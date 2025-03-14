import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors';
import { CustomTextInput } from '../../components/CustomTextInput';
import SearchIcon from "../../assets/icons/search.svg"

export default function ChatScreen() {

  const [chats,setChats] = useState<ChatEntity[]>([
    {
      ChatMasterId: 1,
      ChatMasterUUID: "123e4567-e89b-12d3-a456-426614174000",
      ChatMasterName: "General Chat",
      ChatTypeUUID: "987e6543-e21b-45c9-b567-123456789abc",
      ChatTypeCode: "GROUP",
      ChatProfilePictureURL: "https://i.pravatar.cc/150",
      ChatMemberUserUUID: "789e4567-e12b-67d3-b789-567891234000",
      ChatMemberUserName: "john_doe",
      ChatMemberFirstName: "John",
      ChatMemberLastName: "Doe"
    },
    {
      ChatMasterId: 2,
      ChatMasterUUID: "234e5678-e89b-23d3-a567-526614174111",
      ChatMasterName: "Work Discussion",
      ChatTypeUUID: "876e5432-e21b-34c9-b678-234567890bcd",
      ChatTypeCode: "DIRECT",
      ChatProfilePictureURL: "https://i.pravatar.cc/150",
      ChatMemberUserUUID: "890e5678-e23b-78d3-b890-678901234111",
      ChatMemberUserName: "jane_doe",
      ChatMemberFirstName: "Jane",
      ChatMemberLastName: "Doe"
    },
    {
      ChatMasterId: 3,
      ChatMasterUUID: "345e6789-e89b-34d3-a678-626614174222",
      ChatMasterName: "Project Alpha",
      ChatTypeUUID: "765e4321-e21b-23c9-b789-345678901cde",
      ChatTypeCode: "GROUP",
      ChatProfilePictureURL: "https://i.pravatar.cc/150",
      ChatMemberUserUUID: "901e6789-e34b-89d3-b901-789012345222",
      ChatMemberUserName: "mike_smith",
      ChatMemberFirstName: "Mike",
      ChatMemberLastName: "Smith"
    },
    {
      ChatMasterId: 4,
      ChatMasterUUID: "456e7890-e89b-45d3-a789-726614174333",
      ChatMasterName: "Marketing Team",
      ChatTypeUUID: "654e3210-e21b-12c9-b890-456789012def",
      ChatTypeCode: "GROUP",
      ChatProfilePictureURL: "https://i.pravatar.cc/150",
      ChatMemberUserUUID: "012e7890-e45b-90d3-b012-890123456333",
      ChatMemberUserName: "sarah_jones",
      ChatMemberFirstName: "Sarah",
      ChatMemberLastName: "Jones"
    },
    {
      ChatMasterId: 5,
      ChatMasterUUID: "567e8901-e89b-56d3-a890-826614174444",
      ChatMasterName: "Developers Hub",
      ChatTypeUUID: "543e2109-e21b-01c9-b901-567890123fgh",
      ChatTypeCode: "GROUP",
      ChatProfilePictureURL: "https://i.pravatar.cc/150",
      ChatMemberUserUUID: "123e8901-e56b-01d3-b123-901234567444",
      ChatMemberUserName: "chris_wilson",
      ChatMemberFirstName: "Chris",
      ChatMemberLastName: "Wilson"
    },
    {
      ChatMasterId: 6,
      ChatMasterUUID: "678e9012-e89b-67d3-a901-926614174555",
      ChatMasterName: "Support Team",
      ChatTypeUUID: "432e1098-e21b-90c9-b012-678901234ghi",
      ChatTypeCode: "DIRECT",
      ChatProfilePictureURL: "https://i.pravatar.cc/150",
      ChatMemberUserUUID: "234e9012-e67b-12d3-b234-012345678555",
      ChatMemberUserName: "lisa_brown",
      ChatMemberFirstName: "Lisa",
      ChatMemberLastName: "Brown"
    },
    {
      ChatMasterId: 7,
      ChatMasterUUID: "789e0123-e89b-78d3-a012-026614174666",
      ChatMasterName: "Gaming Chat",
      ChatTypeUUID: "321e0987-e21b-89c9-b123-789012345jkl",
      ChatTypeCode: "GROUP",
      ChatProfilePictureURL: "https://i.pravatar.cc/150",
      ChatMemberUserUUID: "345e0123-e78b-23d3-b345-123456789666",
      ChatMemberUserName: "alex_martin",
      ChatMemberFirstName: "Alex",
      ChatMemberLastName: "Martin"
    },
    {
      ChatMasterId: 8,
      ChatMasterUUID: "890e1234-e89b-89d3-a123-126614174777",
      ChatMasterName: "Freelancers Network",
      ChatTypeUUID: "210e9876-e21b-78c9-b234-890123456mno",
      ChatTypeCode: "GROUP",
      ChatProfilePictureURL: "https://i.pravatar.cc/150",
      ChatMemberUserUUID: "456e1234-e89b-34d3-b456-234567890777",
      ChatMemberUserName: "emma_white",
      ChatMemberFirstName: "Emma",
      ChatMemberLastName: "White"
    },
    {
      ChatMasterId: 9,
      ChatMasterUUID: "901e2345-e89b-90d3-a234-226614174888",
      ChatMasterName: "Tech Support",
      ChatTypeUUID: "109e8765-e21b-67c9-b345-901234567pqr",
      ChatTypeCode: "DIRECT",
      ChatProfilePictureURL: "https://i.pravatar.cc/150",
      ChatMemberUserUUID: "567e2345-e90b-45d3-b567-345678901888",
      ChatMemberUserName: "noah_hall",
      ChatMemberFirstName: "Noah",
      ChatMemberLastName: "Hall"
    },
    {
      ChatMasterId: 10,
      ChatMasterUUID: "012e3456-e89b-01d3-a345-326614174999",
      ChatMasterName: "Business Networking",
      ChatTypeUUID: "098e7654-e21b-56c9-b456-012345678stu",
      ChatTypeCode: "GROUP",
      ChatProfilePictureURL: "https://i.pravatar.cc/150",
      ChatMemberUserUUID: "678e3456-e01b-56d3-b678-456789012999",
      ChatMemberUserName: "olivia_scott",
      ChatMemberFirstName: "Olivia",
      ChatMemberLastName: "Scott"
    },
    {
      ChatMasterId: 11,
      ChatMasterUUID: "123e4567-e89b-12d3-a456-426614175000",
      ChatMasterName: "Investors Chat",
      ChatTypeUUID: "087e6543-e21b-45c9-b567-123456789vwx",
      ChatTypeCode: "DIRECT",
      ChatProfilePictureURL: "https://i.pravatar.cc/150",
      ChatMemberUserUUID: "789e4567-e12b-67d3-b789-567891234000",
      ChatMemberUserName: "david_king",
      ChatMemberFirstName: "David",
      ChatMemberLastName: "King"
    },
    {
      ChatMasterId: 12,
      ChatMasterUUID: "234e5678-e89b-23d3-a567-526614175111",
      ChatMasterName: "Startup Founders",
      ChatTypeUUID: "076e5432-e21b-34c9-b678-234567890yz",
      ChatTypeCode: "GROUP",
      ChatProfilePictureURL: "https://i.pravatar.cc/150",
      ChatMemberUserUUID: "890e5678-e23b-78d3-b890-678901234111",
      ChatMemberUserName: "sophia_adams",
      ChatMemberFirstName: "Sophia",
      ChatMemberLastName: "Adams"
    }
  ])

const renderChatItem = ({ item }: { item: ChatEntity }) => {
  return (
    <TouchableOpacity style={styles.chatItem} onPress={() => {}}>
      <Image style={styles.chatMemberProfilePic} source={{ uri: item.ChatProfilePictureURL }} />
      <View style={styles.mainChatDetailsContainer}>
        <View style={styles.chatDetailsContainer}>
          <Text style={styles.chatMemberName}>{item.ChatMemberUserName}</Text>
          <Text style={styles.chatTime}>12:00</Text>
        </View>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.latestText}>Lo Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore molestiae neque quos, ad reiciendis ipsa nulla architecto iure, ex voluptatem perferendis, numquam molestias. Numquam facere dolorem doloremque tenetur provident? Debitis!
        Repudiandae assumenda optio doloribus a consequuntur cupiditate! Fuga voluptates, dolorum perferendis sint omnis vero assumenda, rerum voluptate ratione consequuntur hic quisquam! Quasi soluta est iste at, quo tempora id? Veritatis?rem ipsum,lorem dolor</Text>
      </View>
    </TouchableOpacity>
  );
};

  return (
    <View>
      <FlatList
        ListHeaderComponent={
        <>
          <CustomTextInput value='' leftIcon={<SearchIcon opacity={0.7} />} inputStyle={styles.searchField} onChangeText={() => {}} placeholder='Search messages or contact' />
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

const styles = StyleSheet.create({
  chatList: {
    gap: 0
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
    fontWeight: 500
  },
  searchField: {
    backgroundColor: "red",
/*     flex: 1, */
    width: "90%",
    marginHorizontal: "5%",
    borderRadius: 50,
    paddingLeft: 50
  }
})