import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { CustomTextInput } from '../../components/CustomTextInput'
import { colors } from '../../styles/colors'
import { defaultInputStyles } from '../../styles/global-styles'
import SearchIcon from "../../assets/icons/search-2.svg"

export default function StoresScreen() {

  const [storeSearch, setStoreSearch] = useState("")


  return (
    <View style={styles.container}>
      <CustomTextInput placeholder='Search for your store' placeholderTextColor={colors.LIGHT_TEXT} inputStyle={[defaultInputStyles, styles.searchField]} onChangeText={(e) => setStoreSearch(e)} value={storeSearch} leftIcon={<SearchIcon color={colors.LIGHT_TEXT} width={18} height={18} />} />

      <Text>Your Favorites</Text>
      <Text>Explore more stores</Text>
      
      

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 14
  },
  searchField : {
    paddingLeft: 35,
    borderColor: colors.BORDER_COLOR,
    borderWidth: 1,
  }
})