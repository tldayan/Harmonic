import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { cancelButton, modalButtonsContainer, modalContainer, modalNotice, modalTitle, proceedButton, squareCheckbox } from '../../styles/floatModals-styles'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import CheckIcon from "../../assets/icons/check.svg"

interface ReportProps {
    onClose: () => void
}


export default function Report({onClose} : ReportProps) {

    const [blockAndDeleteChat, setBlockAndDeleteChat] = useState(false)

  return (
    <View style={modalContainer}>
      <Text style={modalTitle}>Report chat</Text>
      <Text style={modalNotice}>The last 5 messages of this conversation will be flagged and reported to the builder manager. Are you sure you want to report?</Text>

      <TouchableOpacity onPress={() => setBlockAndDeleteChat((prev) => !prev)} style={styles.checkboxContainer}>
        <View style={[squareCheckbox, blockAndDeleteChat && {backgroundColor: colors.ACTIVE_ACCENT_COLOR, borderWidth: 0}]}>
            {blockAndDeleteChat && <CheckIcon width={10} height={10} />}
        </View>         
        <Text style={styles.checkboxOption}>Block user and delete chat</Text>
      </TouchableOpacity>

      <View style={modalButtonsContainer}>
        <CustomButton onPress={onClose} buttonStyle={cancelButton} textStyle={{color: colors.ACTIVE_ORANGE}} title={"Cancel"} />
        <CustomButton onPress={() => {}} buttonStyle={proceedButton} textStyle={{color: "white"}} title={"Report"} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    checkboxContainer: {
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10
    },
    checkboxOption: {
        flexWrap: "wrap",
        flexShrink: 1,
        fontSize: 15
    },
})