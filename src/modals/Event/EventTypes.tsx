import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalsHeader from '../ModalsHeader'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { getEventTypes } from '../../api/network-utils'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import { ScrollView } from 'react-native-gesture-handler'
import { EventInformation } from '../../types/event.types'

interface EventTypesProps {
  onClose: () => void;
  setEventInformation: React.Dispatch<React.SetStateAction<EventInformation>>
}

export default function EventTypes({ onClose, setEventInformation }: EventTypesProps) {
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [loading, setLoading] = useState(false)
  const { organizationUUID } = useSelector((state: RootState) => state.auth)

  const fetchEventTypes = async () => {
    setLoading(true)
    try {
      const res = await getEventTypes(organizationUUID)
      setEventTypes(res.Payload)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventTypes()
  }, [organizationUUID])

  const renderEventTypeItem = ({ item }: { item: EventType }) => (
    <CustomButton
      buttonStyle={styles.eventType}
      onPress={() => {
        setEventInformation((prev) => ({...prev, eventType: {eventTypeName: item.EventTypeCode, eventTypeUUID: item.EventTypeUUID}}))
        onClose();
      }}
      title={item.EventType}
    />
  )

  return (
    <View style={styles.container}>
      <ModalsHeader onClose={onClose} title='Event Types' />
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <ScrollView style={styles.mainEventTypeList} horizontal={true} scrollEnabled={false} showsHorizontalScrollIndicator={false}>
          <FlatList
            style={styles.eventTypeList}
            data={eventTypes}
            contentContainerStyle={{ gap: 15 }}
            keyExtractor={(item) => item.EventTypeUUID}
            renderItem={renderEventTypeItem}
            ListEmptyComponent={<Text>No Event Types Available</Text>}
            ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
          />
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    width: 343,
    paddingBottom: 10
  },
  mainEventTypeList: {
    flexDirection: "column",
    width: "90%",
    alignSelf: "center",
    paddingBottom: 10,
  },
  eventTypeList: {
    width: "90%",
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  eventType: {
    backgroundColor: colors.LIGHT_COLOR,
    borderRadius: 25,
    paddingVertical: 5
  }
})
