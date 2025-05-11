import { Image, StyleSheet,ScrollView, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Clock from "../../assets/icons/clock.svg"
import { formatLongDate } from '../../utils/helpers';
import MapPin from "../../assets/icons/map-pin.svg"
import Group from "../../assets/icons/participants.svg"
import { colors } from '../../styles/colors';
import { getEventDetails } from '../../api/network-utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation-types';
import { Event } from '../../types/event.types';
import CustomButton from '../../components/CustomButton';
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../styles/button-styles';
import { CardShadowStyles, shadowStyles } from '../../styles/global-styles';
import ChevronLeft from "../../assets/icons/chevron-left.svg"
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ImageSkeleton from '../../skeletons/ImageSkeleton';

export type EventScreenRouteProp = RouteProp<RootStackParamList, "Event">

export const EventScreen = () => {

  const {userUUID} = useSelector((state: RootState) => state.auth)
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute<EventScreenRouteProp>()
  const {eventUUID} =  route.params || {}
  const [imageLoaded, setImageLoaded] = useState(false);
  

  const [eventDetails, setEventDetails] = useState<Event | null>(null)

  const fetchEventDetails = async () => {
    try {
      const response = await getEventDetails(userUUID, eventUUID);
      if (response?.Payload) {
        console.log(response)
        setEventDetails(response.Payload);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchEventDetails();
  }, []);
  

  

  return (
    <View style={{ flex: 1 }}>
      <CustomButton icon={<ChevronLeft width={25} height={25} />} onPress={() => navigation.goBack()} buttonStyle={styles.goBack} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, gap: 10}}
        style={[styles.eventInfoContainer, CardShadowStyles, { marginVertical: 10 }]}
      >
        {!eventDetails ? (
          <ActivityIndicator style={{marginVertical: "75%"}} size="large" />
        ) : (
          <>
            <Text style={styles.eventName}>{eventDetails.EventName}</Text>
            <View style={styles.eventBannerContainer}>
              {!imageLoaded && <ImageSkeleton oneImage={true} />}
              
              <Image
                style={styles.eventBanner}
                source={{
                  uri: eventDetails?.EventBanner ?? "https://i.pravatar.cc/150",
                }}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </View>

            
  
            <View style={styles.statsContainer}>
              <Clock width={15} height={15} />
              <Text style={styles.statInfo}>
                {formatLongDate(eventDetails.EventStartDateTime)}
              </Text>
            </View>
  
            <View style={styles.statsContainer}>
              <MapPin width={15} height={15} />
              <Text style={styles.statInfo}>Carolina Palms Community Hall</Text>
            </View>
  
            <View style={styles.statsContainer}>
              <Group width={15} height={15} />
              <Text style={styles.statInfo}>
                {eventDetails.NoOfParticipants
                  ? `${eventDetails.NoOfParticipants} guests`
                  : "-"}
              </Text>
            </View>
  
            <View style={styles.mainGuestsContainer}>
              <View style={styles.hostContainer}>
                <Text style={{ color: colors.LIGHT_TEXT, fontWeight: "500" }}>Host:</Text>
                <Text>{eventDetails.HostFullName}</Text>
              </View>
            </View>
  
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Description</Text>
            <Text>{eventDetails.EventDescription}</Text>
          </>
        )}
      </ScrollView>
  
      {eventDetails && <View style={styles.bottomButtonContainer}>
        <CustomButton
          onPress={() => {}}
          buttonStyle={[PRIMARY_BUTTON_STYLES, CardShadowStyles]}
          textStyle={PRIMARY_BUTTON_TEXT_STYLES}
          title={"Join Event"}
        />
      </View>}
    </View>
  );
  
  
}

const styles = StyleSheet.create({
    eventInfoContainer: {
   /*      borderWidth: 2, */
        flex: 1,
        padding: 24,
        width: "90%",
        borderRadius: 24,
        alignSelf: "center",
      /*   justifyContent: "center", */
        backgroundColor: "white",
    },
    eventName: {
      fontSize: 22,
      fontWeight: 500
    },
    eventBannerContainer: {
      position: 'relative',
      width: '100%',
      height: 300,
      borderRadius: 24,
      overflow: 'hidden',
    },
    eventBanner: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      position: 'absolute',
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
      flexDirection: "row",
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
    },
    bottomButtonContainer: {
      position: 'absolute',
      bottom: 10,
      paddingHorizontal: 24,
      left: 24,
      right: 24,
    },
    goBack: {
      width: "90%",
      marginVertical: 10,
      alignSelf: "center",
    }
    
})