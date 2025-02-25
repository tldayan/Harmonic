import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, Image, Alert, FlatList, TouchableOpacity, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'
import { getAllCommentReplies, getListOfComments, getMBMessageDetails, saveMBMessageComment } from '../../api/network-utils'
import { CommentItemProps, PostItemProps, ReplyItemProps } from '../../types/post-types'
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

type CommentsScreenRouteProp = RouteProp<RootStackParamList, "Comments">

export default function CommentsScreen() {

  const [messageDetails, setMessageDetails] = useState<PostItemProps | null>(null)
  const [comment, setComment] = useState<string>("")
  const [comments, setComments] = useState<CommentItemProps[]>([])
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

  useEffect(() => {
    if (!postUUID) return

    const fetchMBMessageDetails = async() => {
      const messageDetails = await getMBMessageDetails(postUUID)
      setMessageDetails(messageDetails)
    }

    const fetchComments = async() => {
      const comments = await getListOfComments(postUUID)
      console.log(comments)
      setComments(comments)
    }

    if(postUUID) {
      fetchMBMessageDetails()
      fetchComments()
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
    console.log(commentReplies)
    setReplies((prev) => ({...prev, [MessageBoardCommentUUID] : commentReplies}))
  }

  const toggleReplies = (MessageBoardCommentUUID: string) => {
    setExpandedComments((prev) => ({...prev, [MessageBoardCommentUUID]: !prev[MessageBoardCommentUUID]}))
    fetchCommentReplies(MessageBoardCommentUUID)
  }

  const handleComment = async() => {

    if(!comment) return

    const newReplyorComment = {
          "MessageBoardCommentUUID": replyingTo.MessageBoardCommentUUID, 
          "Comment": comment,
          "TotalRepliesCount": 0,
          "CreatedDateTime": new Date().toISOString(),
          "CreatedBy": userUUID,
          "UserName": null,
          "FirstName": user?.displayName ?? "",
          "LastName": null,
          "ProfilePicURL": user?.photoURL ?? ""
      }

      const commentResponse = await saveMBMessageComment( comment, userUUID, messageDetails?.MessageBoardUUID,replyingTo.MessageBoardCommentUUID)

    if(replyingTo.MessageBoardCommentUUID && messageDetails?.MessageBoardUUID) {
      setReplies((prev) => ({...prev, [newReplyorComment.MessageBoardCommentUUID] : [newReplyorComment, ...prev[newReplyorComment.MessageBoardCommentUUID] || []]}))
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
          <View style={styles.commentDetailsContainer}>
            <Text style={styles.name}>{item.FirstName}</Text>
            <Text style={styles.comment}>{item.Comment}</Text>
          </View>
          <View style={styles.commentActionsContainer}>
            <Text style={styles.commentDateTime}>{timeAgo(item.CreatedDateTime)}</Text>
            {item.TotalRepliesCount > 0 ? <CustomButton buttonStyle={styles.commentCount} textStyle={styles.commentCountText} onPress={() => toggleReplies(item.MessageBoardCommentUUID)} title={`${item.TotalRepliesCount} Replies`} />  : null}
            <CustomButton textStyle={[styles.commentCountText, {fontWeight: 500}]} onPress={() => initiateReply(item.FirstName,item.MessageBoardCommentUUID, index)} title={"Reply"} />
          </View>
          
          {expandedComments[item.MessageBoardCommentUUID] && replies[item.MessageBoardCommentUUID] && (
          replies[item.MessageBoardCommentUUID].map((reply) => (
            <View key={reply.MessageBoardCommentUUID} style={styles.repliesContainer}>
              <Image style={styles.replyProfilePic} source={{uri: reply.ProfilePicURL || "https://i.pravatar.cc/150"}} />
              <View style={styles.replyContainer}>
                <Text style={styles.name}>{reply.FirstName}</Text>
                <Text style={styles.reply}>{reply.Comment}</Text>
              </View>
            </View>
          )))}
        </View>
      </View>
    )

  }

  return (
    <View style={styles.container} >
      <View style={styles.headerProfileContainer}>
        <CustomButton onPress={() => navigation.goBack()} icon={<ChevronLeft />} />
        {messageDetails && <ProfileHeader FirstName={messageDetails?.FirstName} CreatedDateTime={messageDetails?.CreatedDateTime} />}
      </View>

      {messageDetails && <PostItem setViewingImageUrl={() => {}} childAttachmentData={attachmentData} showProfileHeader={false} post={messageDetails} />}

        <FlatList ref={flatListRef} showsVerticalScrollIndicator={false} style={styles.commentListContainer} contentContainerStyle={styles.commentList} keyExtractor={(item) => item.MessageBoardCommentUUID} renderItem={commentItem} data={comments} />


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
            {comment && <CustomButton onPress={handleComment} icon={<SendIcon />} />}
          </View>
        </View>
      </View>
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
    gap: 5,
    justifyContent: "space-between",
    borderRadius: 5,
    fontSize: 12,
    alignSelf: "flex-start",
  },  
  name : {
    fontSize: 12,
  },
  comment: {
    fontSize: 11,
    fontWeight: "300",
    paddingRight: 8,  
    flexWrap: "wrap", 
    maxWidth: "100%", 
  },
  commentCount : {
    alignSelf: 'flex-start'
  },
  commentCountText: {
    fontSize: 10,
    fontWeight: 300,
    color: colors.ACTIVE_ORANGE
  },
  commentActionsContainer: {
/*     borderWidth : 1, */
    flexDirection: "row",
    gap: 5
  },
  commentDateTime: {
    fontSize: 10,
    fontWeight: 300,
    color: colors.ACTIVE_ACCENT_COLOR
  },
  commentListContainer :{
/*     borderWidth: 1, */
    padding: 5,
    width: "96%",
    marginHorizontal: "2%",
    marginTop: 20,
    flex: 1,
    marginBottom: 80
  },
  commentList: {
/*     borderWidth: 2, */
    gap: 20,
    flexGrow: 1,

  },
  replyProfilePic: {
    width: 25,
    height: 25,
    borderRadius: 50
  },
  repliesContainer: {
    marginVertical: 10,
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  replyContainer: {
/*     flex: 1, */
    backgroundColor: colors.LIGHT_COLOR,
    paddingHorizontal: 12, 
    paddingVertical: 8,
    gap: 5,
    justifyContent: "space-between",
    borderRadius: 5,
    fontSize: 12,
    maxWidth: "95%", 
  },
  reply : {
    fontSize: 11,
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
    fontSize: 12,
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
  }
  
})
