// components/ChatItem.tsx
import React from "react";
import { TouchableOpacity, View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import CustomButton from ".././CustomButton";
import FastImage from "@d11/react-native-fast-image";
import { getTimeFromISO } from "../../utils/helpers";
import { CHAT_INVITE_STATUS_CODES, chatTypes } from "../../utils/constants";

type Props = {
  item: ChatEntity;
  isLoading: boolean;
  typingChats: Set<string>;
  onNavigate: (item: ChatEntity) => void;
  onChatInvite: (item: ChatEntity, inviteStatus: string) => void;
};

const ChatItem = ({
  item,
  isLoading,
  typingChats,
  onNavigate,
  onChatInvite,
}: Props) => {
  return (
    <TouchableOpacity style={styles.chatItem} onPress={() => onNavigate(item)}>
      <FastImage
        style={styles.chatMemberProfilePic}
        source={{
          uri: item.ChatProfilePictureURL || "https://i.pravatar.cc/150",
          priority: FastImage.priority.high,
        }}
      />
      <View style={styles.mainChatDetailsContainer}>
        <View style={styles.chatDetailsContainer}>
          <Text style={styles.chatMemberName}>{item.ChatMasterName}</Text>
          <Text style={styles.chatTime}>{getTimeFromISO(item.LastMessageTimestamp)}</Text>
        </View>

        {item.LoggedInUserInviteStatusItemCode === CHAT_INVITE_STATUS_CODES.PENDING && (
          <View style={styles.mainChatInviteButtonsContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.ACTIVE_ORANGE} />
            ) : (
              <>
                <Text style={styles.pending}>Pending Invite:</Text>
                <View style={styles.chatInviteButtonsContainer}>
                  <CustomButton
                    onPress={() => onChatInvite(item, CHAT_INVITE_STATUS_CODES.DECLINED)}
                    buttonStyle={styles.decline}
                    textStyle={styles.declineText}
                    title="Decline"
                  />
                  <CustomButton
                    onPress={() => onChatInvite(item, CHAT_INVITE_STATUS_CODES.APPROVED)}
                    buttonStyle={styles.accept}
                    textStyle={styles.acceptText}
                    title="Accept"
                  />
                </View>
              </>
            )}
          </View>
        )}

        {item.LoggedInUserInviteStatusItemCode === CHAT_INVITE_STATUS_CODES.APPROVED &&
          (typingChats.has(item.ChatMemberUserUUID) && item.ChatTypeCode === chatTypes.PRIVATE ? (
            <Text style={{ color: colors.GREEN }}>Typing...</Text>
          ) : (
            <Text ellipsizeMode="tail" numberOfLines={1} style={styles.latestText}>
              {item.LastMessage ? item.LastMessage : "Attachment"}
            </Text>
          ))}
      </View>
    </TouchableOpacity>
  );
};


export default React.memo(ChatItem);

const styles = StyleSheet.create({
    chatItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 15,
      paddingHorizontal: 5,
      backgroundColor: "white",
    },
    chatMemberProfilePic: {
      width: 45,
      height: 45,
      borderRadius: 50,
    },
    mainChatDetailsContainer: {
      justifyContent: "space-between",
      height: 45,
      flexGrow: 1,
      width: "50%",
    },
    chatDetailsContainer: {
      flexDirection: "row",
    },
    chatMemberName: {
      fontWeight: "500",
      fontSize: 16,
    },
    chatTime: {
      marginLeft: "auto",
      opacity: 0.5,
    },
    latestText: {
      opacity: 0.5,
      paddingRight: 8,
    },
    mainChatInviteButtonsContainer: {
      flexDirection: "row",
      marginLeft: "auto",
      alignItems: "center",
      marginTop: 5,
    },
    chatInviteButtonsContainer: {
      flexDirection: "row",
      gap: 5,
    },
    pending: {
      color: colors.LIGHT_TEXT,
      fontSize: 12,
    },
    accept: {
      padding: 5,
      backgroundColor: colors.ACTIVE_ORANGE,
      borderRadius: 4,
    },
    acceptText: {
      fontSize: 13,
      color: "white",
      fontWeight: "bold",
    },
    decline: {
      padding: 5,
      borderRadius: 4,
    },
    declineText: {
      color: colors.RED_TEXT,
      fontSize: 13,
      fontWeight: "bold",
    },
  });
