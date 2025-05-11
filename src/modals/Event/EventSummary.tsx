import { Image, StyleSheet,ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { EventInformation } from "../../types/event.types";
import Clock from "../../assets/icons/clock.svg"
import { formatLongDate } from '../../utils/helpers';
import MapPin from "../../assets/icons/map-pin.svg"
import Group from "../../assets/icons/participants.svg"
import { colors } from '../../styles/colors';
import { getUserProfile } from '../../api/network-utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface EventInformationProps {
    eventInformation: EventInformation
}


export const EventSummary = ({eventInformation}: EventInformationProps) => {

  const userUUID = useSelector((state: RootState) => state.auth.userUUID)

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile(userUUID);
      if (response?.data?.Payload) {
        setUserProfile(response.data.Payload);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchUserProfile();
  }, []);
  

  console.log(eventInformation.eventBanner[0])

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{gap: 10}} style={[styles.eventInfoContainer, {marginVertical: 10}]}>
      <Text style={styles.eventName}>{eventInformation.eventName}</Text>
      <Image style={styles.eventBanner} source={{uri: (eventInformation.eventBanner?.[0] as any)?.localUri ?? "https://i.pravatar.cc/150" ?? "https://i.pravatar.cc/150"}}/>
      <View style={styles.statsContainer}>
        <Clock width={15} height={15} />
        <Text style={styles.statInfo}>{formatLongDate(eventInformation.eventStartDateTime)}</Text>
      </View>    
      <View style={styles.statsContainer}>
        <MapPin width={15} height={15} />
        <Text style={styles.statInfo}>Carolina Palms Community Hall</Text>
      </View>
      <View style={styles.statsContainer}>
        <Group width={15} height={15} />
        <Text style={styles.statInfo}>{eventInformation.participants.length} guests</Text>
      </View>

      <View style={styles.mainGuestsContainer}>
        <View style={styles.hostContainer}>
          <Text style={{fontWeight: 500}}>Host</Text>
          <Image style={styles.hostImage} source={{uri: userProfile?.ProfilePicURL ? userProfile.ProfilePicURL : "https://i.pravatar.cc/150"}} />
          <Text style={{fontWeight: 500}}>{userProfile?.FirstName}</Text>
        </View>
        <View style={styles.guestContainer}>
          {eventInformation.participants.map((eachGuest) => {
            return <Image style={styles.guest} source={{uri: eachGuest.profileURL ? eachGuest.profileURL : "https://i.pravatar.cc/150"}} />
          })}
        </View>
      </View>


      <Text style={{fontSize: 16, fontWeight: 500}}>Description</Text>
      <Text>{eventInformation.eventDescription}</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    eventInfoContainer: {
   /*      borderWidth: 2, */
        flex: 1,
    },
    eventName: {
      fontSize: 22,
      fontWeight: 500
    },
    eventBanner: {
      width: "100%",
      borderRadius: 24,
      height: 300,
      resizeMode: "cover"
    },
    statsContainer: {
      flexDirection: "row",
      gap: 5,
      alignItems: "center"
    },
    statInfo: {
      color: colors.LIGHT_TEXT
    },
    mainGuestsContainer: {
      /* borderWidth: 2, */
      marginVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      alignSelf:"center",
    /*   justifyContent: "space-between" */
    },
    hostContainer: {
/*       borderWidth: 1, */
      alignItems: "center",
      gap: 5,
      marginRight: 50
    },
    hostImage: {
      width: 40,
      height: 40,
      borderRadius: 50
    },
    guest: {
      width: 50,
      height: 50,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: 'white', 
      marginLeft: -20,
    },
    guestContainer: {
      flexDirection : "row"
    }
})