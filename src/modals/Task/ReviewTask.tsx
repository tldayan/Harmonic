import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from '../../components/CustomButton'
import { TaskInformationState } from '../../types/work-order.types'
import { colors } from '../../styles/colors'
import Edit from "../../assets/icons/editPage.svg"
import { WORK_PRIORITY_COLOR_CODES, WORK_PRIORITY_TEXT_COLOR_CODES } from '../../utils/constants'

interface ReviewTaskProps {
    taskInformation: TaskInformationState
}

export default function ReviewTask({taskInformation}: ReviewTaskProps) {

    const creatorFields = {
        Name: taskInformation.creatorName,
        Email: taskInformation.creatorEmail,
        Number: taskInformation.creatorNumber,
        Location: taskInformation.creatorLocation,
      };

    const TaskFields = { 
        TaskType: taskInformation.workOrderType.workOrderTypeName,
        TaskAsset: taskInformation.asset.assetName,
        TaskDescription: taskInformation.taskDescription,
        TaskPriorityUUID: taskInformation.workPriority.workPriorityUUID,
        TaskPriorityName: taskInformation.workPriority.workPriorityName
      };


  return (
    <View>
      <View style={{marginTop: 20, paddingHorizontal: 16}}>
        <View style={styles.taskInfoHeader}> 
            <Text style={{fontSize: 16}}>Requestor Information</Text>
            <CustomButton buttonStyle={styles.edit} iconPosition='right' icon={<Edit width={15} height={15}/>} onPress={() => {}} title={"Edit"} />
        </View>
        <View style={{marginTop: 10, gap: 3}}>
            {Object.entries(creatorFields).map(([label, value]) => {
                return <Text style={styles.infoLabel} key={label}>{value}</Text>
            })}
        </View>
        <View style={styles.taskInfoHeader}> 
            <Text style={{fontSize: 16}}>Task Information</Text>
            <Text style={[styles.workPriorityName, {backgroundColor:WORK_PRIORITY_COLOR_CODES[TaskFields.TaskPriorityName], color: WORK_PRIORITY_TEXT_COLOR_CODES[TaskFields.TaskPriorityName] }]}>{TaskFields.TaskPriorityName}</Text>
            <CustomButton buttonStyle={styles.edit} iconPosition='right' icon={<Edit width={15} height={15}/>} onPress={() => {}} title={"Edit"} />
        </View>
        <View style={{marginTop: 10, gap: 3}}>
            {Object.entries(TaskFields).map(([label, value]) => {
                return <Text style={styles.infoLabel} key={label}>{value.trim()}</Text>
            })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    taskInfoHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    infoLabel: {
        color: colors.TEXT_COLOR
    },
    edit: {
        flexDirection :"row",
        gap: 5
    },
    workPriorityName: {
        marginLeft: "auto",
        marginRight: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 24
      }
})