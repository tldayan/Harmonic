import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../types/navigation-types'
import { getWorkRequestDetails } from '../../api/network-utils'
import TaskInfoDetails from './TaskInfoDetails'
import TaskHistory from './TaskHistory'


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


    const fetchWorkRequestDetails = async() => {

        const workRequestDetails = await getWorkRequestDetails(workRequestUUID)

    }


    return (
      <ScrollView contentContainerStyle={{gap: 15, paddingBottom: 50}} style={styles.container}>
        <TaskInfoDetails workRequestUUID={workRequestUUID} />
        <TaskHistory workRequestUUID={workRequestUUID} />
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
/*       borderWidth: 1, */
      flex: 1,
      paddingHorizontal: 10,
    }
  });