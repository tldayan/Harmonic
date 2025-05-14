import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { CustomTextInput } from '../../components/CustomTextInput'
import { defaultInputStyles, defaultNumberInputStyles } from '../../styles/global-styles'
import CustomSelectInput from '../../components/CustomSelectInput';

interface SetupProfileProps {
    setUserInformation: React.Dispatch<React.SetStateAction<UserProfile>>;
    userInformation: UserProfile;
    setUserAddress: React.Dispatch<React.SetStateAction<UserAddress>>;
    userAddress: UserAddress;
}


export default function SetupProfile({ setUserInformation, userInformation, setUserAddress, userAddress }: SetupProfileProps) {    
  return (
    <View style={styles.container}>

        <CustomTextInput value={userInformation.FirstName} labelStyle={styles.label} onChangeText={(e) => setUserInformation((prev) => ({...prev, FirstName: e}))} label='FirstName' inputStyle={defaultInputStyles} placeholder='Jitesh' />
        <CustomTextInput value={userInformation.FirstName} labelStyle={styles.label} onChangeText={(e) => setUserInformation((prev) => ({...prev, FirstName: e}))} label='LastName' inputStyle={defaultInputStyles} placeholder='Adnani' />
        <CustomTextInput value={userInformation.FirstName} labelStyle={styles.label} onChangeText={(e) => setUserInformation((prev) => ({...prev, FirstName: e}))} label='Email' inputStyle={defaultInputStyles} placeholder='jitesh@gmail.com' />
        <CustomTextInput value={userInformation.FirstName} labelStyle={styles.label} onChangeText={(e) => setUserInformation((prev) => ({...prev, FirstName: e}))} label='Phone' inputStyle={defaultNumberInputStyles} placeholder='567136828' /* mainInputStyle={styles.numberInput} */ inputMode='tel' />
        
        <CustomTextInput value={userInformation.FirstName} labelStyle={styles.label} onChangeText={(e) => setUserInformation((prev) => ({...prev, FirstName: e}))} label='Address Line 1' inputStyle={defaultInputStyles} placeholder='Tarun' />
        <CustomTextInput value={userInformation.FirstName} labelStyle={styles.label} onChangeText={(e) => setUserInformation((prev) => ({...prev, FirstName: e}))} label='Address Line 2' inputStyle={defaultInputStyles} placeholder='Tarun' />

     {/*    <CustomSelectInput onSelect={() => {}} /> */}

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        flex: 1,
    },
    label: {
        marginBottom: 10,
        fontWeight: 500
    },
    numberInput: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    }
})