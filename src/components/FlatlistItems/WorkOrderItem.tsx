import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../../styles/colors'
import { TASK_STATUS_CODES, WORK_PRIORITY_COLOR_CODES, WORK_PRIORITY_TEXT_COLOR_CODES, WORK_STATUS__NOTIFICATION_COLOR_CODES, WORK_STATUS_COLOR_CODES } from '../../utils/constants'
import { CardShadowStyles, shadowStyles } from '../../styles/global-styles'
import { formatProperDate } from '../../utils/helpers'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'
import { getWorkOrderDetails } from '../../api/network-utils'

interface WorkOrderItemProps {
    workOrderItem: WorkOrder
    setTaskDetails: React.Dispatch<React.SetStateAction<WorkOrderDetails | null>>;
}

export default function WorkOrderItem({workOrderItem, setTaskDetails}: WorkOrderItemProps) {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const handleTaskPress = async () => {
    
    if(workOrderItem.StatusItemCode === TASK_STATUS_CODES.DRAFT) {

      const WorkOrderDetails = await getWorkOrderDetails(workOrderItem.WorkOrderUUID)

      setTaskDetails(WorkOrderDetails.Payload)
      return
    }

    if(workOrderItem.WorkOrderUUID) {
      navigation.navigate("TaskInfo", {workOrderUUID: workOrderItem.WorkOrderUUID})
    }

  }

  return (
    <TouchableOpacity onPress={handleTaskPress} style={[styles.mainWorkOrderContainer, {backgroundColor:WORK_STATUS_COLOR_CODES[workOrderItem.StatusItemName]}]}>
      <View style={[styles.workOrderContainer, CardShadowStyles]}>
        <View style={styles.workOrderStatsContainer}>
          <Text style={{fontSize: 15, color: "#111827", fontWeight: "500"}}>{workOrderItem.WorkOrderNumber}</Text>
          <Text style={[styles.workPriorityName, {backgroundColor:WORK_PRIORITY_COLOR_CODES[workOrderItem.WorkPriorityName], color: WORK_PRIORITY_TEXT_COLOR_CODES[workOrderItem.WorkPriorityName] }]}>{workOrderItem.WorkPriorityName}</Text>
          <View style={[styles.statusItemNameContainer, {backgroundColor:WORK_STATUS_COLOR_CODES[workOrderItem.StatusItemName]}]}>
            <View style={[styles.notificationDot, {backgroundColor:WORK_STATUS__NOTIFICATION_COLOR_CODES[workOrderItem.StatusItemName]}]}></View>
            <Text style={[styles.statusItemName ]}>{workOrderItem.StatusItemName}</Text>
          </View>
        </View>

        {workOrderItem.CreatedDateTime && <Text style={{color: colors.LIGHT_TEXT}}>Created on <Text style={{color: "black"}}>{formatProperDate(workOrderItem.CreatedDateTime)}</Text></Text>}
        <Text>{workOrderItem.AssetName}</Text>
        <Text style={{fontSize: 16, color: colors.GRAY_DARK_TEXT}}>{workOrderItem.ProblemDescription}</Text>
        <Text>{workOrderItem.WorkDescription}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  mainWorkOrderContainer: {
    marginBottom: 10,
    width: "95%",
    borderRadius: 24,
    alignSelf :"center"
  },
  workOrderContainer: {
/*     borderWidth: 1, */
    borderRadius: 24,
    width: "99%",
    gap: 10,
    marginLeft: "auto",
    backgroundColor: "white",
    padding: 16
  },
  workOrderStatsContainer: {
    flexDirection : "row",
    alignItems: "center",
  },
  workPriorityName: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 24
  },
  statusItemNameContainer: {
    flexDirection : "row", 
    marginLeft: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 8,
    borderRadius: 24,
  },
  statusItemName: {
    color: "#1A202C",
  },
  notificationDot: {
    height: 10,
    width: 10,
    borderRadius: 50,
  }
})