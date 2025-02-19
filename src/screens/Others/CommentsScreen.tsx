import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, Image, Alert, FlatList, TouchableOpacity, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'
import { getListOfComments, getMBMessageDetails } from '../../api/network-utils'
import { CommentItemProps, PostItemProps } from '../../types/post-types'
import ProfileHeader from '../../components/ProfileHeader'
import ChevronLeft from "../../assets/icons/chevron-left.svg"
import CustomButton from '../../components/CustomButton'
import PostItem from '../../components/PostItem'
import { CustomTextInput } from '../../components/CustomTextInput'
import { colors } from '../../styles/colors'
import SendIcon from "../../assets/icons/send-horizontal.svg"

type CommentsScreenRouteProp = RouteProp<RootStackParamList, "Comments">

export default function CommentsScreen() {

  const [messageDetails, setMessageDetails] = useState<PostItemProps | null>(null)
  const [comment, setComment] = useState<string>("")
  const [comments, setComments] = useState([])
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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

  const commentItem = ({item}: {item: CommentItemProps}) => {
    if(!item) {
      return null
    }

    return (
      <TouchableOpacity onPress={() => {}} style={styles.commentItemContainer}>
        <Image style={styles.profilePic} source={{uri: item.ProfilePicURL || "https://i.pravatar.cc/150"}} />
        <View style={styles.commentDetailsContainer}>
          <Text style={styles.name}>{item.FirstName}</Text>
          <Text style={styles.comment}>{item.Comment}</Text>
        </View>
      </TouchableOpacity>
    )

  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} 
    >
      <View style={styles.headerProfileContainer}>
        <CustomButton onPress={() => navigation.goBack()} icon={<ChevronLeft />} />
        {messageDetails && <ProfileHeader FirstName={messageDetails?.FirstName} CreatedDateTime={messageDetails?.CreatedDateTime} />}
      </View>

      {messageDetails && <PostItem setViewingImageUrl={() => {}} childAttachmentData={attachmentData} showProfileHeader={false} post={messageDetails} />}


   <FlatList style={styles.commentListContainer} contentContainerStyle={styles.commentList} keyExtractor={(item) => item.MessageBoardCommentUUID} renderItem={commentItem} data={comments} />




      <View style={[styles.commentContainer, {paddingBottom: isKeyboardVisible ? 0 : 20}]}>
        <CustomButton 
          onPress={() => {}} 
          icon={<Image source={require("../../assets/images/frame.png")} />} 
        />
    

        <CustomTextInput 
          value={comment} 
          onChangeText={(e) => setComment(e)} 
          inputStyle={styles.commentField} 
          placeholderTextColor={colors.LIGHT_TEXT_COLOR}
          placeholder="Write a comment..." 
        />
        {comment && <CustomButton onPress={() => {}} icon={<SendIcon />} />}
      </View>
    </KeyboardAvoidingView>
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
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop:10,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
  },
  commentField: {
    borderRadius: 50,
    backgroundColor: colors.BACKGROUND_COLOR,
    borderStyle: "solid",
    borderColor: colors.BORDER_COLOR,
    borderWidth: 1,
    height: 35,
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
    maxWidth: "95%", 
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
  commentListContainer :{
    width: "90%",
    marginHorizontal: "5%",
    marginTop: 20,
  },
  commentList: {
    gap: 20
  }
})
