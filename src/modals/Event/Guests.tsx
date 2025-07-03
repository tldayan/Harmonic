import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { EventInformation } from "../../types/event.types";
import CustomKeyboardAvoidingView from "../../components/CustomKeyboardAvoidingView";
import CustomButton from "../../components/CustomButton";
import Plus from "../../assets/icons/plus.svg"
import { colors } from "../../styles/colors";
import { CustomModal } from "../../components/CustomModal";
import AddParticipants from "./AddParticipants";
import ProfileHeader from "../../components/ProfileHeader";
import { getOrganizationUsers } from "../../api/network-utils";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface EventGuestsProps {
    setEventInformation: React.Dispatch<React.SetStateAction<EventInformation>>
    eventInformation: EventInformation
}


export const Guests = ({ eventInformation, setEventInformation }: EventGuestsProps) => {

  const [addingGuests, setAddingGuests] = useState(false)
  const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([])
  const {userUUID, organizationUUID} = useSelector((state: RootState) => state.auth)

  const fetchOrganizationUsers = async() => {

    const organizationUsersResponse = await getOrganizationUsers(organizationUUID) 
    setOrganizationUsers(organizationUsersResponse.Payload.slice(0, 5))
    
  }

  useEffect(() => {
    fetchOrganizationUsers()
  }, [])

  return (
    <CustomKeyboardAvoidingView>
      <View style={styles.container}>
        <CustomButton onPress={() => setAddingGuests(true)} textStyle={{fontWeight: 500}} iconPosition="left" icon={<Plus color="black" strokeWidth={2} width={20} height={20} />} buttonStyle={styles.addMember}  title={"Add Member"} />
        <Text style={[styles.title, {borderBottomWidth: 0}]}>Invited Guests</Text>

        {eventInformation.participants.length ? 
        <View style={{ height: 300, borderWidth: 1 }}>
          <ScrollView contentContainerStyle={{ gap: 10, padding: 10 }}>
            {eventInformation.participants.map((eachGuest) => (
              <ProfileHeader
                flex
                key={eachGuest.memberUUID}
                ProfilePic={eachGuest.profileURL}
                name={eachGuest.memberName}
                noDate
              />
            ))}
          </ScrollView>
        </View> : <Text style={{color: colors.TEXT_COLOR}}>No guests invited</Text>}
        
      <Text style={styles.title}>Suggested members</Text>
      <View style={styles.suggestedMembersContainer}>
        {organizationUsers.map((eachMember) => {
          return <TouchableOpacity key={eachMember.UserUUID} onPress={() => setAddingGuests(true)}>
                  <Image style={styles.member} source={{uri: eachMember.ProfilePicURL ? eachMember.ProfilePicURL : "https://i.pravatar.cc/150"}} />
                </TouchableOpacity>
        })}

        <View style={{marginLeft: "auto", gap: 5,alignItems: "center"}}>
          <CustomButton buttonStyle={styles.viewAll} icon={<Plus strokeWidth={2.5} color="white" width={30} height={30} />} onPress={() => setAddingGuests(true)} />
          <Text style={{fontWeight: 500}}>View all</Text>
        </View>
        
      </View>
        
      
      
      </View>


      {addingGuests && <CustomModal presentationStyle="formSheet" fullScreen onClose={() => setAddingGuests(false)}>
        <AddParticipants eventInformation={eventInformation} setEventInformation={setEventInformation} onClose={() => setAddingGuests(false)} />
      </CustomModal>}
    </CustomKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 0,
    paddingBottom: 30
  },
  addMember: {
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 8,
    marginTop: 15,
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems :"center",
  },
  member: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white', 
    marginLeft: -20,
  },
  title :{
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: 500,
    borderBottomWidth: 1,
    marginTop: 10,
    borderBottomColor: colors.BORDER_COLOR
  },
  suggestedMembersContainer: {
    flexDirection: "row",
    width: "70%",
    marginTop: 15,
    alignSelf: "center"
  },
  viewAll: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor :"black",
    borderRadius: 100
  }
});

