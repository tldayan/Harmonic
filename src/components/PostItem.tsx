import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThreeDots from "../assets/icons/three-dots-horizontal.svg"
import CustomButton from './CustomButton'
import { colors } from '../styles/colors'
import { shadowStyles } from '../styles/global-styles'
import { formatDate } from '../utils/helpers'
import { PostItemProps } from '../types/post-types'
import { getMBMessageAttacment } from '../api/network-utils'

interface PostItemChildProps {
  setViewingImageUrl: (url: string) => void;
  post: PostItemProps
}


export default function PostItem({ post, setViewingImageUrl }: PostItemChildProps) {

  const [attachmentData, setAttachmentData] = useState([])

  useEffect(() => {

    const fetchPostAttachments = async() => {
      const attachemntDataResponse = await getMBMessageAttacment(post.MessageBoardUUID)
      setAttachmentData(attachemntDataResponse) 
    }

    fetchPostAttachments()
  }, [])


  return (
    <View style={[styles.mainContainer, shadowStyles]}>
      <View>
        <View style={styles.mainProfileDetialsContainer}>
{/*         <Image source={{ uri: post.ProfilePic ?? "https://i.pravatar.cc/150" }}  style={styles.profilePicture} /> */}

          <View style={styles.userNameContainer}>
              <Text style={styles.name}>{post.FirstName}</Text>
              <View style={styles.dateContainer}>
              <Text style={styles.postDate}>{formatDate(post.CreatedDateTime)}</Text>
              </View>
          </View>
          
          <Text style={styles.categoryText}>General</Text>
          <CustomButton buttonStyle={styles.threeDots} icon={<ThreeDots width={15} height={15} />} onPress={() => {}} />
        </View>
      </View>

      <Text style={styles.postText}>{post.Message}</Text>
      {/* <CustomButton onPress={() => setViewingImageUrl("https://wallpapercat.com/w/full/e/9/4/150403-1080x1920-samsung-1080p-virat-kohli-background-photo.jpg")} buttonStyle={[styles.postImageContainer, shadowStyles]} icon={<Image style={styles.postImage} source={{uri: attachmentData[0]?.Attachment}} />} />  */}
      {/* ABOVE */}
     
      <View style={styles.postActionButtonsContainer}>
        <CustomButton buttonStyle={styles.postActionButton} onPress={() => {}} icon={<Image style={styles.postActionButtonIcon} source={require("../assets/images/like.png")} />} />
        <CustomButton buttonStyle={styles.postActionButton} onPress={() => {}} icon={<Image style={styles.postActionButtonIcon} source={require("../assets/images/comment.png")} />} />
        <CustomButton buttonStyle={styles.postActionButton} onPress={() => {}} icon={<Image style={styles.postActionButtonIcon} source={require("../assets/images/share.png")} />} />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({

  mainContainer :{
/*     borderRadius: 24, */
    backgroundColor: "white",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 12
  },

  threeDots: {
    flexDirection: "row", 
    alignItems: 'center',
    padding: 5
  },

  mainProfileDetialsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3
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
  postText: {
    paddingTop: 8
  },
  categoryText: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 24,
    fontSize: 10,
    borderColor: colors.LIGHT_COLOR
  },
  postImageContainer : {
    marginTop: 5,
    width: "100%",
    height: 200,
  },
  postImage: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
/*     resizeMode: "contain" */
  },
  postActionButtonsContainer: {
/*     borderTopWidth: 1,
    borderBottomWidth: 1, */
    borderColor: "#0000001A",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 4,
    paddingVertical: 4,
    gap: 4
  },
  postActionButton : {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 50,
    paddingVertical: 4
  },
  postActionButtonIcon: {
    width: 20,
    height: 20
  }



})