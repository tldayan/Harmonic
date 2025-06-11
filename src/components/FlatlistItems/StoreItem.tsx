import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function StoreItem() {
  return (
    <View>
      <Image source={{uri: ""}} />
      <Text>Store Name</Text>
      <Text>Store Desc</Text>
    </View>
  )
}

const styles = StyleSheet.create({})