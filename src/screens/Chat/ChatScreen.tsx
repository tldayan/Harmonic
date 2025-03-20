import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ProfileHeader from '../../components/ProfileHeader'
import { CustomTextInput } from '../../components/CustomTextInput'
import SendIcon from "../../assets/icons/send-horizontal.svg"
import { colors } from '../../styles/colors'
import CustomButton from '../../components/CustomButton'
import { useKeyboardVisibility } from '../../utils/helpers'
import PaperClip from "../../assets/icons/paper-clip.svg"

export default function ChatScreen() {
    
  const [chats, setChats] = useState([]) 
  const [message, setMessage] = useState("")
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)


  useKeyboardVisibility(() => setIsKeyboardVisible(true), () => setIsKeyboardVisible(false))

  return (
    <View style={styles.container}>
      <ProfileHeader onPress={() => {}} showStatus goBack online noDate name='Mark' />

      <FlatList
        contentContainerStyle={styles.chatHistoryList}
        data={chats}
        keyExtractor={(item) => item.ChatUUID}
        renderItem={() => {}}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      />


     <View style={[styles.messageFieldContainer, {paddingBottom: isKeyboardVisible ? 0 : 20}]}>
        <CustomButton onPress={() => {}} icon={<PaperClip width={20} height={20} />} />
        <CustomTextInput placeholder='Write a message' placeholderTextColor={colors.LIGHT_TEXT_COLOR} inputStyle={styles.messageField} value={message} onChangeText={(e) => setMessage(e)} />
        <CustomButton onPress={() => {}}icon={<SendIcon width={30} height={30} strokeWidth={1} fill={message ? colors.ACTIVE_ORANGE : "grey"} stroke={message ? "white" : "white"} />} /> 
     </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
      /*   borderWidth: 2, */
        backgroundColor: "#FFFFFF",
      },
      chatHistoryList: {
        flex: 1,
     /*    borderWidth: 2, */
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
})