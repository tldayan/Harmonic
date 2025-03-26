import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import CheckIcon from "../../assets/icons/check.svg"

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
    <View style={styles.container}>
      <Text style={styles.title}>Mute notifications</Text>
      <Text style={styles.notice}>The notifications from this chat will be disabled you can always change this setting</Text>

        <View style={styles.checkboxContainer}>
            {muteOptions.map((eachOption) => {
                return (
                    <TouchableOpacity key={eachOption.value} onPress={() => handleCheckbox(eachOption.value)} style={[styles.muteOption]}>
                        <View style={[styles.checkbox, muteDurationValue === eachOption.value && {backgroundColor : colors.PRIMARY_COLOR, borderWidth: 0}]}>
                            {muteDurationValue === eachOption.value && <CheckIcon width={10} height={10} />}
                        </View>
                        <Text style={{fontWeight: 300}}>{eachOption.label}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>

      <View style={styles.buttonsContainer}>
        <CustomButton onPress={onClose} buttonStyle={styles.cancel} textStyle={{color: colors.ACTIVE_ORANGE}} title={"Cancel"} />
        <CustomButton onPress={() => {}} buttonStyle={styles.mute} textStyle={{color: "white"}} title={"Mute"} />
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
    buttonsContainer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "center",
        gap: 10
    },
    cancel: {
        padding: 10,
        flex: 1,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.ACTIVE_ORANGE
    },
    mute: {
        backgroundColor: colors.ACTIVE_ORANGE,
        padding: 10,
        flex: 1,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.ACTIVE_ORANGE
    },
    checkboxContainer: {
        gap: 15,
        marginVertical: 10,
    },
    checkbox: {
        width: 23,
        height: 23,
        borderRadius: 50,
        borderColor: colors.LIGHT_COLOR,
        backgroundColor: colors.BACKGROUND_COLOR,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    muteOption: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    }
})