import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ModalsHeader from '../ModalsHeader'
import { CustomTextInput } from '../../components/CustomTextInput'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import X from "../../assets/icons/x.svg"
import ProfileHeader from '../../components/ProfileHeader'
import Check from "../../assets/icons/circle-check.svg"

interface CreateGroupProps {
    onClose: () => void
}


export default function CreateGroup({onClose}: CreateGroupProps) {

  const [memberSearch, setMemberSearch] = useState("")
  const [addedMembers, setAddedMembers] = useState<string[]>([]);
  const [allFriends, setAllFriends] = useState([
    "Michael", "David", "Luke", "James", "John", "Robert", "William", "Thomas", 
    "Daniel", "Matthew", "Christopher", "Andrew", "Joseph", "Benjamin", "Charles", 
    "Jonathan", "Nathan", "Samuel", "Henry", "Nicholas", "Edward", "Patrick", 
    "Richard", "Alexander", "Zachary", "Gabriel", "Ethan", "Jacob", "Elijah", "Anthony",
    "Michelle", "Sarah", "Emily", "Jessica", "Ashley", "Samantha", "Jennifer", 
    "Elizabeth", "Lauren", "Megan", "Olivia", "Sophia", "Isabella", "Hannah", 
    "Rachel", "Victoria", "Natalie", "Julia"
  ])

  const memberItem = ({item} : {item: string}) => {
    return <TouchableOpacity style={styles.memberItemContainer} onPress={() => handleAddMember(item)}>
                <ProfileHeader noDate name={item} />
                {addedMembers.includes(item) && <Check style={styles.checkLogo} fill={colors.ACTIVE_ORANGE} stroke='white' width={20} height={20} />}
            </TouchableOpacity>
  }

  const handleAddMember = (member: string) => {

    let isMemberAlreadyAdded = addedMembers.some((eachMemeber) => eachMemeber === member)
    
    if(!isMemberAlreadyAdded) {
        setAddedMembers((prev) => [...prev, member])
    } else {
        handleRemoveMember(member)
    }
  }

  const handleRemoveMember = (member: string) => {

    let updatedMembers = addedMembers.filter((eachMember) => eachMember !== member)

    setAddedMembers(updatedMembers)

  }



  return (
    <SafeAreaView style={styles.container}>
        <ModalsHeader onClose={onClose} title={"Add group Members"} />
 
        <View style={styles.innerContainer}>
            <Text style={styles.memberTitle}>Members</Text>
            <View style={styles.selectedMembersContainer}>
                {addedMembers?.map((eachMember) => {
                    return <CustomButton buttonStyle={styles.selectedMembers} onPress={() => handleRemoveMember(eachMember)} title={eachMember} icon={<X width={10} height={10} />} />
                })}
                <CustomTextInput inputStyle={styles.memberSearchField} value={memberSearch} placeholder='Search members to add' onChangeText={(e) => setMemberSearch(e)} />
            </View>
        
        <FlatList
            contentContainerStyle={styles.friendList}
            renderItem={memberItem} 
            keyExtractor={(item) => item}
            data={allFriends}
        />
        
        </View>
        
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

    container : {
        flex: 1,
    },
    innerContainer : {
/*         borderWidth: 2, */
        padding: 16,
/*         flexGrow: 1, */
/*         borderWidth: 2, */
    },
    friendList: {
        marginTop: 30,
        gap: 15,
/*         borderWidth: 2, */
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
        paddingVertical: 4
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
       /*  borderWidth: 2, */
        width: 150
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
        /* top: "50%",
        left: "-3%", */
/*         transform: [{ translateX: "110%" }, { translateY: "0%" }] */
    }

})