import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { chatTypes } from '../../utils/constants'
import Block from '../../modals/Chat/Block'
import Report from '../../modals/Chat/Report'

export type ChatInfoScreenRouteProp = RouteProp<RootStackParamList, "ChatInfo">

export default function ChatInfo() {

  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [addingMembers, setAddingMembers] = useState(false)
  const [members, setMembers] = useState<ChatMembers[]>([])
  const [isBlockingUser, setIsBlockingUser] = useState(false)
  const [isReportingUser, setIsReportingUser] = useState(false)

    const navigation = useNavigation()
    const route = useRoute<ChatInfoScreenRouteProp>()
    const {chatMasterUUID, chatType} = route.params || {}
    

  useEffect(() => {

    const fetchGroupDetails = async() => {
      console.log(chatMasterUUID)
      const groupDetails = await getGroupDetails(chatMasterUUID)
      console.log(groupDetails.ChatMembers)
      setGroupDetails(groupDetails)
      setMembers(groupDetails.ChatMembers)
    }

    if(chatType === "GROUP_CHAT") {
          fetchGroupDetails()
    }

  }, [])


  const renderMember = ({item} : {item : ChatMembers}) => {
    return (
      <ProfileHeader noDate name={item.FirstName} ProfilePic={item.ProfilePicURL || "https://i.pravatar.cc/150"} />
    )
  }


  return (
    <View style={styles.container}>
      
      <View style={{ width: "100%", flex: 1 }}>
        <Text>{chatType}</Text>
        <FlatList
          ListHeaderComponent={
            <>
            <View style={styles.listHeaderComponent}>
              <CustomButton buttonStyle={{alignSelf: "flex-start", marginLeft: 10}} onPress={() => navigation.goBack()} title={""} icon={<ChevronLeft />} />
              <Image source={{uri: "https://i.pravatar.cc/150"}} style={styles.chatProfilePictureURL} />
              <Text style={styles.name}>Tech Team</Text>
              <Text style={styles.memberCount}>{members?.length} Members</Text>

              <View>
                <Text>Media</Text>
              </View>
            </View>

            {chatType === chatTypes.GROUP && <CustomButton buttonStyle={styles.addMemberContainer} onPress={() => setAddingMembers(true)} iconPosition='left' icon={<AddMember strokeWidth={0.7} fill={colors.ACTIVE_ORANGE} width={23} height={23} />} title={"Add members"} />}
            </>
          }
          data={groupDetails?.ChatMembers || []}
          bounces={false}
          renderItem={renderMember}
          keyExtractor={(item) => item.ChatMemberUUID}
          contentContainerStyle={styles.memberList}
        />
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

    </View>
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
    borderWidth: 2,
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
    borderWidth: 1,
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
  }

})