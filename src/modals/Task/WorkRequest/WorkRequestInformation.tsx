import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import RadioGroup from "../RadioGroup"
import CustomTextAreaInput from '../../../components/CustomTextAreaInput'
import CustomSelectInput from '../../../components/CustomSelectInput'
import { CustomModal } from '../../../components/CustomModal'
import WorkRequestTypes from './WorkRequestTypes'
import AssetTypes from "../AssetTypes"
import { WorkRequestInformationState } from '../../../types/work-request.types'
import { CustomTextInput } from '../../../components/CustomTextInput'
import { defaultInputStyles } from '../../../styles/global-styles'

interface WorkRequestInformationProps {
    priorityOptions?: WorkPriority[]
    setWorkRequestInformation: React.Dispatch<React.SetStateAction<WorkRequestInformationState>>
    workRequestInformation: WorkRequestInformationState
}

export default function WorkRequestInformation({
    priorityOptions,
    setWorkRequestInformation,
    workRequestInformation
}: WorkRequestInformationProps) {

    const [selectingWorkRequestType, setSelectingWorkRequestType] = useState(false)
    const [selectingAsset, setSelectingAsset] = useState(false)

    return (
        <View style={styles.modalBody}>
            <View style={styles.inputRow}>
                <View style={styles.row}>
                    <CustomSelectInput
                        onSelect={() => setSelectingWorkRequestType(true)}
                        placeholder={
                            workRequestInformation.workRequestType.workRequestTypeName
                                ? workRequestInformation.workRequestType.workRequestTypeName
                                : 'Select Request Type'
                        }
                    />
                </View>
            </View>

            <View style={styles.inputRow}>
                <View style={styles.row}>
                    <CustomSelectInput
                        onSelect={() => setSelectingAsset(true)}
                        placeholder={
                            workRequestInformation.asset.assetName
                                ? workRequestInformation.asset.assetName
                                : 'Select Asset'
                        }
                    />
                </View>
            </View>
            <CustomTextAreaInput
                multiline={true}
                flex={true}
                onChangeText={(e) =>
                    setWorkRequestInformation((prev) => ({
                        ...prev,
                        taskDescription: e
                    }))
                }
                placeholder="Write issue description here"
            />

            <View style={styles.inputRow}>
                <View style={styles.row}>
                    <CustomSelectInput placeholder="Repair" />
                </View>
            </View>

            <RadioGroup
                label="Priority"
                options={priorityOptions}
                onSelect={(selectedPriority: WorkPriority) => {
                    setWorkRequestInformation((prev) => ({
                        ...prev,
                        workPriority: {
                            workPriorityUUID: selectedPriority.WorkPriorityUUID,
                            workPriorityName: selectedPriority.WorkPriorityName
                        }
                    }))
                }}
            />

            <CustomModal isOpen={selectingWorkRequestType} onClose={() => setSelectingWorkRequestType(false)}>
                <WorkRequestTypes setWorkRequestInformation={setWorkRequestInformation} onClose={() => setSelectingWorkRequestType(false)} />
            </CustomModal>

            <CustomModal isOpen={selectingAsset} onClose={() => setSelectingAsset(false)}>
                <AssetTypes setWorkRequestInformation={setWorkRequestInformation} onClose={() => setSelectingAsset(false)} />
            </CustomModal>
        </View>
    )
}

const styles = StyleSheet.create({
    modalBody: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        gap: 10,
        marginTop: 10
    },
    inputRow: {
        minHeight: 42,
        width: '100%',
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '400',
        lineHeight: 1
    },
    row: {
        display: 'flex',
        width: '100%',
        gap: 16,
        flex: 1,
        height: '100%',
        padding: 0
    }
})
