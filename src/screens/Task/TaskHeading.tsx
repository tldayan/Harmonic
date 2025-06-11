import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { WORK_PRIORITY_COLOR_CODES, WORK_PRIORITY_TEXT_COLOR_CODES, WORK_STATUS__NOTIFICATION_COLOR_CODES, WORK_STATUS_COLOR_CODES } from '../../utils/constants'

interface TaskHeadingProps {
    taskDetails: any
}

export default function TaskHeading({taskDetails} : TaskHeadingProps) {

  return (
    <View>
        <View style={styles.workRequestStatusContainer}>
          <Text style={[
            styles.workRequestPriorityName,
            {
                backgroundColor: WORK_PRIORITY_COLOR_CODES[taskDetails?.WorkPriorityName ?? ""] || "#ccc",
                color: WORK_PRIORITY_TEXT_COLOR_CODES[taskDetails?.WorkPriorityName ?? ""] || "#000"                
            }
          ]}>
            {taskDetails?.WorkPriorityName || "N/A"}
          </Text>
          <View style={[
            styles.workRequestStatusItemNameContainer,
            { backgroundColor: WORK_STATUS_COLOR_CODES[taskDetails?.StatusItemName ?? ""] || "#eee" }
          ]}>
            <View style={[
              styles.workRequestNotificationDot,
              { backgroundColor: WORK_STATUS__NOTIFICATION_COLOR_CODES[taskDetails?.StatusItemName ?? ""] || "#999" }
            ]} />
            <Text style={styles.workRequestStatusItemName}>
              {taskDetails?.StatusItemName || "N/A"}
            </Text>
          </View>
        </View>

        <Text style={styles.workRequestNumber}>{taskDetails?.WorkRequestNumber}</Text>
        <Text style={styles.workRequestDescription}>{taskDetails?.ProblemDescription}</Text>

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
        justifyContent: "flex-start",
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