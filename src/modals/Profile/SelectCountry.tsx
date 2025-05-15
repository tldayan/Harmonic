import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ModalsHeader from '../ModalsHeader'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import { ScrollView } from 'react-native-gesture-handler'

interface SelectCountryProps {
  onClose: () => void;
  setUserAddress: React.Dispatch<React.SetStateAction<UserAddress>>;
  countries: Country[]
}

export default function SelectCountry({ onClose, setUserAddress,countries }: SelectCountryProps) {


  const renderCountryTypeItem = ({ item }: { item: Country }) => (
    <CustomButton
      buttonStyle={styles.eventType}
      onPress={() => {
        setUserAddress((prev) => ({...prev, CountryId: item.CountryId, CountryName: item.CountryName, StateId:0, StateName:"", CityId: 0, CityName: ""}))
        onClose();
      }}
      title={item.CountryName}
    />
  )

  return (
    <View style={styles.container}>
      <ModalsHeader onClose={onClose} title='Select Country' />
        <ScrollView style={styles.mainEventTypeList} horizontal={true} scrollEnabled={true} showsHorizontalScrollIndicator={false}>
          <FlatList
            style={styles.eventTypeList}
            data={countries}
            contentContainerStyle={{ gap: 15 }}
            keyExtractor={(item) => item.CountryId.toString()}
            renderItem={renderCountryTypeItem}
            ListEmptyComponent={<Text>No Countires Available</Text>}
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
