import { StyleSheet, Text, View, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import React from 'react';
import CustomButton from '../../components/CustomButton';
import { WorkOrderInformationState } from '../../types/work-order.types';
import { colors } from '../../styles/colors';
import Edit from "../../assets/icons/editPage.svg";
import { WORK_PRIORITY_COLOR_CODES, WORK_PRIORITY_TEXT_COLOR_CODES } from '../../utils/constants';
import { DocumentItem } from '../../components/FlatlistItems/DocumentItem';
import { WorkRequestInformationState } from '../../types/work-request.types';

interface ReviewTaskProps {
  workOrderInformation?: WorkOrderInformationState;
  workRequestInformation?: WorkRequestInformationState;
  setStep: (value: number) => void;
}

export default function ReviewTask({ workOrderInformation, workRequestInformation, setStep }: ReviewTaskProps) {
  const data = workOrderInformation ?? workRequestInformation;

  if (!data) {
    return (
      <View style={{ padding: 16 }}>
        <Text>No data provided.</Text>
      </View>
    );
  }

  const isWorkOrder = !!workOrderInformation;

  const creatorFields = {
    Name: data.creatorName,
    Email: data.creatorEmail,
    Number: data.creatorNumber,
    Location: data.creatorLocation,
  };

  const TaskFields = {
    TaskType: isWorkOrder
      ? workOrderInformation?.workOrderType?.workOrderTypeName
      : workRequestInformation?.workRequestType?.workRequestTypeName,
    TaskAsset: data.asset.assetName,
    TaskDescription: data.taskDescription,
    TaskPriorityUUID: data.workPriority.workPriorityUUID,
    TaskPriorityName: data.workPriority.workPriorityName
  };

  console.log("TASKFIELD", workRequestInformation);

  return (
    <ScrollView>
      {!workOrderInformation?.loading ? (
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
                <Text style={styles.label}>{label}: </Text>
                {value !== null && value !== undefined && String(value).trim() !== ""
                  ? String(value).trim()
                  : "N/A"}
              </Text>
            ))}
          </View>

          {/* Additional Info */}
          <View style={styles.taskInfoHeader}>
            <Text style={{ fontSize: 16 }}>Additional Info</Text>
            <CustomButton
              buttonStyle={styles.edit}
              iconPosition="right"
              icon={<Edit width={15} height={15} />}
              onPress={() => setStep(1)}
              title={"Edit"}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <FlatList
              indicatorStyle='black'
              style={styles.mainSelectedAttachments}
              contentContainerStyle={styles.attachmentsList}
              data={data.attachments}
              numColumns={3}
              renderItem={({ item, index }) => (
                <DocumentItem item={item} index={index} />
              )}
              keyExtractor={(item) => String(item.uri)}
              columnWrapperStyle={{ gap: 5 }}
              ListEmptyComponent={<Text style={{ color: colors.LIGHT_TEXT }}>No Attachments Uploaded</Text>}
            />
          </View>
        </View>
      ) : (
        <ActivityIndicator style={{ marginVertical: "50%" }} size={"small"} color={colors.ACTIVE_ORANGE} />
      )}
    </ScrollView>
  );
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
  mainSelectedAttachments: {},
  attachmentsList: {
    gap: 10,
  }
});
