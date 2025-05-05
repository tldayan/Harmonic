import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../types/navigation-types'
import { getWorkRequestDetails } from '../../api/network-utils'
import TaskInfoDetails from './TaskInfoDetails'
import TaskHistory from './TaskHistory'
import TaskHeading from './TaskHeading'
import CustomButton from '../../components/CustomButton'
import Back from "../../assets/icons/chevron-left.svg"
import { NativeStackNavigationProp } from '@react-navigation/native-stack'


export type TaskInfoScreenRouteProp = RouteProp<RootStackParamList, "TaskInfo">

export default function TaskInfo() {

    const route = useRoute<TaskInfoScreenRouteProp>()
    const {workRequestUUID} = route.params || {}
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()


    return (
      <ScrollView contentContainerStyle={{gap: 15, paddingBottom: 50}} style={styles.container}>
        <CustomButton buttonStyle={{marginTop: 15}} onPress={() => navigation.goBack()} icon={<Back width={20} height={20}  />} />
        <TaskHeading workRequestUUID={workRequestUUID} />
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