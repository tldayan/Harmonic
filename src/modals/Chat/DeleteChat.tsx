import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { cancelButton, modalButtonsContainer, modalContainer, modalNotice, modalTitle, proceedButton } from '../../styles/floatModals-styles'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'

interface DeleteChatProps {
    onClose: () => void
    name?: string
}

export default function DeleteChat({onClose, name}: DeleteChatProps) {


  return (
    <View style={modalContainer}>
      <Text style={modalTitle}>Delete chat</Text>
      <Text style={modalNotice}>This action will delete the entire chat with {name}. Are you sure you want to delete this chat?</Text>


      <View style={modalButtonsContainer}>
        <CustomButton onPress={onClose} buttonStyle={cancelButton} textStyle={{color: colors.ACTIVE_ORANGE}} title={"Cancel"} />
        <CustomButton onPress={() => {}} buttonStyle={[proceedButton, {backgroundColor: colors.RED_COLOR, borderColor: colors.RED_COLOR}]} textStyle={{color: "white"}} title={"Delete"} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})