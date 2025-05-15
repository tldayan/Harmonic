import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CustomTextInput } from '../../components/CustomTextInput'
import { defaultInputLabelStyles, defaultInputStyles, defaultNumberInputStyles } from '../../styles/global-styles'
import CustomSelectInput from '../../components/CustomSelectInput';
import CustomTextAreaInput from '../../components/CustomTextAreaInput';
import { CustomModal } from '../../components/CustomModal';
import SelectCountry from '../../modals/Profile/SelectCountry';
import { getAllCitiesForCountryAndState, getAllCountries, getAllStatesForCountry } from '../../api/network-utils';
import SelectState from '../../modals/Profile/SelectState';
import SelectCity from '../../modals/Profile/SelectCity';

interface SetupProfileProps {
    setUserInformation: React.Dispatch<React.SetStateAction<UserProfile>>;
    userInformation: UserProfile;
    setUserAddress: React.Dispatch<React.SetStateAction<UserAddress>>;
    userAddress: UserAddress;
}


export default function SetupProfile({ setUserInformation, userInformation, setUserAddress, userAddress }: SetupProfileProps) {  
    
    
    const [selectingCountry, setSelectingCountry] = useState(false)
    const [selectingState, setSelectingState] = useState(false)
    const [selectingCity, setSelectingCity] = useState(false)
    const [countries, setCountries] = useState<Country[]>([])
    const [states, setStates] = useState<State[]>([])
    const [cities, setCities] = useState<City[]>([])

    useEffect(() => {

        const fetchCountries = async () => {
          try {
            const countriesResponse = await getAllCountries();
            setCountries(countriesResponse.Payload);
          } catch (err) {
            console.log(err);
          }
        };
      
        fetchCountries();
      }, []);
      
      useEffect(() => {
        const fetchStates = async () => {
          if (!userAddress.CountryId) return;
      
          try {
            const statesResponse = await getAllStatesForCountry(userAddress.CountryId.toString());
            setStates(statesResponse.Payload);
          } catch (err) {
            console.log(err);
          }
        };
      
        fetchStates();
      }, [userAddress.CountryId]);
      
      useEffect(() => {
        const fetchCities = async () => {
          if (!userAddress.CountryId || !userAddress.StateId) return;
      
          try {
            const citiesResponse = await getAllCitiesForCountryAndState(
              userAddress.CountryId.toString(),
              userAddress.StateId.toString()
            );
            setCities(citiesResponse.Payload);
          } catch (err) {
            console.log(err);
          }
        };
      
        fetchCities();
      }, [userAddress.CountryId, userAddress.StateId]);
      


  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>

        <Text style={styles.title}>Setup Profile</Text>

        <CustomTextInput value={userInformation.FirstName} labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserInformation((prev) => ({...prev, FirstName: e}))} label='FirstName' inputStyle={defaultInputStyles} placeholder='Jitesh' />
        <CustomTextInput value={userInformation.LastName ?? ""} labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserInformation((prev) => ({...prev, LastName: e}))} label='LastName' inputStyle={defaultInputStyles} placeholder='Adnani' />
        <CustomTextInput value={userInformation.EmailAddress} labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserInformation((prev) => ({...prev, EmailAddress: e}))} label='Email' inputStyle={defaultInputStyles} placeholder='jitesh@gmail.com' />
        <CustomTextInput value={userInformation.PhoneNumber} labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserInformation((prev) => ({...prev, PhoneNumber: e}))} label='Phone' inputStyle={defaultNumberInputStyles} placeholder='567136828' /* mainInputStyle={styles.numberInput} */ inputMode='tel' />
        
        <CustomTextAreaInput value={userInformation.Description ?? ""} multiline label='Description' labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserInformation((prev) => ({...prev, Description: e}))} placeholder='About me'  />
        <CustomTextInput value={userAddress.AddressLine1} labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserAddress((prev) => ({...prev, AddressLine1: e}))} label='Address Line 1' inputStyle={defaultInputStyles} placeholder='JVC' />
        <CustomTextInput value={userAddress.AddressLine2} labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserAddress((prev) => ({...prev, AddressLine2: e}))} label='Address Line 2' inputStyle={defaultInputStyles} placeholder='Street 10' />

        <CustomSelectInput placeholder={userAddress.CountryName ? userAddress.CountryName : 'Select Country'} label='Country' labelStyle={defaultInputLabelStyles} onSelect={() => setSelectingCountry(true)} />
        <CustomSelectInput placeholder={userAddress.StateName ? userAddress.StateName : "Select State"} label='State' labelStyle={defaultInputLabelStyles} onSelect={() => setSelectingState(true)} />
        <CustomSelectInput placeholder={userAddress.CityName ? userAddress.CityName : "Select City"} label='City' labelStyle={defaultInputLabelStyles} onSelect={() => setSelectingCity(true)} />

        <CustomTextInput inputMode="numeric" value={userAddress.PostCode} labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserAddress((prev) => ({...prev, PostCode: e}))} label='Zip Code' inputStyle={defaultInputStyles} placeholder='00000' />
   
        <CustomModal isOpen={selectingCountry} onClose={() => setSelectingCountry(false)}>
            <SelectCountry countries={countries} setUserAddress={setUserAddress} onClose={() => setSelectingCountry(false)} />
        </CustomModal>

        <CustomModal isOpen={selectingState} onClose={() => setSelectingState(false)}>
            <SelectState states={states} setUserAddress={setUserAddress} onClose={() => setSelectingState(false)} />
        </CustomModal>

        <CustomModal isOpen={selectingCity} onClose={() => setSelectingCity(false)}>
            <SelectCity cities={cities} setUserAddress={setUserAddress} onClose={() => setSelectingCity(false)} />
        </CustomModal>
   

    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
/*         borderWidth: 2, */
        flex: 1,
    },
    label: {
        marginBottom: 10,
        fontWeight: 500
    },
    numberInput: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    },
    title: {
        fontSize: 24,
        marginVertical: 10,
        fontWeight: 800
    }
})