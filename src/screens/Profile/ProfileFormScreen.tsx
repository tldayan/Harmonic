import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import SetupProfile from './SetupProfile'
import CustomButton from '../../components/CustomButton'
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../styles/button-styles'

const steps = [
    {id: "1", title : "Setup Profile"},
    {id: "2", title : "Tenant Information"},
    {id: "3", title : "Tenants"},
 ]

const width = Dimensions.get("window").width

export default function ProfileFormScreen() {

    const [step, setStep] = useState(0)
    const flatListRef = useRef<FlatList<any>>(null)
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


    const next = () => {

        if(step <= 1) {
            setStep((prev) => prev + 1)
        }

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

        <CustomButton title={"Next"} onPress={next} buttonStyle={PRIMARY_BUTTON_STYLES} textStyle={PRIMARY_BUTTON_TEXT_STYLES} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer : {
        paddingHorizontal: 16,
/*         borderWidth: 2, */
        width: width
    },
})