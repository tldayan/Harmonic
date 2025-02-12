import { StyleSheet, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ModalsHeader from './ModalsHeader'

interface NotificationsProps {
    onClose: () => void
}

export default function Notifications({onClose}: NotificationsProps) {
  return (
            <SafeAreaView style={styles.container}>
                <ModalsHeader title='Notifications' lightCloseIcon={false} onClose={onClose} />
                <Text>notis</Text>
                <Text>notis</Text>
                <Text>notis</Text>
                <Text>notis</Text>
            </SafeAreaView>
  )
}

const styles = StyleSheet.create({

    container :{
        flex : 1, 
    },

})