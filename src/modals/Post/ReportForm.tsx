import { Modal, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ModalsHeader from '../ModalsHeader'
import { CustomTextInput } from '../../components/CustomTextInput'
import { colors } from '../../styles/colors'
import CustomButton from '../../components/CustomButton'
import { reportMBCommentInappropriate, reportMBMessageInappropriate } from '../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { SafeAreaView } from 'react-native-safe-area-context'
import { STATUS_CODE } from '../../utils/constants'

interface ReportFormProps {
    onClose: () => void
    MessageBoardUUID?: string
    MessageBoardCommentUUID?: string
}


export default function ReportForm({onClose, MessageBoardUUID, MessageBoardCommentUUID} : ReportFormProps) {

    const userUUID = useSelector((state: RootState) => state.auth.userUUID)
    const [errorMessage, setErrorMessage] = useState("")
    const [report, setReport] = useState("")

    const handleSend = async() => {
        if(!MessageBoardUUID && !MessageBoardCommentUUID) return

        if(!report) {
            setErrorMessage("Please write a report")
            return
        }

        let reportStatus = undefined

        if(MessageBoardCommentUUID) {
            const reportCommentResponse = await reportMBCommentInappropriate(userUUID, MessageBoardCommentUUID, report)
            reportStatus = reportCommentResponse
        } else if(MessageBoardUUID) {
            const reportMessageResponse = await reportMBMessageInappropriate(userUUID, MessageBoardUUID, report)
            reportStatus = reportMessageResponse
        }

        if(reportStatus === STATUS_CODE.SUCCESS) {
            onClose()
        }

    }    

    const handleReportText = (e: string) => {
        setReport(e)
        if(errorMessage) {
            setErrorMessage("")
        }
    }

  return (
    <SafeAreaView style={styles.container}>
        <ModalsHeader onClose={onClose} title='Report Post' />
        <View style={styles.innerContainer}>
            <Text style={styles.title}>We're sorry that you've had this experience!</Text>
            <Text style={styles.reportNotice}>Everyone Plays a Part in Keeping a Community Safe. You can help our review team identify potentially harmful messages as quickly as possible by reporting any message. We will take appropriate action to make sure healthy standards are maintained in our community</Text>
            <CustomTextInput errorMessage={errorMessage} label='Write to us, help us understand the problem' labelStyle={styles.reportLabel} inputStyle={styles.reportField} multiline placeholder='Write your report...' placeholderTextColor={colors.LIGHT_TEXT_COLOR} value={report} onChangeText={handleReportText} />
            <CustomButton textStyle={styles.cancelText} buttonStyle={styles.cancel} onPress={onClose} title={"Cancel"} />
            <CustomButton textStyle={styles.sendText} buttonStyle={styles.send} onPress={handleSend} title={"Send"} />
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
    },
    innerContainer : {
/*         borderWidth: 2, */
        padding: 16,
    },
    title: {
        fontSize: 18,
        paddingHorizontal: 20,
        fontWeight: 500,
        textAlign : "center"
    },
    reportNotice: {
        textAlign: "center",
        marginTop: 20,
        fontWeight: 300,
    },
    reportLabel: {
        marginTop: 20,
        marginBottom: 5
    },
    reportField: {
        width : "100%",
        height: 100,
        borderColor: colors.ACTIVE_ORANGE,
        textAlignVertical: "top",
    },
    sendText: {
        color: "white",
        fontSize: 16,
        fontWeight: 600
      },
      send: {
        padding: 10,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center", 
        flexDirection: "row",
        backgroundColor: colors.RED_TEXT,
        gap: 8
      },
      cancelText: {
        color: colors.ACCENT_COLOR,
        fontSize: 16,
        fontWeight: 500
      },
      cancel: {
        marginTop: 10,
        padding: 10,
        gap: 8
      }
})