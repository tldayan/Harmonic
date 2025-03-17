import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors';
import { CustomTextInput } from '../../components/CustomTextInput';
import SearchIcon from "../../assets/icons/search.svg"
import { getChatsList } from '../../api/network-utils';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import ThreeDots from "../../assets/icons/three-dots-vertical.svg"
import {Dropdown} from "react-native-element-dropdown"

const actions = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
];


const DropdownComponent = () => {
  const [value, setValue] = useState(null);

  return (
    <Dropdown
      style={styles.dropdown}
      data={actions}
      mode= "auto"
/*       itemTextStyle={{color: "red"}} */
      containerStyle={{
        width: "90%",
        marginHorizontal: "5%",
        top: 0,
        left: "auto",
        right: 0,}}
      maxHeight={300}
      labelField="label"
      valueField="value"
      value={value}
      onChange={item => {
        setValue(item.value);
      }}
      // USE ABSOLUTE POSITIONING FOR THREEDOTS ICON
      /* renderRightIcon={() => (
        <CustomButton icon={<ThreeDots width={15} height={15} />} onPress={() => {}}/>
      )} */
    />
  );
};

const ChatsList = () => {

  const [chats, setChats] = useState<ChatEntity[]>([])
  const [chatSearch, setChatSearch] = useState("")
  const [editing, setEditing] = useState(false)
  const userUUID = useSelector((state: RootState) => state.auth.userUUID)

  

  useEffect(() => {

    const fetchChats = async() => {
      const chatsResponse = await getChatsList(userUUID)
      setChats(chatsResponse)
    }

    fetchChats()

  }, [])

const renderChatItem = ({ item }: { item: ChatEntity }) => {
  return (
    <TouchableOpacity style={styles.chatItem} onPress={() => {}}>
      <Image style={styles.chatMemberProfilePic} source={{ uri: item.ChatProfilePictureURL ?? "https://i.pravatar.cc/150" }} />
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
          <DropdownComponent />
          </View>
   
    
          <ScrollView contentContainerStyle={styles.chatCategoryButtonsContainer}>
            <CustomButton buttonStyle={styles.chatCategoryButton} textStyle={styles.chatCategory} onPress={() => {}} title={"All"} />
            <CustomButton buttonStyle={styles.chatCategoryButton} textStyle={styles.chatCategory} onPress={() => {}} title={"Unread"} />
            <CustomButton buttonStyle={styles.chatCategoryButton} textStyle={styles.chatCategory} onPress={() => {}} title={"Groups"} />
            <CustomButton buttonStyle={styles.chatCategoryButton} textStyle={styles.chatCategory} onPress={() => {}} title={"Starred"} />
          </ScrollView>
        </>
        }
        contentContainerStyle={styles.chatList} 
        data={chats} renderItem={renderChatItem} 
        keyExtractor={(item) => item.ChatMasterUUID} />
    </View>
  )
}

export default ChatsList


const styles = StyleSheet.create({
  chatList: {
/*     borderWidth: 1, */
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
    gap: 10,
    width:"96%",
    marginHorizontal: "2%",
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
    position: "relative",
    flexDirection: "row",
/*     borderWidth :2, */
    margin: 16,
    width : "10%",
    marginLeft: "auto",
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
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
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

})