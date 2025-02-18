import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { formatDate } from '../utils/helpers'
import CustomButton from './CustomButton'
import ThreeDots from "../assets/icons/three-dots-horizontal.svg"

interface ProfileHeaderProps {
    FirstName?: string
    CreatedDateTime?: string
    ProfilePic?: string
}

export default function ProfileHeader({FirstName,CreatedDateTime, ProfilePic} : ProfileHeaderProps) {

    const formattedDate = formatDate(CreatedDateTime || "")

  return (
    <View style={styles.mainProfileDetialsContainer}>
        <Image source={{ uri: ProfilePic || "https://i.pravatar.cc/150" }}   style={styles.profilePicture} />
        <View style={styles.userNameContainer}>
            <Text style={styles.name}>{FirstName}</Text>
            <View style={styles.dateContainer}>
                <Text style={styles.postDate}>{formattedDate}</Text>
            </View>
        </View>
        <CustomButton buttonStyle={styles.threeDots} icon={<ThreeDots width={15} height={15} />} onPress={() => {}} />
    </View>
  )
}

const styles = StyleSheet.create({
    mainProfileDetialsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 3
    },
    profilePicture: {
        width: 34,
        height: 34,
        borderRadius: 50
      },
    userNameContainer: {
        gap: 2
      },
      name: {
        fontWeight: 500,
        color: "#000000"
      },
      dateContainer : {
        flexDirection: "row",
        gap: 4
      },
      postDate: {
        color: "#626262",
        fontSize: 11
      },
  threeDots: {
    marginLeft: "auto",
    flexDirection: "row", 
    alignItems: 'center',
    padding: 5
  },
})