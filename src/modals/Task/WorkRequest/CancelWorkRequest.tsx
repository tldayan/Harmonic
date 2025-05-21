import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ModalsHeader from '../../ModalsHeader'
import CustomTextAreaInput from '../../../components/CustomTextAreaInput'
import Alert from "../../../assets/icons/circle-alert.svg"
import CustomButton from '../../../components/CustomButton'
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../../styles/button-styles'
import { shadowStyles } from '../../../styles/global-styles'
import { colors } from '../../../styles/colors'
import { approveWorkRequest, cancelWorkRequest, getWorkOrderDetails } from '../../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { STATUS_CODE } from '../../../utils/constants'
import { CustomModal } from '../../../components/CustomModal'
import WorkOrderCreation from '../WorkOrder/WorkOrderCreation'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types/navigation-types'

interface CancelWorkRequestProps {
    onClose: () => void
    workRequestUUID: string
    workRequestNumber: string
    fetchWorkRequestDetails: () => Promise<void>
}

export default function CancelWorkRequest({onClose, workRequestUUID, workRequestNumber, fetchWorkRequestDetails} : CancelWorkRequestProps) {


    const [note, setNote] = useState('')

    const userUUID = useSelector((state: RootState) => state.auth.userUUID)

    const handleCancelWorkRequest = async() => {

        try {
            const cancelWorkRequestResponse = await cancelWorkRequest(userUUID, note, workRequestUUID)
            if(cancelWorkRequestResponse.Status === STATUS_CODE.SUCCESS) {
                fetchWorkRequestDetails()
                onClose()
            }

        } catch (err) {
            console.log(err)
        }
    }




  return (
    <View style={styles.container}>
      <ModalsHeader onClose={onClose} title='Decline Work Request' />

        <View style={{paddingHorizontal: 20, alignItems:"center", gap: 10}}>
            <Text style={{color: colors.TEXT_COLOR}}>You are about to decline request:</Text>
            <Text style={{fontWeight: 500}}>{workRequestNumber}</Text>

            <Text style={{color: colors.TEXT_COLOR}}>Please provide a reason for declining</Text>

            <View style={[styles.alertContainer, shadowStyles ]}>
                <Alert fill='red' color='white' width={22} height={22}/>
                <Text style={styles.pending}>Declined requests cannot be edited again. This action is final.</Text>
            </View>

            <CustomTextAreaInput onChangeText={(e) => setNote(e)} multiline placeholder='Note' />

            <View style={{flexDirection: "row",gap: 20, justifyContent:"center", width: "100%"}}>
                <CustomButton buttonStyle={[PRIMARY_BUTTON_STYLES, {flex: 1, backgroundColor: "white", borderWidth: 1, borderColor: colors.BORDER_COLOR}]} textStyle={[PRIMARY_BUTTON_TEXT_STYLES, {color: colors.TEXT_COLOR}]} onPress={onClose} title={"No, Cancel"} />
                <CustomButton buttonStyle={[PRIMARY_BUTTON_STYLES, {flex: 1}]} textStyle={PRIMARY_BUTTON_TEXT_STYLES} onPress={handleCancelWorkRequest} title={"Yes, I'm sure"} />
            </View>
        </View>

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