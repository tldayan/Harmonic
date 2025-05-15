import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ModalsHeader from '../ModalsHeader'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import { ScrollView } from 'react-native-gesture-handler'

interface SelectCityProps {
  onClose: () => void;
  setUserAddress: React.Dispatch<React.SetStateAction<UserAddress>>;
  states: State[]
}

export default function SelectState({ onClose, setUserAddress,states }: SelectCityProps) {


  const renderStateTypeItem = ({ item }: { item: State }) => (
    <CustomButton
      buttonStyle={styles.eventType}
      onPress={() => {
        setUserAddress((prev) => ({...prev, StateId: item.StateId, StateName: item.StateName}))
        onClose();
      }}
      title={item.StateName}
    />
  )

  return (
    <View style={styles.container}>
      <ModalsHeader onClose={onClose} title='Select State' />
        <ScrollView style={styles.mainEventTypeList} horizontal={true} scrollEnabled={true} showsHorizontalScrollIndicator={false}>
          <FlatList
            style={styles.eventTypeList}
            data={states}
            contentContainerStyle={{ gap: 15 }}
            keyExtractor={(item) => item.StateId.toString()}
            renderItem={renderStateTypeItem}
            ListEmptyComponent={<Text>No results found</Text>}
          />
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    width: 343,
    paddingBottom: 10,
    maxHeight: 500
  },
  mainEventTypeList: {
/*     borderWidth: 1, */
    flexDirection: "column",
    width: "90%",
    alignSelf: "center",
    paddingBottom: 10,
  },
  eventTypeList: {
    width: "90%",
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  eventType: {
    backgroundColor: colors.LIGHT_COLOR,
    borderRadius: 25,
    paddingVertical: 5
  }
})
