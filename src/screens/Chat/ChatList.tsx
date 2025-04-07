import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors';
import { CustomTextInput } from '../../components/CustomTextInput';
import SearchIcon from "../../assets/icons/search.svg"
import { getChatsList } from '../../api/network-utils';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { CustomModal } from '../../components/CustomModal';
import CreateGroup from '../../modals/Chat/CreateGroup';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation-types';
import { ChatListDropdownComponent } from '../../dropdowns/ChatListDropdown';


const ChatsList = () => {
  const [chats, setChats] = useState<ChatEntity[]>([])
  const [chatSearch, setChatSearch] = useState("")
  const userUUID = useSelector((state: RootState) => state.auth.userUUID)
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  useEffect(() => {

    const fetchChats = async() => {

      setLoading(true)
      try {
        const chatsResponse = await getChatsList(userUUID)
        console.log(chatsResponse)
        setChats(chatsResponse)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  
    fetchChats()

  }, [])

const renderChatItem = ({ item }: { item: ChatEntity }) => {
  return (
    <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate("ChatScreen", {userUUID: userUUID , chatMasterUUID: item.ChatMasterUUID, chatProfilePictureURL: item.ChatProfilePictureURL, chatMasterName: item.ChatMasterName, chatType: item.ChatTypeCode, chatMemberUserUUID: item.ChatMemberUserUUID})}>
      <Image style={styles.chatMemberProfilePic} source={{ uri: item.ChatProfilePictureURL ? item.ChatProfilePictureURL : "https://i.pravatar.cc/150" }} />
      <View style={styles.mainChatDetailsContainer}>
        <View style={styles.chatDetailsContainer}>
          <Text style={styles.chatMemberName}>{item.ChatMasterName}</Text>
          <Text style={styles.chatTime}>12:00</Text>
        </View>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.latestText}>Lo Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore molestiae neque quos, ad reiciendis ipsa nulla architecto iure, ex voluptatem perferendis, numquam molestias. Numquam facere dolorem doloremque tenetur provident? Debitis!
        Repudiandae assumenda optio doloribus a consequuntur cupiditate! Fuga voluptates, dolorum perferendis sint omnis vero assumenda, rerum voluptate ratione consequuntur hic quisquam! Quasi soluta est iste at, quo tempora id? Veritatis?rem ipsum,lorem dolor</Text>
      </View>
    </TouchableOpacity>
  );
};


  return (
    <View style={{backgroundColor: "white"}}>
      <FlatList
        ListHeaderComponent={
        <>

          <View style={styles.mainSearchFieldContainer}>
            <CustomTextInput value={chatSearch} leftIcon={<SearchIcon opacity={0.5} />} mainInputStyle={styles.searchFieldContainer} inputStyle={styles.searchField} onChangeText={(e) => setChatSearch(e)} placeholder='Search messages or contact' />
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
        ListFooterComponent={
          <>
            {loading ? <ActivityIndicator style={{marginTop: 50}} size="small" /> : null}
          </>
        }
        contentContainerStyle={styles.chatList} 
        data={chats}
        renderItem={renderChatItem} 
        keyExtractor={(item) => item.ChatMasterUUID} 
      />

      <CustomModal presentationStyle="overFullScreen" fullScreen isOpen={action === "1"}>
        <CreateGroup onClose={() => setAction(null)} />
      </CustomModal>


    </View>
  )
}

export default ChatsList


const styles = StyleSheet.create({
  chatList: {
/*     borderWidth: 1, */
    position: "relative",
    height: "100%",
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
    paddingLeft: 50
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
})