import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import SelectInput from '../../components/CustomSelectInput';
import RadioGroup from './RadioGroup';
import CustomTextAreaInput from '../../components/CustomTextAreaInput';
import CustomSelectInput from '../../components/CustomSelectInput';
import { CustomModal } from '../../components/CustomModal';
import WorkOrderTypes from './WorkOrderTypes';
  

interface TaskInformationProps {
    priorityOptions?: WorkPriority[];
    setTaskInformation: React.Dispatch<React.SetStateAction<TaskInformationState>>
    taskInformation: TaskInformationState
}

export default function TaskInformation({priorityOptions, setTaskInformation, taskInformation} : TaskInformationProps) {


    const [selectingWorkType, setSelectingWorkType] = useState(false)
    const [selectingAssetType, setSelectingAssetType] = useState(false)

    
  return (
        <View style={styles.modalBody}>
            <Text style={styles.labelText}>1. Task Information</Text>

            <View style={styles.inputRow}>
                <View style={styles.row}>
                <CustomSelectInput onSelect={() => setSelectingWorkType(true)} placeholder={taskInformation.workOrderType.workOrderTypeName ? taskInformation.workOrderType.workOrderTypeName : "Washing Machine" }/>
                </View>
            </View>
            
            <View style={styles.inputRow}>
            <View style={styles.row}>
                <CustomSelectInput placeholder="Water leakage" />
            </View>
            </View>
                <CustomTextAreaInput onChangeText={(e) => setTaskInformation((prev) => ({...prev, taskDescription: e}))} placeholder="Write issue description here" />
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
                    workPriorityUUID: selectedPriority.WorkPriorityUUID
                    }));
                }}
            />


            <CustomModal isOpen={selectingWorkType} onClose={() => setSelectingWorkType(false)}>
                <WorkOrderTypes setTaskInformation={setTaskInformation} onClose={() => setSelectingWorkType(false)} />
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
      },
    labelText: {
      fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
      color: "#111928",
      fontWeight: "500",
    },
    inputRow: {
      minHeight: 42,
      width: "100%",
      fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
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
  