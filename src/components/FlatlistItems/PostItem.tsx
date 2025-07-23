import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../CustomButton'
import { colors } from '../../styles/colors'
import { AttachmentData, PostItemProps } from '../../types/post-types'
import { getMBMessageAttacment, saveMBMessageLike } from '../../api/network-utils'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../types/navigation-types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ProfileHeader from '../ProfileHeader'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import LikeButton from "../../assets/icons/like.svg"
import CommentIcon from "../../assets/icons/comment-icon.svg"
import Share from "../../assets/icons/share-icon.svg"
import { CustomModal } from '../CustomModal'
import PostLikes from '../../modals/Post/PostLikes'
import { toggleLike } from '../../store/slices/postLikesSlice'
import AttachmentCarousel from '../../modals/AttachmentCarousel'
import { fetchWithErrorHandling } from '../../utils/helpers'
import { useCreds } from '../../hooks/useCreds'
import PostAttachmentItem from './PostAttachmentItem'

interface PostItemChildProps {
  post: PostItemProps
  showProfileHeader: boolean
  childAttachmentData?: AttachmentData[]
  fetchLatestMessages?: (messageBoardUUID?: string) => void
}


export default function PostItem({ post, showProfileHeader, childAttachmentData, fetchLatestMessages}: PostItemChildProps) {
  const [attachmentData, setAttachmentData] = useState<AttachmentData[]>(childAttachmentData || [])
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const {userUUID} = useCreds()
  const [viewingLikes, setViewingLikes] = useState(false)
  const [viewingAttachments, setViewingAttachments] = useState(false)
  const [initialAttachmentIndex, setInitialAttachmentIndex] = useState(0)
  const [loading, setLoading] = useState<{[key: number]: boolean}>({})
  const reduxHasLiked = useSelector((state: RootState) => state.postLikes.posts[post.MessageBoardUUID]?.hasLiked ?? false)
/*   const reduxPostLikeCount = useSelector((state: RootState) => state.postLikes.posts[post.MessageBoardUUID]?.likeCount) */
  const [videoPlaying, setVideoPlaying] = useState(false)
  const dispatch = useDispatch()
  const route = useRoute()

  useEffect(() => {
    let isMounted = true;
  
    const fetchPostAttachments = async () => {
      try {
        const response = await fetchWithErrorHandling(getMBMessageAttacment, post.MessageBoardUUID);
        if (isMounted && response) {
          setAttachmentData(response);
        }
      } catch (error) {
        console.error("Error fetching attachments:", error);
      }
    };
  
    if (!childAttachmentData && post.HasAttachment) {
      fetchPostAttachments();
    }
  
    return () => {
      isMounted = false;
    };
  }, [post]);
  


  

  const handlePostLike = async () => {

    dispatch(toggleLike({ postId: post.MessageBoardUUID}));

    try { 
      const newLikedState = !reduxHasLiked
      await fetchWithErrorHandling(saveMBMessageLike,post.MessageBoardUUID, userUUID, newLikedState ? 1 : 0);
    } catch (error) {
      console.log(error)
    }
  };

  const handleGetLikes = async() => {
    setViewingLikes(true)
  }


  const handleAttachmentPress = (index: number) => {
    setViewingAttachments(true);
    setInitialAttachmentIndex(index);
    setVideoPlaying(true);
  };
  

  return (
    <View style={[ route.name === "Comments" ?  styles.defaultMainContainer : styles.mainContainer]}>

        {showProfileHeader && 
          <ProfileHeader onPress={() => navigation.navigate("Profile", {userUUID : post.CreatedBy})} fetchLatestMessages={fetchLatestMessages} showPostActions post={post} />
        }


      {post.Message && <Text style={[styles.postText, !attachmentData.length ? {paddingVertical: 8}: null]}>{post.Message}</Text>}
      

      {(attachmentData.length >= 1 && post.HasAttachment) && <FlatList
        horizontal
        indicatorStyle="black"
        style={styles.mainImagesList}
        contentContainerStyle={styles.imagesList}
        data={attachmentData}
        keyExtractor={(item) => item.AttachmentUUID}
        renderItem={({ item, index }) => (
          <PostAttachmentItem
            item={item}
            index={index}
            attachmentCount={attachmentData.length}
            loading={loading}
            videoPlaying={videoPlaying}
            onPress={handleAttachmentPress}
/*             onLoadStart={(index) =>
              setLoading((prev) => ({ ...prev, [index]: true }))
            }
            onLoadEnd={(index) =>
              setLoading((prev) => ({ ...prev, [index]: false }))
            } */
          />
        )}
      />
      }
    
     <ScrollView horizontal contentContainerStyle={styles.categoryContainerList}>
        {post.AllMBCategoryItems?.map(eachCategory => {
          return <Text key={eachCategory.CategoryItemUUID} style={styles.categoryText}>{eachCategory.CategoryItemName}</Text>
        })}
      </ScrollView>
      
      <View style={styles.postActionButtonsContainer}>
        <CustomButton buttonStyle={styles.postActionButton} textStyle={styles.postActionButtonText} title={"Like"} onPress={handlePostLike} icon={<LikeButton fill={reduxHasLiked ? colors.ACTIVE_COLOR : "none" } width={20} strokeWidth={1.25} stroke={reduxHasLiked ? "white" : "currentColor"}  style={styles.postActionButtonIcon} />} />
        <CustomButton buttonStyle={styles.postActionButton} textStyle={styles.postActionButtonText} title={"Comment"} onPress={() => route.name !== "Comments" && navigation.navigate("Comments", {postUUID: post.MessageBoardUUID, attachmentData: attachmentData, createdBy: post.CreatedBy})} icon={<CommentIcon width={20} style={styles.postActionButtonIcon} />} />
        <CustomButton buttonStyle={styles.postActionButton} textStyle={styles.postActionButtonText} title={"Share"} onPress={() => {}} icon={<Share width={20} style={styles.postActionButtonIcon} />} />
      </View>
      {/* <View style={styles.postStatsContainer}>
        {reduxPostLikeCount > 0 && <CustomButton textStyle={styles.likeStats} icon={<LikeButton fill={colors.ACTIVE_COLOR} stroke='none' width={15} height={15} />} title={reduxPostLikeCount} onPress={handleGetLikes} buttonStyle={styles.likeStatsContainer} />}
        {post.NoOfComments > 0 && <CustomButton textStyle={styles.commentStats} icon={<Comment stroke='none' fill={colors.ACTIVE_ORANGE} width={15} height={15} />} title={post.NoOfComments} onPress={() => navigation.navigate("Comments", {postUUID: post.MessageBoardUUID, attachmentData: attachmentData, createdBy: post.CreatedBy})} buttonStyle={styles.commentStatsContainer} />}
      </View> */}
        

      {viewingLikes && <CustomModal presentationStyle="formSheet" fullScreen isOpen={viewingLikes} onClose={() => setViewingLikes(false)}>
        <PostLikes MessageBoardUUID={post.MessageBoardUUID} onClose={() => setViewingLikes(false)} />
      </CustomModal>}
      
      {viewingAttachments && <CustomModal blackBackground isOpen={viewingAttachments} onClose={() => {setViewingAttachments(false); setVideoPlaying(false)}}>
        <AttachmentCarousel initialIndex={initialAttachmentIndex} AttachmentData={attachmentData} onClose={() => {setViewingAttachments(false); setVideoPlaying(false)}} />
      </CustomModal>}  

    </View>
  )
}

const styles = StyleSheet.create({

  mainContainer :{
    borderBottomColor: "#ECECEC",
    backgroundColor: "white",
    width: "94%",
    marginHorizontal: "3%",
    borderRadius: 24,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  defaultMainContainer :{
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
  content: {
/*     borderWidth: 1,
    borderColor: "red", */
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  mainImagesList : {
/*     flex: 1, */
    height: 'auto',
    paddingBottom: 10,
    marginTop: 10,
  },
  imagesList : {
    gap: 10,
    flexGrow: 1
  },
  postText: {
/*     borderWidth: 1, */
    fontWeight: 300,
    fontSize: 15,
    paddingTop: 8
  },
  postActionButtonsContainer: {
    borderColor: "#0000001A",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
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
/*     borderWidth: 0.75, */
   /*  backgroundColor: colors.LIGHT_COLOR, */
    borderRadius: 50,
    paddingVertical: 4
  },
  postActionButtonText: {
    fontSize: 12,
    fontWeight: "500"
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
  }

})