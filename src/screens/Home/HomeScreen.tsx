import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { firebase } from '@react-native-firebase/auth'
import { useUser } from '../../context/AuthContext'
import { handleSignOut } from '../../services/auth-service'

export default function HomeScreen() {

  const {user} = useUser()

  return (
    <View style={{flex : 1, justifyContent :"center"}}>
      <Text>
        HOME SCREEN {user ? user.email : 'No user signed in'}
      </Text>
      <Button title='Sign Out' onPress={handleSignOut} />
    </View>
  )
}

const styles = StyleSheet.create({})