import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'
import { getCommentReplies, getListOfComments, getMBMessageDetails, saveMBMessageComment } from '../../api/network-utils'
import { CommentItemProps, EditPostState, PostItemProps, ReplyItemProps } from '../../types/post-types'
import ProfileHeader from '../../components/ProfileHeader'
import CustomButton from '../../components/CustomButton'
import PostItem from '../../components/PostItem'
import { CustomTextInput } from '../../components/CustomTextInput'
import { colors } from '../../styles/colors'
import SendIcon from "../../assets/icons/send-horizontal.svg"
import { fetchWithErrorHandling, timeAgo, useKeyboardVisibility } from '../../utils/helpers'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useUser } from '../../context/AuthContext'
import PostActions from '../../modals/Post/PostActions'
import { CustomModal } from '../../components/CustomModal'
import { STATUS_CODE } from '../../api/endpoints'

export type CommentsScreenRouteProp = RouteProp<RootStackParamList, "Comments">

export default function CommentsScreen() {
  
  const [messageDetails, setMessageDetails] = useState<PostItemProps | null>(null)
  const [comment, setComment] = useState<string>("")
  const [comments, setComments] = useState<CommentItemProps[]>([])
  const [editPost, setEditPost] = useState<EditPostState>({state: false, updatedEdit: "", postUUID: ""})
  const [focusedComment, setFocusedComment] = useState({state: false, comment: "", MessageBoardCommentUUID: "", CreatedBy: ""})
  const [commentsstartIndex, setCommentsStartIndex] = useState(0)
  const [repliesstartIndex, setRepliesStartIndex] = useState<{[key: string]: number}>({})
  const [hasMoreComments, setHasMoreComments] = useState(true)
  const [hasMoreReplies, setHasMoreReplies] = useState<{[key: string]: boolean}>({})
  const [replyingTo, setReplyingTo] = useState({name: "", MessageBoardCommentUUID: ""})
  const [replies, setReplies] = useState<{ [key: string]: ReplyItemProps[] }>({})
  const [loading, setLoading] = useState(false)
  const [expandedComments, setExpandedComments] = useState<{[key: string]: boolean}>({})
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const userUUID = useSelector((state: RootState) => state.auth.userUUID)
  const {user} = useUser()
  const commentInput = useRef<any>(null)
  const isFetching = useRef(false)

  const flatListRef = useRef<FlatList>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute<CommentsScreenRouteProp>()
  const { postUUID, attachmentData } = route.params || {}


  const fetchComments = async() => {
    if(isFetching.current || !hasMoreComments) return
    isFetching.current = true

/*     await new Promise(resolve => setTimeout(resolve, 2000)); */

    if(!postUUID) return

    try {

      const comments = await getListOfComments(postUUID, commentsstartIndex)
      if(comments?.length === 0) {
        setHasMoreComments(false)
        return
      }
      setComments((prev) => {
        const commentsMap = new Map([...prev, ...comments].map((comment) => [comment.MessageBoardCommentUUID, comment]))
        return Array.from(commentsMap.values())
      })
      setCommentsStartIndex((prev) => prev + 10)
      if(comments.length < 10) {
        setHasMoreComments(false)
      }

    } catch (err) {
      console.error(err)
    } finally {
      isFetching.current = false
    }

  }


  useEffect(() => {
    if (!postUUID) return

    const fetchMBMessageDetails = async() => {
      const messageDetails = await fetchWithErrorHandling(getMBMessageDetails,postUUID, userUUID)
      console.log(messageDetails)
      if(!messageDetails) {
        navigation.goBack()
      }
/*       console.log(messageDetails) */
      setMessageDetails(messageDetails)
    }

    if(postUUID) {
      fetchMBMessageDetails()
    /*   fetchComments()  */// CALLED TWICE
    }

  }, [])



  useKeyboardVisibility(() => setIsKeyboardVisible(true), () => setIsKeyboardVisible(false))


  const fetchCommentReplies = async(MessageBoardCommentUUID: string, firstToggle: boolean) => {

    if(firstToggle && replies[MessageBoardCommentUUID]) return
    setLoading(true)

    try {
      const repliesIndex = firstToggle ? 0 : repliesstartIndex[MessageBoardCommentUUID] || 0;

      const commentReplies = await fetchWithErrorHandling(getCommentReplies,MessageBoardCommentUUID, repliesIndex)
      if(commentReplies.length === 0) return
      if(commentReplies.length < 10) {
        setHasMoreReplies((prev) => ({...prev, [MessageBoardCommentUUID]: false}))
      } else {
        setHasMoreReplies((prev) => ({...prev, [MessageBoardCommentUUID]: true}))
      }

      if(firstToggle) {
        setReplies((prev) => ({...prev, [MessageBoardCommentUUID] : commentReplies}))
      } else {
        setReplies((prev) => ({...prev, [MessageBoardCommentUUID] : [...(prev[MessageBoardCommentUUID] || []), ...commentReplies]}))
      }
        setRepliesStartIndex((prev) => ({...prev, [MessageBoardCommentUUID]: repliesIndex + 10 }))
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }

  }

  const toggleReplies = (MessageBoardCommentUUID: string) => {
    setExpandedComments((prev) => ({...prev, [MessageBoardCommentUUID]: !prev[MessageBoardCommentUUID]}))
    fetchCommentReplies(MessageBoardCommentUUID, true)
  }

  const handleComment = async(postUUID?: string) => {

    if(!comment && !postUUID) return

    const newReplyorComment = {
          "MessageBoardCommentUUID": Date.now().toString(), 
          "Comment": comment,
          "TotalRepliesCount": 0,
          "CreatedDateTime": new Date().toISOString(),
          "CreatedBy": userUUID,
          "UserName": null,
          "FirstName": user?.displayName ?? "",
          "LastName": null,
          "ProfilePicURL": user?.photoURL ?? ""
      }

      let response = await saveMBMessageComment( comment ? comment : editPost.updatedEdit, userUUID, messageDetails?.MessageBoardUUID,replyingTo.MessageBoardCommentUUID, postUUID)
      if(response === STATUS_CODE.SUCCESS) {
        console.log("comment update successfull")
      }

    if(replyingTo.MessageBoardCommentUUID && messageDetails?.MessageBoardUUID) {

      setReplies((prev) => {
        const updatedReplies = { ...prev };
        updatedReplies[replyingTo.MessageBoardCommentUUID] = [
          newReplyorComment,
          ...(updatedReplies[replyingTo.MessageBoardCommentUUID] || []),
        ];
        return updatedReplies;
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment.MessageBoardCommentUUID === replyingTo.MessageBoardCommentUUID
            ? { ...comment, TotalRepliesCount: comment.TotalRepliesCount + 1 }
            : comment
        )
      );
      
    } else if (postUUID) {

      setComments((prev) => {
        const updatedComments = prev.map((eachComment) => eachComment.MessageBoardCommentUUID === postUUID ? {...eachComment, Comment: editPost.updatedEdit} : eachComment)
        return updatedComments
      })

    } else if(messageDetails?.MessageBoardUUID) {
      setComments((prev) => ([newReplyorComment,...prev]))
    }

    setComment("")
    if(postUUID) {
      setEditPost({state: false, updatedEdit: "", postUUID: ""})
    }
  }

  const initiateReply = (firstName: string, messageBoardCommentUUID: string, index: number) => {
    setReplyingTo({ name: firstName, MessageBoardCommentUUID: messageBoardCommentUUID });
    flatListRef.current?.scrollToIndex({ index, animated: true, viewOffset: 100});
    commentInput?.current?.focus();
  };

  const commentItem = ({ item, index }: { item: CommentItemProps; index: number }) => {

    if(!item) {
      return null
    }

    return (
      <View style={styles.commentItemContainer}>
        <CustomButton onPress={() => {}} icon={<Image style={styles.profilePic} source={{uri: item.ProfilePicURL || "https://i.pravatar.cc/150"}} />} />
        <View style={{flex: 1, marginBottom: 25}}>       
          <TouchableOpacity onLongPress={() => setFocusedComment({state: true, comment: item.Comment, MessageBoardCommentUUID: item.MessageBoardCommentUUID, CreatedBy: item.CreatedBy})} style={styles.commentDetailsContainer}>
            <Text style={styles.name}>{item.FirstName}</Text>
            {!editPost.state && <Text style={styles.comment}>{item.Comment}</Text>}
            {(editPost.state && editPost.postUUID === item.MessageBoardCommentUUID) && <CustomTextInput multiline inputStyle={styles.editField} onChangeText={(e) => setEditPost((prev) => ({...prev, updatedEdit: e}))} value={editPost.updatedEdit} placeholder='Edit your comment...' />}
            {(editPost.state && editPost.postUUID === item.MessageBoardCommentUUID) && <View style={styles.editButtonsContainer}>
             <CustomButton textStyle={styles.cancelText} buttonStyle={styles.cancel} title={"Cancel"} onPress={() => setEditPost({state: false, updatedEdit: "", postUUID: ""})} />
             <CustomButton textStyle={styles.updateText} buttonStyle={styles.update} title={"Update"} onPress={() => handleComment(item.MessageBoardCommentUUID)} />
            </View>}
            
          </TouchableOpacity>
          <View style={styles.commentActionsContainer}>
            {item.TotalRepliesCount > 0 ? <CustomButton buttonStyle={styles.commentCount} textStyle={styles.commentCountText} onPress={() => toggleReplies(item.MessageBoardCommentUUID)} title={`${expandedComments[item.MessageBoardCommentUUID] === true ? "Hide" : "Show"} ${item.TotalRepliesCount} ${item.TotalRepliesCount > 1 ? "Replies" : "Reply"}`} />  : null}
            <CustomButton textStyle={styles.replyButton} onPress={() => initiateReply(item.FirstName,item.MessageBoardCommentUUID, index)} title={"Reply"} />
          </View>
          
          {expandedComments[item.MessageBoardCommentUUID] && replies[item.MessageBoardCommentUUID] && (
          replies[item.MessageBoardCommentUUID].map((reply) => (
            <View key={reply.MessageBoardCommentUUID} style={styles.repliesContainer}>
              <Image style={styles.replyProfilePic} source={{uri: reply.ProfilePicURL || "https://i.pravatar.cc/150"}} />
              <TouchableOpacity onPress={() => {}} style={styles.replyContainer}>
                <Text style={styles.name}>{reply.FirstName}</Text>
                <Text style={styles.reply}>{reply.Comment}</Text>
              </TouchableOpacity>
              <Text style={styles.commentDateTime}>{timeAgo(reply.CreatedDateTime)}</Text>
            </View>
          )))}
          {(loading && expandedComments[item.MessageBoardCommentUUID]) && <ActivityIndicator size={"small"} />}
          {((hasMoreReplies[item.MessageBoardCommentUUID] && !loading) && expandedComments[item.MessageBoardCommentUUID]) && <CustomButton textStyle={styles.loadMore} onPress={() => fetchCommentReplies(item.MessageBoardCommentUUID, false)} title={"Load more"} />}
        </View>
        <Text style={styles.commentDateTime}>{timeAgo(item.CreatedDateTime)}</Text>
      </View>
    )

  }

  return (
    <View style={styles.container} >
      <View style={styles.headerProfileContainer}>
        {messageDetails && (
          <View style={{ flex: 1 }}>
            <ProfileHeader goBack attachmentData={attachmentData} showActions post={messageDetails}/>
          </View>
        )}
      </View>

      {messageDetails && <PostItem childAttachmentData={attachmentData} showProfileHeader={false} post={messageDetails} />}
    
        <FlatList 
          ref={flatListRef} 
          showsVerticalScrollIndicator={false} 
          style={styles.commentListContainer} 
          contentContainerStyle={styles.commentList} 
          keyExtractor={(item) => item.MessageBoardCommentUUID} 
          renderItem={commentItem} 
          data={comments}
          onEndReached={fetchComments}  
          onEndReachedThreshold={0.5}
          ListFooterComponent={hasMoreComments ? <ActivityIndicator size="small" color="black" /> : null }
        />


      <View style={[styles.mainCommentContainer, {paddingBottom: isKeyboardVisible ? 0 : 20}]}>
          <CustomButton
            onPress={() => {}} 
            icon={<Image source={require("../../assets/images/frame.png")} />} 
          />
        <View style={styles.commentContainer}>
            {replyingTo.MessageBoardCommentUUID 
              ? <View style={styles.replyingTo}>
                  <Text style={styles.replyingToText}>Replying to</Text>
                  <Text style={styles.replyingToName}>{replyingTo.name}</Text>
                  <Text style={styles.separator}>·</Text>
                  <CustomButton onPress={() => setReplyingTo({name: "", MessageBoardCommentUUID: ""})} textStyle={styles.cancelReply} title="Cancel" />
                </View>
            
              : null
            }
          <View style={styles.commentInputContainer}>
            <CustomTextInput 
              ref={commentInput}
              value={comment} 
              onChangeText={(e) => setComment(e)} 
              inputStyle={styles.commentField} 
              placeholderTextColor={colors.LIGHT_TEXT_COLOR}
              placeholder={replyingTo.MessageBoardCommentUUID ? `Reply to ${replyingTo.name}...` : "Write a comment..."} 
            />
          <CustomButton onPress={handleComment} icon={<SendIcon width={30} height={30} strokeWidth={1} fill={comment ? colors.ACTIVE_ORANGE : "grey"} stroke={comment ? "white" : "white"} />} />

          </View>
        </View>
      </View>

      <CustomModal halfModal  isOpen={focusedComment.state} onClose={() => setFocusedComment({state: false, comment: "", MessageBoardCommentUUID: "", CreatedBy: ""})}>
        <PostActions setComments={setComments} focusedComment={focusedComment.comment} setEditPost={setEditPost} CreatedBy={focusedComment.CreatedBy} MessageBoardCommentUUID={focusedComment.MessageBoardCommentUUID}  onClose={() => setFocusedComment({state: false, comment: "" ,MessageBoardCommentUUID: "", CreatedBy: ""})} />
      </CustomModal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerProfileContainer: {
    paddingTop: 16,
    width: "100%",
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  mainCommentContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop:5,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
  },
  commentContainer : {
    paddingTop: 5,
    flex: 1,
    alignItems :"center",
  },
  commentInputContainer: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  commentField: {
    borderRadius: 50,
    backgroundColor: colors.BACKGROUND_COLOR,
    borderStyle: "solid",
    borderColor: colors.BORDER_COLOR,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 16,
    color: "black",
  },
  commentItemContainer: {
    flexDirection: "row",
    gap: 10,
    flex :1,
  },
  profilePic: {
    width: 34,
    height: 34,
    borderRadius: 50
  },
  commentDetailsContainer: {
    backgroundColor: colors.LIGHT_COLOR,
    paddingHorizontal: 12, 
    paddingVertical: 8,
    flexGrow:1,
    gap: 5,
    justifyContent: "space-between",
    borderRadius: 5,
    fontSize: 12,
/*     alignSelf: "flex-start", */
  },  
  name : {
    fontSize: 14,
  },
  comment: {
    fontSize: 13,
    fontWeight: "300",
    paddingRight: 8,  
    flexWrap: "wrap", 
    maxWidth: "100%", 
  },
  commentCount : {
    alignSelf: 'flex-start'
  },
  commentCountText: {
    fontSize: 12,
    fontWeight: 500,
    color: colors.ACCENT_COLOR
  },
  commentActionsContainer: {
    justifyContent: "flex-end",
    flexDirection: "row",
    gap: 5
  },
  commentDateTime: {
    fontSize: 12,
    fontWeight: 300,
    color: colors.ACTIVE_ACCENT_COLOR,
  },
  commentListContainer :{
/*     borderWidth: 1, */
    padding: 5,
    paddingTop: 20,
    width: "96%",
    marginHorizontal: "2%",
    flex: 1,
  },
  commentList: {
/*     borderWidth: 2, */
    gap: 20,
    flexGrow: 1,
    paddingBottom: 80
  },
  replyProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 50
  },
  replyButton: {
    fontSize: 12,
    fontWeight: 500,
    color: colors.ACTIVE_ORANGE
  },
  repliesContainer: {
    
/*     borderWidth: 2, */
    marginVertical: 10,
    flexDirection: "row",
    gap: 10,
    width: "100%",
    flex: 1,
  },
  replyContainer: {
/*     borderWidth: 1, */
/*     flex: 1, */
    backgroundColor: colors.LIGHT_COLOR,
    paddingHorizontal: 12, 
    paddingVertical: 8,
    gap: 5,
    borderRadius: 5,
    flex: 1,
  },
  reply : {
    fontSize: 13,
    fontWeight: 300,
    paddingRight: 8,  
    flexWrap: "wrap", 
    maxWidth: "100%", 
  },
  replyingToText : {
    fontSize: 12,
    fontWeight: 300,
  },
  replyingTo: {
/*     borderWidth: 1, */
    marginRight: "auto",
    paddingBottom: 5,
    fontWeight: 300,
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  replyingToName: {
    color: colors.ACCENT_COLOR,
    fontSize: 12,
    fontWeight: 500
  },
  cancelReply: {
    fontSize: 12,
    fontWeight: 300,
    color: "red"
  },
  separator: {
    fontSize: 16,
    color: "#888",
  },
  editField: {
    backgroundColor: colors.MAIN_BACKGROUND_COLOR,
    fontSize: 12,
    fontWeight: "300",
    flex: 1,
  },
  editButtonsContainer :{
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancel: {
    borderColor: colors.LIGHT_TEXT,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
  },
  cancelText: {
    fontSize: 12,
    color: colors.RED_TEXT,
    justifyContent: "center"
  },
  update: {
    borderColor: colors.LIGHT_TEXT,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
    backgroundColor: colors.ACTIVE_ORANGE,
    justifyContent: "center"
  },
  updateText: {
    color: "white",
    fontSize: 12
  },
  loadMore: {
    color: colors.ACTIVE_ACCENT_COLOR,
    fontSize: 12,
    textAlign: "right"
  }
  
})
