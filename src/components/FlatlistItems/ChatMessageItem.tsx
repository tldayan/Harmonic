import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { memo } from 'react';
import { formatDate } from '../../utils/helpers';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { colors } from '../../styles/colors';
import FastImage from '@d11/react-native-fast-image';

interface MessageItemProps {
  item: ChatMessage;
  index: number;
  userUUID: string;
  user: FirebaseAuthTypes.User | null;
  chatProfilePictureURL: string | null;
  chatMasterName: string;
  chats: ChatMessage[];
  setAttachment: (attachment: string) => void;
  setViewingAttachments: (viewing: boolean) => void;
  setChatAttachments: (attachments: any[]) => void;
}

export function MessageItem({
  item,
  index,
  userUUID,
  user,
  chatProfilePictureURL,
  chatMasterName,
  chats,
  setAttachment,
  setViewingAttachments,
  setChatAttachments,
}: MessageItemProps): React.ReactElement | null {
  if (!item.Message?.trim() && !item.Attachment) {
    return null;
  }

  const isMessagefromOwner = item.SenderUUID === userUUID;
  const isSeen = item.Status?.ReadBy?.some(uuid => uuid !== userUUID);

  const isLastSentMessage =
    isMessagefromOwner &&
    index ===
      chats.findIndex(
        msg =>
          msg.SenderUUID === userUUID &&
          msg.MessageType === "user-generated"
      );

  if (item.MessageType === "system-generated") {
    return <Text style={styles.systemGeneratedMessage}>{item.Message}</Text>;
  }

  if (item.MessageType === "user-generated") {
    const avatarUri =
      item.SenderUUID === userUUID ? user?.photoURL || "https://i.pravatar.cc/150" : chatProfilePictureURL || "https://i.pravatar.cc/150";

    return (
      <View
        style={[
          styles.userGeneratedMessageContainer,
          isMessagefromOwner && { flexDirection: 'row-reverse', alignSelf: 'flex-end' },
        ]}
      >
        <Image style={styles.profilePic} source={{ uri: avatarUri }} />
        <View
          style={[
            styles.userMessageContainer,
            isMessagefromOwner && { alignItems: "flex-end" },
          ]}
        >
          <Text style={styles.username}>
            {isMessagefromOwner
              ? user?.displayName
              : item.SenderFirstName || chatMasterName}
          </Text>

          <TouchableOpacity
            style={[
              styles.userGeneratedMessage,
              item.Attachment && { padding: 5 },
              isMessagefromOwner
                ? {
                    borderTopRightRadius: 0,
                    borderTopLeftRadius: 10,
                    marginLeft: "auto",
                  }
                : {
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 0,
                  },
            ]}
            onPress={() => {
              if (item.Attachment) {
                setAttachment(
                  typeof item.Attachment === "string"
                    ? item.Attachment
                    : (item.Attachment as { url: string }).url
                );
                
                setViewingAttachments(true);
                setChatAttachments([]);
              }
            }}
          >
            {item.Attachment && (
              <FastImage
                style={styles.attachmentImage}
                source={{
                  uri:
                    typeof item.Attachment === "string"
                      ? item.Attachment
                      : (item.Attachment as { url: string }).url,
                  priority: FastImage.priority.high,
                }}
              />
            )}
            {item.Message !== "" && (
              <Text>{item.Message}</Text>
            )}

            <Text
              style={[
                styles.messageTime,
                isMessagefromOwner && { left: -38 },
              ]}
            >
              {formatDate(item.Timestamp, true)}
            </Text>
          </TouchableOpacity>

          {isMessagefromOwner && isLastSentMessage && isSeen && (
            <Text style={styles.seenText}>Seen</Text>
          )}
        </View>
      </View>
    );
  }

  return null;
}


const styles = StyleSheet.create({
    userGeneratedMessageContainer: {
      marginBottom: 10,
      flexDirection: "row",
      gap: 10,
      alignItems: "flex-start",
    },
    profilePic: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.LIGHT_COLOR,
    },
    userMessageContainer: {
      flex: 1,
      gap: 5,
    },
    username: {
      fontSize: 15,
      fontWeight: "500",
    },
    userGeneratedMessage: {
      backgroundColor: "#f5f5f5",
      padding: 10,
      gap: 5,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      maxWidth: "80%",
      alignSelf: "flex-start",
      position: "relative",
    },
    attachmentImage: {
      width: 200,
      height: 200,
      borderRadius: 10,
      resizeMode: "cover",
      maxWidth: "100%",
    },
    messageTime: {
      color: "#999",
      fontSize: 12,
      marginLeft: "auto",
      position: "absolute",
      bottom: 2,
      right: -38,
    },
    systemGeneratedMessage: {
      padding: 5,
      borderRadius: 50,
      textAlign: "center",
      marginVertical: 5,
      alignSelf: "center",
      paddingHorizontal: 15,
      fontSize: 13,
      fontWeight: "300",
      color: "#888",
      opacity: 0.8,
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "#eee",
    },
    seenText: {
      fontSize: 12,
      color: "#999",
    },
  });
  
export const MemoedMessageItem = memo(MessageItem);