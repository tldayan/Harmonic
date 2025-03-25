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
import { getMessages } from '../../api/network-utils'
import { profilePic } from '../../styles/global-styles'
import { formatDate } from '../../utils/helpers'
import { CustomModal } from '../../components/CustomModal'
import AttachmentCarousel from '../../modals/AttachmentCarousel'
import { NativeStackNavigationProp, NativeStackNavigatorProps } from '@react-navigation/native-stack'

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
        setChatAction(item.value);
      }}
        renderRightIcon={() => (
        <View style={styles.iconStyle}><ThreeDotsOrange width={18} height={18} /></View>
      )}
    />
  );
};

export type ChatsScreenRouteProp = RouteProp<RootStackParamList, "ChatScreen">

export default function ChatScreen() {
    
  const [chats, setChats] = useState<ChatMessage[]>([
    {
        "id": "1",
        "SenderUUID": "1ac7b702-c147-11ef-b36c-42010a400004",
        "Message": "Hey, did you check the new design updates I sent earlier?",
        "MessageType": "user-generated",
        "Attachment": "",
        "AttachmentType": "",
        "Timestamp": "2024-12-24T10:15:30.537Z",
        "Status": {
            "DeliveredTo": [],
            "ReadBy": ["a99cc57c-c12d-11ef-b36c-42010a400004"]
        },
        "UserUUID": "2ff929c1-e3db-11ef-bdd1-42010a400005"
    },
    {
        "id": "2",
        "SenderUUID": "2ff929c1-e3db-11ef-bdd1-42010a400005",
        "Message": "Yes, I really liked the color scheme. It gives a more modern feel to the app.",
        "MessageType": "user-generated",
        "Attachment": "",
        "AttachmentType": "",
        "Timestamp": "2024-12-24T10:16:00.123Z",
        "Status": {
            "DeliveredTo": [],
            "ReadBy": ["1ac7b702-c147-11ef-b36c-42010a400004"]
        },
        "UserUUID": "1ac7b702-c147-11ef-b36c-42010a400004"
    },
    {
        "id": "3",
        "SenderUUID": "1ac7b702-c147-11ef-b36c-42010a400004",
        "Message": "",
        "MessageType": "user-generated",
        "Attachment": "https://firebasestorage.googleapis.com/v0/b/harmonicdevapp.appspot.com/o/uploads%2Fchat%2FmessageAttachment%2F1735034147273_Autobiography.webp?alt=media&token=afeaf2d6-f6df-4451-9e23-7ece4262f1e9",
        "AttachmentType": "image/webp",
        "Timestamp": "2024-12-24T10:18:45.999Z",
        "Status": {
            "DeliveredTo": [],
            "ReadBy": []
        },
        "UserUUID": "2ff929c1-e3db-11ef-bdd1-42010a400005"
    },
    {
        "id": "4",
        "SenderUUID": "2ff929c1-e3db-11ef-bdd1-42010a400005",
        "Message": "That looks great! Can we maybe add some animations for better user engagement?",
        "MessageType": "user-generated",
        "Attachment": "",
        "AttachmentType": "",
        "Timestamp": "2024-12-24T10:20:10.847Z",
        "Status": {
            "DeliveredTo": [],
            "ReadBy": []
        },
        "UserUUID": "1ac7b702-c147-11ef-b36c-42010a400004"
    },
    {
        "id": "5",
        "SenderUUID": "",
        "Message": "John joined the group chat",
        "MessageType": "system-generated",
        "Attachment": null,
        "AttachmentType": null,
        "Timestamp": "2024-12-24T10:25:00.000Z",
        "Status": {
            "DeliveredTo": [],
            "ReadBy": ["1ac7b702-c147-11ef-b36c-42010a400004"]
        },
        "UserUUID": "2ff929c1-e3db-11ef-bdd1-42010a400005"
    },
    {
        "id": "6",
        "SenderUUID": "2ff929c1-e3db-11ef-bdd1-42010a400005",
        "Message": "Welcome, John! We were just discussing the UI updates for the app. Feel free to share your thoughts!, Welcome, John! We were just discussing the UI updates for the app. Feel free to share your thoughts!",
        "MessageType": "user-generated",
        "Attachment": "",
        "AttachmentType": "",
        "Timestamp": "2024-12-24T10:26:30.214Z",
        "Status": {
            "DeliveredTo": [],
            "ReadBy": ["1ac7b702-c147-11ef-b36c-42010a400004"]
        },
        "UserUUID": "1ac7b702-c147-11ef-b36c-42010a400004"
    },
    {
        "id": "7",
        "SenderUUID": "1ac7b702-c147-11ef-b36c-42010a400004",
        "Message": "",
        "MessageType": "user-generated",
        "Attachment": "https://firebasestorage.googleapis.com/v0/b/harmonicdevapp.appspot.com/o/uploads%2Fchat%2FmessageAttachment%2F1735034147273_Autobiography.webp?alt=media&token=afeaf2d6-f6df-4451-9e23-7ece4262f1e9",
        "AttachmentType": "video/mp4",
        "Timestamp": "2024-12-24T10:30:00.537Z",
        "Status": {
            "DeliveredTo": [],
            "ReadBy": []
        },
        "UserUUID": "2ff929c1-e3db-11ef-bdd1-42010a400005"
    },
    {
        "id": "8",
        "SenderUUID": "2ff929c1-e3db-11ef-bdd1-42010a400005",
        "Message": "Nice! The transitions look very smooth. I love how it flows from one screen to another.",
        "MessageType": "user-generated",
        "Attachment": "",
        "AttachmentType": "",
        "Timestamp": "2024-12-24T10:31:15.920Z",
        "Status": {
            "DeliveredTo": [],
            "ReadBy": []
        },
        "UserUUID": "1ac7b702-c147-11ef-b36c-42010a400004"
    },
    {
        "id": "9",
        "SenderUUID": "1ac7b702-c147-11ef-b36c-42010a400004",
        "Message": "Let's finalize the layout today so we can move to the backend integrations tomorrow.",
        "MessageType": "user-generated",
        "Attachment": "",
        "AttachmentType": "",
        "Timestamp": "2024-12-24T10:35:45.637Z",
        "Status": {
            "DeliveredTo": [],
            "ReadBy": []
        },
        "UserUUID": "2ff929c1-e3db-11ef-bdd1-42010a400005"
    },
    {
        "id": "10",
        "SenderUUID": "2ff929c1-e3db-11ef-bdd1-42010a400005",
        "Message": "Agreed! I'll share the API documentation in a bit.",
        "MessageType": "user-generated",
        "Attachment": "",
        "AttachmentType": "",
        "Timestamp": "2024-12-24T10:37:00.721Z",
        "Status": {
            "DeliveredTo": [],
            "ReadBy": []
        },
        "UserUUID": "1ac7b702-c147-11ef-b36c-42010a400004"
    },
    {
        "id": "11",
        "SenderUUID": "1ac7b702-c147-11ef-b36c-42010a400004",
        "Message": "",
        "MessageType": "user-generated",
        "Attachment": "https://firebasestorage.googleapis.com/v0/b/harmonicdevapp.appspot.com/o/uploads%2Fchat%2FmessageAttachment%2F1735034147273_Autobiography-2.jpg?alt=media&token=5e1a97b0-e3d5-45e1-8546-cab43ab66ea6",
        "AttachmentType": "application/pdf",
        "Timestamp": "2024-12-24T10:40:10.123Z",
        "Status": {
            "DeliveredTo": [],
            "ReadBy": []
        },
        "UserUUID": "2ff929c1-e3db-11ef-bdd1-42010a400005"
    }
]
) 
  const [message, setMessage] = useState("")
  const [chatAction, setChatAction] = useState<string | null>(null);
  const [viewingAttachment, setViewingAttachment] = useState(false)
  const [attachment, setAttachment] = useState<string | null>(null)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const route = useRoute<ChatsScreenRouteProp>()
  const {userUUID, chatMasterUUID, chatProfilePictureURL, chatMasterName, chatType} = route.params || {}
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  useKeyboardVisibility(() => setIsKeyboardVisible(true), () => setIsKeyboardVisible(false))


  useEffect(() => {

    if(chatAction === "1") {
      navigation.navigate("ChatInfo", {chatMasterUUID: chatMasterUUID, chatType: chatType })
    }

  }, [chatAction])

/*   useEffect(() => {

    const fetchChats = async() => {

      const messagesResponse = await getMessages(userUUID, chatMasterUUID)
      console.log(messagesResponse.Messages)
      setChats(messagesResponse.Messages)

    }
    
    fetchChats()

  }, []) */


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
        <ProfileHeader onPress={() => {}} ProfilePic={chatProfilePictureURL ?? undefined} showStatus goBack online noDate name={chatMasterName} showMemberActions  />
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
        <CustomButton onPress={() => {}} icon={<PaperClip width={20} height={20} />} />
        <CustomTextInput placeholder='Write a message' placeholderTextColor={colors.LIGHT_TEXT_COLOR} inputStyle={styles.messageField} value={message} onChangeText={(e) => setMessage(e)} />
        <CustomButton onPress={() => {}}icon={<SendIcon width={30} height={30} strokeWidth={1} fill={message ? colors.ACTIVE_ORANGE : "grey"} stroke={message ? "white" : "white"} />} /> 
     </View>

    <CustomModal isOpen={viewingAttachment} onClose={() => setViewingAttachment(false)}>
      <AttachmentCarousel Attachment={attachment} onClose={() => setViewingAttachment(false)} />
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
        paddingTop: 10,
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
        fontWeight: 200,
        opacity: 0.8,
        backgroundColor: "white",
        shadowColor: "#000", 
        shadowOpacity: 0.1, 
        shadowOffset: { width: 0, height: 1 }, 
        elevation: 15
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
      
})