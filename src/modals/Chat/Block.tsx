import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { cancelButton, modalButtonsContainer, modalContainer, modalNotice, modalTitle, proceedButton, squareCheckbox } from '../../styles/floatModals-styles'
import CheckIcon from "../../assets/icons/check.svg"
import { colors } from '../../styles/colors'
import CustomButton from '../../components/CustomButton'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { blockUser } from '../../api/network-utils'
import { STATUS_CODE } from '../../utils/constants'

interface BlockProps {
  onClose: () => void,
  chatMemberUserUUID: string,
  noReport?: boolean
}

export default function Block({onClose, chatMemberUserUUID, noReport}: BlockProps) {

  const [reportToBuildingManager, setReportToBuildingManager] = useState(false)
  const [BlockReason, setBlockReason] = useState("")
  const [loading, setLoading] = useState(false)
  const userUUID = useSelector((state: RootState) => state.auth.userUUID)


  const handleBlockUser = async() => {
      setLoading(true)

    try {
      const blockUserRequestResponse = await blockUser(chatMemberUserUUID, userUUID, BlockReason)
      if(blockUserRequestResponse === STATUS_CODE.ERROR) {
        onClose()
      }

    } catch (err) {
      console.error(err)
    }
    
  }

  return (
      loading ? <ActivityIndicator size={"small"} /> : <View style={modalContainer}> 
            <Text style={modalTitle}>Block User</Text>
            <Text style={modalNotice}>Blocked users will not be able to send messages to you or see your posts on community central. Are you sure you want to block this user?</Text>

              {!noReport && <TouchableOpacity onPress={() => setReportToBuildingManager((prev) => !prev)} style={styles.checkboxContainer}>
                  <View style={[squareCheckbox, reportToBuildingManager && {backgroundColor: colors.ACTIVE_ACCENT_COLOR, borderWidth: 0}]}>
                      {reportToBuildingManager && <CheckIcon width={10} height={10} />}
                  </View>
                  <Text style={styles.checkboxOption}>Report last 5 messages to building manager</Text>
              </TouchableOpacity>}

            {loading ? <ActivityIndicator size={"small"} /> : <View style={modalButtonsContainer}>
              <CustomButton onPress={onClose} buttonStyle={cancelButton} textStyle={{color: colors.ACTIVE_ORANGE}} title={"Cancel"} />
              <CustomButton onPress={handleBlockUser} buttonStyle={proceedButton} textStyle={{color: "white"}} title={"Block"} />
            </View>}
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