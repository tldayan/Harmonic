import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ModalsHeader from '../ModalsHeader'
import { CustomTextInput } from '../../components/CustomTextInput'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import X from "../../assets/icons/x.svg"
import ProfileHeader from '../../components/ProfileHeader'
import Check from "../../assets/icons/circle-check.svg"
import ChevronRight from "../../assets/icons/chevron-right.svg"
import Group from "../../assets/icons/group.svg"
import { Dropdown } from 'react-native-element-dropdown'

interface CreateGroupProps {
    onClose: () => void
}

const allFriendsList = [
    "Michael", "David", "Luke", "James", "John", "Robert", "William", "Thomas", 
    "Daniel", "Matthew", "Christopher", "Andrew", "Joseph", "Benjamin", "Charles", 
    "Jonathan", "Nathan", "Samuel", "Henry", "Nicholas", "Edward", "Patrick", 
    "Richard", "Alexander", "Zachary", "Gabriel", "Ethan", "Jacob", "Elijah", "Anthony",
    "Michelle", "Sarah", "Emily", "Jessica", "Ashley", "Samantha", "Jennifer", 
    "Elizabeth", "Lauren", "Megan", "Olivia", "Sophia", "Isabella", "Hannah", 
    "Rachel", "Victoria", "Natalie", "Julia"
  ];

  const steps = [
    { id: "1", title: "Select Members" },
    { id: "2", title: "Enter Group Name" },
    { id: "3", title: "Review & Create" },
  ];

  interface DropdownComponentProps {
    groupSubject: string | null
    setGroupSubject: React.Dispatch<React.SetStateAction<string | null>>
  }

  const groupSubjects = [
    { label: 'Subject 1', value: '1' },
    { label: 'Subject 2', value: '2' },
  ];
  
  const width = Dimensions.get("window").width

  const DropdownComponent = ({groupSubject, setGroupSubject} : DropdownComponentProps) => {

    return (
      <Dropdown
        style={styles.dropdown}
        data={groupSubjects}
        mode= "auto"
        placeholder='Group Subject'
        placeholderStyle={{color: "black", fontWeight: 300}}
        itemTextStyle={{color: "black"}}
        containerStyle={{
          borderRadius: 5,
          width: "90%",
          marginHorizontal: "5%",
          left: "auto",
          shadowColor: "#000", 
          shadowOpacity: 0.1, 
          shadowRadius: 5, 
          shadowOffset: { width: 0, height: 4 }, 
          elevation: 5,
        }}
        onFocus={() => setGroupSubject(null)}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={groupSubject}
        onChange={item => {
          setGroupSubject(item.value);
        }}
/*         renderRightIcon={() => (
          <View style={styles.iconStyle}><ThreeDots width={18} height={18} /></View>
        )} */
      />
    );
  };

export default function CreateGroup({onClose}: CreateGroupProps) {

  const [step, setStep] = useState(0)
  const [memberSearch, setMemberSearch] = useState("")
  const [addedMembers, setAddedMembers] = useState<string[]>([]);
  const [allFriends, setAllFriends] = useState(allFriendsList)
  const [groupSubject, setGroupSubject] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<any>>(null);



  const next = () => {

    if(step === 1) {
        onClose()
    }

    if(step < steps.length - 1) {
        setStep(step + 1)
        flatListRef?.current?.scrollToIndex({ index: step + 1, animated: true })
    }
  }
  const handleGoBack = () => {
    if(step > 0) {
        setStep(step - 1)
        flatListRef?.current?.scrollToIndex({ index: step - 1, animated: true })
    }
  }

  const filteredFriends = useMemo(() => {
    if (!memberSearch) return allFriends;
    return allFriendsList.filter((eachMember) =>
      eachMember.toLowerCase().includes(memberSearch.toLowerCase())
    );
  }, [memberSearch]);

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
        setMemberSearch("")
    } else {
        handleRemoveMember(member)
    }
  }

  const handleRemoveMember = (member: string) => {

    let updatedMembers = addedMembers.filter((eachMember) => eachMember !== member)

    setAddedMembers(updatedMembers)

  }

  
  const stepOne = () => {
    return (
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
                data={filteredFriends}
            />
        </View>
    )
  }

  const stepTwo = () => {
    return (
        <View style={styles.innerContainer}>
            <View style={{backgroundColor: "#FEECDC", padding: 50, borderRadius: "100%", alignSelf: "center"}}>
                <Group width={100} height={100} />

            </View>
            <DropdownComponent groupSubject={groupSubject} setGroupSubject={setGroupSubject} />
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
            horizontal data={steps} 
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => index === 0 ? stepOne() : stepTwo()}
        />

        {addedMembers.length >= 1 && <CustomButton buttonStyle={{position: "absolute", bottom: "5%", right: "10%"}} onPress={next} title={""} icon={<ChevronRight fill={colors.ACTIVE_ORANGE} stroke='white'  width={60} height={60}/>} />}
        
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
        /* top: "50%",
        left: "-3%", */
/*         transform: [{ translateX: "110%" }, { translateY: "0%" }] */
    },
    dropdown: {
        marginTop: 20,
        borderBottomWidth: 2,
        borderBottomColor: colors.ACCENT_COLOR,
        position: "relative",
        width : "100%",
        height: 40,
    },

})