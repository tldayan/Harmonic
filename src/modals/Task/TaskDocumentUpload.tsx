import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import UploadIcon from "../../assets/icons/upload.svg";
import SearchIcon from '../../assets/icons/search.svg';
import { colors } from '../../styles/colors';
import CustomButton from '../../components/CustomButton';
import CustomTextAreaInput from '../../components/CustomTextAreaInput';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { WorkOrderInformationState } from '../../types/work-order.types';
import { keepLocalCopy, pick } from '@react-native-documents/picker';
import { DocumentItem } from '../../components/FlatlistItems/DocumentItem';
import { WorkRequestInformationState } from '../../types/work-request.types';
import { uploadLocalDocuments } from '../../utils/helpers';

interface TaskDocumentUploadProps {
  setWorkOrderInformation?: React.Dispatch<React.SetStateAction<WorkOrderInformationState>>;
  workOrderInformation?: WorkOrderInformationState;
  setWorkRequestInformation?: React.Dispatch<React.SetStateAction<WorkRequestInformationState>>;
  workRequestInformation?: WorkRequestInformationState;
}

const TaskDocumentUpload = ({
  setWorkOrderInformation,
  workOrderInformation,
  setWorkRequestInformation,
  workRequestInformation,
}: TaskDocumentUploadProps) => {
  const [loading, setLoading] = useState(false);

  const data = workOrderInformation ?? workRequestInformation;
  const setData = setWorkOrderInformation ?? setWorkRequestInformation;

  const addDocument = async () => {
    setLoading(true);
    
    try {
      const documentsWithLocalUri = await uploadLocalDocuments(data);

      if (setWorkOrderInformation && workOrderInformation) {
        setWorkOrderInformation((prev) => ({
          ...prev,
          attachments: [...prev.attachments, ...documentsWithLocalUri],
        }));
      } else if (setWorkRequestInformation && workRequestInformation) {
        setWorkRequestInformation((prev) => ({
          ...prev,
          attachments: [...prev.attachments, ...documentsWithLocalUri],
        }));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = (attachmentUri: string) => {
    if (setWorkOrderInformation && workOrderInformation) {
      const updatedAttachments = workOrderInformation.attachments.filter(
        (eachImage) => eachImage.uri !== attachmentUri
      );
      setWorkOrderInformation((prev) => ({ ...prev, attachments: updatedAttachments }));
    } else if (setWorkRequestInformation && workRequestInformation) {
      const updatedAttachments = workRequestInformation.attachments.filter(
        (eachImage) => eachImage.uri !== attachmentUri
      );
      setWorkRequestInformation((prev) => ({ ...prev, attachments: updatedAttachments }));
    }
  };

  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          <View style={styles.uploadContainer}>
            <View style={styles.uploadContent}>
              {(data?.attachments?.length ?? 0) ? (
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  style={styles.mainSelectedAttachments}
                  numColumns={3}
                  contentContainerStyle={styles.attachmentsList}
                  data={data?.attachments}
                  renderItem={({ item, index }) => (
                    <DocumentItem item={item} index={index} deleteDocument={deleteDocument} />
                  )}
                  keyExtractor={(item) => String(item.uri)}
                  columnWrapperStyle={{ gap: 10 }}
                />
              ) : (
                <>
                  <Image
                    source={{
                      uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9af5c245a81d67256eabfdba9613f9326049b673?placeholderIfAbsent=true',
                    }}
                    style={styles.uploadImage}
                  />

                  <View style={styles.uploadInstructions}>
                    <View style={styles.iconContainer}>
                      <UploadIcon color={colors.LIGHT_TEXT} width={20} height={20} />
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

            <CustomButton
              loading={loading}
              textStyle={styles.browseButtonText}
              buttonStyle={styles.browseButton}
              onPress={addDocument}
              title={"Browse File"}
              icon={<SearchIcon color={colors.LIGHT_COLOR} strokeWidth={2} width={18} height={18} />}
            />
          </View>

          <CustomTextAreaInput
            flex
            multiline
            onChangeText={(e) => {
              if (setWorkOrderInformation && workOrderInformation) {
                setWorkOrderInformation((prev) => ({ ...prev, attachmentDescription: e }));
              } else if (setWorkRequestInformation && workRequestInformation) {
                setWorkRequestInformation((prev) => ({ ...prev, attachmentDescription: e }));
              }
            }}            
            placeholder="Attachment Description"
          />
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
    marginVertical: 10,
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
    marginVertical: 10,
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
    flexGrow: 1,
    gap: 10,
  },
  mainSelectedAttachments: {
    padding: 5,
    flexDirection: "row",
    marginBottom: "auto",
  },
});

export default TaskDocumentUpload;
