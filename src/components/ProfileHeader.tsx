import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { formatDate } from '../utils/helpers'
import CustomButton from './CustomButton'
import ThreeDots from "../assets/icons/three-dots-horizontal.svg"
import { CustomModal } from './CustomModal'
import PostActions from '../modals/Post/PostActions'
import { AttachmentData, PostItemProps, PostLikeProps } from '../types/post-types'
import ChevronLeft from "../assets/icons/chevron-left.svg"
import { useNavigation } from '@react-navigation/native'

interface ProfileHeaderProps {
    name?: string,
    ProfilePic?: string,
    post?: PostItemProps
    postLikes?: PostLikeProps
    showPostActions?: boolean
    showMemberActions?: boolean
    attachmentData?: AttachmentData[]
    noDate?: boolean
    online?: boolean
    goBack?: boolean
    showStatus?: boolean,
    onPress?: () => void
    fetchLatestMessages?: (getLatest?: boolean) => void
}

export default function ProfileHeader({name, fetchLatestMessages, onPress , goBack, showStatus, online = false,post,postLikes,showMemberActions, showPostActions, attachmentData, noDate, ProfilePic = "https://i.pravatar.cc/150"} : ProfileHeaderProps) {

    const [isEditingPost, setIsEditingPost] = useState(false)
    const navigation = useNavigation()
    const postData = post
    ? { 
        ...post, 
        ProfilePic: post.ProfilePic, 
        MessageBoardUUID: post.MessageBoardUUID 
      } 
    : postLikes
    ? { 
        ...postLikes, 
        ProfilePic: postLikes.ProfilePicURL,  
        MessageBoardUUID: postLikes.MessageBoardLikeUUID 
      } 
    : null;



    const formattedDate = formatDate(postData?.CreatedDateTime || "")


  return (
    <View style={styles.mainProfileDetialsContainer}>
        {goBack && <CustomButton buttonStyle={{flexDirection :"row", height: "100%", alignItems: "center"}} onPress={() => navigation.goBack()} icon={<ChevronLeft />} />}
        
        <TouchableOpacity style={{flexDirection: "row", gap: 10, alignItems: "center"}} onPress={onPress}>
          <Image source={{ uri: postData?.ProfilePic || ProfilePic }} style={styles.profilePicture} />
          <View style={styles.userNameContainer}>
              <Text style={styles.name}>{postData?.FirstName ? postData?.FirstName : name}</Text>
              {showStatus && <View style={styles.memberStatusContainer}>
                <View style={[styles.ellipse, {backgroundColor: online ? "#0E9F6E" : "red"}]}></View>
                <Text style={{color: online ? "#0E9F6E" : "red"}}>{online ? "Online" : "Offline"}</Text>
              </View>}
              {!noDate && <View style={styles.dateContainer}>
                  <Text style={styles.postDate}>{formattedDate}</Text>
              </View>}
          </View>
        </TouchableOpacity>
        {showPostActions && <CustomButton buttonStyle={styles.threeDots} icon={<ThreeDots width={15} height={15} />} onPress={() => setIsEditingPost(true)} />}
    
        <CustomModal isOpen={isEditingPost} halfModal onClose={() => setIsEditingPost(false)}>
          <PostActions fetchLatestMessages={fetchLatestMessages} attachmentData={attachmentData} post={post} onClose={() => setIsEditingPost(false)} />
        </CustomModal>

    </View>
  )
}

const styles = StyleSheet.create({
    mainProfileDetialsContainer: {
/*       borderWidth: 2, */
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
/*         flex: 1, */
    },
    profilePicture: {
        width: 34,
        height: 34,
        borderRadius: 50
      },
    userNameContainer: {
        gap: 2
      },
      name: {
        fontWeight: 500,
        fontSize: 15,
        color: "#000000"
      },
      dateContainer : {
        flexDirection: "row",
        gap: 4
      },
      postDate: {
        color: "#626262",
        fontSize: 11
      },
  threeDots: {
    marginLeft: "auto",
    flexDirection: "row", 
    alignItems: 'center',
    padding: 5,
    opacity: 0.7
  },
  memberStatusContainer: {
    flexDirection : "row",
    alignItems: "center",
    gap: 5
  },
  ellipse: {
    width: 8,
    height: 8,
    borderRadius: 50
  }
})