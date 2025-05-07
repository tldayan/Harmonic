import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../../styles/colors';
import ModalsHeader from '../ModalsHeader';
import { EventInformation } from '../../types/event.types';
import CustomButton from '../../components/CustomButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import { OrganizationUserItem } from '../../components/FlatlistItems/OrganizationUserItem';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getOrganizationUsers } from '../../api/network-utils';
import X from "../../assets/icons/x.svg"
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../styles/button-styles';

  const width = Dimensions.get("window").width


  interface AddParticipantsProps {
    onClose: () => void
    setEventInformation: React.Dispatch<React.SetStateAction<EventInformation>>
    eventInformation: EventInformation
  }

export default function AddParticipants({onClose, setEventInformation, eventInformation} : AddParticipantsProps) {

  const [loading, setLoading] = useState(false)
  const [addedMembers, setAddedMembers] = useState<{memberName: string, memberUUID: string, profileURL: string}[]>(eventInformation.participants);
  const {userUUID, organizationUUID} = useSelector((state: RootState) => state.auth)
  const [memberSearch, setMemberSearch] = useState("")
  const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([])

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


  const handleAddMember = (member: OrganizationUser) => {
    
    if(member.UserUUID === userUUID) return
    
    
    let isMemberAlreadyAdded = addedMembers.some((eachMember) => eachMember.memberUUID === member.UserUUID)
    
    if(!isMemberAlreadyAdded) {
        setAddedMembers((prev) => [...prev, {memberName: member.FullName, memberUUID: member.UserUUID, profileURL: member.ProfilePicURL}])
        setMemberSearch("")
    } else {
        handleRemoveMember(member.UserUUID)
    }
  }

  const handleRemoveMember = (memberUUID: string) => {
    setAddedMembers((prev) => prev.filter((eachMember) => eachMember.memberUUID !== memberUUID));
  };

  useEffect(() => {
    console.log(addedMembers)
  }, [addedMembers])



  return (
    <View style={styles.innerContainer}>
      <ModalsHeader title='Invite Participants' onClose={onClose} />
            <Text style={styles.memberTitle}>Members</Text>
            <View style={styles.selectedMembersContainer}>
                {addedMembers?.map((eachMember) => {
                    return <CustomButton key={eachMember.memberUUID} buttonStyle={styles.selectedMembers} onPress={() => handleRemoveMember(eachMember.memberUUID)} title={eachMember.memberName} icon={<X width={10} height={10} />} />
                })}
                <CustomTextInput inputStyle={styles.memberSearchField} placeholderTextColor={colors.LIGHT_TEXT} value={memberSearch} placeholder='Search members to add' onChangeText={(e) => setMemberSearch(e)} />
            </View>
            {loading ? <ActivityIndicator style={{marginTop: "50%"}} size={"small"} /> : 
            <FlatList
                contentContainerStyle={styles.friendList}
                renderItem={({item}) => <OrganizationUserItem item={item} addedMembers={addedMembers} handleAddMember={handleAddMember} />} 
                keyExtractor={(item) => item.UserUUID}
                data={organizationUsers}
            />}
            <CustomButton buttonStyle={[PRIMARY_BUTTON_STYLES, styles.Done]} textStyle={PRIMARY_BUTTON_TEXT_STYLES} onPress={() => {setEventInformation((prev) => ({...prev, participants: addedMembers})); onClose()}} title={"Done"} />
        </View>
  )
}

const styles = StyleSheet.create({
    innerContainer: {
      padding: 16,
      width: width,
      flex: 1
    },
    memberTitle: {
      color: colors.ACTIVE_ORANGE,
    },
    selectedMembersContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      paddingTop: 10,
      paddingBottom: 5,
      borderBottomWidth: 2,
      borderBottomColor: colors.ACTIVE_ORANGE,
    },
    selectedMembers: {
      flexDirection: "row-reverse",
      gap: 5,
      alignItems: "center",
      borderRadius: 50,
      backgroundColor: colors.LIGHT_COLOR,
      paddingHorizontal: 15,
      paddingVertical: 4,
      height: 30,
    },
    memberSearchField: {
      flex: 1,
    },
    friendList: {
      marginTop: 30,
      gap: 15,
    },
    Done: {
      marginTop: "auto"
    }
  });
  