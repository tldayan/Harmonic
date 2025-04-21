import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { act, useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import CustomButton from '../../components/CustomButton'
import ChevronLeft from "../../assets/icons/chevron-left.svg"
import { addAdminToGroup, getGroupDetails, removeGroupMembers, removeMemberFromAdmin } from '../../api/network-utils'
import { RootStackParamList } from '../../types/navigation-types'
import ProfileHeader from '../../components/ProfileHeader'
import Trash from "../../assets/icons/trash.svg"
import ThumbsDown from "../../assets/icons/thumbs-down.svg"
import XCircle from "../../assets/icons/x-circle.svg"
import { colors } from '../../styles/colors'
import AddMember from "../../assets/icons/add-member.svg"
import { CustomModal } from '../../components/CustomModal'
import CreateGroup from '../../modals/Chat/CreateGroup'
import { chatTypes, MEMBER_ROLES, STATUS_CODE } from '../../utils/constants'
import Block from '../../modals/Chat/Block'
import Report from '../../modals/Chat/Report'
import Lock from "../../assets/icons/lock.svg"
import Group from "../../assets/icons/group.svg"
import { GroupMemberDropdownComponent } from '../../dropdowns/GroupMemberDropdown'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { SafeAreaView } from 'react-native-safe-area-context'
import ConfirmationModal from '../../modals/ConfirmationModal'

export type ChatInfoScreenRouteProp = RouteProp<RootStackParamList, "ChatInfo">

export default function ChatInfo() {

  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [addingMembers, setAddingMembers] = useState(false)
  const [members, setMembers] = useState<ChatMembers[]>([])
  const [isBlockingUser, setIsBlockingUser] = useState(false)
  const [action, setAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [adminConfirmation, setAdminConfirmation] = useState(false)
  const [selectedMember, setSelectedMember] = useState<{userUUID: string, chatMemberUUID: string}>({
    userUUID: '',
    chatMemberUUID: '',
  });
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

const addAdmin = async() => {
      try {
        const addAdminToGroupResponse = await addAdminToGroup(chatMasterUUID, userUUID, [selectedMember.userUUID]);

          if(addAdminToGroupResponse.Status === STATUS_CODE.SUCCESS) {
            fetchGroupDetails()
          }

          setAction(null)
        } catch(err) {
          console.log(err)
        }
      }

const removeAdmin = async() => {
      try {
        const removeAdminResponse = await removeMemberFromAdmin(chatMasterUUID, userUUID, [selectedMember.userUUID]);

          if(removeAdminResponse.Status === STATUS_CODE.SUCCESS) {
            fetchGroupDetails()
          }

          setAction(null)
        } catch(err) {
          console.log(err)
        }
      }

const removeGroupMember = async() => {
  console.log(selectedMember)
      try {
        const removeGroupMembersResponse = await removeGroupMembers(chatMasterUUID, userUUID, [selectedMember.chatMemberUUID]);

          if(removeGroupMembersResponse.Status === STATUS_CODE.SUCCESS) {
            fetchGroupDetails()
          }

          setAction(null)
        } catch(err) {
          console.log(err)
        }
      }

  useEffect(() => {

    if(action === "1" || action === "2" || action == "3") {
      setShowConfirmModal(true)
    }

  }, [action])


  const renderMember = ({item} : {item : ChatMembers}) => {
    return (
      <View style={styles.memberItem}>
        <ProfileHeader noDate name={item.FirstName} ProfilePic={item.ProfilePicURL || "https://i.pravatar.cc/150"} />
        {item.ChatMemberTypeCode === MEMBER_ROLES.ADMIN && <Text style={styles.admin}>{MEMBER_ROLES.ADMIN}</Text>}
        <GroupMemberDropdownComponent userUUID={userUUID} selectedMember={selectedMember.userUUID} onDropdownFocus={() => {setSelectedMember({userUUID: item.UserUUID, chatMemberUUID: item.ChatMemberUUID})}} userRole={item.ChatMemberTypeCode} action={action} setAction={setAction} />
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
          
            <View style={styles.groupActionsContainer}>
              <Text style={styles.members}>Members</Text>
              {chatType === chatTypes.GROUP && <CustomButton buttonStyle={styles.addMemberContainer} textStyle={{color: colors.ACTIVE_ORANGE}} onPress={() => setAddingMembers(true)} iconPosition='left' /* icon={<AddMember strokeWidth={2} color='white' width={20} height={20} />} */ title={"Add members"} />}
            </View>
            
            </>
          }
          data={groupDetails?.ChatMembers || []}
          bounces={false}
          renderItem={renderMember}
          keyExtractor={(item) => item.ChatMemberUUID}
          contentContainerStyle={styles.memberList}
          /* ListFooterComponent={
          <>
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
      </>} */
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
          <CreateGroup fetchGroupDetails={fetchGroupDetails} chatMasterUUID={chatMasterUUID} addingMembers={true} onClose={() => setAddingMembers(false)} />
        </CustomModal>

        <CustomModal isOpen={isBlockingUser} onClose={() => setIsBlockingUser(false)}>
          <Block noReport={true} chatMemberUserUUID={chatMasterUUID} onClose={() => setIsBlockingUser(false)} />
        </CustomModal>

        <CustomModal isOpen={isReportingUser} onClose={() => setIsReportingUser(false)}>
          <Report onClose={() => setIsReportingUser(false)} />
        </CustomModal>
        
        <CustomModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
          {action === "1" ? <ConfirmationModal confirmText='Yes' declineText="No, Cancel" warningText='You and this person will share all Admin privileges!' setConfirmation={addAdmin} onClose={() => setShowConfirmModal(false)} /> 
          : action === "2" ? 
          <ConfirmationModal confirmText='Yes' declineText="No, Cancel" warningText="Are you sure you want to remove this person's admin privileges?" setConfirmation={removeAdmin} onClose={() => setShowConfirmModal(false)} /> 
          : 
          <ConfirmationModal confirmText='Yes' declineText="No, Cancel" warningText="This person will be removed permanently!" setConfirmation={removeGroupMember} onClose={() => setShowConfirmModal(false)} />
        }
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
  memberItem: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between"
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
/*     backgroundColor: colors.ACTIVE_ORANGE, */
    color: colors.ACTIVE_ORANGE,
    borderRadius: 3,
    flexDirection: "row",

    padding: 5,
    paddingHorizontal: 10
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
    color: colors.LIGHT_TEXT
  },
  admin: {
    color: "#3CB371",
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 10,
    marginLeft: "auto",
    backgroundColor: colors.BACKGROUND_COLOR,
    borderRadius: 3 
  },
  groupActionsContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }

})