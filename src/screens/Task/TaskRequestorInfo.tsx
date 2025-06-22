import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../types/navigation-types'
import { CardShadowStyles } from '../../styles/global-styles'
import { colors } from '../../styles/colors'
import { getUserProfile } from '../../api/network-utils'
import ChevronDown from "../../assets/icons/chevron-down.svg"



export type TaskInfoScreenRouteProp = RouteProp<RootStackParamList, "TaskInfo">

interface TaskRequestorInfoProps {
    workRequestorUUID: string
  }
  

export default function TaskRequestorInfo({workRequestorUUID} : TaskRequestorInfoProps) {

    const route = useRoute<TaskInfoScreenRouteProp>()
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(false);

        const fetchWorkRequestorDetails = async() => {
            console.log(workRequestorUUID)
            try {
                const workRequestorUserProfileResponse = await getUserProfile(workRequestorUUID)
                setUserProfile(workRequestorUserProfileResponse?.data.Payload)
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
    
        useEffect(() => {
            fetchWorkRequestorDetails()
        }, [])



    return (
      <TouchableOpacity disabled={loading} activeOpacity={0.7} onPress={() => setExpanded((prev) => !prev)}  style={[styles.container, CardShadowStyles]}>
        {loading ? <ActivityIndicator size={"small"}/> : <>
        <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={styles.headerText}>Requestor Info</Text>
                <View style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}>
                  <ChevronDown strokeWidth={3} width={15} height={15} />
                </View>
          </View>
  
        {expanded && <View style={styles.detailsContainer}>

          <View style={styles.invoiceItem}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>Full Name</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{userProfile?.FirstName} {userProfile?.LastName}</Text>
            </View>
          </View>
  
          <View style={styles.invoiceItem}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>Email</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>
                {userProfile?.EmailAddress}
              </Text>
            </View>
          </View>
  
          <View style={[styles.invoiceItem, {borderBottomWidth: 0, paddingBottom: 0}]}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>Phone</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{userProfile?.PhoneNumberWithCode ? userProfile?.PhoneNumberWithCode : "-" }</Text>
            </View>
          </View>
        </View>}
        </>}
      </TouchableOpacity>
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
    headerText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111928",
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