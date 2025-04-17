import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { act, useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import CustomButton from '../../components/CustomButton'
import ChevronLeft from "../../assets/icons/chevron-left.svg"
import { getGroupDetails } from '../../api/network-utils'
import { RootStackParamList } from '../../types/navigation-types'
import ProfileHeader from '../../components/ProfileHeader'
import Trash from "../../assets/icons/trash.svg"
import ThumbsDown from "../../assets/icons/thumbs-down.svg"
import XCircle from "../../assets/icons/x-circle.svg"
import { colors } from '../../styles/colors'
import AddMember from "../../assets/icons/add-member.svg"
import { CustomModal } from '../../components/CustomModal'
import CreateGroup from '../../modals/Chat/CreateGroup'
import { chatTypes, MEMBER_ROLES } from '../../utils/constants'
import Block from '../../modals/Chat/Block'
import Report from '../../modals/Chat/Report'
import Lock from "../../assets/icons/lock.svg"
import Group from "../../assets/icons/group.svg"
import { GroupMemberDropdownComponent } from '../../dropdowns/GroupMemberDropdown'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { SafeAreaView } from 'react-native-safe-area-context'

export type ChatInfoScreenRouteProp = RouteProp<RootStackParamList, "ChatInfo">

export default function ChatInfo() {

  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [addingMembers, setAddingMembers] = useState(false)
  const [members, setMembers] = useState<ChatMembers[]>([])
  const [isBlockingUser, setIsBlockingUser] = useState(false)
  const [action, setAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const [selectedMember, setSelectedMember] = useState("")
  const [isReportingUser, setIsReportingUser] = useState(false)
  
    const navigation = useNavigation()
    const route = useRoute<ChatInfoScreenRouteProp>()
    const {chatMasterUUID, chatType} = route.params || {}
    const userUUID = useSelector((state: RootState) => state.auth.userUUID)
  

    const fetchGroupDetails = async() => {

      setLoading(true)

      try {

        const groupDetails = await getGroupDetails(chatMasterUUID)
        
        setGroupDetails(groupDetails)
        setMembers(groupDetails.ChatMembers)

      } catch(err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {

    if(chatType === "GROUP_CHAT") {
      fetchGroupDetails()
    }

  }, [])

  useEffect(() => {

    if(action === "1") {
      // make selected member group admin
    }


  }, [action])

  const isUserAdmin = members.some((eachMember) => eachMember.UserUUID === userUUID && eachMember.ChatMemberTypeCode === MEMBER_ROLES.ADMIN )


  const renderMember = ({item} : {item : ChatMembers}) => {
    return (
      <View style={{flexDirection: "row", alignItems: 'center'}}>
        <ProfileHeader noDate name={item.FirstName} ProfilePic={item.ProfilePicURL || "https://i.pravatar.cc/150"} />
        <TouchableOpacity onPress={() => setSelectedMember(item.ChatMemberUUID)} style={{marginLeft:"auto", flexDirection: "row", alignItems:"center"}}> 
          <GroupMemberDropdownComponent userRole={isUserAdmin ? MEMBER_ROLES.ADMIN : MEMBER_ROLES.MEMBER} action={action} setAction={setAction} />
        </TouchableOpacity>
      </View>
    )
  }


  return (
    <SafeAreaView style={styles.container}>
      
      <View style={{ width: "100%", flex: 1 }}>
        <Text>{chatType}</Text>
        {loading && <ActivityIndicator style={{marginTop: "50%"}} size={"small"} color={colors.ACTIVE_ORANGE} />}
        {!loading && <FlatList
          ListHeaderComponent={
            <>
            <View style={styles.listHeaderComponent}>
              <CustomButton buttonStyle={{alignSelf: "flex-start", marginLeft: 10}} onPress={() => navigation.goBack()} title={""} icon={<ChevronLeft />} />
              {groupDetails?.ChatProfilePictureURL ? <Image source={{uri: groupDetails.ChatProfilePictureURL}} style={styles.chatProfilePictureURL} /> : <Group width={50} height={50} /> }
              <Text style={styles.name}>{groupDetails?.ChatMasterName}</Text>
              <Text style={styles.memberCount}>{members?.length} Members</Text>
            </View>
          
            {chatType === chatTypes.GROUP && <CustomButton buttonStyle={styles.addMemberContainer} onPress={() => setAddingMembers(true)} iconPosition='left' icon={<AddMember strokeWidth={0.7} fill={colors.ACTIVE_ORANGE} width={23} height={23} />} title={"Add members"} />}
              <Text style={styles.members}>Members</Text>
            </>
          }
          data={groupDetails?.ChatMembers || []}
          bounces={false}
          renderItem={renderMember}
          keyExtractor={(item) => item.ChatMemberUUID}
          contentContainerStyle={styles.memberList}
        />}
      </View>

      <View style={styles.mainEncryptionContianer}>
          <Lock width={20} height={20}/>
          <View style={styles.encryptionContinaer}>
            <Text style={{fontWeight: 500}}>Encryption</Text>
            <Text style={{color: colors.TEXT_COLOR}}>Messages and calls are end-to-end encrypted</Text>
          </View>
      </View>

      <View style={styles.mainActionsContainer}>
        <TouchableOpacity onPress={() => setIsBlockingUser(true)} style={styles.actionContainer}>
          <XCircle fill='red' width={20} height={20}/>
          <Text style={styles.action}>Block user</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsReportingUser(true)} style={styles.actionContainer}>
          <ThumbsDown fill='red' width={20} height={20}/>
          <Text style={styles.action}>Report user</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.actionContainer}>
          <Trash fill='red' width={20} height={20}/>
          <Text style={styles.action}>Delete chat</Text>
        </TouchableOpacity>
      </View> 

        <CustomModal presentationStyle="overFullScreen" fullScreen isOpen={addingMembers}>
          <CreateGroup chatMasterUUID={chatMasterUUID} addingMembers={true} onClose={() => setAddingMembers(false)} />
        </CustomModal>

        <CustomModal isOpen={isBlockingUser} onClose={() => setIsBlockingUser(false)}>
          <Block noReport={true} chatMemberUserUUID={chatMasterUUID} onClose={() => setIsBlockingUser(false)} />
        </CustomModal>

        <CustomModal isOpen={isReportingUser} onClose={() => setIsReportingUser(false)}>
          <Report onClose={() => setIsReportingUser(false)} />
        </CustomModal>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
/*     alignItems :"center" */
  }, 
  listHeaderComponent: {
    alignItems: "center"
  },
  name: {
    marginTop: 15,
    fontWeight: 500,
    fontSize: 18
  },  

  chatProfilePictureURL: {
    width: 100,
    height: 100,
    borderRadius: "50%"
  },
  memberList: {
/*     borderWidth: 2, */
    flex: 1,
    width: "100%",
    gap: 20,
    padding: 10
  },
  memberCount: {
    marginTop: 5,
    color: colors.LIGHT_TEXT
  },
  mainActionsContainer: {
    padding: 20,
    /* borderWidth: 1, */
    width: "100%",
    alignItems: "flex-start",
    gap: 25
  },
  actionContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center"
    
  },
  action: {
    color: colors.RED_COLOR,
    fontSize: 17
  },
  addMemberContainer: {
    marginTop: 10,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    paddingHorizontal: 5
  },
  mainEncryptionContianer: {
    flexDirection: "row",
    gap: 10,
    padding: 20
  },
  encryptionContinaer: {
    gap: 5
  },
  members: {
    marginTop: 20,
    color: colors.LIGHT_TEXT
  }

})