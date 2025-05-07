import { Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Participants from "../../assets/icons/participants.svg"
import Clock from "../../assets/icons/clock.svg"
import { CardShadowStyles } from '../../styles/global-styles'
import { formatDate } from '../../utils/helpers'
import { colors } from '../../styles/colors'


interface EventItemProps {
    event: Event;
    index: number;
    scrollX: Animated.Value;
  }
const {width : SCREEN_WIDTH} = Dimensions.get("window")
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function EventItem({ event, index, scrollX }: EventItemProps) {

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
      
    

  return (
    <ScrollView style={styles.mainEventContainer}>
        <AnimatedTouchableOpacity
        onPress={() => {}}
        activeOpacity={0.7}
        style={[styles.eventContainer, CardShadowStyles, { transform: [{ scale }, { rotate }] }]}
        >
        <Image style={styles.banner} source={{ uri: event.EventBanner }} />
        <Text style={styles.eventName}>{event.EventName}</Text>
        <Text numberOfLines={5} style={styles.eventDescription}>{event.EventDescription}</Text>

        <View style={styles.eventInfoContainer}>
            <View style={styles.participantInfo}>
                <Participants width={16} height={16} />
                <Text style={{ fontWeight: "300" }}>{event.NoOfParticipants ? event.NoOfParticipants : "-"}</Text>
            </View>
            <View style={styles.timeInfoContainer}>
                <Clock width={16} height={16} />
                <Text style={styles.time}>{formatDate(event.EventStartDateTime)}</Text>
            </View>
        </View>
        </AnimatedTouchableOpacity>
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
        paddingTop: 10,
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
    }

})