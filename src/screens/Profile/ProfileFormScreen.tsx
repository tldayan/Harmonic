import { Alert, Dimensions, FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import SetupProfile from './SetupProfile'
import CustomButton from '../../components/CustomButton'
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../styles/button-styles'
import { checkIfUserNameAlreadyExists, saveUserAddress, updateUserProfile } from '../../api/network-utils'
import { RootState } from '../../store/store'
import { useSelector } from 'react-redux'
import { saveUserProfileToRealm } from '../../database/management/realmUtils/saveUserProfileToRealm'
import Toast from 'react-native-toast-message'

const steps = [
    {id: "1", title : "Setup Profile"},
    {id: "2", title : "Tenant Information"},
    {id: "3", title : "Tenants"},
 ]

const width = Dimensions.get("window").width

interface ProfileFormScreenProps {
    userProfile: UserProfile | null
    userAddress: UserAddress | null
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  }

export interface FieldErrors {
    UserName: boolean;
    FirstName: boolean;
    LastName: boolean;
    EmailAddress: boolean;
    PhoneNumber: boolean;
    Description: boolean;
    AddressLine1: boolean;
    AddressLine2: boolean;
    CountryName: boolean;
    StateName: boolean;
    CityName: boolean;
    PostCode: boolean;
  }
  
  

export default function ProfileFormScreen({setUserProfile, userProfile, userAddress} : ProfileFormScreenProps) {

    const [step, setStep] = useState(0)
    const flatListRef = useRef<FlatList<any>>(null)
    const userUUID = useSelector((state: RootState) => state.auth.userUUID)
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userInformation, setUserInformation] = useState<UserProfile>({
/*         UserId: 0, */
        UserUUID: "",
        UserName: userProfile?.UserName || "",
        FirstName: userProfile?.FirstName || "",
        LastName: userProfile?.LastName || "",
        Description: userProfile?.Description || "",
        EmailAddress: userProfile?.EmailAddress || "",
        GenderUUID: "",
        CountryUUID: "",
        NationalityUUID: "",
        PhoneCountryUUID: userProfile?.PhoneCountryUUID || "",
        PhoneNumber: userProfile?.PhoneNumber || "",
        DateOfBirth: "",
        CreatedBy: "",
        CreatedDateTime: "",
        ModifiedBy: "",
        ModifiedDateTime: "",
        ProfilePicURL: "",
        BannerURL: ""
    })
    const [userAddressInformation, setUserAddressInformation] = useState<UserAddress>({
        UserAddressUUID: userAddress?.UserAddressUUID || "",
        AddressUUID: userAddress?.AddressUUID || "",
        IsDefault: false,
        UseForCommunication: false,
        UseForBilling: false,
        FullName: null,
        PhoneCountryId: userAddress?.PhoneCountryId || null,
        PhoneCountryName: null,
        PhoneNumber: userAddress?.PhoneNumber || null,
        CountryId: userAddress?.CountryId || null,
        CountryName: userAddress?.CountryName || "",
        StateId: userAddress?.StateId || null,
        StateName: userAddress?.StateName || "",
        CityId: userAddress?.CityId || null,
        CityName: userAddress?.CityName || "",
        StreetId: userAddress?.StreetId || null,
        StreetName: userAddress?.StreetName || null,
        PostCode: userAddress?.PostCode || "",
        AddressLine1: userAddress?.AddressLine1 || "",
        AddressLine2: userAddress?.AddressLine2 || "",
        NearestLandmark: null
    })
    const [errors, setErrors] = useState<FieldErrors>({
        UserName: false,
        FirstName: false,
        LastName: false,
        EmailAddress: false,
        PhoneNumber: false,
        Description: false,
        AddressLine1: false,
        AddressLine2: false,
        CountryName: false,
        StateName: false,
        CityName: false,
        PostCode: false,
      });
      

      const validateFields = () => {
        const newErrors = {
          UserName: userInformation.UserName.trim() === "",
          FirstName: userInformation.FirstName.trim() === "",
          LastName: userInformation.LastName.trim() === "",
          EmailAddress: !userInformation.EmailAddress.includes("@"),
          PhoneNumber: userInformation.PhoneNumber.trim() === "",
          Description: userInformation.Description.trim() === "",
          AddressLine1: userAddressInformation.AddressLine1.trim() === "",
          AddressLine2: userAddressInformation.AddressLine2.trim() === "",
          CountryName: userAddressInformation.CountryName.trim() === "",
          StateName: userAddressInformation.StateName.trim() === "",
          CityName: userAddressInformation.CityName.trim() === "",
          PostCode: userAddressInformation.PostCode.trim() === "",
        };
      
        setErrors(newErrors);
    
        return !Object.values(newErrors).some(Boolean);
      };

    const stepOne = () => {
        return <View style={styles.innerContainer}>
            <SetupProfile errors={errors} setUserInformation={setUserInformation} userInformation={userInformation} setUserAddressInformation={setUserAddressInformation} userAddressInformation={userAddressInformation} termsAccepted={termsAccepted} setTermsAccepted={setTermsAccepted} />
        </View>
    }

    const stepTwo = () => {
        return <View style={styles.innerContainer}>
            {/* <SetupProfile /> */}
        </View>
    }

    const stepThree = () => {
        return <View style={styles.innerContainer}>
            {/* <SetupProfile /> */}
        </View>
    }


    const next = async() => {
        setLoading(true)
        const isFormComplete = validateFields()
        if(!isFormComplete || !termsAccepted) {
            Toast.show({
                type: "error",
                text1: "Empty Fields!",
                text2: !isFormComplete ? "Please ensure all fields are filled" : "Please accept the Terms of Use and Privacy Policy to proceed.",
                position: "bottom",
            });
            setLoading(false)
            return
        }

        if(step === 0) {
            console.log("saving proifle")
            try {
                const checkUserNameExistsResponse = await checkIfUserNameAlreadyExists(userUUID, userInformation.UserName) 
                if(checkUserNameExistsResponse.Payload) {
                    Toast.show({
                        type: "error",
                        text1: "Username taken!",
                        text2: "That username is taken. Try something else!",
                        position: "bottom",
                    });
                    return
                }
                const updateUserProfileResponse = await updateUserProfile(userUUID, userInformation)
                const updateUserAddressResponse = await saveUserAddress(userUUID, userAddressInformation)
                console.log(updateUserProfileResponse)
                console.log(updateUserAddressResponse)
                
                saveUserProfileToRealm(updateUserProfileResponse.Payload)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }

        }

        /* if(step <= 1) {
            setStep((prev) => prev + 1)
        } */

    }


        useEffect(() => {
            flatListRef.current?.scrollToIndex({index: step})
        }, [step])
    

        const back = () => {
            setStep((prev) => prev - 1)
        }
    


  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={steps}
        renderItem={({item,index}) => index === 0 ? stepOne() : index === 1 ? stepTwo() : stepThree()}
        keyExtractor={(item) => item.id}
        horizontal
        scrollEnabled={false}
        pagingEnabled
      />

        <View style={styles.nextButtonContainer}>
            <CustomButton loading={loading} title={"Done"} onPress={next} buttonStyle={PRIMARY_BUTTON_STYLES} textStyle={PRIMARY_BUTTON_TEXT_STYLES} />
        </View>
        
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    innerContainer : {
        paddingHorizontal: 16,
     /*    borderWidth: 2, */
/*         marginHorizontal: 16, */
        backgroundColor: "white",
        width: width
    },
    nextButtonContainer: {
        paddingHorizontal: 16
    },
    title: {
        fontSize: 24,
        marginVertical: 10,
        fontWeight: 800
    }
})