import { ActivityIndicator, StyleSheet, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { colors } from '../../styles/colors'
import { defaultInputStyles, shadowStyles } from '../../styles/global-styles'
import { CustomTextInput } from '../../components/CustomTextInput'
import CustomButton from '../../components/CustomButton'
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../styles/button-styles'
import SearchIcon from "../../assets/icons/search-2.svg"
import Plus from "../../assets/icons/plus.svg"
import { getEventList } from '../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import EventItem from '../../components/FlatlistItems/EventItem'
import { Animated } from 'react-native';
import { CustomModal } from '../../components/CustomModal'
import EventCreation from '../../modals/Event/EventCreation'



export default function EventsScreen() {

  const [creatingEvent, setCreatingEvent] = useState(false)
  const [searchEvent, setSearchEvent] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const {userUUID, organizationUUID} = useSelector((state: RootState) => state.auth)
  const [startIndex, setStartIndex] = useState(0)
  const [hasMoreEvents, setHasMoreEvents] = useState(true)
  const [loading, setLoading] = useState(true)
  const scrollX = useRef(new Animated.Value(0)).current;


  const fetchEventsList = async() => {

    if(!hasMoreEvents) return

    try {

        const eventsListResponse = await getEventList(userUUID, organizationUUID, startIndex)
        setStartIndex((prev) => prev + 10)
        if(eventsListResponse.Payload.length < 10) {
            setHasMoreEvents(false)
        }
        setEvents((prev) => [...prev, ...eventsListResponse.Payload])

    } catch (err) {
        console.log(err)
    } finally {
        setLoading(false)
    }

  }


  useEffect(() => {
    fetchEventsList()
  }, [])

  useEffect(() => {

    const event = searchEvent.trim().toLowerCase()
    const filteredEvents = events.filter((eachEvent) => eachEvent.EventName.toLowerCase().includes(event))
    setFilteredEvents(filteredEvents)

  }, [searchEvent])


  return (
    <View>
      <View style={[styles.searchEventContainer, shadowStyles]}>
        <CustomTextInput placeholder='Search for events' placeholderTextColor={colors.LIGHT_TEXT} inputStyle={[defaultInputStyles, styles.searchField]} onChangeText={(e) => setSearchEvent(e)} value={searchEvent} leftIcon={<SearchIcon color={colors.LIGHT_TEXT} width={18} height={18} />} />
        <View style={styles.createEventContainer}>
          <CustomButton onPress={() => setCreatingEvent(true)}  textStyle={PRIMARY_BUTTON_TEXT_STYLES} buttonStyle={[PRIMARY_BUTTON_STYLES, styles.createEvent, {marginTop: 0, marginBottom: 0}]} icon={<Plus width={12} height={12} />} iconPosition="left" title={"Add new event"} />
        </View>
      </View>

        {loading ? <ActivityIndicator style={{marginVertical: "50%"}} size={"small"} /> : null}
      <Animated.FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        data={searchEvent.trim() ? filteredEvents : events}
        style={{height: "100%"}}
        keyExtractor={(item) => item.EventUUID}
        renderItem={({ item, index }) => (
            <EventItem event={item} index={index} scrollX={scrollX} />
        )}
      />


        <CustomModal presentationStyle="formSheet" fullScreen isOpen={creatingEvent} onClose={() => setCreatingEvent(false)}>
          <EventCreation onClose={() => setCreatingEvent(false)} />
        </CustomModal>


    </View>
  )
}

const styles = StyleSheet.create({

      searchEventContainer: {
    /*     borderWidth: 1, */
        backgroundColor: "white",
        paddingHorizontal: 15,
        width: "95%",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 16,
        gap: 16,
        padding: 16,
        borderRadius: 15
      },
      searchField : {
        paddingLeft: 35,
        borderColor: colors.BORDER_COLOR,
        borderWidth: 1,
      },
      createEvent: {
        paddingHorizontal: 15,
        flex: 1,
        backgroundColor: colors.BRIGHT_ORANGE,
      },
      createEventContainer: {
        flexDirection: "row", 
        marginLeft: "auto",
        alignItems: "center", 
        gap: 10
      },
      eventList: {
        gap: 20,
        width: "95%",
        marginHorizontal: "2.5%",
        paddingBottom: 230
      }

})