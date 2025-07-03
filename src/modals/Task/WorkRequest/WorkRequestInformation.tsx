import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import RadioGroup from "../RadioGroup"
import CustomTextAreaInput from '../../../components/CustomTextAreaInput'
import CustomSelectInput from '../../../components/CustomSelectInput'
import { CustomModal } from '../../../components/CustomModal'
import WorkRequestTypes from './WorkRequestTypes'
import AssetTypes from "../AssetTypes"
import { WorkRequestInformationState } from '../../../types/work-request.types'
import { CustomTextInput } from '../../../components/CustomTextInput'
import { defaultInputStyles } from '../../../styles/global-styles'
import { getWorkPriorities } from '../../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'

interface WorkRequestInformationProps {
    setWorkRequestInformation: React.Dispatch<React.SetStateAction<WorkRequestInformationState>>
    workRequestInformation: WorkRequestInformationState
}

export default function WorkRequestInformation({
    setWorkRequestInformation,
    workRequestInformation
}: WorkRequestInformationProps) {

    const [selectingWorkRequestType, setSelectingWorkRequestType] = useState(false)
    const [selectingAsset, setSelectingAsset] = useState(false)
    const [workPriorities, setWorkPriorities] = useState<WorkPriority[]>()
    const {organizationUUID} = useSelector((state: RootState) => state.auth)
    const [loading, setLoading] = useState(false)

        useEffect(() => {
    
            const fetchWorkPriorities = async() =>  {
                setLoading(true)
                try {
                    const workPriorities = await getWorkPriorities(organizationUUID)
                    console.log(workPriorities)
                    setWorkPriorities(workPriorities.Payload)
                } catch (err) {
                    console.log(err)
                } finally {
                    setLoading(false)
                }

            }
    
            fetchWorkPriorities()
    
        }, [])
    

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

            {loading ? <ActivityIndicator size={"small"} style={{marginTop: 20}} /> :<RadioGroup
                label="Priority"
                options={workPriorities}
                onSelect={(selectedPriority: WorkPriority) => {
                    setWorkRequestInformation((prev) => ({
                        ...prev,
                        workPriority: {
                            workPriorityUUID: selectedPriority.WorkPriorityUUID,
                            workPriorityName: selectedPriority.WorkPriorityName
                        }
                    }))
                }}
            />}

            {selectingWorkRequestType && <CustomModal onClose={() => setSelectingWorkRequestType(false)}>
                <WorkRequestTypes setWorkRequestInformation={setWorkRequestInformation} onClose={() => setSelectingWorkRequestType(false)} />
            </CustomModal>}

            {selectingAsset && <CustomModal onClose={() => setSelectingAsset(false)}>
                <AssetTypes setWorkRequestInformation={setWorkRequestInformation} onClose={() => setSelectingAsset(false)} />
            </CustomModal>}
            
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
