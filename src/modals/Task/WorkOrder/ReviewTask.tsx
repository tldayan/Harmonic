import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from '../../../components/CustomButton'
import { TaskInformationState } from '../../../types/work-order.types'
import { colors } from '../../../styles/colors'
import Edit from "../../../assets/icons/editPage.svg"
import { WORK_PRIORITY_COLOR_CODES, WORK_PRIORITY_TEXT_COLOR_CODES } from '../../../utils/constants'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { DocumentItem } from '../../../components/FlatlistItems/DocumentItem'

interface ReviewTaskProps {
    taskInformation: TaskInformationState
    setStep: (value: number) => void
}

export default function ReviewTask({ taskInformation, setStep }: ReviewTaskProps) {

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

  const attachments = {
    /* Images: taskInformation.images, */
    Attachments: taskInformation.attachments
  }

  return (
    <ScrollView>
      <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
        {/* Requestor Info */}
        <View style={styles.taskInfoHeader}>
          <Text style={{ fontSize: 16 }}>Requestor Information</Text>
          <CustomButton
            buttonStyle={styles.edit}
            iconPosition="right"
            icon={<Edit width={15} height={15} />}
            onPress={() => setStep(2)}
            title={"Edit"}
          />
        </View>
        <View style={{ marginTop: 10 }}>
        {Object.entries(creatorFields).map(([label, value]) => (
            <Text style={styles.infoLabel} key={label}>
                <Text style={styles.label}>{label}: </Text>{value ? String(value).trim() : "N/A"}
            </Text>
            ))}
        </View>

        {/* Task Info */}
        <View style={styles.taskInfoHeader}>
          <Text style={{ fontSize: 16 }}>Task Information</Text>
          <Text style={[
            styles.workPriorityName,
            {
              backgroundColor: WORK_PRIORITY_COLOR_CODES[TaskFields.TaskPriorityName],
              color: WORK_PRIORITY_TEXT_COLOR_CODES[TaskFields.TaskPriorityName]
            }
          ]}>
            {TaskFields.TaskPriorityName}
          </Text>
          <CustomButton
            buttonStyle={styles.edit}
            iconPosition="right"
            icon={<Edit width={15} height={15} />}
            onPress={() => setStep(0)}
            title={"Edit"}
          />
        </View>
        <View style={{ marginTop: 10 }}>
        {Object.entries(TaskFields).map(([label, value]) => (
            <Text style={styles.infoLabel} key={label}>
                <Text style={styles.label}>{label}: </Text>{value ? String(value).trim() : "N/A"}
            </Text>
        ))}
        </View>

        {/* Additional Info */}
        <View style={styles.taskInfoHeader}>
          <Text style={{ fontSize: 16 }}>Additional Info</Text>
          <Text style={[
            styles.workPriorityName,
            {
              backgroundColor: WORK_PRIORITY_COLOR_CODES[TaskFields.TaskPriorityName],
              color: WORK_PRIORITY_TEXT_COLOR_CODES[TaskFields.TaskPriorityName]
            }
          ]}>
            {TaskFields.TaskPriorityName}
          </Text>
          <CustomButton
            buttonStyle={styles.edit}
            iconPosition="right"
            icon={<Edit width={15} height={15} />}
            onPress={() => setStep(1)}
            title={"Edit"}
          />
        </View>
        <View style={{ marginTop: 10 }}>

          <FlatList indicatorStyle='black'  
              style={styles.mainSelectedAttachments} 
              contentContainerStyle={styles.attachmentsList} 
              data={taskInformation.attachments} 
              numColumns={3}
              renderItem={({ item, index }) => (
              <DocumentItem
                  item={item}
                  index={index}
              />
              )}
              keyExtractor={(item) => String(item.uri)}
              columnWrapperStyle={{gap: 5 }}
          />
        {/* {Object.entries(attachments).map(([label, value]) => (
            <Text style={styles.infoLabel} key={label}>
                <Text style={styles.label}>{label}: </Text>{value ? String(value).trim() : "N/A"}
            </Text>
        ))} */}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  taskInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20
  },
  infoLabel: {
    color: colors.TEXT_COLOR,
    marginBottom: 4
  },
  label: {
    fontWeight: "bold"
  },
  edit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  workPriorityName: {
    marginLeft: "auto",
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 24
  },
  mainSelectedAttachments : {
  /*   borderWidth: 1, */
  }, 
  attachmentsList: {
    gap: 10,

  }
})
