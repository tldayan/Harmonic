import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { CustomTextInput } from '../../components/CustomTextInput'
import { defaultInputStyles } from '../../styles/global-styles'
import { TaskInformationState } from '../../types/work-order.types'
import CustomSelectInput from '../../components/CustomSelectInput'
import { colors } from '../../styles/colors'


interface TaskUserInfoProps {
    setTaskInformation: React.Dispatch<React.SetStateAction<TaskInformationState>>
    taskInformation: TaskInformationState
}

export default function TaskUserInfo({setTaskInformation, taskInformation}: TaskUserInfoProps) {




  return (
    <View style={styles.userInfoContainer}>
      <CustomTextInput value={taskInformation.creatorName} inputStyle={defaultInputStyles} onChangeText={(e) => setTaskInformation((prev) => ({...prev, creatorName: e}))} placeholder='Tarun' />
      <CustomTextInput value={taskInformation.creatorEmail} inputStyle={defaultInputStyles} onChangeText={(e) => setTaskInformation((prev) => ({...prev, creatorEmail: e}))} placeholder='tarun@gmail.com' />
      <CustomTextInput inputStyle={[styles.inputField, styles.numberField]} placeholder="123 456 7890" countryCode={"971"} onChangeText={(e) => setTaskInformation((prev) => ({...prev, creatorNumber: e}))} value={taskInformation.creatorNumber} inputMode="tel" />
      <CustomSelectInput placeholder='Unit D3' onSelect={() => {}}  />
    </View>
  )
}

const styles = StyleSheet.create({
    userInfoContainer : {
        marginTop: 20,
        flexDirection: "column",
        gap: 10
    },
    inputField : {
        borderStyle: "solid",
        borderColor: colors.BORDER_COLOR,
        borderWidth: 1,
        flex: 1,
        height: 42,
        paddingHorizontal: 16,
        color: "black",
    },
    numberField : { 
		borderTopLeftRadius: 0, 
		borderBottomLeftRadius: 0, 
		borderTopRightRadius: 50, 
		borderBottomRightRadius: 50, 
		marginBottom: 0
	}
})