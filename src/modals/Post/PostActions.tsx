import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ModalsHeader from '../ModalsHeader'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { deleteMBComment, deleteMBMessage } from '../../api/network-utils'
import { STATUS_CODE } from '../../api/endpoints'
import { CustomModal } from '../../components/CustomModal'
import ReportForm from './ReportForm'
import { CommentItemProps, EditPostState } from '../../types/post-types'
import { useRoute } from '@react-navigation/native'
import { CommentsScreenRouteProp } from '../../screens/Others/CommentsScreen'

interface PostActionsProps {
  focusedComment?: string,
  onClose: () => void
  MessageBoardUUID?: string
  MessageBoardCommentUUID?: string
  CreatedBy?: string
  setEditPost?: React.Dispatch<React.SetStateAction<EditPostState>>;
  setComments?: React.Dispatch<React.SetStateAction<CommentItemProps[]>>
}

export default function PostActions({onClose, MessageBoardUUID, CreatedBy, MessageBoardCommentUUID,setEditPost, focusedComment, setComments} : PostActionsProps) {
  const [loading, setLoading] = useState(false)
  const [isReportingPost, setIsReportingPost] = useState(false)
const route = useRoute<CommentsScreenRouteProp>()
  const { createdBy } = route.params || {}

  const userUUID = useSelector((state: RootState) => state.auth.userUUID)

  const handleDeletePost = async() => {

    if(!MessageBoardUUID && !MessageBoardCommentUUID) return

    setLoading(true)

    try {
      if(MessageBoardUUID) {
        const deleteMessageResponse = await deleteMBMessage(MessageBoardUUID,userUUID)

        if(deleteMessageResponse.Status === STATUS_CODE.SUCCESS) {
          onClose()
        } else {
          Alert.alert(deleteMessageResponse.Message)
        }
      } else if(MessageBoardCommentUUID) {
        const deleteCommentResponse = await deleteMBComment(MessageBoardCommentUUID, userUUID)

        if(deleteCommentResponse.Status === STATUS_CODE.SUCCESS) {
          onClose()
          setComments?.((prev) => prev.filter((eachComment) => eachComment.MessageBoardCommentUUID !== MessageBoardCommentUUID))

        } else {
          Alert.alert(deleteCommentResponse.Message)
        }
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const isUserMessageOwner = (CreatedBy ?? createdBy) === userUUID

  const handleCloseAllModals = () => {
    setIsReportingPost(false)
    setTimeout(() => {
      onClose()
    },0)

  }

  return (
      <View style={styles.container}>
        <ModalsHeader onClose={onClose} title={"Post Actions"} />
        <View style={styles.postActionButtonsContainer}>
          {!isUserMessageOwner && <CustomButton onPress={() => setIsReportingPost(true)} textStyle={styles.reportText} buttonStyle={styles.report} title={"Report"} />}
          {isUserMessageOwner && <CustomButton onPress={() => {setEditPost?.({state: true, updatedEdit: focusedComment ?? "", postUUID: MessageBoardCommentUUID ?? ""}); onClose()}} textStyle={styles.editText} buttonStyle={styles.edit} title={"Edit"} />}
          {isUserMessageOwner && <CustomButton onPress={handleDeletePost} textStyle={styles.deleteText} buttonStyle={styles.delete} title={loading ? null : "Delete"} icon={loading ? <ActivityIndicator size="small" color="#fff" /> : null} />}
        </View>


        <CustomModal fullScreen presentationStyle="formSheet" isOpen={isReportingPost} onClose={() => setIsReportingPost(false)} >
          <ReportForm MessageBoardCommentUUID={MessageBoardCommentUUID} MessageBoardUUID={MessageBoardUUID} onClose={handleCloseAllModals} />
        </CustomModal>

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