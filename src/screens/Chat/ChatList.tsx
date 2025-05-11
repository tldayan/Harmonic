import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors';
import { CustomTextInput } from '../../components/CustomTextInput';
import SearchIcon from "../../assets/icons/search.svg"
import { getChatInviteDetails, getChatsList, respondToChatInvite } from '../../api/network-utils';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { CustomModal } from '../../components/CustomModal';
import CreateGroup from '../../modals/Chat/CreateGroup';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation-types';
import { ChatListDropdownComponent } from '../../dropdowns/ChatListDropdown';
import Close from "../../assets/icons/close-dark.svg"
import CreateChat from '../../modals/Chat/CreateChat';
import { CHAT_INVITE_STATUS_CODES, chatTypes, STATUS_CODE } from '../../utils/constants';
import { getTimeFromISO } from '../../utils/helpers';
import { SocketContext } from '../../context/SocketContext';

const ChatsList = () => {
  const [chats, setChats] = useState<ChatEntity[]>([])
  const [filteredChats, setFilteredChats] = useState<ChatEntity[]>([])
  const [chatSearch, setChatSearch] = useState("")
  const [typingChats, setTypingChats] = useState<Set<string>>(new Set())
  const userUUID = useSelector((state: RootState) => state.auth.userUUID)
  const [loading, setLoading] = useState(false)
  const [chatActionLoadingUUID, setChatActionLoadingUUID] = useState<string | null>(null)
  const [action, setAction] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const [refreshing, setRefreshing] = useState(false)
  const socket = useContext(SocketContext);

  const fetchChats = async () => {
    setLoading(true)
    try {
      const chatsResponse = await getChatsList(userUUID)
      setChats(chatsResponse)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChats()
  }, [])

  useEffect(() => {
    if (!socket) return;
  
    const registerSocket = () => {
      if (socket.connected && userUUID) {
        socket.emit("register", userUUID);
        console.log("Registered socket with userUUID:", userUUID);
      }
    };
  
    if (socket.connected) {
      registerSocket();
    }
  
    socket.on("connect", registerSocket);
  
    return () => {
      socket.off("connect", registerSocket);
      if (userUUID) {
    
        socket.emit("deregister", userUUID);
        console.log("Deregistered socket with userUUID:", userUUID);
      }
    };
  }, [socket, userUUID]);


  useFocusEffect(
    useCallback(() => {
      if (!socket) return;
  
      const handleTyping = (senderUUID: string) => {
        setTypingChats(prev => {
          const updated = new Set(prev);
          updated.add(senderUUID);
          return updated;
        });
      };
  
      const handleStopTyping = (senderUUID: string) => {
        setTypingChats(prev => {
          const updated = new Set(prev);
          updated.delete(senderUUID);
          return updated;
        });
      };
  
      socket.on("notify_typing", handleTyping);
      socket.on("notify_stop_typing", handleStopTyping);
  
      return () => {
        socket.off("notify_typing", handleTyping);
        socket.off("notify_stop_typing", handleStopTyping);
      };
    }, [socket])
  );


  const handleNavigate = (item: ChatEntity) => {
    if (item.LoggedInUserInviteStatusItemCode !== CHAT_INVITE_STATUS_CODES.APPROVED) return
    navigation.navigate("ChatScreen", {
      userUUID,
      createdDateTime: item.CreatedDateTime,
      chatMasterUUID: item.ChatMasterUUID,
      chatProfilePictureURL: item.ChatProfilePictureURL,
      chatMasterName: item.ChatMasterName,
      chatType: item.ChatTypeCode,
      chatMemberUserUUID: item.ChatMemberUserUUID
    })
  }

  const respondToInvite = (chatUUID: string, status: string) => {
    if (!socket) return;
  
    socket.emit("respond_to_chat_invite", {
      ChatUUID: chatUUID,
      StatusItemCode: status,
    });
  };
  
  const handleChatInvite = async (item: ChatEntity, inviteStatus: string) => {
    setChatActionLoadingUUID(item.ChatMasterUUID)
    try {
      const chatInviteDetails = await getChatInviteDetails(userUUID, item.ChatMasterUUID)
      const inviteForUUID = chatInviteDetails.Payload.InviteFor
      const respondToChatInviteResponse = await respondToChatInvite(userUUID, inviteForUUID, inviteStatus, item.ChatMasterUUID)

      if (respondToChatInviteResponse.Status === STATUS_CODE.SUCCESS) {
        if (inviteStatus === CHAT_INVITE_STATUS_CODES.APPROVED) {
          navigation.navigate("ChatScreen", {
            userUUID,
            createdDateTime: item.CreatedDateTime,
            chatMasterUUID: item.ChatMasterUUID,
            chatProfilePictureURL: item.ChatProfilePictureURL,
            chatMasterName: item.ChatMasterName,
            chatType: item.ChatTypeCode,
            chatMemberUserUUID: item.ChatMemberUserUUID
          })
          respondToInvite(item.ChatMasterUUID, inviteStatus)
          

          setFilteredChats((prev) =>
            prev.map((eachChat) =>
              eachChat.ChatMasterUUID === item.ChatMasterUUID
                ? { ...item, LoggedInUserInviteStatusItemCode: CHAT_INVITE_STATUS_CODES.APPROVED }
                : eachChat
            )
          )
        } else {
          setFilteredChats((prev) =>
            prev.filter((eachChat) => eachChat.ChatMasterUUID !== item.ChatMasterUUID)
          )
        }
      }
    } catch (err) {
      console.log(err)
    } finally {
      setChatActionLoadingUUID(null)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchChats()
    setRefreshing(false)
  }

  useEffect(() => {
    const filtered = chats.filter((eachChat) =>
      eachChat.ChatMasterName.toLowerCase().includes(chatSearch.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [chatSearch, chats]);

  const renderChatItem = ({ item }: { item: ChatEntity }) => {
    const isLoading = chatActionLoadingUUID === item.ChatMasterUUID;

    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => handleNavigate(item)}>
        <Image style={styles.chatMemberProfilePic} source={{ uri: item.ChatProfilePictureURL || "https://i.pravatar.cc/150" }} />
        <View style={styles.mainChatDetailsContainer}>
          <View style={styles.chatDetailsContainer}>
            <Text style={styles.chatMemberName}>{item.ChatMasterName}</Text>
            <Text style={styles.chatTime}>{getTimeFromISO(item.LastMessageTimestamp)}</Text>
          </View>

          {item.LoggedInUserInviteStatusItemCode === CHAT_INVITE_STATUS_CODES.PENDING &&
            <View style={styles.mainChatInviteButtonsContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.ACTIVE_ORANGE} />
              ) : (
                <>
                  <Text style={styles.pending}>Pending Invite:</Text>
                  <View style={styles.chatInviteButtonsContainer}>
                    <CustomButton onPress={() => handleChatInvite(item, CHAT_INVITE_STATUS_CODES.DECLINED)} buttonStyle={styles.decline} textStyle={styles.declineText} title="Decline" />
                    <CustomButton onPress={() => handleChatInvite(item, CHAT_INVITE_STATUS_CODES.APPROVED)} buttonStyle={styles.accept} textStyle={styles.acceptText} title="Accept" />
                  </View>
                </>
              )}
            </View>
          }

          {item.LoggedInUserInviteStatusItemCode === CHAT_INVITE_STATUS_CODES.APPROVED && (
            typingChats.has(item.ChatMemberUserUUID) && item.ChatTypeCode === chatTypes.PRIVATE ? <Text style={{color: colors.GREEN}}>Typing...</Text> : <Text ellipsizeMode="tail" numberOfLines={1} style={styles.latestText}>{item.LastMessage ? item.LastMessage : "Attachment"}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.mainSearchFieldContainer}>
              <CustomTextInput
                value={chatSearch}
                rightIcon={chatSearch && <CustomButton onPress={() => setChatSearch("")} icon={<Close opacity={0.8} width={18} height={18} />} />}
                leftIcon={<SearchIcon width={20} height={20} opacity={0.5} />}
                mainInputStyle={styles.searchFieldContainer}
                inputStyle={styles.searchField}
                onChangeText={(e) => setChatSearch(e)}
                placeholder='Search messages or contact'
              />
              <ChatListDropdownComponent action={action} setAction={setAction} />
            </View>

              <ScrollView contentContainerStyle={styles.chatCategoryButtonsContainer}>
                <CustomButton buttonStyle={styles.chatCategoryButton} textStyle={styles.chatCategory} onPress={() => {}} title={"All"} />
                <CustomButton buttonStyle={styles.chatCategoryButton} textStyle={styles.chatCategory} onPress={() => {}} title={"Unread"} />
                <CustomButton buttonStyle={styles.chatCategoryButton} textStyle={styles.chatCategory} onPress={() => {}} title={"Groups"} />
                <CustomButton buttonStyle={styles.chatCategoryButton} textStyle={styles.chatCategory} onPress={() => {}} title={"Starred"} />
              </ScrollView>
          </>
        }
        ListFooterComponent={loading ? <ActivityIndicator style={{ marginTop: 50 }} size="small" /> : null}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.chatList}
        data={filteredChats.length ? filteredChats : chats}
        renderItem={renderChatItem}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        keyExtractor={(item) => item.ChatMasterUUID}
        ListEmptyComponent={<Text style={{alignSelf: 'center', textAlign: "center", marginVertical: "50%", marginHorizontal: "20%", color: colors.LIGHT_TEXT}}>No chats yet. Start a chat to connect with someone!</Text>}
      />

      <CustomModal presentationStyle="overFullScreen" fullScreen isOpen={action === "1"}>
        <CreateGroup fetchChats={fetchChats} onClose={() => setAction(null)} />
      </CustomModal>

      <CustomModal presentationStyle="overFullScreen" fullScreen isOpen={action === "2"}>
        <CreateChat fetchChats={fetchChats} onClose={() => setAction(null)} />
      </CustomModal>
    </View>
  )
}

export default ChatsList



const styles = StyleSheet.create({
  chatList: {
/*     borderWidth: 1, */
    flexGrow: 1,
    position: "relative",
    gap: 0,
    paddingHorizontal: 5
  },
  chatItem: {
  /*   borderWidth: 1, */
    flexDirection : 'row',
    alignItems: "center",
    gap: 10,
    paddingVertical: 15,
    paddingHorizontal: 5,
    backgroundColor: "white"
  },
  chatMemberProfilePic: {
    width: 45,
    height: 45,
    borderRadius: 50
  },
  chatMemberName: {
    fontWeight: 500,
    fontSize: 16,
  },
  mainChatDetailsContainer: {
  /*   borderWidth: 1, */
    justifyContent: 'space-between',
    height: 45,
    flexGrow: 1,
    width: "50%"
  },
  chatDetailsContainer: {
  /*   borderWidth: 1, */
/*     flex: 1, */
/*     width: "100%", */
    flexDirection: "row",
  },
  chatTime: {
    marginLeft: "auto",
    opacity: 0.5
  },
  latestText: {
    opacity: 0.5,
    paddingRight: 8,  
/*     flexWrap: "wrap",  */
/*     flexGrow: 1 */
/*     maxWidth: "85%",  */
  },
  chatCategoryButton: {
/*     borderWidth: 1, */
    paddingHorizontal: 15,
    paddingVertical:5,
    borderRadius: 50,
    backgroundColor: colors.LIGHT_COLOR,
    marginVertical: 10
  },
  chatCategoryButtonsContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  chatCategory: {
/*     fontWeight: 500 */
  },
  mainSearchFieldContainer: {
    marginTop: 15,
    flexDirection: "row", 
    alignItems: "center",
    gap: 5,
    width:"98%",
    marginHorizontal: "1%",
  },
  searchFieldContainer: {
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  searchField: {
    backgroundColor: colors.BACKGROUND_COLOR,
    flex: 1,
    borderRadius: 50,
    paddingLeft: 40
  },




  dropdown: {
/*     backgroundColor: "red", */
    position: "relative",
    width : "6%",
    marginLeft: "auto",
    height: 50,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  mainChatInviteButtonsContainer: {
/*     borderWidth: 2, */
    flexDirection: "row",
    marginLeft: "auto",
    alignItems: "center",
    marginTop: 5
  },
  chatInviteButtonsContainer: {
    flexDirection: "row",
    gap: 5
  },
  acceptText: {
    fontSize: 13,
    color: "white",
    fontWeight: "bold"
  },
  declineText: {
    color: colors.RED_TEXT,
    fontSize: 13,
    fontWeight: "bold"
  },
  accept: {
    padding: 5,
    backgroundColor: colors.ACTIVE_ORANGE,
    borderRadius: 4,
  },
  decline: {
    padding: 5,
    borderRadius: 4,
    color: colors.RED_TEXT,
  },
  pending: {
    color: colors.LIGHT_TEXT,
    fontSize: 12
  }
})