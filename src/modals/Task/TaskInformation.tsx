import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import RadioGroup from './RadioGroup';
import CustomTextAreaInput from '../../components/CustomTextAreaInput';
import CustomSelectInput from '../../components/CustomSelectInput';
import { CustomModal } from '../../components/CustomModal';
import WorkOrderTypes from './WorkOrderTypes';
import AssetTypes from './AssetTypes';
import { TaskInformationState } from '../../types/work-order.types';
import { CustomTextInput } from '../../components/CustomTextInput';
import { defaultInputStyles } from '../../styles/global-styles';
  

interface TaskInformationProps {
    priorityOptions?: WorkPriority[];
    setTaskInformation: React.Dispatch<React.SetStateAction<TaskInformationState>>
    taskInformation: TaskInformationState
}

export default function TaskInformation({priorityOptions, setTaskInformation, taskInformation} : TaskInformationProps) {


    const [selectingWorkType, setSelectingWorkType] = useState(false)
    const [selectingAsset, setSelectingAsset] = useState(false)


    
  return (
        <View style={styles.modalBody}>
            <View style={styles.inputRow}>
                <View style={styles.row}>
                <CustomSelectInput onSelect={() => setSelectingWorkType(true)} placeholder={taskInformation.workOrderType.workOrderTypeName ? taskInformation.workOrderType.workOrderTypeName : "Washing Machine" }/>
                </View>
            </View>
            
            <View style={styles.inputRow}>
            <View style={styles.row}>
                <CustomSelectInput onSelect={() => setSelectingAsset(true)} placeholder={taskInformation.asset.assetName ? taskInformation.asset.assetName : "Water leakage"} />
            </View>
            </View>
                <CustomTextAreaInput onChangeText={(e) => setTaskInformation((prev) => ({...prev, problemDescription: e}))} placeholder="Write Problem" />
                <CustomTextAreaInput flex onChangeText={(e) => setTaskInformation((prev) => ({...prev, taskDescription: e}))} placeholder="Write issue description here" />
            <View style={styles.inputRow}>
            <View style={styles.row}>
                <CustomSelectInput placeholder="Repair" />
                </View>
            </View>

            <RadioGroup 
                label="Priority" 
                options={priorityOptions} 
                onSelect={(selectedPriority) => {
                  setTaskInformation(prev => ({
                    ...prev,
                    workPriority: {
                      workPriorityUUID: selectedPriority.WorkPriorityUUID,
                      workPriorityName: selectedPriority.WorkPriorityName
                    }
                  }));
                }}
            />


            <CustomModal isOpen={selectingWorkType} onClose={() => setSelectingWorkType(false)}>
                <WorkOrderTypes setTaskInformation={setTaskInformation} onClose={() => setSelectingWorkType(false)} />
            </CustomModal>

            <CustomModal isOpen={selectingAsset} onClose={() => setSelectingAsset(false)}>
                <AssetTypes setTaskInformation={setTaskInformation} onClose={() => setSelectingAsset(false)} />
            </CustomModal>
                

            </View>
  )
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
  