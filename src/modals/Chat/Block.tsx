import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { cancelButton, modalButtonsContainer, modalContainer, modalNotice, modalTitle, proceedButton, squareCheckbox } from '../../styles/floatModals-styles'
import CheckIcon from "../../assets/icons/check.svg"
import { colors } from '../../styles/colors'
import CustomButton from '../../components/CustomButton'

interface BlockProps {
  onClose: () => void
}

export default function Block({onClose}: BlockProps) {

    const [reportToBuildingManager, setReportToBuildingManager] = useState(false)

  return (
<View style={modalContainer}> 
      <Text style={modalTitle}>Block User</Text>
      <Text style={modalNotice}>Blocked user will not be able to send messages to you or see your posts on community central. Are you sure you want to block this user?</Text>

        <TouchableOpacity onPress={() => setReportToBuildingManager((prev) => !prev)} style={styles.checkboxContainer}>
            <View style={[squareCheckbox, reportToBuildingManager && {backgroundColor: colors.ACTIVE_ACCENT_COLOR, borderWidth: 0}]}>
                {reportToBuildingManager && <CheckIcon width={10} height={10} />}
            </View>
            <Text style={styles.checkboxOption}>Report last 5 messages to building manager</Text>
        </TouchableOpacity>

      <View style={modalButtonsContainer}>
        <CustomButton onPress={onClose} buttonStyle={cancelButton} textStyle={{color: colors.ACTIVE_ORANGE}} title={"Cancel"} />
        <CustomButton onPress={() => {}} buttonStyle={proceedButton} textStyle={{color: "white"}} title={"Block"} />
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
      flexShrink: 1
    }
})