import { Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Dispatch, SetStateAction, useState } from 'react'
import Participants from "../../assets/icons/participants.svg"
import Clock from "../../assets/icons/clock.svg"
import { CardShadowStyles } from '../../styles/global-styles'
import { formatDate, formatProperDate } from '../../utils/helpers'
import { colors } from '../../styles/colors'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { Event } from '../../types/event.types'
import CustomButton from '../CustomButton'
import ThreeDots from "../../assets/icons/three-dots-horizontal.svg"
import { EventActionDropdownComponent } from '../../dropdowns/EventActionDropdown'
import { CustomModal } from '../CustomModal'
import ConfirmationModal from '../../modals/ConfirmationModal'
import { cancelEvent } from '../../api/network-utils'
import { STATUS_CODE } from '../../utils/constants'
import Toast from 'react-native-toast-message'
import EventCreation from '../../modals/Event/EventCreation'

interface EventItemProps {
    event: Event;
    index: number;
    scrollX: Animated.Value;
    setEvents: Dispatch<SetStateAction<Event[]>>;
    fetchEventsList?: (latest?: boolean, initial?: boolean) => Promise<void>;
  }


const {width : SCREEN_WIDTH} = Dimensions.get("window")
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function EventItem({ event, index, scrollX,setEvents,fetchEventsList }: EventItemProps) {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { userUUID, organizationUUID } = useSelector((state: RootState) => state.auth);
  const [action, setAction] = useState<string | null>(null);


    const inputRange = [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH
      ];
    
      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.9, 1, 0.9],
        extrapolate: 'clamp'
      });
    
      const rotate = scrollX.interpolate({
        inputRange,
        outputRange: ['10deg', '0deg', '-10deg'],
        extrapolate: 'clamp'
      });
      

      const handleCancelEvent = async () => {
        const cancelEventResponse = await cancelEvent(userUUID, event.EventUUID);
        const isSuccess = cancelEventResponse.Status === STATUS_CODE.SUCCESS;
        const status = isSuccess ? "success" : "error";
      
        if (isSuccess) {
          setEvents((prev) => prev.filter((eachEvent) => eachEvent.EventUUID !== event.EventUUID));
        }
      
        Toast.show({
          type: status,
          text1: isSuccess ? "Cancelled Event" : "Something went wrong",
          text2: cancelEventResponse.UserMessage,
          position: "bottom",
        });
      };
      
    

  return (
    <ScrollView style={styles.mainEventContainer}>
        <AnimatedTouchableOpacity
        onPress={() => navigation.navigate("Event", {eventUUID: event.EventUUID})}
        activeOpacity={0.7}
        style={[styles.eventContainer, CardShadowStyles, { transform: [{ scale }, { rotate }] }]}
        >
        <Image style={styles.banner} source={{ uri: event.EventBanner }} />

        <View style={styles.eventCategoryContainer}>
            <Text style={styles.eventCategory}>{event.StatusItemCode}</Text>
            <Text style={styles.eventCategory}>{event.EventType}</Text>
            <EventActionDropdownComponent createdBy={event.CreatedBy} horizontalDots action={action} setAction={setAction} />
        </View>

        <Text style={styles.eventName}>{event.EventName}</Text>
        <Text numberOfLines={5} style={styles.eventDescription}>{event.EventDescription}</Text>

        <View style={styles.eventInfoContainer}>
            <View style={styles.participantInfo}>
                <Participants width={16} height={16} />
                <Text style={{ fontWeight: "300" }}>{event.NoOfParticipants ? event.NoOfParticipants : "-"}</Text>
            </View>
            <View style={styles.timeInfoContainer}>
                <Clock width={16} height={16} />
                <Text style={styles.time}>{formatProperDate(event.EventStartDateTime)}</Text>
            </View>
        </View>
        </AnimatedTouchableOpacity>


        <CustomModal isOpen={action === "2"} onClose={() => setAction(null)}>
            <ConfirmationModal declineText="No" confirmText='Yes' setConfirmation={handleCancelEvent} warningText='Are you sure you want to cancel this event?' onClose={() => setAction(null)} />
        </CustomModal>

         <CustomModal presentationStyle="formSheet" fullScreen isOpen={action === "1"} onClose={() => setAction(null)}>
            <EventCreation fetchEventsList={fetchEventsList} event={event} /* fetchEventsList={fetchEventsList} */  onClose={() => setAction(null)} />
         </CustomModal>
        
        {/* <CustomModal presentationStyle="overFullScreen" fullScreen isOpen={action === "2"}>
            <CreateChat fetchChats={fetchChats} onClose={() => setAction(null)} />
        </CustomModal> */}

    </ScrollView>
  )
}

const styles = StyleSheet.create({

    mainEventContainer:{
        padding: 24,
/*         borderWidth: 1, */
        width: SCREEN_WIDTH
    },
    eventContainer: {
        borderRadius: 24,
        padding: 24,
        width: "80%",
        alignSelf: "center",
        backgroundColor: "white",
        gap: 10
    },
     banner: {
        width: "100%",
        borderRadius: 24,
        height: 200,
        resizeMode: "cover"
     },
    eventName: {
        paddingTop: 5,
        fontWeight: 600,
        fontSize: 16
    },
    eventInfoContainer : {
/*         borderWidth: 1, */
        marginTop: 10,
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between"
    },
    participantInfo: {
        alignItems: "center",
        flexDirection: "row",
        gap: 5,
    },
    timeInfoContainer: {
        alignItems: "center",
        flexDirection: "row",
        gap: 5
    },
    time : {
        fontSize: 10,
        color: colors.LIGHT_TEXT
    },
    eventDescription: {
        textAlign: "left",
    },
    eventCategoryContainer: {
/*         borderWidth: 1, */
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
     eventCategory: {
        paddingHorizontal: 10,
        marginTop: 5,
        backgroundColor: colors.LIGHT_COLOR,
        fontSize: 12,
        fontWeight: "500",
        borderRadius: 24,
        paddingVertical: 2
     },
    threeDots: {
        marginLeft: "auto",
        flexDirection: "row", 
        alignItems: 'center',
        padding: 5,
        opacity: 0.7
    }

})