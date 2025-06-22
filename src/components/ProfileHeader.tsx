import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { formatDate } from '../utils/helpers'
import CustomButton from './CustomButton'
import ThreeDots from "../assets/icons/three-dots-horizontal.svg"
import PostActions from '../modals/Post/PostActions'
import { AttachmentData, PostItemProps, PostLikeProps } from '../types/post-types'
import ChevronLeft from "../assets/icons/chevron-left.svg"
import { useNavigation, useRoute } from '@react-navigation/native'
import { colors } from '../styles/colors'
import FastImage from '@d11/react-native-fast-image'
import { useBottomSheet } from './BottomSheetContext'

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
  typing?: boolean
  showStatus?: boolean,
  onPress?: () => void
  flex?: boolean
  fetchLatestMessages?: (messageBoardUUID?: string) => void
}

export default function ProfileHeader({
  name, flex, typing, fetchLatestMessages, onPress,
  goBack, showStatus, online = false, post, postLikes,
  showMemberActions, showPostActions, attachmentData,
  noDate, ProfilePic = "https://i.pravatar.cc/150"
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
    openBottomSheet(
      <PostActions
        post={post}
        fetchLatestMessages={fetchLatestMessages}
        navigation={navigation}
        route={route}
        onClose={closeBottomSheet}
      />
    );
    
  };

  return (
    <View style={styles.mainProfileDetialsContainer}>
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
        <FastImage
          style={styles.profilePicture}
          source={{
            uri: postData?.ProfilePic?.trim() || "https://i.pravatar.cc/150",
            priority: FastImage.priority.high,
          }}
        />
        <View style={styles.userNameContainer}>
          <Text style={styles.name}>{postData?.FirstName ? postData?.FirstName : name}</Text>

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
          icon={<ThreeDots width={18} height={18} />}
          onPress={handleOpenPostActions}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainProfileDetialsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profilePicture: {
    width: 34,
    height: 34,
    borderRadius: 50
  },
  userNameContainer: {},
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
  memberStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  ellipse: {
    width: 8,
    height: 8,
    borderRadius: 50
  }
});
