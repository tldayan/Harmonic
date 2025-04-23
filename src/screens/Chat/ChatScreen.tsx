import { ActivityIndicator, Alert, Animated, FlatList, Image, Keyboard, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import ProfileHeader from '../../components/ProfileHeader'
import { CustomTextInput } from '../../components/CustomTextInput'
import SendIcon from "../../assets/icons/send-horizontal.svg"
import { colors } from '../../styles/colors'
import CustomButton from '../../components/CustomButton'
import { formatLongDate, pickMedia, useKeyboardVisibility } from '../../utils/helpers'
import PaperClip from "../../assets/icons/paper-clip2.svg"
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../types/navigation-types'
import { getGroupMessages, getMessages } from '../../api/network-utils'
import { profilePic } from '../../styles/global-styles'
import { formatDate } from '../../utils/helpers'
import { CustomModal } from '../../components/CustomModal'
import AttachmentCarousel from '../../modals/AttachmentCarousel'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import MuteNotifications from '../../modals/Chat/MuteNotifications'
import Block from '../../modals/Chat/Block'
import Report from '../../modals/Chat/Report'
import DeleteChat from '../../modals/Chat/DeleteChat'
import { chatTypes } from '../../utils/constants'
import CameraIcon from "../../assets/icons/chat-camera.svg"
import DocumentUpload from "../../assets/icons/document-upload.svg"
import Location from "../../assets/icons/location.svg"
import ImageUpload from "../../assets/icons/upload-image.svg"
import { ChatActionDropdownComponent, chatActions } from '../../dropdowns/ChatActionDropdown'
import { Asset } from 'react-native-image-picker'
import { Attachmentitem } from '../../components/FlatlistItems/AttachmentItem'
import { DocumentPickerResponse, pick } from '@react-native-documents/picker'
import { DocumentItem } from '../../components/FlatlistItems/DocumentItem'
import { getCurrentLocation } from '../../utils/ChatScreen/Location'
import { PhotoFile} from 'react-native-vision-camera';
import CameraView from '../../components/CameraView'
import { CapturedItem } from '../../components/FlatlistItems/CapturedItem'
import { SocketContext } from '../../context/SocketContext'
import { BaseMessage, GroupMessageReceived, PrivateMessageReceived } from '../../types/chat-types'
import { convertToChatMessage } from '../../utils/ChatScreen/ConverMessage'
import { useUser } from '../../context/AuthContext'


export type ChatsScreenRouteProp = RouteProp<RootStackParamList, "ChatScreen">

export default function ChatScreen() {

  const [chats, setChats] = useState<ChatMessage[]>([]) 
  const [lastMessageTimeStamp, setLastMessageTimeStamp] = useState("")
  const [message, setMessage] = useState("")
  const [userBlocked, setUserBlocked] = useState(false)
  const [chatAction, setChatAction] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false)
  const [chatAttachments, setChatAttachments] = useState<Asset[]>([])
  const [capturedAttachments, setCapturedAttachments] = useState<PhotoFile[]>([])
  const [chatDocuments, setChatDocuments] = useState<DocumentPickerResponse[]>([])
  const [viewingAttachments, setViewingAttachments] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [initialAttachmentIndex, setInitialAttachmentIndex] = useState(0)
  const [attachment, setAttachment] = useState<string | null>(null)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [showCamera, setShowCamera] = useState(false);
  const route = useRoute<ChatsScreenRouteProp>()
  const {userUUID, chatMasterUUID, createdDateTime,chatProfilePictureURL, chatMasterName, chatType, chatMemberUserUUID} = route.params || {}
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const paddingAnim = useRef(new Animated.Value(0)).current;
  const isGroupChat = chatType === chatTypes.GROUP
  const socket = useContext(SocketContext);
  const { user } = useUser();
  const socketChatType = isGroupChat ? "group" : "private"
  useKeyboardVisibility(() => setIsKeyboardVisible(true), () => setIsKeyboardVisible(false))


// 1. Register the socket with the userUUID
/* useEffect(() => {
  if (!socket) return;

  const registerSocket = () => {
    if (socket.connected && userUUID) {
      // Register user with socket
      socket.emit("register", userUUID);
      console.log("Registered socket with userUUID:", userUUID);
    }
  };

  // If the socket is already connected, register
  if (socket.connected) {
    registerSocket();
  }

  // On socket connection, register user
  socket.on("connect", registerSocket);

  return () => {
    socket.off("connect", registerSocket);
    if (userUUID) {
      // Deregister the user from the socket when component unmounts or userUUID changes
      socket.emit("deregister", userUUID);
      console.log("Deregistered socket with userUUID:", userUUID);
    }
  };
}, [socket, userUUID]);
 */


useEffect(() => {
  if (socket?.connected) {
    if (chatMasterUUID && !isGroupChat) {
      socket.emit("join_chat", chatMasterUUID);
      console.log(`Joined private chat room: ${chatMasterUUID}`);
    } else if (chatMasterUUID && isGroupChat) {
      socket.emit("join_group", chatMasterUUID);
      console.log(`Joined group chat room: ${chatMasterUUID}`);
    }
  }

  return () => {
    console.log(`Left room: ${chatMasterUUID}`);
  };
}, [chatMasterUUID, socket, isGroupChat]);
;

  useEffect(() => {
    if (!socket) return;
  
  
    const handleMessage = (data: BaseMessage) => {
      console.log("New message received", data);
      const senderFirstName = isGroupChat
      ? (data as GroupMessageReceived).SenderFirstName
      : (data as PrivateMessageReceived).SenderFirstName;

      let newMessage = convertToChatMessage(data, userUUID, senderFirstName || chatMasterName)
      setChats(prev => [newMessage,...prev]);
    };
  
    socket.on(`${socketChatType}_message_received`, handleMessage);
  
    return () => {
      socket.off(`${socketChatType}_message_received`, handleMessage);
    };
  }, [socket, isGroupChat]);
  

  useEffect(() => {
    if (!socket || !chats.length) return;

      chats.forEach(msg => {
        if (msg.SenderUUID !== userUUID) {
          socket.emit(`${socketChatType}_message_delivered`, {
            ChatUUID: chatMasterUUID,
            MessageId: msg.id,
            UserUUID: userUUID
          });
        }
      });
    
    
  }, [socket, chats, isGroupChat]);


  useEffect(() => {
    if (!socket || !chats.length) return;
      
      socket.emit(`${socketChatType}_message_read`, {
        ChatUUID: chatMasterUUID,
        UserUUID: userUUID,
      });
    

  }, [socket, isGroupChat, chats.length, chatMasterUUID, userUUID]);
  
  


  useEffect(() => {
    if (!socket) return;
    
  
    const handleDelivered = ({ MessageId, UserUUID }: any) => {
      setChats(prev =>
        prev.map(m =>
          m.id === MessageId
            ? {
                ...m,
                Status: {
                  ...m.Status,
                  DeliveredTo: [...new Set([...(m.Status?.DeliveredTo || []), UserUUID])]
                }
              }
            : m
        )
      );
    };
  
    socket.on(`${socketChatType}_message_marked_delivered`, handleDelivered);
  
    return () => {
      socket.off(`${socketChatType}_message_marked_delivered`, handleDelivered);
    };
  }, [socket, isGroupChat]);
  
  

  useEffect(() => {
    if (!socket) return;
  
    const handleRead = ({ ChatUUID, UserUUID }: { ChatUUID: string; UserUUID: string }) => {
      console.log("hejre")
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.SenderUUID === userUUID && !chat.Status.ReadBy.includes(UserUUID)) {
            return {
              ...chat,
              Status: {
                ...chat.Status,
                ReadBy: [...chat.Status.ReadBy, UserUUID],
              },
            };
          }
          return chat;
        })
      );
    };
  
    socket.on(`${socketChatType}_message_marked_read`, handleRead);
  
    return () => {
      socket.off(`${socketChatType}_message_marked_read`, handleRead);
    };
  }, [socket, chatMasterUUID, userUUID, isGroupChat]);
  
  

  useEffect(() => {
    if(chatAction === "1") {
      navigation.navigate("ChatInfo", {chatMasterUUID: chatMasterUUID, chatType: chatType })
    }
  }, [chatAction])

  
  const fetchChats = useCallback(async (initialMessages: boolean) => {
    let messagesResponse;
  
    if (chatType === chatTypes.PRIVATE) {
      messagesResponse = await getMessages(userUUID, chatMasterUUID, lastMessageTimeStamp);
    } else {
      messagesResponse = await getGroupMessages(userUUID, chatMasterUUID, lastMessageTimeStamp);
    }
    console.log(messagesResponse.Messages)
    const chats = messagesResponse?.Messages || [];
    if (chats.length === 0) return;
  
    setChats((prev) => initialMessages ? chats : [...prev, ...chats]);
  
    const lastTimestamp = chats[chats.length - 1]?.Timestamp;
    if (lastTimestamp) {
      setLastMessageTimeStamp(lastTimestamp);
    }
  }, [chatType, userUUID, chatMasterUUID, lastMessageTimeStamp]);
  


    useFocusEffect(
      useCallback(() => {
        fetchChats(true);
    
        if (userBlocked) {
          chatActions.map((eachAction) => {
            if (eachAction.label === "Block") {
              eachAction.label = "Unblock";
            }
          });
        }
    
      }, [])
    );


  const handleSendMessage = () => {
    
    if(!message.trim()) return
    const timestamp = new Date().toISOString();

    const payload = {
      SenderUUID: userUUID, 
      Message: message,
      Attachment: null, 
      AttachmentType: null,
      ViewUUID: "", //optional
      ...(isGroupChat
        ? { GroupId: chatMasterUUID } // for group
        : { ChatUUID: chatMasterUUID }) // for private
    }
    console.log(payload)
    if(isGroupChat) {
      socket.emit("group_message", payload)
    } else {
      socket.emit("private_message", payload)
    }

    const newMessage: ChatMessage = {
      id : `msg-${Date.now()}`,
      SenderUUID: userUUID,
      Message: message,
      MessageType: "user-generated",
      Attachment: "",
      AttachmentType: "",
      Timestamp: timestamp,
      Status: {
        DeliveredTo: [],
        ReadBy: [],
      },
      UserUUID: userUUID,
      SenderFirstName: user?.displayName || "", 
      SenderLastName: user?.displayName || "",
    };


    setChats((prev) => [newMessage, ...prev])
    
    setMessage("")
  }


  const addMedia = async() => {
    try {
      const assets = await pickMedia()
      setChatAttachments((prev) => [...prev, ...assets ?? []])
    } catch(err) {
      console.log(err)
    } finally {
      setShowActions(false)
    }

  }

  const addDocument = async() => {

    try {
      const pickResults = await pick({ allowMultiSelection: true });
      let nonDuplicateDocuments = pickResults.filter((eachDoc) => !chatDocuments.some((doc) => doc.uri === eachDoc.uri))
      setChatDocuments((prev) => [...prev, ...nonDuplicateDocuments])
    } catch (err: unknown) {
      console.log(err)
    } finally {
      setShowActions(false)
    }
  }

  const getLocation = async() => {
    setLocationLoading(true)
    try {
      const location  = await getCurrentLocation()
      console.log(location)
      if(location) {
        Alert.alert("Send location?", "Are you sure you want to send your location?",[
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Send',
            onPress: () => {
              console.log('Sending location:', location);
            },
          },
        ],
        { cancelable: true })
      }
    } catch(err) {
      console.log(err)
    } finally {
      setLocationLoading(false)
    }

  }

  const renderMessage = ({ item, index }: { item: ChatMessage, index: number }) => {
    if (!item.Message?.trim() && !item.Attachment) {
      return null; 
    }
  
    const isMessagefromOwner = item.SenderUUID === userUUID;
    const isSeen = item.Status?.ReadBy?.some(uuid => uuid !== userUUID);

  const isLastSentMessage = isMessagefromOwner &&
  index === chats.findIndex(
    (msg) => msg.SenderUUID === userUUID && msg.MessageType === "user-generated"
  )
  
    if (item.MessageType === "system-generated") {
      return <Text style={styles.systemGeneratedMessage}>{item.Message}</Text>;
    }
  
    if (item.MessageType === "user-generated") {
      return ( 
        <View style={[
          styles.userGeneratedMessageContainer,
          isMessagefromOwner && { flexDirection: "row-reverse", alignSelf: "flex-end" }
        ]}>
          <Image
            style={[
              profilePic
            ]}
            source={{
              uri:
                item.SenderUUID === userUUID
                  ? user?.photoURL || "https://i.pravatar.cc/150"
                  : chatProfilePictureURL || "https://i.pravatar.cc/150"
            }}
          />
          <View style={[styles.userMessageContainer, isMessagefromOwner && { alignItems: "flex-end" }]}>
            <Text style={styles.username}>
              {isMessagefromOwner ? user?.displayName : item.SenderFirstName ? item.SenderFirstName : chatMasterName}
            </Text>
  
            <TouchableOpacity
              style={[
                styles.userGeneratedMessage,
                item.Attachment && { padding: 5 },
                isMessagefromOwner ? {borderTopRightRadius : 0, borderTopLeftRadius: 10} : {borderTopRightRadius : 10, borderTopLeftRadius: 0},
                isMessagefromOwner && { marginLeft: "auto"}
              ]}
            >
              {item.Attachment && (
                <TouchableOpacity onPress={() => {
                  setAttachment(item.Attachment);
                  setViewingAttachments(true);
                  setChatAttachments([]);
                }}>
                  <Image
                    style={styles.attachmentImage}
                    source={{ uri: item.Attachment }}
                  />
                </TouchableOpacity>
              )}
  
              {item.Message !== "" && (
                <Text>
                  {item.Message}
                </Text>
              )}
  
              <Text style={[styles.messageTime, isMessagefromOwner && {left : -38} ]}>
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
  };
  
  useEffect(() => {
    let toValue = 0;
  
    if (isKeyboardVisible) {
      toValue = 0;
    } else if (showActions) {
      toValue = 50;
    }
  
    Animated.spring(paddingAnim, {
      toValue,            
      friction: 5,         
      tension: 50, 
      useNativeDriver: false,
    }).start();
  }, [isKeyboardVisible, showActions]);
  
  const AddAdditionalMediaButton = () => {
    if(chatAttachments.length || chatDocuments.length) {
        return (
      <CustomButton buttonStyle={[styles.addAttachment, chatDocuments.length ? {width: 100, height: 100} : null]} onPress={chatAttachments.length ? addMedia : addDocument} icon={<Image source={require("../../assets/images/plus.png")} />} /> 
    )
    }
  }

  const deleteAttachment = (imageFilename: string) => {
    if(chatAttachments.length) {
      let updatedSelectedImages = chatAttachments.filter((eachImage) => eachImage.fileName !== imageFilename)
      setChatAttachments(updatedSelectedImages)
    } else if(capturedAttachments.length) {
      let updatedCapturedImages = capturedAttachments.filter((eachImage) => eachImage.path !== imageFilename)
      setCapturedAttachments(updatedCapturedImages)
    }



  }

  const deleteDocument = (uri: string) => {
    let updatedSelectedDocuments = chatDocuments.filter((eachImage) => eachImage.uri !== uri)
    setChatDocuments(updatedSelectedDocuments)
  }


  const handleAddAttachments = () => {

    if(isKeyboardVisible) {
      Keyboard.dismiss()
    }

    setShowActions((prev) => !prev)
  }


  return (
    <View style={styles.container}>
      <>
      <View style={styles.header}>
        <ProfileHeader onPress={() => navigation.navigate("ChatInfo", {chatMasterUUID: chatMasterUUID, chatType: chatType })} ProfilePic={chatProfilePictureURL ?? undefined} showStatus goBack online noDate name={chatMasterName} showMemberActions  />
        <ChatActionDropdownComponent chatAction={chatAction} setChatAction={setChatAction} />
      </View>

      <FlatList
        style={{marginBottom: 80}}
        contentContainerStyle={styles.chatHistoryList}
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        inverted
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<Text style={styles.systemGeneratedMessage}>{formatLongDate(createdDateTime)}</Text>}
      />

    <View style={[styles.mainMessageFieldContainer, { padding: isKeyboardVisible ? 0 : Platform.OS === "ios" ? 20 : 0 }]}>
      
      {chatAttachments.length > 0 && <FlatList indicatorStyle='black' horizontal style={styles.mainSelectedAttachments} contentContainerStyle={styles.selectedImagesList} data={chatAttachments} renderItem={({ item, index }) => (
        <Attachmentitem
            item={item}
            index={index}
            deleteAttachment={deleteAttachment}
            setAttachment={setAttachment}
            setViewingAttachments={setViewingAttachments}
            setInitialAttachmentIndex={setInitialAttachmentIndex}
        />
        )}
        keyExtractor={(item) => String(item.fileName)} ListFooterComponent={<AddAdditionalMediaButton />} />}

      {capturedAttachments.length > 0 && <FlatList indicatorStyle='black' horizontal style={styles.mainSelectedAttachments} contentContainerStyle={styles.selectedImagesList} data={capturedAttachments} renderItem={({ item, index }) => (
        <CapturedItem
          item={item}
          index={index}
          deleteAttachment={deleteAttachment}
          setAttachment={setAttachment}
          setViewingAttachments={setViewingAttachments}
          setInitialAttachmentIndex={setInitialAttachmentIndex}
        />
        )}
        keyExtractor={(item) => String(item.path)} ListFooterComponent={<AddAdditionalMediaButton />} />}

      {chatDocuments.length > 0 && <FlatList indicatorStyle='black' horizontal style={styles.mainSelectedAttachments} contentContainerStyle={styles.selectedImagesList} data={chatDocuments} renderItem={({ item, index }) => (
        <DocumentItem
            item={item}
            index={index}
            deleteDocument={deleteDocument}
        />
        )}
        keyExtractor={(item) => String(item.uri)} ListFooterComponent={<AddAdditionalMediaButton />} />}


      {userBlocked ? (
        <Text style={styles.blockedUserNotice}>
          Can't send a message to blocked users
        </Text>
      ) : (
        <>
        <View style={styles.messageFieldContainer}>
          <View style={styles.quickActionsContainer}>
            <CustomButton
              onPress={handleAddAttachments}
              icon={<PaperClip width={20} height={20} />}
              buttonStyle={styles.quickActions}
            />
            <CustomButton
              onPress={() => setShowCamera(true)}
              icon={<CameraIcon fill={colors.ACTIVE_ORANGE} width={20} height={20} />}
              buttonStyle={styles.quickActions}
            />
          </View>
          
          <CustomTextInput
            placeholder="Write a message"
            placeholderTextColor={colors.LIGHT_TEXT_COLOR}
            inputStyle={styles.messageField}
            value={message}
            onChangeText={e => setMessage(e)}
            onPress={() => setShowActions(false)}
          />
          <CustomButton
            onPress={handleSendMessage}
            icon={
              <SendIcon
                width={30}
                height={30}
                strokeWidth={1}
                fill={(message || chatAttachments.length || chatDocuments.length) ? colors.ACTIVE_ORANGE : 'grey'}
                stroke={(message || chatAttachments.length || chatDocuments.length) ? 'white' : 'white'}
              />
            }
          />
    </View>
    <Animated.View style={[styles.mainActionsContainer, {height: paddingAnim}, showActions ? {marginBottom: 10} : null]}>
      {showActions && 
      <>
        <CustomButton buttonStyle={styles.mainAttachmentsContainer} onPress={addMedia} icon={<ImageUpload width={23} height={23} />} title={""} />
        <CustomButton buttonStyle={styles.mainAttachmentsContainer} onPress={addDocument} icon={<DocumentUpload width={23} height={23} />} title={""} />
        <CustomButton buttonStyle={styles.mainAttachmentsContainer} onPress={getLocation} icon={locationLoading ? <ActivityIndicator color={colors.ACTIVE_ORANGE} size={"small"} /> : <Location width={23} height={23} />} title={""} />
      </>}
    </Animated.View>
    </>
  )}
</View>
</>

    <CustomModal isOpen={viewingAttachments} onClose={() => {setViewingAttachments(false)}}>
      <AttachmentCarousel initialIndex={initialAttachmentIndex} Attachment={attachment} capturedAttachments={capturedAttachments} Assets={chatAttachments} onClose={() => {setViewingAttachments(false)}} />
    </CustomModal> 

    <CustomModal isOpen={chatAction === "3"} onClose={() => setChatAction(null)}>
      <MuteNotifications onClose={() => setChatAction(null)} />
    </CustomModal>

    <CustomModal disableCloseOnBackground={true} isOpen={chatAction === "7"} onClose={() => setChatAction(null)}>
      <Block chatMemberUserUUID={chatMemberUserUUID} onClose={() => setChatAction(null)} />
    </CustomModal>
    
    <CustomModal isOpen={chatAction === "6"} onClose={() => setChatAction(null)}>
      <Report onClose={() => setChatAction(null)} />
    </CustomModal>
    
    <CustomModal isOpen={chatAction === "9"} onClose={() => setChatAction(null)}>
      <DeleteChat name={chatMasterName} onClose={() => setChatAction(null)} />
    </CustomModal>

    <CustomModal fullScreen isOpen={showCamera} presentationStyle="fullScreen">
      <CameraView capturedAttachments={capturedAttachments} setCapturedAttachments={setCapturedAttachments} setShowCamera={setShowCamera} />
    </CustomModal>

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
      /*   borderWidth: 2, */
        backgroundColor: colors.BACKGROUND_COLOR,
      },
      header: {
        borderBottomWidth: 0.3,
        borderBottomColor: colors.TEXT_COLOR,
        backgroundColor: "white",
  /*       backgroundColor: colors.LIGHT_COLOR, */
        flexDirection :"row",
        alignItems: "center",
        justifyContent: "space-between"
      },
      chatHistoryList: {
        flexGrow: 1,
/*         marginBottom: 100, */
        gap: 15,
        paddingHorizontal: 10,
        paddingVertical: 10
/*         borderWidth: 2, */
      },
      mainMessageFieldContainer: {
        alignItems: "center",
        flexDirection: "column",
        gap: 10,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        paddingHorizontal: 2,
        paddingTop:5,
        borderTopWidth: 1,
        borderTopColor: colors.BORDER_COLOR,
      },
      messageFieldContainer: {
 /*        borderWidth: 1, */
        width: "100%",
        flex: 1,
        flexDirection: "row",
        alignItems:"center",
        gap: 5
      },
    messageField: {
      marginLeft: 5,
        borderRadius: 50,
        backgroundColor: colors.BACKGROUND_COLOR,
        borderStyle: "solid",
        borderColor: colors.BORDER_COLOR,
        flex: 1,
        paddingHorizontal: 16,
        color: "black",
      },
      dropdown: {
        /*     backgroundColor: "red", */
     /*    borderWidth: 1, */
        width : 50,
        height: 50,
      },
      iconStyle: {
        width: "100%",
        height: 50,
        alignItems: "center",
        justifyContent: "center"
      },
      mainSelectedAttachments : {
        marginRight: "auto",
        borderColor: "aqua",
        flexGrow: 0, height: 'auto'
      },
      selectedImagesList : {
        marginTop: 10,
        paddingBottom: 10,
        gap: 10       
      },

      systemGeneratedMessage: {
        padding: 5,
        borderRadius: 50,
        textAlign: "center",
        alignSelf: "center",
      /*   width: "70%", */
        paddingHorizontal: 15,
        fontSize: 13,
        fontWeight: 300,
        color: colors.LIGHT_TEXT,
        opacity: 0.8,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: colors.LIGHT_COLOR
/*         shadowColor: "#000", 
        shadowOpacity: 0.1, 
        shadowOffset: { width: 0, height: 1 }, 
        elevation: 15 */
/*         color: colors.LIGHT_TEXT_COLOR */
      },
      userMessageContainer: {
/*         borderWidth: 1, */
        flex: 1,
        gap: 5,
      },
      userGeneratedMessageContainer: {
        borderWidth:1,
        marginBottom: 10,
        flexDirection: "row",
        gap: 10,
        alignItems :"flex-start",
      },
      userGeneratedMessage: {
/*         borderWidth: 1, */
/*         borderRadius: 50, */
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
/*         marginRight: 5, */
        padding: 10,
        position: "relative",
        backgroundColor: colors.LIGHT_COLOR,
        color: '#111928',
        alignSelf: "flex-start",  
        maxWidth: "80%",  
      },
      
      username: {
        fontSize: 15,
        fontWeight: 500
      },
      messageTime: {
        color: colors.LIGHT_TEXT,
        fontSize: 12,
        marginLeft: 'auto',
        position: "absolute",
        bottom :2,
        right: -38,
      },
      attachmentImage: {
        width: 200, 
        height: 200, 
        borderRadius: 10,
        resizeMode: "cover", 
        maxWidth: "100%", 
      },
      blockedUserNotice: {
        textAlign : "center",
        padding: 15,
        color: colors.LIGHT_TEXT,
        width: "100%"
      },
      mainAttachmentsContainer : {
        borderWidth: 1,
        borderColor : colors.LIGHT_COLOR,
        padding: 12,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
      },
      mainActionsContainer : {
/*         borderWidth: 1, */
        width: "100%",
        justifyContent: "center",
        gap: 20,
        flexDirection: "row"
      },
      addAttachment: {
        borderColor: colors.BORDER_COLOR,
        flexDirection : "row",
        borderRadius: 5,
        backgroundColor: colors.LIGHT_COLOR,
        alignItems: "center",
        justifyContent: "center",
        width: 150,
        height: 150
    },
    quickActionsContainer: {
/*       borderWidth: 1,
      borderColor: "red", */
      marginLeft: 5,
      flexDirection: "row",
      justifyContent: "space-around",
      gap: 5,
      height: "100%",  
    },
    quickActions: {
      justifyContent: 'center', 
      padding: 2, 
      height:"100%"
    },
    seenText: {
      fontSize: 12,
      color: colors.LIGHT_TEXT
    }

})