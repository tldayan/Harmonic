import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import RadioGroup from '../RadioGroup';
import CustomTextAreaInput from '../../../components/CustomTextAreaInput';
import CustomSelectInput from '../../../components/CustomSelectInput';
import { CustomModal } from '../../../components/CustomModal';
import WorkOrderTypes from './WorkOrderTypes';
import AssetTypes from '../AssetTypes';
import { WorkOrderInformationState } from '../../../types/work-order.types';
import { CustomTextInput } from '../../../components/CustomTextInput';
import { defaultInputStyles } from '../../../styles/global-styles';
  

interface WorkOrderInformationProps {
    priorityOptions?: WorkPriority[];
    setWorkOrderInformation: React.Dispatch<React.SetStateAction<WorkOrderInformationState>>
    workOrderInformation: WorkOrderInformationState
}

export default function WorkOrderInformation({ priorityOptions, setWorkOrderInformation, workOrderInformation }: WorkOrderInformationProps) {

  const [selectingWorkType, setSelectingWorkType] = useState(false);
  const [selectingAsset, setSelectingAsset] = useState(false);

  return (
    <View style={styles.modalBody}>
      <View style={styles.inputRow}>
        <View style={styles.row}>
          <CustomSelectInput
            onSelect={() => setSelectingWorkType(true)}
            placeholder={workOrderInformation.workOrderType.workOrderTypeName ? workOrderInformation.workOrderType.workOrderTypeName : "Inspection"}
          />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.row}>
          <CustomSelectInput
            onSelect={() => setSelectingAsset(true)}
            placeholder={workOrderInformation.asset.assetName ? workOrderInformation.asset.assetName : "Water leakage"}
          />
        </View>
      </View>

      <CustomTextAreaInput
        onChangeText={(e) => setWorkOrderInformation((prev) => ({ ...prev, problemDescription: e }))}
        placeholder={workOrderInformation.problemDescription ? workOrderInformation.problemDescription : "Write Problem"}
      />
      <CustomTextAreaInput
        multiline={true}
        flex={true}
        onChangeText={(e) => setWorkOrderInformation((prev) => ({ ...prev, taskDescription: e }))}
        placeholder={workOrderInformation.taskDescription ? workOrderInformation.taskDescription : "Write issue description here"}
      />

{/*       <View style={styles.inputRow}>
        <View style={styles.row}>
          <CustomSelectInput placeholder="Repair" />
        </View>
      </View> */}

      <RadioGroup
        label="Priority"
        taskInformation={workOrderInformation}
        options={priorityOptions}
        onSelect={(selectedPriority: WorkPriority) => {
          setWorkOrderInformation((prev) => ({
            ...prev,
            workPriority: {
              workPriorityUUID: selectedPriority.WorkPriorityUUID,
              workPriorityName: selectedPriority.WorkPriorityName,
            },
          }));
        }}
      />

      {selectingWorkType && <CustomModal onClose={() => setSelectingWorkType(false)}>
        <WorkOrderTypes setWorkOrderInformation={setWorkOrderInformation} onClose={() => setSelectingWorkType(false)} />
      </CustomModal>}

      {selectingAsset && <CustomModal onClose={() => setSelectingAsset(false)}>
        <AssetTypes setWorkOrderInformation={setWorkOrderInformation} onClose={() => setSelectingAsset(false)} />
      </CustomModal>}
    </View>
  );
}

const styles = StyleSheet.create({
    modalBody: {
        flex: 1,
        width: "100%",
        flexDirection: "column", 
        gap: 10, 
        marginTop: 10,
      },
    inputRow: {
      minHeight: 42,
      width: "100%",
      fontSize: 14,
      color: "#6b7280",
      fontWeight: "400",
      lineHeight: 1,
    },
    row: {
      display: "flex",
      width: "100%",
      gap: 16,
      flex: 1,
      height: "100%",
      padding: 0,
    },
  });
  