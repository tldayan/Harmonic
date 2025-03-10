import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { formatDate } from '../utils/helpers'
import CustomButton from './CustomButton'
import ThreeDots from "../assets/icons/three-dots-horizontal.svg"
import { CustomModal } from './CustomModal'
import PostActions from '../modals/Post/PostActions'
import { PostItemProps, PostLikeProps } from '../types/post-types'

interface ProfileHeaderProps {
    post?: PostItemProps
    postLikes?: PostLikeProps
    showActions?: boolean
}

export default function ProfileHeader({post,postLikes, showActions} : ProfileHeaderProps) {

    const [isEditingPost, setIsEditingPost] = useState(false)
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
        <Image source={{ uri: postData?.ProfilePic || "https://i.pravatar.cc/150" }} style={styles.profilePicture} />
        <View style={styles.userNameContainer}>
            <Text style={styles.name}>{postData?.FirstName}</Text>
            <View style={styles.dateContainer}>
                <Text style={styles.postDate}>{formattedDate}</Text>
            </View>
        </View>
        {showActions && <CustomButton buttonStyle={styles.threeDots} icon={<ThreeDots width={15} height={15} />} onPress={() => setIsEditingPost(true)} />}
    
        <CustomModal isOpen={isEditingPost} halfModal onClose={() => setIsEditingPost(false)}>
          <PostActions post={post} onClose={() => setIsEditingPost(false)} />
        </CustomModal>

    </View>
  )
}

const styles = StyleSheet.create({
    mainProfileDetialsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
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
})