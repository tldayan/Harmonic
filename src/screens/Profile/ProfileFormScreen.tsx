import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import SetupProfile from './SetupProfile'
import CustomButton from '../../components/CustomButton'
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../styles/button-styles'
import { saveUserAddress, updateUserProfile } from '../../api/network-utils'
import { RootState } from '../../store/store'
import { useSelector } from 'react-redux'

const steps = [
    {id: "1", title : "Setup Profile"},
    {id: "2", title : "Tenant Information"},
    {id: "3", title : "Tenants"},
 ]

const width = Dimensions.get("window").width

interface ProfileFormScreenProps {
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  }
  

export default function ProfileFormScreen({setUserProfile} : ProfileFormScreenProps) {

    const [step, setStep] = useState(0)
    const flatListRef = useRef<FlatList<any>>(null)
    const userUUID = useSelector((state: RootState) => state.auth.userUUID)
    const [userInformation, setUserInformation] = useState<UserProfile>({
        UserId: 0,
        UserUUID: "",
        UserName: "",
        FirstName: "",
        LastName: "",
        Description: "",
        EmailAddress: "",
        GenderUUID: "",
        CountryUUID: "",
        NationalityUUID: "",
        PhoneCountryUUID: "",
        PhoneNumber: "",
        DateOfBirth: "",
        CreatedBy: "",
        CreatedDateTime: "",
        ModifiedBy: "",
        ModifiedDateTime: "",
        ProfilePicURL: "",
        BannerURL: ""
    })
    const [userAddress, setUserAddress] = useState<UserAddress>({
        UserAddressUUID: "",
        AddressUUID: "",
        IsDefault: false,
        UseForCommunication: false,
        UseForBilling: false,
        FullName: null,
        PhoneCountryId: null,
        PhoneCountryName: null,
        PhoneNumber: null,
        CountryId: 0,
        CountryName: "",
        StateId: 0,
        StateName: "",
        CityId: 0,
        CityName: "",
        StreetId: null,
        StreetName: null,
        PostCode: "",
        AddressLine1: "",
        AddressLine2: "",
        NearestLandmark: null
    })

    const stepOne = () => {
        return <View style={styles.innerContainer}>
            <SetupProfile setUserInformation={setUserInformation} userInformation={userInformation} setUserAddress={setUserAddress} userAddress={userAddress} />
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

        if(step === 0) {
            console.log("saving proifle")
            const updateUserProfileResponse = await updateUserProfile(userUUID, userInformation)
            const updateUserAddressResponse = await saveUserAddress(userUUID, userAddress)

            setUserProfile(updateUserProfileResponse.Payload)
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
            <CustomButton title={"Next"} onPress={next} buttonStyle={PRIMARY_BUTTON_STYLES} textStyle={PRIMARY_BUTTON_TEXT_STYLES} />
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