import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from './CustomButton'
import { colors } from '../styles/colors'
import { AttachmentData, PostItemProps } from '../types/post-types'
import { getMBMessageAttacment, saveMBMessageLike } from '../api/network-utils'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../types/navigation-types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ProfileHeader from './ProfileHeader'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import LikeButton from "../assets/icons/heart.svg"

interface PostItemChildProps {
  setViewingImageUrl: (url: string) => void
  post: PostItemProps
  showProfileHeader: boolean
  childAttachmentData?: AttachmentData[]
}


export default function PostItem({ post, setViewingImageUrl, showProfileHeader, childAttachmentData }: PostItemChildProps) {

  const [attachmentData, setAttachmentData] = useState<AttachmentData[]>(childAttachmentData || [])
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const userUUID = useSelector((state: RootState) => state.auth.userUUID)
  const [hasLiked, setHasLiked] = useState(post.HasLiked);
  const [noOfLikes, setNoOfLikes] = useState(post.NoofLikes);


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

  useEffect(() => {
    setHasLiked(post.HasLiked);
    setNoOfLikes(post.NoofLikes);
  }, [post]); 
  

  const handlePostLike = async () => {
    
    try {
      const newLikedState = !hasLiked;
      setHasLiked(newLikedState);
      setNoOfLikes((prevLikes) => prevLikes + (newLikedState ? 1 : -1));

      await saveMBMessageLike(post.MessageBoardUUID, userUUID, newLikedState ? 1 : 0);
    } catch (error) {
      console.error("Error liking post:", error);

      setHasLiked((prev) => !prev);
      setNoOfLikes((prevLikes) => prevLikes + (hasLiked ? -1 : 1));
    }
  };
  
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
          <ProfileHeader FirstName={post.FirstName} CreatedDateTime={post.CreatedDateTime} ProfilePic={post.ProfilePic} MessageBoardUUID={post.MessageBoardUUID} CreatedBy={post.CreatedBy} />
        </TouchableOpacity>}


      {post.Message && <Text style={styles.postText}>{post.Message}</Text>}
      

      {attachmentData.length >= 1 && <FlatList indicatorStyle='black' horizontal style={styles.mainImagesList} contentContainerStyle={styles.imagesList} data={attachmentData} renderItem={imageItem} keyExtractor={(item) => item.AttachmentUUID} />}
    
     <ScrollView horizontal contentContainerStyle={styles.categoryContainerList}>
        {post.AllMBCategoryItems.map(eachCategory => {
          return <Text key={eachCategory.CategoryItemUUID} style={styles.categoryText}>{eachCategory.CategoryItemName}</Text>
        })}
      </ScrollView>
      
      <View style={styles.postActionButtonsContainer}>
        <CustomButton buttonStyle={styles.postActionButton} textStyle={styles.postActionButtonText} title={noOfLikes.toString() || "0"} onPress={handlePostLike} icon={<LikeButton fill={hasLiked ? colors.ACTIVE_COLOR : "none" } width={20} strokeWidth={1.25} stroke={hasLiked ? "white" : "currentColor"}  style={styles.postActionButtonIcon} />} />
        <CustomButton buttonStyle={styles.postActionButton} textStyle={styles.postActionButtonText} title={post.NoOfComments.toString() || "0"} onPress={() => navigation.navigate("Comments", {postUUID: post.MessageBoardUUID, attachmentData: attachmentData})} icon={<Image style={styles.postActionButtonIcon} source={require("../assets/images/comment.png")} />} />
        <CustomButton buttonStyle={styles.postActionButton} onPress={() => {}} icon={<Image style={styles.postActionButtonIcon} source={require("../assets/images/share.png")} />} />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({

  mainContainer :{
    borderBottomColor: "#ECECEC",
    backgroundColor: "white",
    width: "100%",
    marginBottom: 10,
    paddingTop: 15,
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
    fontSize: 15,
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
    height: 20,
  }

})