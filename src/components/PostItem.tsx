import { ActivityIndicator, FlatList, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CustomButton from './CustomButton'
import { colors } from '../styles/colors'
import { AttachmentData, PostItemProps } from '../types/post-types'
import { getMBMessageAttacment, saveMBMessageLike } from '../api/network-utils'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../types/navigation-types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ProfileHeader from './ProfileHeader'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import LikeButton from "../assets/icons/heart.svg"
import Comment from "../assets/icons/comment.svg"
import { CustomModal } from './CustomModal'
import PostLikes from '../modals/Post/PostLikes'
import { toggleLike } from '../store/slices/postLikesSlice'
import AttachmentCarousel from '../modals/AttachmentCarousel'
import Video from 'react-native-video'
import VideoIcon from "../assets/icons/video.svg"

interface PostItemChildProps {
  post: PostItemProps
  showProfileHeader: boolean
  childAttachmentData?: AttachmentData[]
}


export default function PostItem({ post, showProfileHeader, childAttachmentData }: PostItemChildProps) {

  const [attachmentData, setAttachmentData] = useState<AttachmentData[]>(childAttachmentData || [])
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const userUUID = useSelector((state: RootState) => state.auth.userUUID)
  const [viewingLikes, setViewingLikes] = useState(false)
  const [viewingAttachments, setViewingAttachments] = useState(false)
  const [initialAttachmentIndex, setInitialAttachmentIndex] = useState(0)
  const [hasLiked, setHasLiked] = useState(post.HasLiked);
  const reduxHasLiked = useSelector((state: RootState) => state.postLikes.posts[post.MessageBoardUUID]?.hasLiked ?? false)
  const reduxPostLikeCount = useSelector((state: RootState) => state.postLikes.posts[post.MessageBoardUUID]?.likeCount ?? post.NoofLikes )
  const [videoPlaying, setVideoPlaying] = useState(false)
  const dispatch = useDispatch()


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


  

  const handlePostLike = async () => {

    dispatch(toggleLike({ postId: post.MessageBoardUUID, postLikeCount: post.NoofLikes }));

    try {
      const newLikedState = !hasLiked;
      setHasLiked(newLikedState);

      await saveMBMessageLike(post.MessageBoardUUID, userUUID, newLikedState ? 1 : 0);
    } catch (error) {
      console.error("Error liking post:", error);

      setHasLiked((prev) => !prev);
    }
  };

  const handleGetLikes = async() => {
    setViewingLikes(true)
  }
  
  const attachmentItem = ({item,index}: {item : AttachmentData, index: number}) => {

    if (!item.Attachment) {
      return null;
    }

    return (
      <CustomButton 
        onPress={() => { 
          if (item.AttachmentType.includes("image") || attachmentData.length > 1) 
            setViewingAttachments(true);
            setInitialAttachmentIndex(index)
        ;setVideoPlaying(true)}}
        buttonStyle={[styles.postContentContainer, attachmentData.length === 1 && { width: "100%", height: 200 }]} 
        icon={
          item.AttachmentType.includes("image") ? (
      <Image style={styles.content} source={{ uri: item?.Attachment }} />
    ) : (
      <View style={{ position: 'relative' }}>
        {!videoPlaying && <VideoIcon stroke="white" fill="white" width={20} height={20} style={{ position: 'absolute', bottom: 8, left: 8, zIndex: 2 }} />}

        <Video 
          paused 
          renderLoader={<ActivityIndicator style={styles.contentLoader} size={'small'} color={"black"} />} 
          style={styles.content}
          controls={attachmentData.length > 1 ? false : true}
          source={{ uri: item?.Attachment }} 
        />
      </View>
    )
  }
/>

      )
  }


  return (
    <View style={[styles.mainContainer]}>

        {showProfileHeader && <TouchableOpacity onPress={() => {}}> 
          <ProfileHeader showActions post={post} />
        </TouchableOpacity>}


      {post.Message && <Text style={styles.postText}>{post.Message}</Text>}
      

      {attachmentData.length >= 1 && <FlatList indicatorStyle='black' horizontal style={styles.mainImagesList} contentContainerStyle={styles.imagesList} data={attachmentData} renderItem={attachmentItem} keyExtractor={(item) => item.AttachmentUUID} />}
    
     <ScrollView horizontal contentContainerStyle={styles.categoryContainerList}>
        {post.AllMBCategoryItems?.map(eachCategory => {
          return <Text key={eachCategory.CategoryItemUUID} style={styles.categoryText}>{eachCategory.CategoryItemName}</Text>
        })}
      </ScrollView>
      
      <View style={styles.postActionButtonsContainer}>
        <CustomButton buttonStyle={styles.postActionButton} textStyle={styles.postActionButtonText} title={""} onPress={handlePostLike} icon={<LikeButton fill={reduxHasLiked ? colors.ACTIVE_COLOR : "none" } width={20} strokeWidth={1.25} stroke={reduxHasLiked ? "white" : "currentColor"}  style={styles.postActionButtonIcon} />} />
        <CustomButton buttonStyle={styles.postActionButton} textStyle={styles.postActionButtonText} title={""} onPress={() => navigation.navigate("Comments", {postUUID: post.MessageBoardUUID, attachmentData: attachmentData, createdBy: post.CreatedBy})} icon={<Image style={styles.postActionButtonIcon} source={require("../assets/images/comment.png")} />} />
        <CustomButton buttonStyle={styles.postActionButton} onPress={() => {}} icon={<Image style={styles.postActionButtonIcon} source={require("../assets/images/share.png")} />} />
      </View>
      <View style={styles.postStatsContainer}>
        {reduxPostLikeCount > 0 && <CustomButton textStyle={styles.likeStats} icon={<LikeButton fill={colors.ACTIVE_COLOR} stroke='none' width={15} height={15} />} title={reduxPostLikeCount} onPress={handleGetLikes} buttonStyle={styles.likeStatsContainer} />}
        {post.NoOfComments > 0 && <CustomButton textStyle={styles.commentStats} icon={<Comment stroke='none' fill={colors.ACTIVE_ORANGE} width={15} height={15} />} title={post.NoOfComments} onPress={() => {}} buttonStyle={styles.commentStatsContainer} />}
      </View>
        
      <CustomModal presentationStyle="formSheet" fullScreen isOpen={viewingLikes} onClose={() => setViewingLikes(false)}>
        <PostLikes MessageBoardUUID={post.MessageBoardUUID} onClose={() => setViewingLikes(false)} />
      </CustomModal>
      
      <CustomModal isOpen={viewingAttachments} onClose={() => {setViewingAttachments(false); setVideoPlaying(false)}}>
        <AttachmentCarousel initialIndex={initialAttachmentIndex} AttachmentData={attachmentData} onClose={() => {setViewingAttachments(false); setVideoPlaying(false)}} />
      </CustomModal>  

    </View>
  )
}

const styles = StyleSheet.create({

  mainContainer :{
    borderBottomColor: "#ECECEC",
    backgroundColor: "white",
    width: "100%",
    marginBottom: 20,
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
  postContentContainer : {
/*     borderWidth: 2,
    borderColor: "red", */
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
    aspectRatio: 1,
    width: 150,
    height: 150,
    position: "relative",
/*     backgroundColor: "black" */
  },
  content: {
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
/*     borderColor: "#0000001A",
    borderWidth: 2, */
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
    borderColor: colors.LIGHT_COLOR,
    borderWidth: 0.75,
   /*  backgroundColor: colors.LIGHT_COLOR, */
    borderRadius: 50,
    paddingVertical: 4
  },
  postActionButtonText: {
    fontSize: 12,
    fontWeight:300
  },
  postActionButtonIcon: {
    width: 20,
    height: 20,
  },
  postStatsContainer: {
/*     borderWidth: 1, */
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likeStats: {
    fontSize: 14,
    fontWeight: 300,
  },
  commentStats: {
    fontSize: 14,
    fontWeight: 300,
  },
  likeStatsContainer: {
    flexDirection: "row",
    marginRight: "auto",
    gap: 2,
    alignItems: "center",
  },
  commentStatsContainer: {
    flexDirection: "row",
    marginLeft: "auto",
    gap: 2,
    alignItems: "center",
  },
  contentLoader :{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }]
  }

})