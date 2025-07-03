import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CustomTextInput } from '../../components/CustomTextInput'
import { defaultInputLabelStyles, defaultInputStyles, defaultNumberInputStyles } from '../../styles/global-styles'
import CustomSelectInput from '../../components/CustomSelectInput';
import CustomTextAreaInput from '../../components/CustomTextAreaInput';
import SelectCountry from '../../modals/Profile/SelectCountry';
import { getAllCitiesForCountryAndState, getAllCountries, getAllStatesForCountry } from '../../api/network-utils';
import SelectState from '../../modals/Profile/SelectState';
import SelectCity from '../../modals/Profile/SelectCity';
import { colors } from '../../styles/colors';
import Check from "../../assets/icons/check.svg"
import { FieldErrors } from './ProfileFormScreen';
import OTPInput from '../../components/OPTInput';
import CustomButton from '../../components/CustomButton';
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../styles/button-styles';
import { confirmCode, handlePhoneNumberVerification } from '../../services/auth-service';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import { useBottomSheet } from '../../components/BottomSheetContext';

interface SetupProfileProps {
    setUserInformation: React.Dispatch<React.SetStateAction<UserProfile>>;
    userInformation: UserProfile;
    setUserAddressInformation: React.Dispatch<React.SetStateAction<UserAddress>>;
    userAddressInformation: UserAddress;
    termsAccepted: boolean
    setTermsAccepted: React.Dispatch<React.SetStateAction<boolean>>
    errors: FieldErrors
}


export default function SetupProfile({ setUserInformation, userInformation, setUserAddressInformation, userAddressInformation, termsAccepted, setTermsAccepted, errors }: SetupProfileProps) {  
    
    const [countries, setCountries] = useState<CountryName[]>([])
    const [states, setStates] = useState<State[]>([])
    const [cities, setCities] = useState<City[]>([])
    const [code, setCode] = useState<string>(''); 
    const [otpError, setOtpError] = useState("")
    const [confirmation, setConfirmation] = useState<FirebaseAuthTypes.PhoneAuthSnapshot | null>(null);
    const [showSendOtp, setShowSendOtp] = useState(false)
  const { open: openBottomSheet, close: closeBottomSheet } = useBottomSheet();

    useEffect(() => {

        const fetchCountries = async () => {
          try {
            const countriesResponse = await getAllCountries();
            setCountries(countriesResponse);
          } catch (err) {
            console.log(err);
          }
        };
      
        fetchCountries();
      }, []);
      
      useEffect(() => {
        const fetchStates = async () => {
          if (!userAddressInformation.CountryId) return;
      
          try {
            const statesResponse = await getAllStatesForCountry(userAddressInformation.CountryId.toString());
            setStates(statesResponse.Payload);
          } catch (err) {
            console.log(err);
          }
        };
      
        fetchStates();
      }, [userAddressInformation.CountryId]);
      
      useEffect(() => {
        const fetchCities = async () => {
          if (!userAddressInformation.CountryId || !userAddressInformation.StateId) return;
      
          try {
            const citiesResponse = await getAllCitiesForCountryAndState(
              userAddressInformation.CountryId.toString(),
              userAddressInformation.StateId.toString()
            );
            setCities(citiesResponse.Payload);
          } catch (err) {
            console.log(err);
          }
        };
      
        fetchCities();
      }, [userAddressInformation.CountryId, userAddressInformation.StateId]);
      

      const handleOpenCounties = () => {
            openBottomSheet(
                <SelectCountry countries={countries} setUserAddressInformation={setUserAddressInformation} onClose={() => closeBottomSheet()} />,
              { snapPoints: ['50%'] }
            );
      }
      
      const handleOpenStates = () => {
            openBottomSheet(
              <SelectState states={states} setUserAddressInformation={setUserAddressInformation} onClose={() => closeBottomSheet()} />,
              { snapPoints: ['50%'] }
            );
      }

      const handleOpenCities = () => {
            openBottomSheet(
              <SelectCity cities={cities} setUserAddressInformation={setUserAddressInformation} onClose={() => closeBottomSheet()} />,
              { snapPoints: ['50%'] }
            );
      }

      const verifyOTP = async () => {
        if (confirmation) {
          const result = await confirmCode(confirmation, code);
          
          if (result.success) {
            Toast.show({
              type: "success",
              text1: "Phone Number Verified",
              text2: "Phone number linked successfully to your account.",
              position: "bottom",
            });
            
            setConfirmation(null)
          } else {
            setOtpError(result.error ?? "");
          }
        }
      };
      

      const handleOTP = async () => {
        if (!userInformation.PhoneNumber || !userInformation.PhoneCountryUUID) {
          return;
        }
 
        setShowSendOtp(false)
        setOtpError("")
        setConfirmation(null)
        const joinedNumber = `+${userInformation.PhoneCountryUUID.PhoneCode}${userInformation.PhoneNumber}`;
        console.log(joinedNumber)
        try {
          const phoneConfirmation = await handlePhoneNumberVerification(joinedNumber);
          console.log(phoneConfirmation)
          setConfirmation(phoneConfirmation);
        } catch (error) {
          console.error('Phone verification failed:', error);
        }
      };


      useEffect(() => {
  
        if(userInformation.PhoneNumber) {
          setShowSendOtp(true)
        } else {
          setShowSendOtp(false)
        }
        
        if(confirmation) {
          setConfirmation(null)
        }
      }, [userInformation.PhoneNumber])

      useEffect(() => {
        console.log(userInformation)
      },[userInformation])


  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>

        <Text style={styles.title}>Setup Profile</Text>

        <CustomTextInput value={userInformation.UserName} hasError={errors.UserName} labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserInformation((prev) => ({...prev, UserName: e}))} label='User Name' inputStyle={defaultInputStyles} placeholder='Jitesh_Adnani' />
        <CustomTextInput value={userInformation.FirstName} hasError={errors.FirstName} labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserInformation((prev) => ({...prev, FirstName: e}))} label='First Name' inputStyle={defaultInputStyles} placeholder='Jitesh' />
        <CustomTextInput value={userInformation.LastName ?? ""} hasError={errors.LastName} labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserInformation((prev) => ({...prev, LastName: e}))} label='Last Name' inputStyle={defaultInputStyles} placeholder='Adnani' />
        <CustomTextInput value={userInformation.EmailAddress} hasError={errors.EmailAddress} labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserInformation((prev) => ({...prev, EmailAddress: e}))} label='Email' inputStyle={defaultInputStyles} placeholder='jitesh@gmail.com' />
        
        <View style={{flexDirection: "row", gap: 10}}>
          <CustomTextInput setCountryCode={(phoneCode) => setUserInformation((prev) => ({...prev, PhoneCountryUUID: phoneCode }))} hasError={errors.PhoneNumber} countryCode={userInformation.PhoneCountryUUID ? userInformation.PhoneCountryUUID : undefined} value={userInformation.PhoneNumber} labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserInformation((prev) => ({...prev, PhoneNumber: e}))} label='Phone' inputStyle={defaultNumberInputStyles} placeholder='567136828' /* mainInputStyle={styles.numberInput} */ inputMode='tel' />
          {(userInformation.PhoneNumber && showSendOtp) && <CustomButton onPress={handleOTP} title={confirmation ? "Resend OTP" : "Send OTP"} buttonStyle={[PRIMARY_BUTTON_STYLES, {marginTop: "auto", marginBottom: 0, paddingHorizontal: 20}]} textStyle={PRIMARY_BUTTON_TEXT_STYLES} />}
        </View>
        
        {confirmation && <View style={styles.otpContainer}>
          <OTPInput errorMessage={otpError} setCode={setCode} />
          <CustomButton onPress={verifyOTP} title={"Verify OTP"} buttonStyle={[PRIMARY_BUTTON_STYLES, {marginBottom: 0}]} textStyle={PRIMARY_BUTTON_TEXT_STYLES} />
        </View>}

        <CustomTextAreaInput value={userInformation.Description ?? ""} hasError={errors.Description} multiline label='Description' labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserInformation((prev) => ({...prev, Description: e}))} placeholder='About me'  />
        <CustomTextInput value={userAddressInformation.AddressLine1} hasError={errors.AddressLine1} labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserAddressInformation((prev) => ({...prev, AddressLine1: e}))} label='Address Line 1' inputStyle={defaultInputStyles} placeholder='JVC' />
        <CustomTextInput value={userAddressInformation.AddressLine2} hasError={errors.AddressLine2} labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserAddressInformation((prev) => ({...prev, AddressLine2: e}))} label='Address Line 2' inputStyle={defaultInputStyles} placeholder='Street 10' />

        <CustomSelectInput placeholder={userAddressInformation.CountryName ? userAddressInformation.CountryName : 'Select Country'} hasError={errors.CountryName} label='Country' labelStyle={defaultInputLabelStyles} onSelect={() => handleOpenCounties()} />
        <CustomSelectInput placeholder={userAddressInformation.StateName ? userAddressInformation.StateName : "Select State"} hasError={errors.StateName} label='State' labelStyle={defaultInputLabelStyles} onSelect={() => handleOpenStates()} />
        <CustomSelectInput placeholder={userAddressInformation.CityName ? userAddressInformation.CityName : "Select City"} hasError={errors.CityName} label='City' labelStyle={defaultInputLabelStyles} onSelect={() => handleOpenCities()} />

        <CustomTextInput inputMode="numeric" value={userAddressInformation.PostCode} hasError={errors.PostCode} labelStyle={defaultInputLabelStyles} onChangeText={(e) => setUserAddressInformation((prev) => ({...prev, PostCode: e}))} label='Zip Code' inputStyle={defaultInputStyles} placeholder='00000' />



        <TouchableOpacity onPress={() => setTermsAccepted((prev) => !prev)} style={styles.termsContainer}>
          <View  style={[styles.checkbox, termsAccepted ? {backgroundColor: "blue", borderColor: "none"} : null]}>
              {termsAccepted && <Check width={10} height={10} />}
          </View>

          <View style={styles.textWrapper}>
            <Text style={styles.termsText}>
              By signing up, you are creating a Harmonic account, and you agree to Harmonic’s{' '}
              <Text style={styles.link} onPress={() => {}}>Terms of Use</Text> and
              <Text style={styles.link} onPress={() => {}}> Privacy Policy</Text>.
            </Text>
          </View>
        </TouchableOpacity>




       {/*  <CustomModal isOpen={selectingCountry} onClose={() => setSelectingCountry(false)}>
            <SelectCountry countries={countries} setUserAddressInformation={setUserAddressInformation} onClose={() => setSelectingCountry(false)} />
        </CustomModal> */}
{/* 
        <CustomModal isOpen={selectingState} onClose={() => setSelectingState(false)}>
            <SelectState states={states} setUserAddressInformation={setUserAddressInformation} onClose={() => setSelectingState(false)} />
        </CustomModal> */}

   {/*      <CustomModal isOpen={selectingCity} onClose={() => setSelectingCity(false)}>
            <SelectCity cities={cities} setUserAddressInformation={setUserAddressInformation} onClose={() => setSelectingCity(false)} />
        </CustomModal> */}
   

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
    },
    checkbox: {
      borderWidth: 1,
      borderColor: colors.BORDER_COLOR,
      width: 16,
      height: 16,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 4
    },
    termsText: {
      color: colors.TEXT_COLOR, 
      textAlign: "left",
    },
    termsContainer : {
/*       borderWidth: 1, */
      marginVertical: 10,
      flexDirection: 'row',
      gap: 5,
    },
    textWrapper: {
      flex: 1,
    },
    link: {
      color: colors.ACTIVE_ACCENT_COLOR,
    },
    otpContainer: {
      borderWidth: 1, 
      borderColor: colors.BORDER_COLOR, 
      borderRadius: 24, 
      paddingHorizontal: 20, 
      paddingBottom: 20, 
      marginTop: 10}
})