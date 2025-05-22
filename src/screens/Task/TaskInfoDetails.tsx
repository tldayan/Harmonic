import { ActivityIndicator, Alert, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../types/navigation-types'
import { getWorkRequestAttachments } from '../../api/network-utils'
import PDFIcon from "../../assets/icons/pdf.svg"
import PhotoIcon from "../../assets/icons/photo.svg"
import DefaultIcon from "../../assets/icons/document.svg"
import { getCleanFileNameFromUrl } from '../../utils/helpers'
import { CardShadowStyles } from '../../styles/global-styles'
import { colors } from '../../styles/colors'

export type TaskInfoScreenRouteProp = RouteProp<RootStackParamList, "TaskInfo">

interface TaskInfoDetailsProps {
    workRequestUUID: string; 
    workRequestDetails: WorkRequestDetails
  }
  

export default function TaskInfoDetails({workRequestUUID, workRequestDetails} : TaskInfoDetailsProps) {

    const route = useRoute<TaskInfoScreenRouteProp>()
    const [workRequestAttachments, setWorkRequestAttachments] = useState<WorkRequestAttachment[]>([])
    const [loading, setLoading] = useState(true)


    const fetchWorkRequestAttachments = async() => {
        
        try {
            const workRequestAttachmentsRespose = await getWorkRequestAttachments(workRequestUUID)
            setWorkRequestAttachments(workRequestAttachmentsRespose.Payload)
        } catch(err) {
            console.log(err)
        } finally {
          setLoading(false)
        }
    }

    useEffect(() => {
        fetchWorkRequestAttachments()
    }, [])

    const getFileIconComponent = (fileUrl: string) => {
        try {

          if (!fileUrl) {
            console.error('Invalid file URL:', fileUrl);
            return DefaultIcon; 
          }
    
          const decodedPath = decodeURIComponent(fileUrl.split('?')[0].split('/').pop()?.toLowerCase() || '');
    
      
          if (decodedPath.endsWith('.pdf')) {
            return PDFIcon;
          }
          if (decodedPath.match(/\.(jpg|jpeg|png|svg)$/)) {
            return PhotoIcon;
          }
      
          return DefaultIcon; 
        } catch (error) {
          return DefaultIcon;
        }
      };
      
      
      const openDocument = (url: string) => {
        Linking.canOpenURL(url)
          .then((supported) => {
            if (supported) {
              Linking.openURL(url);
            } else {
              Alert.alert("Error", "Unable to open the document.");
            }
          })
          .catch((err) => {
            console.error("Failed to open URL:", err);
            Alert.alert("Error", "An error occurred while trying to open the file.");
          });
      }
    


    return (
      <View style={[styles.container, CardShadowStyles]}>
        {loading ? <ActivityIndicator size={"small"} /> : <>
        <View style={styles.header}>
          <View style={styles.taskInfoContainer}>
            <Text style={styles.taskInfoText}>Task Info</Text>
          </View>
        </View>
  
        <View style={styles.detailsContainer}>
          {/* Inline InvoiceDetailsItem */}
          <View style={styles.invoiceItem}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>Asset</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{workRequestDetails?.AssetName}</Text>
            </View>
          </View>
  
{/*           <View style={styles.invoiceItem}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>Issue</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{workRequestDetails?.ProblemDescription}</Text>
            </View>
          </View> */}
  
          <View style={styles.invoiceItem}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>Description</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>
                {workRequestDetails?.ProblemDescription}
              </Text>
            </View>
          </View>
  
          <View style={styles.invoiceItem}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>Location</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>Lorem Ipsum</Text>
            </View>
          </View>
  
          {/* Files Section */}
          <View style={styles.filesSection}>
            <View style={styles.filesSectionHeader}>
              <Text style={styles.filesSectionLabel}>Files</Text>
            </View>
  
            <View style={styles.filesContainer}>
              {workRequestAttachments.length === 0 ? (
                <Text style={{ textAlign: "right", color: colors.LIGHT_TEXT }}>
                  No files attached
                </Text>
              ) : (
                <>
                  {workRequestAttachments.map((eachAttachment) => {
                    const IconComponent = getFileIconComponent(eachAttachment.Attachment);
                    return (
                      <TouchableOpacity
                        onPress={() => openDocument(eachAttachment.Attachment)}
                        key={eachAttachment.AttachmentUUID}
                        style={styles.filePreview}
                      >
                        <View style={styles.fileInfoContainer}>
                          <IconComponent style={styles.fileIcon} />
                          <Text>
                            <Text style={styles.fileName}>
                              {getCleanFileNameFromUrl(eachAttachment.Attachment)}
                            </Text>
                            {"\n"}
                            <Text style={styles.fileDetails}>12 Pages, 18 MB</Text>
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
            </View>

          </View>
        </View>
        </>}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
/*       borderWidth: 1, */
      backgroundColor: "white",
      borderRadius: 24,
      padding: 24,
    },
    header: {
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
    },
    taskInfoContainer: {
      alignSelf: "stretch",
      justifyContent: "center",
    },
    taskInfoText: {
      fontSize: 16,
      color: "#111928",
      fontWeight: "600",
    },
    closeIcon: {
      width: 12,
      height: 12,
      aspectRatio: 1,
    },
    detailsContainer: {
      marginTop: 24,
      width: "100%",
/*       gap: 16, */
    },
    invoiceItem: {
      paddingVertical: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
      width: "100%",
    },
    labelContainer: {
      alignSelf: "stretch",
      justifyContent: "center",
    },
    labelText: {
      color: "#111928",
      fontSize: 14,
      fontWeight: "600",
    },
    valueContainer: {
      flexBasis: "60%",
      maxWidth: "60%",
      flexShrink: 1, // Allows shrinking
      justifyContent: "center",
      alignItems: "flex-end",
    },

    valueText: {
      color: "#6b7280",
      fontSize: 14,
      textAlign: "right",
      flexWrap: "wrap",
    },
    filesSection: {
      marginTop: 16,
      width: "100%",
      justifyContent: "space-between",
      flexDirection: "row", 
      gap: 12,
    },
    filesSectionHeader: {
      alignSelf: "stretch",
      justifyContent: "center",
    },
    filesSectionLabel: {
      color: "#111928",
      fontSize: 14,
      fontWeight: "600",
    },
    filesContainer: {
     /*  width: "100%", */
     flex: 1,
      flexDirection: "column",
      gap: 10,
    },
    filePreview: {
      alignItems: "center",
      borderRadius: 8,
    /*   flex: 1, */
      gap: 16,
      alignSelf: "flex-end",
      padding: 8,
      backgroundColor: "#F9FAFB",
    },
    fileInfoContainer: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
    },
    fileIcon: {
      width: 20,
      height: 20,
      aspectRatio: 1,
    },
    fileName: {
      color: "#6B7280",
      fontWeight: "500",
    },
    fileDetails: {
      fontSize: 10,
      color: colors.LIGHT_TEXT_COLOR,
    },
    secondFilePreview: {
      marginTop: 10,
      width: 188,
    },
  });