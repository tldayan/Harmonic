import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import UploadIcon from "../../assets/icons/upload.svg";
import SearchIcon from '../../assets/icons/search.svg';
import { colors } from '../../styles/colors';
import CustomButton from '../../components/CustomButton';
import CustomTextAreaInput from '../../components/CustomTextAreaInput';
import { pickMedia } from '../../utils/helpers';
import { FirebaseAttachment } from '../../types/post-types';
import { Attachmentitem } from '../../components/FlatlistItems/AttachmentItem';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { TaskInformationState } from '../../types/work-order.types';
import { keepLocalCopy, pick } from '@react-native-documents/picker';
import { DocumentItem } from '../../components/FlatlistItems/DocumentItem';

interface TaskImageUploadProps {
    setTaskInformation: React.Dispatch<React.SetStateAction<TaskInformationState>>
    taskInformation: TaskInformationState
}

const TaskImageUpload = ({setTaskInformation, taskInformation} : TaskImageUploadProps) => {

      const [firebaseAttachmentUrls, setFirebaseAttachmentUrls] = useState<FirebaseAttachment[]>([])
      const [loading, setLoading] = useState(false)


      const addDocument = async () => {
        setLoading(true);
        try {
          const pickResults = await pick({ allowMultiSelection: true, keepLocalCopy: "cachesDirectory" });
      
          console.log('Picked Documents:', pickResults);
      
          const copyResults = await Promise.all(
            pickResults.map(async (doc) => {
              const [copyResult] = await keepLocalCopy({
                files: [
                  {
                    uri: doc.uri,
                    fileName: doc.name ?? 'fallback-name',
                  },
                ],
                destination: 'cachesDirectory', 
              });
      
              return copyResult; 
            })
          );
      
         
          const nonDuplicateDocuments = pickResults.filter((eachDoc) =>
            !taskInformation.attachments.some((doc) => doc.uri === eachDoc.uri)
          );
      
          const documentsWithLocalUri = nonDuplicateDocuments.map((doc, index) => {
            const copyResult = copyResults[index];
      
            if (copyResult.status === 'success') {
              return {
                ...doc,
                localUri: copyResult.localUri ?? copyResult.sourceUri, 
              };
            } else {
              console.error('Failed to copy file:', copyResult.copyError);
              return doc;
            }
          });
      
          setTaskInformation((prev) => ({
            ...prev,
            attachments: [
              ...prev.attachments,
              ...documentsWithLocalUri,
            ],
          }));
      
        } catch (err: unknown) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };
      

  const deleteDocument = (attachemtnUri: string) => {
    if(taskInformation.attachments.length) {
      let updatedSelectedImages = taskInformation.attachments.filter((eachImage) => eachImage.uri !== attachemtnUri)
      setTaskInformation((prev) => ({...prev, attachments: [...updatedSelectedImages]}))
    }
  }


  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    style={{ flex: 1 }}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} 
    >
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

    <ScrollView>
     <View style={styles.uploadContainer}>

    <View style={[styles.uploadContent, firebaseAttachmentUrls.length ? {flexDirection: "row"} : null]}>

        

        {taskInformation.attachments.length > 0 ? (

            <FlatList indicatorStyle='black' 
              /*   horizontal  */
                style={styles.mainSelectedAttachments} 
                numColumns={3}
                contentContainerStyle={styles.attachmentsList} 
                data={taskInformation.attachments} 
                renderItem={({ item, index }) => (
                <DocumentItem
                    item={item}
                    index={index}
                    deleteDocument={deleteDocument}
                />
                )}
                keyExtractor={(item) => String(item.uri)}
                columnWrapperStyle={{gap: 10 }}
                /* ListFooterComponent={<AddAdditionalMediaButton />} */ 
                />
        ) : (
            <>
            <Image
                source={{
                uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9af5c245a81d67256eabfdba9613f9326049b673?placeholderIfAbsent=true',
                }}
                style={styles.uploadImage}
                accessibilityLabel="Upload image"
            />

            <View style={styles.uploadInstructions}>
                <View style={styles.iconContainer}>
                <UploadIcon width={20} height={20} />
                </View>
            </View>

            <View style={styles.textContainer}>
                <Text style={[styles.instructionText, styles.boldText]}>
                Click to upload images, docs, PDFs
                </Text>
                <Text style={styles.instructionText}>or drag and drop</Text>
            </View>

            <Text style={styles.fileSizeText}>Max. File Size: 30MB</Text>
            </>
        )}
    </View>


        <CustomButton loading={loading} textStyle={styles.browseButtonText} buttonStyle={styles.browseButton} onPress={addDocument} title={"Browse File"} icon={<SearchIcon color={colors.LIGHT_COLOR} strokeWidth={2} width={18} height={18} />} />
      </View>
      <CustomTextAreaInput flex onChangeText={(e) => setTaskInformation((prev) => ({...prev, imageDescription: e}))} placeholder='Attachment Description' />
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  uploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
    height: 303,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    width: '100%',
    backgroundColor: '#F9FAFB',
  },
  uploadContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'center',
    flex: 1,
  },
  uploadImage: {
    width: 120,
    height: 116,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5
  },
  uploadInstructions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  boldText: {
    fontWeight: '700',
  },
  fileSizeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  browseButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 8,
    paddingLeft: 12,
    marginBottom: 10,
    borderRadius: 25,
    gap: 8,
    width: 110,
    backgroundColor: '#F3A46D',
  },
  browseButtonText: {
    fontSize: 12,
    color: '#FFF',
  },
  attachmentsList: {
    flexGrow:1,
    gap: 10,
    
  },
  mainSelectedAttachments : {
/*     borderWidth: 2, */
    padding: 5,
    flexDirection: "row",
    marginBottom:"auto",
  }
});

export default TaskImageUpload;
