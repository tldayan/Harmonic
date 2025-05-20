import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { WORK_PRIORITY_COLOR_CODES, WORK_PRIORITY_TEXT_COLOR_CODES, WORK_STATUS__NOTIFICATION_COLOR_CODES, WORK_STATUS_COLOR_CODES } from '../../utils/constants'
import WorkRequestCreation from '../../modals/Task/WorkRequest/WorkRequestCreation'
import { CardShadowStyles } from '../../styles/global-styles'
import { getWorkRequestDetails } from '../../api/network-utils'
import { WorkRequestActionDropdownComponent } from '../../dropdowns/WorkRequestActions'
import { CustomModal } from '../../components/CustomModal'
import ApproveWorkRequest from '../../modals/Task/WorkRequest/ApproveWorkRequest'

interface TaskHeadingProps {
    workRequestUUID: string
    workRequestNumber: string
}

export default function TaskHeading({workRequestUUID, workRequestNumber} : TaskHeadingProps) {

    const [loading, setLoading] = useState(true);
    const [workRequestDetails, setWorkRequestsDetails] = useState<WorkRequestDetails>({})
    const [action, setAction] = useState<string | null>(null);

    const fetchWorkRequestDetails = async() => {
        
        try {
            const workRequestDetailsResponse = await getWorkRequestDetails(workRequestUUID)
            setWorkRequestsDetails(workRequestDetailsResponse.Payload)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }

    }


    useEffect(() => {
      if(action) return
      fetchWorkRequestDetails()
    }, [action])



  return (
    <View style={[styles.workRequestHeadingContainer, CardShadowStyles]}>
        {loading ? <ActivityIndicator style={{marginVertical: "10%"}} size={"small"} /> : 
        <>
        <View style={styles.workRequestStatusContainer}>
          <Text style={[
            styles.workRequestPriorityName,
            {
                backgroundColor: WORK_PRIORITY_COLOR_CODES[workRequestDetails?.WorkPriorityName ?? ""] || "#ccc",
                color: WORK_PRIORITY_TEXT_COLOR_CODES[workRequestDetails?.WorkPriorityName ?? ""] || "#000"                
            }
          ]}>
            {workRequestDetails?.WorkPriorityName || "N/A"}
          </Text>
          <View style={[
            styles.workRequestStatusItemNameContainer,
            { backgroundColor: WORK_STATUS_COLOR_CODES[workRequestDetails?.StatusItemName ?? ""] || "#eee" }
          ]}>
            <View style={[
              styles.workRequestNotificationDot,
              { backgroundColor: WORK_STATUS__NOTIFICATION_COLOR_CODES[workRequestDetails?.StatusItemName ?? ""] || "#999" }
            ]} />
            <Text style={styles.workRequestStatusItemName}>
              {workRequestDetails?.StatusItemName || "N/A"}
            </Text>
          </View>
            <WorkRequestActionDropdownComponent horizontalDots action={action} setAction={setAction} />
        </View>

        <Text style={styles.workRequestNumber}>{workRequestDetails?.WorkRequestNumber}</Text>
        <Text style={styles.workRequestDescription}>{workRequestDetails?.ProblemDescription}</Text>
        </>}



        <CustomModal onClose={() => setAction(null)} isOpen={action === "1"} >
          <ApproveWorkRequest workRequestNumber={workRequestNumber} workRequestUUID={workRequestUUID} onClose={() => setAction(null)} />
        </CustomModal>

    </View>
  )
}

const styles = StyleSheet.create({

    workRequestHeadingContainer: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 24,
        minHeight: 120
    },
    workRequestStatusContainer :{
        flexDirection: "row",
        alignSelf: "flex-start",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center"
    },
    workRequestContainer: {
        borderRadius: 24,
        width: "99%",
        gap: 10,
        marginLeft: "auto",
        backgroundColor: "white",
        padding: 16
      },
      workRequestStatsContainer: {
        flexDirection: "row",
        alignItems: "center",
      },
      workRequestPriorityName: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 24
      },
      workRequestStatusItemNameContainer: {
        flexDirection: "row",
        marginLeft: 10,
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        gap: 8,
        borderRadius: 24,
      },
      workRequestStatusItemName: {
        color: "#1A202C",
      },
      workRequestNotificationDot: {
        height: 10,
        width: 10,
        borderRadius: 50,
      },
      workRequestNumber: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 500
      },
      workRequestDescription: {
        marginTop: 10
      },

})