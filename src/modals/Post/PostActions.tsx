import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ModalsHeader from '../ModalsHeader'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { deleteMBMessage } from '../../api/network-utils'
import { STATUS_CODE } from '../../api/endpoints'

interface PostActionsProps {
  onClose: () => void
  MessageBoardUUID: string
  CreatedBy?: string
}

export default function PostActions({onClose, MessageBoardUUID, CreatedBy} : PostActionsProps) {

  const [loading, setLoading] = useState(false)

  const userUUID = useSelector((state: RootState) => state.auth.userUUID)

  const handleDeletePost = async() => {

    setLoading(true)
    try {
      const deleteMessageResponse = await deleteMBMessage(MessageBoardUUID,userUUID)
      if(deleteMessageResponse.Status === STATUS_CODE.SUCCESS) {
        onClose()
      } else{
        Alert.alert(deleteMessageResponse.Message)
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const isUserMessageOwner = CreatedBy === userUUID

  return (
      <View style={styles.container}>
        <ModalsHeader onClose={onClose} title={"Post Actions"} />
        <View style={styles.postActionButtonsContainer}>
          <CustomButton onPress={() => {}} textStyle={styles.reportText} buttonStyle={styles.report} title={"Report"} />
          {isUserMessageOwner && <CustomButton onPress={() => {}} textStyle={styles.editText} buttonStyle={styles.edit} title={"Edit"} />}
          {isUserMessageOwner && <CustomButton onPress={handleDeletePost} textStyle={styles.deleteText} buttonStyle={styles.delete} title={loading ? null : "Delete"} icon={loading ? <ActivityIndicator size="small" color="#fff" /> : null} />}
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  container : {
    paddingBottom: 20,
    width: "100%",
    borderRadius: 20,
    backgroundColor :"white",
  },
  postActionButtonsContainer: {
/*     borderWidth: 1, */
    padding: 16,
    gap: 15
  },
  report: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center", 
    flexDirection: "row",
    gap: 8,
    padding: 5
  },
  reportText: {
    color: colors.RED_TEXT,
    fontSize: 16,
    fontWeight: 500
  },
  deleteText: {
    color: "white",
    fontSize: 16,
    fontWeight: 600
  },
  delete: {
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center", 
    flexDirection: "row",
    backgroundColor: colors.RED_TEXT,
    gap: 8
  },
  editText: {
    color: colors.ACCENT_COLOR,
    fontSize: 16,
    fontWeight: 500
  },
  edit: {
    padding: 10,
    gap: 8
  }
  

})