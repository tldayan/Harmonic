import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ChevronLeft from  "../../assets/icons/chevron-left.svg"
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'


export default function EditProfileHeader() {

        const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    
  return (
    <View style={{
            backgroundColor: '#fff',
            justifyContent: "space-between",
            marginHorizontal: 16,
            paddingHorizontal: 16,
            borderRadius: 50,
            alignItems: "center",
            flexDirection: "row",
            
            paddingVertical: 10,
            marginVertical: 16,
        }}>
        <CustomButton onPress={() => navigation.goBack()} icon={<ChevronLeft width={20} height={20} />} />
        <Text style={{fontWeight: 'bold' }}>Edit Profile</Text>
        <View></View>
    </View>
  )
}

const styles = StyleSheet.create({})