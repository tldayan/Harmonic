import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalsHeader from '../ModalsHeader'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { deleteMBComment, deleteMBMessage } from '../../api/network-utils'
import { STATUS_CODE } from '../../utils/constants'
import { CustomModal } from '../../components/CustomModal'
import ReportForm from './ReportForm'
import { AttachmentData, CommentItemProps, EditPostState, PostItemProps } from '../../types/post-types'
import { useRoute } from '@react-navigation/native'
import { CommentsScreenRouteProp } from '../../screens/Others/CommentsScreen'
import CreatePost from './CreatePost'
import { fetchWithErrorHandling } from '../../utils/helpers'

interface PostActionsProps {
  focusedComment?: string,
  onClose: () => void
  MessageBoardCommentUUID?: string
  CreatedBy?: string
  setEditPost?: React.Dispatch<React.SetStateAction<EditPostState>>;
  setComments?: React.Dispatch<React.SetStateAction<CommentItemProps[]>>
  post?: PostItemProps
  attachmentData?: AttachmentData[]
  fetchLatestMessages?: (messageBoardUUID?: string) => void
}

export default function PostActions({onClose, CreatedBy,fetchLatestMessages, MessageBoardCommentUUID,setEditPost, focusedComment, setComments,post, attachmentData} : PostActionsProps) {
  
  const [loading, setLoading] = useState(false)
  const [isReportingPost, setIsReportingPost] = useState(false)
  const [isUserMessageOwner, setIsUserMessageOwner] = useState(false)
  const [isEditingPost, setIsEditingPost] = useState(false)

const route = useRoute<CommentsScreenRouteProp>()
  const { createdBy } = route.params || {}
  

  const userUUID = useSelector((state: RootState) => state.auth.userUUID)


  useEffect(() => {
    console.log(createdBy, CreatedBy, post?.CreatedBy)
    const messageOwnerUUID = CreatedBy ?? createdBy ?? post?.CreatedBy;
    if (messageOwnerUUID === userUUID) {
      console.log("user is owner")
      setIsUserMessageOwner(true);
    }
  }, [post]);
  

  const handleDeletePost = async() => {
    
    if(!post?.MessageBoardUUID && !MessageBoardCommentUUID) return
    
    setLoading(true)

    try {
      if(post?.MessageBoardUUID) {
        const deleteMessageResponse = await fetchWithErrorHandling(deleteMBMessage,post.MessageBoardUUID,userUUID)

        if(deleteMessageResponse.Status === STATUS_CODE.SUCCESS) {
          onClose()
        } else {
          Alert.alert(deleteMessageResponse.Message)
        }
      } else if(MessageBoardCommentUUID) {
        const deleteCommentResponse = await fetchWithErrorHandling(deleteMBComment,MessageBoardCommentUUID, userUUID)

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
      fetchLatestMessages?.()
    }
  }

  const handleEditPost = () => {
    if(CreatedBy) { // if editing comment
      setEditPost?.({state: true, updatedEdit: focusedComment ?? "", postUUID: MessageBoardCommentUUID ?? ""})
      onClose()
    } else if(post) { // if editing post
      setIsEditingPost(true)
    }
  }

/*   const isUserMessageOwner = ((CreatedBy ?? createdBy) || post?.CreatedBy) === userUUID */

  const handleCloseAllModals = () => {
    setIsReportingPost(false)
    setIsEditingPost(false)
    setTimeout(() => {
      onClose()
    },0)

  }

  return (
      <View style={styles.container}>
        <ModalsHeader onClose={onClose} title={"Post Actions"} />
        <View style={styles.postActionButtonsContainer}>
          {!isUserMessageOwner && <CustomButton onPress={() => setIsReportingPost(true)} textStyle={styles.reportText} buttonStyle={styles.report} title={"Report"} />}
          {isUserMessageOwner && <CustomButton onPress={handleEditPost} textStyle={styles.editText} buttonStyle={styles.edit} title={"Edit"} />}
          {isUserMessageOwner && <CustomButton onPress={handleDeletePost} textStyle={styles.deleteText} buttonStyle={styles.delete} title={loading ? null : "Delete"} icon={loading ? <ActivityIndicator size="small" color="#fff" /> : null} />}
        </View>


        <CustomModal fullScreen presentationStyle="formSheet" isOpen={isReportingPost} onClose={() => setIsReportingPost(false)} >
          <ReportForm MessageBoardCommentUUID={MessageBoardCommentUUID} MessageBoardUUID={post?.MessageBoardUUID} onClose={handleCloseAllModals} />
        </CustomModal>

        <CustomModal fullScreen presentationStyle='formSheet' isOpen={isEditingPost} onClose={handleCloseAllModals}>
          <CreatePost fetchLatestMessages={fetchLatestMessages} attachmentData={attachmentData} post={post} onClose={handleCloseAllModals} />
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