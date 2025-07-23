import { Alert, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { formatDate } from '../utils/helpers'
import CustomButton from './CustomButton'
import ThreeDots from "../assets/icons/three-dots-horizontal.svg"
import PostActions from '../modals/Post/PostActions'
import { PostItemProps, PostLikeProps } from '../types/post-types'
import ChevronLeft from "../assets/icons/chevron-left.svg"
import { useNavigation, useRoute } from '@react-navigation/native'
import { colors } from '../styles/colors'
import FastImage from '@d11/react-native-fast-image'
import { useBottomSheet } from './BottomSheetContext'
import User from "../assets/icons/user.svg"
import { profilePictureFallbackStyles } from '../styles/global-styles'

interface ProfileHeaderProps {
  name?: string,
  ProfilePic?: string,
  post?: PostItemProps
  postLikes?: PostLikeProps
  showPostActions?: boolean
  noDate?: boolean
  online?: boolean
  goBack?: boolean
  typing?: boolean
  you?: boolean
  onPress?: () => void
  flex?: boolean
  fetchLatestMessages?: (messageBoardUUID?: string) => void
}

export default function ProfileHeader({
  name, flex, typing, fetchLatestMessages, onPress,
  goBack,you, online = false, post, postLikes, showPostActions,
  noDate, ProfilePic
}: ProfileHeaderProps) {


  const navigation = useNavigation();
  const route = useRoute();
  const { open: openBottomSheet, close: closeBottomSheet } = useBottomSheet();


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

  const formattedDate = formatDate(postData?.CreatedDateTime || "");

  const handleOpenPostActions = () => {
    if(Keyboard.isVisible()) {
      Keyboard.dismiss()
    }

    openBottomSheet(
      <PostActions
        post={post}
        fetchLatestMessages={fetchLatestMessages}
        navigation={navigation}
        route={route}
        onClose={closeBottomSheet}
        openBottomSheet={openBottomSheet}
        closeBottomSheet={closeBottomSheet}
      />
    );
    
  };

  return (
    <View style={[styles.mainProfileDetialsContainer, route.name === "Comments" && {paddingVertical: 5}]}>
      {goBack && (
        <CustomButton
          buttonStyle={{ marginLeft: 10, flexDirection: "row", height: "100%", alignItems: "center" }}
          onPress={() => navigation.goBack()}
          icon={<ChevronLeft />}
        />
      )}

      <TouchableOpacity
        style={[{ flexDirection: "row", gap: 10, alignItems: "center" }, flex ? { flex: 1 } : null]}
        onPress={onPress}
      >
      {post?.ProfilePic?.trim() || ProfilePic ? (
          <FastImage
            style={styles.profilePicture}
            source={{
              uri: post?.ProfilePic.trim() || ProfilePic,
              priority: FastImage.priority.high,
            }}
          />
        ) : (
          <View style={profilePictureFallbackStyles}>
            <User color='red' width={18} height={18} />
          </View>
        )}
        <View>
          <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
            <Text style={styles.name}>{postData?.FirstName ? postData?.FirstName : name}</Text>
            {you && <Text style={styles.you}>You</Text>}
          </View>
          

          {typing && <Text style={{ color: colors.GREEN, fontSize: 12 }}>Typing...</Text>}

          {!noDate && (
            <View style={styles.dateContainer}>
              <Text style={styles.postDate}>{formattedDate}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {showPostActions && (
        <CustomButton
          buttonStyle={styles.threeDots}
          icon={<ThreeDots width={20} height={20} />}
          onPress={handleOpenPostActions}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainProfileDetialsContainer: {
    flexDirection: "row",
/*     borderWidth: 1, */
    alignItems: "center",
    gap: 8,
  },
  profilePicture: {
    width: 34,
    height: 34,
    borderRadius: 50
  },

  name: {
    fontWeight: '500',
    fontSize: 15,
    color: "#000000"
  },
  dateContainer: {
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
  you: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 10,
    borderRadius: 3,
    backgroundColor: colors.LIGHT_COLOR,
    color: colors.LIGHT_TEXT
  },
});
