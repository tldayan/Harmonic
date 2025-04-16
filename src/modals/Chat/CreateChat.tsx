import { ActivityIndicator, Alert, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ModalsHeader from '../ModalsHeader'
import { CustomTextInput } from '../../components/CustomTextInput'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import ProfileHeader from '../../components/ProfileHeader'
import Check from "../../assets/icons/circle-check.svg"
import ChevronRight from "../../assets/icons/chevron-right.svg"
import { getOrganizationUsers, inviteMembersToChat } from '../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { STATUS_CODE } from '../../api/endpoints'

interface CreateChatProps {
    onClose: () => void
    fetchChats: () => void
}

const width = Dimensions.get("window").width

export default function CreateChat({onClose, fetchChats}: CreateChatProps) {

  const [memberSearch, setMemberSearch] = useState("")
  const [chatMember, setChatMember] = useState<string>("");
  const [loading, setLoading] = useState(false)
  const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([])
  const {userUUID, organizationUUID} = useSelector((state: RootState) => state.auth)


  

  const fetchOrganizationUsers = async() => {
    
    setLoading(true)
    try {
      const organizationUsersList = await getOrganizationUsers(organizationUUID, memberSearch)
      setOrganizationUsers(organizationUsersList.Payload)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  
 useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrganizationUsers();
    }, 500);
  
    return () => clearTimeout(timeoutId);
  }, [memberSearch]);


  const startChat = async() => {
    setLoading(true)
    try {
        const inviteMembersToChatResponse = await inviteMembersToChat(userUUID, organizationUUID, [chatMember])
        console.log(inviteMembersToChatResponse)
        if(inviteMembersToChatResponse.Status === STATUS_CODE.SUCCESS) {
            fetchChats()
            onClose()
        }
    } catch (err) {
        console.log(err)
    } finally {
        setLoading(false)
    }

  }

  const memberItem = ({item} : {item: OrganizationUser}) => {

    return <TouchableOpacity style={styles.memberItemContainer} onPress={() => setChatMember(item.UserUUID)}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <ProfileHeader noDate ProfilePic={item.ProfilePicURL} name={item.FullName} />
                </View>
                
                {chatMember === item.UserUUID && <Check style={styles.checkLogo} fill={colors.ACTIVE_ORANGE} stroke='white' width={20} height={20} />}
            </TouchableOpacity>
  }




  return (
    <SafeAreaView style={styles.container}>
        <ModalsHeader onClose={onClose} title={"New Chat"} />

        <View style={styles.innerContainer}>
            <Text style={styles.memberTitle}>Members</Text>
            <View style={styles.selectedMembersContainer}>
                <CustomTextInput inputStyle={styles.memberSearchField} placeholderTextColor={colors.LIGHT_TEXT} value={memberSearch} placeholder='Search members to add' onChangeText={(e) => setMemberSearch(e)} />
            </View>
            {loading && <ActivityIndicator style={{marginTop: "50%"}} size={"small"} />}
            <FlatList
                contentContainerStyle={styles.friendList}
                renderItem={memberItem} 
                keyExtractor={(item) => item.UserUUID}
                data={organizationUsers}
            />
        </View>

        {chatMember && <CustomButton onPress={startChat} buttonStyle={{position: "absolute", bottom: "5%", right: "10%"}} title={""} icon={loading ? <ActivityIndicator size="large" color={colors.ACTIVE_ORANGE} /> : <ChevronRight fill={colors.ACTIVE_ORANGE} stroke='white'  width={60} height={60}/>} />}
        
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

    container : {
        flex: 1,
/*         borderWidth: 2 */
    },
    innerContainer : {
/*         borderWidth: 2, */
        padding: 16,
        width: width
/*         flex: 1, */
/*         borderWidth: 2, */
    },
    friendList: {
        marginTop: 30,
        gap: 15,
        paddingHorizontal: 10,
        borderWidth: 2,
    },
    mainCreateGroupForm: {
/*         borderWidth: 1, */
    },
    memberTitle: {
        color: colors.ACTIVE_ACCENT_COLOR
    },
    member : {
        flexDirection: "row-reverse",
        alignItems: 'center',
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    selectedMembers: {
        flexDirection: "row-reverse",
        gap: 5,
        alignItems: "center",
        borderRadius: 50,
        backgroundColor : colors.LIGHT_COLOR,
        paddingHorizontal: 15,
        paddingVertical: 4,
        height: 30
    },
    selectedMembersContainer: {
/*         borderWidth: 1, */
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        paddingTop: 10,
        paddingBottom:5,
        borderBottomWidth: 2,
        borderBottomColor: colors.ACTIVE_ACCENT_COLOR
    },
    memberSearchField : {
/*         borderWidth: 2, */
        flex: 1
 /*        width: 250 */
    },
    memberItemContainer : {
       /*  borderWidth: 1, */
        position: "relative",
        padding: 5
    },
    checkLogo : {
        position: "absolute",
        bottom: 0,
        left: 0
    },

})