import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ProfileHeader from '../../components/ProfileHeader'
import { CustomTextInput } from '../../components/CustomTextInput'
import SendIcon from "../../assets/icons/send-horizontal.svg"
import { colors } from '../../styles/colors'
import CustomButton from '../../components/CustomButton'
import { useKeyboardVisibility } from '../../utils/helpers'
import PaperClip from "../../assets/icons/paper-clip.svg"
import { Dropdown } from 'react-native-element-dropdown'
import ThreeDotsOrange from "../../assets/icons/dots-vertical-orange.svg"
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../types/navigation-types'
import { getGroupMessages, getMessages } from '../../api/network-utils'
import { profilePic } from '../../styles/global-styles'
import { formatDate } from '../../utils/helpers'
import { CustomModal } from '../../components/CustomModal'
import AttachmentCarousel from '../../modals/AttachmentCarousel'
import { NativeStackNavigationProp, NativeStackNavigatorProps } from '@react-navigation/native-stack'
import MuteNotifications from '../../modals/Chat/MuteNotifications'
import Block from '../../modals/Chat/Block'
import Report from '../../modals/Chat/Report'
import DeleteChat from '../../modals/Chat/DeleteChat'
import { chatTypes } from '../../utils/constants'

const chatActions = [
  { label: 'User Info', value: '1' },
  { label: 'Search messages', value: '2' },
  { label: 'Mute notifications', value: '3' },
  { label: 'Add to favorites', value: '4' },
  { label: 'Close chat', value: '5' },
  { label: 'Report', value: '6' },
  { label: 'Block', value: '7' },
  { label: 'Clear chat', value: '8' },
  { label: 'Delete chat', value: '9' },
];

interface DropdownComponentProps {
  chatAction: string | null
  setChatAction: React.Dispatch<React.SetStateAction<string | null>>
}



const DropdownComponent = ({chatAction, setChatAction} : DropdownComponentProps) => {

  return (
    <Dropdown
      style={styles.dropdown}
      data={chatActions}
      mode= "auto"
      placeholder='Group Subject'
      placeholderStyle={{color: "black", fontWeight: 300}}
      itemTextStyle={{color: "black", textAlign :"right"}}
      containerStyle={{
        borderRadius: 5,
        width: "50%",
        marginHorizontal: "-50%",
        right: 0,
        shadowColor: "#000", 
        shadowOpacity: 0.1, 
        shadowRadius: 5, 
        shadowOffset: { width: 0, height: 4 }, 
        elevation: 5,
      }}
      onFocus={() => setChatAction(null)}
      maxHeight={300}
      labelField="label"
      valueField="value"
      value={chatAction}
      onChange={item => {
        setTimeout(() => {
          setChatAction(item.value);
        }, 0);
      }}
        renderRightIcon={() => (
        <View style={styles.iconStyle}><ThreeDotsOrange width={18} height={18} /></View>
      )}
    />
  );
};

export type ChatsScreenRouteProp = RouteProp<RootStackParamList, "ChatScreen">

export default function ChatScreen() {
    
  const [chats, setChats] = useState<ChatMessage[]>([]) 
  const [message, setMessage] = useState("")
  const [userBlocked, setUserBlocked] = useState(true)
  const [chatAction, setChatAction] = useState<string | null>(null);
  const [viewingAttachment, setViewingAttachment] = useState(false)
  const [attachment, setAttachment] = useState<string | null>(null)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const route = useRoute<ChatsScreenRouteProp>()
  const {userUUID, chatMasterUUID, chatProfilePictureURL, chatMasterName, chatType, chatMemberUserUUID} = route.params || {}
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  console.log(chatMasterUUID)
  useKeyboardVisibility(() => setIsKeyboardVisible(true), () => setIsKeyboardVisible(false))



  useEffect(() => {

    if(chatAction === "1") {
      navigation.navigate("ChatInfo", {chatMasterUUID: chatMasterUUID, chatType: chatType })
    }

  }, [chatAction])

  useEffect(() => {

    const fetchChats = async() => {

      let messagesResponse = undefined

      if(chatType === chatTypes.PRIVATE) {
        messagesResponse = await getMessages(userUUID, chatMasterUUID)
      } else {
        messagesResponse = await getGroupMessages(userUUID, chatMasterUUID)
      }

      console.log(messagesResponse.Messages)
      setChats(messagesResponse.Messages)

    }
  

    fetchChats()
    
    if(userBlocked) {
      chatActions.map((eachAction) => {
        if(eachAction.label === "Block") {
          eachAction.label = "Unblock"
        }
      })
    }

  }, [])


  const renderMessage = ({ item }: { item: ChatMessage }) => {

    if (!item.Message?.trim() && !item.Attachment) {
      return null; 
    }

    if (item.MessageType === "system-generated") {
      return <Text style={styles.systemGeneratedMessage}>{item.Message}</Text>;
    } else if (item.MessageType === "user-generated") {
      return ( 
        <View style={styles.userGeneratedMessageContainer}>
          <Image style={profilePic} source={{uri: chatProfilePictureURL || "https://i.pravatar.cc/150"}} />
          <View style={styles.userMessageContainer}>
            <Text style={styles.username}>{chatMasterName}</Text>
            <TouchableOpacity style={[styles.userGeneratedMessage, item.Attachment ? {padding : 5} : null]}>
              {item.Attachment ? (
                <TouchableOpacity onPress={() => {setAttachment(item.Attachment);setViewingAttachment(true)}}>
                  <Image
                    style={styles.attachmentImage}
                    source={{ uri: item.Attachment }}
                  />
                </TouchableOpacity>
              
              ) : null}
              
              {item.Message === "" ? null : <Text /* style={styles.userGeneratedMessage} */>{item.Message}</Text>}
                  <Text style={styles.messageTime}> {formatDate(item.Timestamp, true)}</Text>
            </TouchableOpacity>
        
 
          </View>

        </View>
      )
    } else {
      return null
    }
  };
  



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProfileHeader onPress={() => navigation.navigate("ChatInfo", {chatMasterUUID: chatMasterUUID, chatType: chatType })} ProfilePic={chatProfilePictureURL ?? undefined} showStatus goBack online noDate name={chatMasterName} showMemberActions  />
        <DropdownComponent chatAction={chatAction} setChatAction={setChatAction} />
      </View>
      


      <FlatList
        style={{marginBottom: 70}}
        contentContainerStyle={styles.chatHistoryList}
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
      />


     <View style={[styles.messageFieldContainer, {paddingBottom: isKeyboardVisible ? 0 : 20}]}>
        {userBlocked ? <Text style={styles.blockedUserNotice}>Can't send a message to blocked users</Text> : <>
          <CustomButton onPress={() => {}} icon={<PaperClip width={20} height={20} />} />
          <CustomTextInput placeholder='Write a message' placeholderTextColor={colors.LIGHT_TEXT_COLOR} inputStyle={styles.messageField} value={message} onChangeText={(e) => setMessage(e)} />
          <CustomButton onPress={() => {}}icon={<SendIcon width={30} height={30} strokeWidth={1} fill={message ? colors.ACTIVE_ORANGE : "grey"} stroke={message ? "white" : "white"} />} /> 
        </>}
     </View>

    <CustomModal isOpen={viewingAttachment} onClose={() => setViewingAttachment(false)}>
      <AttachmentCarousel Attachment={attachment} onClose={() => setViewingAttachment(false)} />
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
      messageFieldContainer: {
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingTop:5,
        borderTopWidth: 1,
        borderTopColor: colors.BORDER_COLOR,
      },
    messageField: {
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


      systemGeneratedMessage: {
        padding: 5,
        borderRadius: 50,
        textAlign: "center",
        alignSelf: "center",
        width: "60%",
        fontSize: 14,
        fontWeight: 300,
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
     /*    borderWidth:1, */
        marginBottom: 10,
        flexDirection: "row",
        gap: 10,
        alignItems :"flex-start",
      },
      userGeneratedMessage: {
  /*       borderWidth: 1, */
        borderRadius: 10,
        marginRight: 5,
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
      }
})