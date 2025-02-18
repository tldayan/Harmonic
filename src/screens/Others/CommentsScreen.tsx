import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'
import { getMBMessageDetails } from '../../api/network-utils'
import { PostItemProps } from '../../types/post-types'
import ProfileHeader from '../../components/ProfileHeader'

type CommentsScreenRouteProp = RouteProp<RootStackParamList, "Comments">

export default function CommentsScreen() {

  const [messageDetails, setMessageDetails] = useState<PostItemProps | null>(null)
    
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute<CommentsScreenRouteProp>()
  
  const {postUUID} = route.params || {}

  useEffect(() => {

    if(!postUUID) return

    const fetchMBMessageDetails = async() => {
        const messageDetails = await getMBMessageDetails(postUUID)
        console.log(messageDetails)
        setMessageDetails(messageDetails)
    }

    fetchMBMessageDetails()

  }, [])
  

  return (
    <View style={styles.container}>
        {messageDetails && <ProfileHeader FirstName={messageDetails?.FirstName} CreatedDateTime={messageDetails?.CreatedDateTime} />}
        <Button onPress={() => navigation.goBack()} title="Go back" />
      <Text>{postUUID}</Text>
      <Text>{messageDetails?.FirstName}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container :{
        flex: 1,
        backgroundColor : "#FFFFFF",
    }
})