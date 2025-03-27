import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import CheckIcon from "../../assets/icons/check.svg"
import { cancelButton, circleCheckbox, modalButtonsContainer, modalContainer, modalNotice, modalTitle, proceedButton, squareCheckbox } from '../../styles/floatModals-styles'

interface MuteNotificationsProps {
    onClose: () => void
}

const muteOptions = [
    {label: "1 hour", value: "1"},
    {label: "8 hour", value: "2"},
    {label: "Always", value: "3"}
]

export default function MuteNotifications({onClose}: MuteNotificationsProps) {

    const [muteDurationValue, setMuteDuratioValue] = useState<string>("")

    const handleCheckbox = (muteDurationValue: string) => {
        setMuteDuratioValue(muteDurationValue)
    }
    

  return (
    <View style={modalContainer}>
      <Text style={modalTitle}>Mute notifications</Text>
      <Text style={modalNotice}>The notifications from this chat will be disabled you can always change this setting</Text>

        <View style={styles.checkboxContainer}>
            {muteOptions.map((eachOption) => {
                return (
                    <TouchableOpacity key={eachOption.value} onPress={() => handleCheckbox(eachOption.value)} style={[styles.muteOption]}>
                        <View style={[circleCheckbox, muteDurationValue === eachOption.value && {backgroundColor : colors.PRIMARY_COLOR, borderWidth: 0}]}>
                            {muteDurationValue === eachOption.value && <CheckIcon width={10} height={10} />}
                        </View>
                        <Text style={{fontWeight: 300}}>{eachOption.label}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>

      <View style={modalButtonsContainer}>
        <CustomButton onPress={onClose} buttonStyle={cancelButton} textStyle={{color: colors.ACTIVE_ORANGE}} title={"Cancel"} />
        <CustomButton onPress={() => {}} buttonStyle={proceedButton} textStyle={{color: "white"}} title={"Mute"} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
        backgroundColor: "white",
        borderRadius: 20,
        width: 343, 
        padding: 20,
    },
    title: {
        fontSize: 19,
        marginBottom: 5,
        fontWeight: 500
    },
    notice: {
        marginVertical: 10
    },
    checkboxContainer: {
        gap: 15,
        marginVertical: 10,
    },
    muteOption: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    }
})