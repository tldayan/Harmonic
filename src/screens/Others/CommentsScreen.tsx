import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, Image, Alert, FlatList, TouchableOpacity, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'
import { getAllCommentReplies, getListOfComments, getMBMessageDetails, saveMBMessageComment } from '../../api/network-utils'
import { CommentItemProps, EditPostState, PostItemProps, ReplyItemProps } from '../../types/post-types'
import ProfileHeader from '../../components/ProfileHeader'
import ChevronLeft from "../../assets/icons/chevron-left.svg"
import CustomButton from '../../components/CustomButton'
import PostItem from '../../components/PostItem'
import { CustomTextInput } from '../../components/CustomTextInput'
import { colors } from '../../styles/colors'
import SendIcon from "../../assets/icons/send-horizontal.svg"
import { timeAgo } from '../../utils/helpers'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useUser } from '../../context/AuthContext'
import PostActions from '../../modals/Post/PostActions'
import { CustomModal } from '../../components/CustomModal'

type CommentsScreenRouteProp = RouteProp<RootStackParamList, "Comments">

export default function CommentsScreen() {

  const [messageDetails, setMessageDetails] = useState<PostItemProps | null>(null)
  const [comment, setComment] = useState<string>("")
  const [comments, setComments] = useState<CommentItemProps[]>([])
  const [editPost, setEditPost] = useState<EditPostState>({state: false, updatedEdit: "", postUUID: ""})
  const [focusedComment, setFocusedComment] = useState({state: false, comment: "", MessageBoardCommentUUID: "", CreatedBy: ""})
  const [startIndex, setStartIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [replyingTo, setReplyingTo] = useState({name: "", MessageBoardCommentUUID: ""})
  const [replies, setReplies] = useState<{ [key: string]: ReplyItemProps[] }>({})
  const [expandedComments, setExpandedComments] = useState<{[key: string]: boolean}>({})
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const userUUID = useSelector((state: RootState) => state.auth.userUUID)
  const {user} = useUser()
  const commentInput = useRef<any>(null)

  const flatListRef = useRef<FlatList>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute<CommentsScreenRouteProp>()
  const { postUUID, attachmentData } = route.params || {}



  const fetchComments = async() => {

    setLoading(true)

    if(!postUUID) return

    try {

      const comments = await getListOfComments(postUUID, startIndex)
      setComments((prev) => {
        const commentsMap = new Map([...prev, ...comments].map((comment) => [comment.MessageBoardCommentUUID, comment]))
        return Array.from(commentsMap.values())
      })
      setStartIndex((prev) => prev + 10)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }

  }


  useEffect(() => {
    if (!postUUID) return

    const fetchMBMessageDetails = async() => {
      const messageDetails = await getMBMessageDetails(postUUID)
      setMessageDetails(messageDetails)
    }

    if(postUUID) {
      fetchMBMessageDetails()
    /*   fetchComments()  */// CALLED TWICE
    }

  }, [])



  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);


  const fetchCommentReplies = async(MessageBoardCommentUUID: string) => {
    const commentReplies = await getAllCommentReplies(MessageBoardCommentUUID)
/*     console.log(commentReplies) */
    setReplies((prev) => ({...prev, [MessageBoardCommentUUID] : commentReplies}))
  }

  const toggleReplies = (MessageBoardCommentUUID: string) => {
    setExpandedComments((prev) => ({...prev, [MessageBoardCommentUUID]: !prev[MessageBoardCommentUUID]}))
    fetchCommentReplies(MessageBoardCommentUUID)
  }

  const handleComment = async(postUUID?: string) => {
    console.log("initiated edit comment")
    if(!comment && !postUUID) return
    console.log("reached")
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

      let response = await saveMBMessageComment( comment, userUUID, messageDetails?.MessageBoardUUID,replyingTo.MessageBoardCommentUUID)
      console.log(response)
    if(replyingTo.MessageBoardCommentUUID && messageDetails?.MessageBoardUUID) {
      setReplies((prev) => ({...prev, [newReplyorComment.MessageBoardCommentUUID] : [newReplyorComment, ...prev[newReplyorComment.MessageBoardCommentUUID] || []]}))
    } else if (postUUID) {

      setComments((prev) => {
        const updatedComments = prev.map((eachComment) => eachComment.MessageBoardCommentUUID === postUUID ? {...eachComment, Comment: editPost.updatedEdit} : eachComment)
        return updatedComments
      })

    } else if(messageDetails?.MessageBoardUUID) {
      setComments((prev) => ([newReplyorComment,...prev]))
    }

    setComment("")
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
        <View style={{flex: 1}}>       
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
              <View style={styles.replyContainer}>
                <Text style={styles.name}>{reply.FirstName}</Text>
                <Text style={styles.reply}>{reply.Comment}</Text>
              </View>
              <Text style={styles.commentDateTime}>{timeAgo(reply.CreatedDateTime)}</Text>
            </View>
          )))}
        </View>
        <Text style={styles.commentDateTime}>{timeAgo(item.CreatedDateTime)}</Text>
      </View>
    )

  }

  return (
    <View style={styles.container} >
      <View style={styles.headerProfileContainer}>
        <CustomButton onPress={() => navigation.goBack()} icon={<ChevronLeft />} />
        {messageDetails && <ProfileHeader MessageBoardUUID={messageDetails.MessageBoardUUID} FirstName={messageDetails?.FirstName} CreatedDateTime={messageDetails?.CreatedDateTime} />}
      </View>

      {messageDetails && <PostItem setViewingImageUrl={() => {}} childAttachmentData={attachmentData} showProfileHeader={false} post={messageDetails} />}

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
          <CustomButton onPress={handleComment}icon={<SendIcon stroke={comment ? colors.ACTIVE_ORANGE : "grey"} />} />

          </View>
        </View>
      </View>

      <CustomModal halfModal  isOpen={focusedComment.state} onClose={() => setFocusedComment({state: false, comment: "", MessageBoardCommentUUID: "", CreatedBy: ""})}>
        <PostActions focusedComment={focusedComment.comment} setEditPost={setEditPost} CreatedBy={focusedComment.CreatedBy} MessageBoardCommentUUID={focusedComment.MessageBoardCommentUUID}  onClose={() => setFocusedComment({state: false, comment: "" ,MessageBoardCommentUUID: "", CreatedBy: ""})} />
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
    width: 25,
    height: 25,
    borderRadius: 50
  },
  replyButton: {
    fontSize: 12,
    fontWeight: 500,
    color: colors.ACTIVE_ORANGE
  },
  repliesContainer: {
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
  }
  
})
