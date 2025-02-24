import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from './CustomButton'
import { colors } from '../styles/colors'
import { AttachmentData, PostItemProps } from '../types/post-types'
import { getMBMessageAttacment } from '../api/network-utils'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../types/navigation-types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ProfileHeader from './ProfileHeader'

interface PostItemChildProps {
  setViewingImageUrl: (url: string) => void
  post: PostItemProps
  showProfileHeader: boolean
  childAttachmentData?: AttachmentData[]
}


export default function PostItem({ post, setViewingImageUrl, showProfileHeader, childAttachmentData }: PostItemChildProps) {

  const [attachmentData, setAttachmentData] = useState<AttachmentData[]>(childAttachmentData || [])
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  useEffect(() => {
    const fetchPostAttachments = async () => {
      try {
        const attachemntDataResponse = await getMBMessageAttacment(post.MessageBoardUUID);

        if(attachemntDataResponse !== undefined) {
          setAttachmentData(attachemntDataResponse);
        }
        
      } catch (error) {
        console.error("Error fetching attachments:", error);
      }
    };

    if(!childAttachmentData && post.HasAttachment) {
      fetchPostAttachments();
    }

  }, []);
  
  
  const imageItem = ({item}: {item : AttachmentData}) => {

    if (!item.Attachment) {
      return null;
    }

    return (
        <CustomButton 
          onPress={() => setViewingImageUrl(item.Attachment)} 
          buttonStyle={[styles.postImageContainer, attachmentData.length === 1 && {width: "100%", height: 200}]} 
          icon={<Image style={styles.postImage} source={{uri: item?.Attachment}} />} 
        />
      )
  }


  return (
    <View style={[styles.mainContainer]}>

        {showProfileHeader && <TouchableOpacity onPress={() => {}}> 
          <ProfileHeader FirstName={post.FirstName} CreatedDateTime={post.CreatedDateTime} ProfilePic={post.ProfilePic} />
        </TouchableOpacity>}


      {post.Message && <Text style={styles.postText}>{post.Message}</Text>}
      

      {attachmentData.length >= 1 && <FlatList indicatorStyle='black' horizontal style={styles.mainImagesList} contentContainerStyle={styles.imagesList} data={attachmentData} renderItem={imageItem} keyExtractor={(item) => item.AttachmentUUID} />}
    
     <ScrollView horizontal contentContainerStyle={styles.categoryContainerList}>
        {post.AllMBCategoryItems.map(eachCategory => {
          return <Text key={eachCategory.CategoryItemUUID} style={styles.categoryText}>{eachCategory.CategoryItemName}</Text>
        })}
      </ScrollView>
      <View style={styles.postActionButtonsContainer}>
        <CustomButton buttonStyle={styles.postActionButton} textStyle={styles.postActionButtonText} title={post.NoofLikes.toString() || "0"} onPress={() => {}} icon={<Image style={styles.postActionButtonIcon} source={require("../assets/images/like.png")} />} />
        <CustomButton buttonStyle={styles.postActionButton} textStyle={styles.postActionButtonText} title={post.NoOfComments.toString() || "0"} onPress={() => navigation.navigate("Comments", {postUUID: post.MessageBoardUUID, attachmentData: attachmentData})} icon={<Image style={styles.postActionButtonIcon} source={require("../assets/images/comment.png")} />} />
        <CustomButton buttonStyle={styles.postActionButton} onPress={() => {}} icon={<Image style={styles.postActionButtonIcon} source={require("../assets/images/share.png")} />} />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({

  mainContainer :{
    borderBottomColor: "#ECECEC",
    borderBottomWidth: 2,
/*     borderRadius: 24, */
    backgroundColor: "white",
    width: "100%",
    paddingBottom: 1,
    paddingTop: 10,
    paddingHorizontal: 12
  },
  categoryContainerList : {
    paddingBottom: 5,
    gap: 5
  },
  categoryText: {
    marginTop: 10,
    alignSelf: "flex-end", 
    borderWidth: 0.5,
    borderColor: colors.ACTIVE_ORANGE,
    fontSize: 10,
    fontWeight: 300,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 5,
    borderRadius: 50,
    color: colors.ACTIVE_ORANGE
  },
  postImageContainer : {
    marginTop: 10,
    width: 150,
    height: 150,
  },
  postImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  mainImagesList : {
/*     flex: 1, */
    height: 'auto',
    paddingBottom: 10,
  },
  imagesList : {
    gap: 10,
    flexGrow: 1
  },
  postText: {
    fontWeight: 300,
    marginTop: 3,
    paddingTop: 8
  },
  postActionButtonsContainer: {
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    flex: 1,
/*     backgroundColor: colors.LIGHT_COLOR,
    borderRadius: 50, */
    paddingVertical: 4
  },
  postActionButtonText: {
    fontSize: 12,
    fontWeight:300
  },
  postActionButtonIcon: {
    width: 20,
    height: 20
  }

})