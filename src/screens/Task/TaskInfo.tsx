import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../types/navigation-types'


export type TaskInfoScreenRouteProp = RouteProp<RootStackParamList, "TaskInfo">

export default function TaskInfo() {

    const route = useRoute<TaskInfoScreenRouteProp>()
    const {workRequestUUID} = route.params || {}
    const [loading, setLoading] = useState({
        workRequestDetails: true,
        workRequestAttachments: true,
        workRequestHistory: true,
        workRequestNotes: true,
    })


    const fetchWorkRequestDetials = () => {

                

    }


  return (
    <View>
      <Text>{workRequestUUID}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})