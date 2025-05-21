import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ModalsHeader from '../../ModalsHeader'
import CustomTextAreaInput from '../../../components/CustomTextAreaInput'
import Alert from "../../../assets/icons/circle-alert.svg"
import CustomButton from '../../../components/CustomButton'
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../../styles/button-styles'
import { shadowStyles } from '../../../styles/global-styles'
import { colors } from '../../../styles/colors'
import { approveWorkRequest, getWorkOrderDetails } from '../../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { STATUS_CODE } from '../../../utils/constants'
import { CustomModal } from '../../../components/CustomModal'
import WorkOrderCreation from '../WorkOrder/WorkOrderCreation'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types/navigation-types'

interface ApproveWorkRequestProps {
    onClose: () => void
    workRequestUUID: string
    workRequestNumber: string
    fetchWorkRequestDetails: () => Promise<void>
}

export default function ApproveWorkRequest({onClose, workRequestUUID, workRequestNumber, fetchWorkRequestDetails} : ApproveWorkRequestProps) {

    

    const [note, setNote] = useState('')
    const [creatingWorkOrder, setCreatingWorkOrder] = useState(false)
    const [workOrder, setWorkOrder] = useState<WorkOrderDetails | null>(null)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const userUUID = useSelector((state: RootState) => state.auth.userUUID)

    const handleApproveWorkRequest = async() => {
        
        try {
            const approveWorkRequestResponse = await approveWorkRequest(userUUID, note, workRequestUUID)
            if(approveWorkRequestResponse.Status === STATUS_CODE.SUCCESS) {
                const workOrderDetailsResponse = await getWorkOrderDetails(approveWorkRequestResponse.Payload.WorkOrderUUID)
                if(workOrderDetailsResponse.Status === STATUS_CODE.SUCCESS) {
                    setWorkOrder(workOrderDetailsResponse.Payload) 
                    setCreatingWorkOrder(true)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }




  return (
    <View style={styles.container}>
      <ModalsHeader onClose={onClose} title='Approve Work Request' />

        <View style={{paddingHorizontal: 20, alignItems:"center", gap: 10}}>
            <Text style={{color: colors.TEXT_COLOR}}>You are about to approve request:</Text>
            <Text style={{fontWeight: 500}}>{workRequestNumber}</Text>

            <View style={[styles.alertContainer, shadowStyles ]}>
            <Alert fill='red' color='white' width={22} height={22}/>
            <Text style={styles.pending}>All approved requests require a task to be created immediately</Text>
            </View>

            <CustomTextAreaInput onChangeText={(e) => setNote(e)} multiline placeholder='Note' />

            <View style={{flexDirection: "row",gap: 20, justifyContent:"center", width: "100%"}}>
                <CustomButton buttonStyle={[PRIMARY_BUTTON_STYLES, {flex: 1, backgroundColor: "white", borderWidth: 1, borderColor: colors.BORDER_COLOR}]} textStyle={[PRIMARY_BUTTON_TEXT_STYLES, {color: colors.TEXT_COLOR}]} onPress={onClose} title={"No, Cancel"} />
                <CustomButton buttonStyle={[PRIMARY_BUTTON_STYLES, {flex: 1}]} textStyle={PRIMARY_BUTTON_TEXT_STYLES} onPress={handleApproveWorkRequest} title={"Yes, I'm sure"} />
            </View>
        </View>


        <CustomModal onClose={() => {setCreatingWorkOrder(false); onClose()}} isOpen={creatingWorkOrder} >
            <WorkOrderCreation workOrder={workOrder} onClose={() => {setCreatingWorkOrder(false); onClose()}} />
        </CustomModal>

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 20,
        width: "90%",
    },
    alertContainer: {
        width: "95%",
        alignSelf: "center",
        gap: 5,
        backgroundColor: colors.RED_SHADE,
        borderRadius: 10,
        padding: 8,
        marginTop: 10,
        flexDirection : "row",
        alignItems: "center"
      },
      pending: {
        flexShrink: 1,
        fontSize: 13,
        flexWrap: 'wrap',
        marginLeft: 5,
        color: colors.LIGHT_TEXT
      },
})