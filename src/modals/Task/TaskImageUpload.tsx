import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import UploadIcon from "../../assets/icons/upload.svg";
import SearchIcon from '../../assets/icons/search.svg';
import { colors } from '../../styles/colors';
import CustomButton from '../../components/CustomButton';
import CustomTextAreaInput from '../../components/CustomTextAreaInput';
import { pickMedia, uploadMedia } from '../../utils/helpers';
import { firebaseStoragelocations } from '../../utils/constants';
import { FirebaseAttachment } from '../../types/post-types';
import { Attachmentitem } from '../../components/FlatlistItems/AttachmentItem';
import { Asset } from 'react-native-image-picker';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { TaskInformationState } from '../../types/work-order.types';

interface TaskImageUploadProps {
    setTaskInformation: React.Dispatch<React.SetStateAction<TaskInformationState>>
    taskInformation: TaskInformationState
}

const TaskImageUpload = ({setTaskInformation, taskInformation} : TaskImageUploadProps) => {

      const [firebaseAttachmentUrls, setFirebaseAttachmentUrls] = useState<FirebaseAttachment[]>([])
      /* const [attachments, setAttachments] = useState<Asset[]>([]) */
      const [viewingAttachments, setViewingAttachments] = useState(false)
      const [initialAttachmentIndex, setInitialAttachmentIndex] = useState(0)
      const [loading, setLoading] = useState(false)

  const addMedia = async() => {
    
/*     setTaskInformation((prev) => ({...prev, loading: true})) */
    setLoading(true)
      try {
        const assets = await pickMedia()
        /* const uploadedFirebaseAttachments = await uploadMedia(assets, firebaseStoragelocations.workOrder) */
/*         setAttachments((prev) => [...prev, ...assets]) */
        setTaskInformation((prev) => ({...prev, images: assets}))
        /* console.log(uploadedFirebaseAttachments) */
  
      } catch(err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
  
    }

    const deleteAttachment = (url: string) => {
        if(taskInformation.images.length) {
          let updatedSelectedImages = firebaseAttachmentUrls.filter((eachImage) => eachImage.url !== url)
          setTaskInformation((prev) => ({...prev, images: updatedSelectedImages}))
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

        

        {taskInformation.images.length > 0 ? (

            <FlatList indicatorStyle='black' 
                horizontal 
                style={styles.mainSelectedAttachments} 
                contentContainerStyle={styles.attachmentsList} 
                data={taskInformation.images} 
                renderItem={({ item, index }) => (
                <Attachmentitem
                    item={item}
                    index={index}
                    deleteAttachment={deleteAttachment}
                    setViewingAttachments={setViewingAttachments}
                    setInitialAttachmentIndex={setInitialAttachmentIndex}
                    imageSize={200}
                />
                )}
                keyExtractor={(item) => String(item.uri)}
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


        <CustomButton loading={loading} textStyle={styles.browseButtonText} buttonStyle={styles.browseButton} onPress={addMedia} title={"Browse File"} icon={<SearchIcon color={colors.LIGHT_COLOR} strokeWidth={2} width={18} height={18} />} />
      </View>
      <CustomTextAreaInput onChangeText={(e) => setTaskInformation((prev) => ({...prev, imageDescription: e}))} placeholder='Image Description' />
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
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  boldText: {
    fontWeight: '700',
  },
  fileSizeText: {
    fontFamily: 'Inter',
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
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#FFF',
  },
  attachmentsList: {
    flexGrow:1,
    gap: 10
  },
  mainSelectedAttachments : {
/*     borderWidth: 2, */
    padding: 5,
    flexDirection: "row",
    marginBottom:"auto",
  }
});

export default TaskImageUpload;
