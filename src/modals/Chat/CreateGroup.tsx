import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ModalsHeader from '../ModalsHeader'
import { CustomTextInput } from '../../components/CustomTextInput'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import X from "../../assets/icons/x.svg"
import ChevronRight from "../../assets/icons/chevron-right.svg"
import Group from "../../assets/icons/group.svg"
import { addMembersToGroup, getOrganizationUsers, saveGroup } from '../../api/network-utils'
import { STATUS_CODE } from '../../utils/constants'
import { defaultInputStyles } from '../../styles/global-styles'
import EditIcon from "../../assets/icons/edit.svg"
import { pickMedia, uploadMedia } from '../../utils/helpers'
import { Asset } from 'react-native-image-picker'
import CloseIcon from "../../assets/icons/close-light.svg"
import { firebaseStoragelocations } from '../../utils/constants'
import { OrganizationUserItem } from '../../components/FlatlistItems/OrganizationUserItem'
import { FlashList } from '@shopify/flash-list'
import { useCreds } from '../../hooks/useCreds'

interface CreateGroupProps {
    onClose: () => void
    addingMembers?: boolean
    chatMasterUUID?: string
    fetchChats?: () => void
    fetchGroupDetails?: () => void
}

  const steps = [
    { id: "1", title: "Select Members" },
    { id: "2", title: "Enter Group Name" },
    { id: "3", title: "Review & Create" },
  ];

  const width = Dimensions.get("window").width

export default function CreateGroup({onClose,fetchGroupDetails, fetchChats, addingMembers, chatMasterUUID}: CreateGroupProps) {

  const [step, setStep] = useState(0)
  const [memberSearch, setMemberSearch] = useState("")
  const [addedMembers, setAddedMembers] = useState<{memberName: string, memberUUID: string}[]>([]);
  const [groupName, setGroupName] = useState("")
  const [groupImage, setGroupImage] = useState<Asset>({})
  const [groupNameErrorMessage, setGroupNameErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([])
  const flatListRef = useRef<FlatList<any>>(null);
  const {userUUID, organizationUUID} = useCreds()


  
  const addMembersToExistingGroup = async() => {
    
    const addMembersToGroupResponse = await addMembersToGroup(chatMasterUUID ?? "",userUUID,addedMembers,organizationUUID)
    console.log(addMembersToGroupResponse)
    if(addMembersToGroupResponse === STATUS_CODE.SUCCESS) {
      fetchGroupDetails?.()
      onClose()
    }

  }

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



  const next =  async() => {

    if(addedMembers && addingMembers) {
      addMembersToExistingGroup()
      return
    }

    if(step === 1) {

      if(!groupName) {
        setGroupNameErrorMessage("Please add a group name")
        return
      }

      setLoading(true)
      try {
        const firstSaveGroupResponse = await saveGroup(groupName, userUUID)
        const groupChatMasterUUID = firstSaveGroupResponse.Payload.ChatMasterUUID
        await addMembersToGroup(groupChatMasterUUID, userUUID, addedMembers, organizationUUID)
        const uploaded = await uploadMedia([groupImage], firebaseStoragelocations.chat);
        const groupImageFirebaseURL = uploaded[0]?.url || "";
        const secondSaveGroupResponse = await saveGroup(groupName, userUUID, groupChatMasterUUID, groupImageFirebaseURL)
        
        if(secondSaveGroupResponse.Status === STATUS_CODE.SUCCESS) {
          fetchChats?.()
          onClose()
        }
      } catch(err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
        
    }

    if(step < steps.length - 1) {
        setStep(step + 1)
        flatListRef?.current?.scrollToIndex({ index: step + 1, animated: true })
    }
  }

  const handleGroupNameChange = (text: string) => {
    setGroupName(text);
  
    if (text.trim()) {
      setGroupNameErrorMessage("");
    }
  };

  const handleGroupImage = async() => {
    if(!groupImage.uri) {
        setLoading(true)
      try {
        const assets = await pickMedia(true)
       /*  if(assets[0].uri === groupImage?.uri) return */
        setGroupImage(assets[0])
        console.log(groupImage)
      } catch(err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    } else {
      setGroupImage({})
    }
    
  }
  
  
  
  const handleGoBack = () => {
    if(step > 0) {
        setStep(step - 1)
        flatListRef?.current?.scrollToIndex({ index: step - 1, animated: true })
    }
  }
  

  const handleAddMember = (member: OrganizationUser) => {
    if(member.UserUUID === userUUID) return
    
    let isMemberAlreadyAdded = addedMembers.some((eachMember) => eachMember.memberUUID === member.UserUUID)
    
    if(!isMemberAlreadyAdded) {
        setAddedMembers((prev) => [...prev, {memberName: member.FullName, memberUUID: member.UserUUID}])
        setMemberSearch("")
    } else {
        handleRemoveMember(member.UserUUID)
    }
  }


  const handleRemoveMember = (memberUUID: string) => {
    setAddedMembers((prev) => prev.filter((eachMember) => eachMember.memberUUID !== memberUUID));
  };


  
  const stepOne = () => {
    return (
        <View style={styles.innerContainer}>
            <Text style={styles.memberTitle}>Members</Text>
            <View style={styles.selectedMembersContainer}>
                {addedMembers?.map((eachMember) => {
                    return <CustomButton key={eachMember.memberUUID} buttonStyle={styles.selectedMembers} onPress={() => handleRemoveMember(eachMember.memberUUID)} title={eachMember.memberName} icon={<X width={10} height={10} />} />
                })}
                <CustomTextInput noBackground inputStyle={styles.memberSearchField} placeholderTextColor={colors.LIGHT_TEXT} value={memberSearch} placeholder='Search members to add' onChangeText={(e) => setMemberSearch(e)} />
            </View>
            {loading ? <ActivityIndicator style={{marginTop: "50%"}} size={"small"} /> : 
            <FlashList
            data={organizationUsers}
            renderItem={({ item }) => (
              <OrganizationUserItem
                item={item}
                addedMembers={addedMembers}
                handleAddMember={handleAddMember}
              />
            )}
            keyExtractor={(item) => item.UserUUID}
            extraData={addedMembers}
            estimatedItemSize={80}
          />
          }
        </View>
    )
  }

  const stepTwo = () => {
    return (
        <View style={styles.innerContainer}>
            <View style={[styles.groupImageContainer, !groupImage?.uri && {padding : 50}]}>
                {!groupImage?.uri && <Group width={50} height={50} />}
                {groupImage?.uri && <Image style={{borderRadius: 75}} width={150} height={150} source={{uri : groupImage?.uri ? groupImage?.uri : ""}}/>}
                <CustomButton onPress={handleGroupImage} buttonStyle={[styles.editGroupImage, groupImage?.uri ? {backgroundColor: "red"} : null]} icon={loading ? <ActivityIndicator size={"small"} color={"white"} /> : groupImage.uri ? <CloseIcon width={20} height={20} /> : <EditIcon fill={"white"} color={colors.ACTIVE_ORANGE} width={20} height={20} />} /> 
            </View>
            <CustomTextInput errorMessage={groupNameErrorMessage} label='Group Name' labelStyle={styles.groupName} inputStyle={defaultInputStyles} value={groupName} onChangeText={handleGroupNameChange} />
        </View>
    )
  }


  return (
    <SafeAreaView style={styles.container}>
        <ModalsHeader goBack={step > 0} goBackFunc={handleGoBack} onClose={onClose} title={step === 0 ? "Add Group Members" : "New Group"} />

        <FlatList
            scrollEnabled={false}
            ref={flatListRef}
            pagingEnabled
            style={styles.mainCreateGroupForm} 
            horizontal
            data={steps} 
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => index === 0 ? stepOne() : stepTwo()}
        />

        {addedMembers.length >= 1 && <CustomButton buttonStyle={{position: "absolute", bottom: "5%", right: "10%"}} onPress={next} title={""} icon={loading ? <ActivityIndicator size="large" color={colors.ACTIVE_ORANGE} /> : <ChevronRight fill={colors.ACTIVE_ORANGE} stroke='white'  width={60} height={60}/>} />}
        
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
      marginBottom: 16,
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
    dropdown: {
        marginTop: 20,
        borderBottomWidth: 2,
        borderBottomColor: colors.ACCENT_COLOR,
        position: "relative",
        width : "100%",
        height: 40,
    },
    groupName: {
      marginTop: 20,
      fontSize: 16,
      marginBottom: 5
    },
    groupImageContainer: {
      position: "relative",
      backgroundColor: "#FEECDC", 
      borderRadius: "100%", 
      alignSelf: "center"
    },
    editGroupImage :  {
      padding: 8,
      borderRadius: 50,
      position: "absolute",
      right: 6,
      bottom: 6,
      backgroundColor: colors.ACTIVE_ORANGE,
      justifyContent: "center",
      alignItems: "center",
    }

})