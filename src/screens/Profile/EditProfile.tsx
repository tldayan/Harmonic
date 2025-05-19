import { ActivityIndicator, Image, Keyboard, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../../styles/colors'
import CustomButton from '../../components/CustomButton'
import { CustomTextInput } from '../../components/CustomTextInput'
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../styles/button-styles'
import { CardShadowStyles, profilePic, shadowStyles } from '../../styles/global-styles'
import CustomKeyboardAvoidingView from '../../components/CustomKeyboardAvoidingView'
import { getUserProfile, updateUserProfile } from '../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { firebaseStoragelocations, STATUS_CODE } from '../../utils/constants'
import { pickMedia, uploadLocalDocuments, uploadMedia } from '../../utils/helpers'
import CloseIcon from "../../assets/icons/close-light.svg"
import { Asset } from 'react-native-image-picker'
import { UserInfo } from '../../types/user-types'
import Toast from 'react-native-toast-message'
import EditProfileHeader from '../../navigation/CustomHeaders/EditProfileHeader'


export default function EditProfile() {

  const {userUUID} = useSelector((state: RootState) => state.auth)
/*   const [savedUserInfo, setSavedUserInfo] = useState<UserProfile | null>(null) */
  const [changedProfilePic, setChangedProfilePic] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updatingUserInfo, setUpdatingUserInfo] = useState(false)  

  const [userInfo, setUserInfo] = useState<UserProfile>({
/* UserId: 0, */
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
  BannerURL: "",
  })


  const fetchUserProfile = async() => {

    setLoading(true)
    try {
        const userProfileResponse = await getUserProfile(userUUID)
        const userProfile = userProfileResponse?.data.Payload
        if(userProfileResponse?.data.Status === STATUS_CODE.SUCCESS) {
         /*    setSavedUserInfo(userProfile) */
         setUserInfo({
/*           UserId: userProfile.UserId || 0, */
          UserUUID: userProfile.UserUUID || "",
          UserName: userProfile.UserName || "",
          FirstName: userProfile.FirstName || "",
          LastName: userProfile.LastName || "",
          Description: userProfile.Description || "",
          EmailAddress: userProfile.EmailAddress || "",
          GenderUUID: userProfile.GenderUUID || "",
          CountryUUID: userProfile.CountryUUID || "",
          NationalityUUID: userProfile.NationalityUUID || "",
          PhoneCountryUUID: userProfile.PhoneCountryUUID || "",
          PhoneNumber: userProfile.PhoneNumber || "",
          DateOfBirth: userProfile.DateOfBirth || "",
          CreatedBy: userProfile.CreatedBy || "",
          CreatedDateTime: userProfile.CreatedDateTime || "",
          ModifiedBy: userProfile.ModifiedBy || "",
          ModifiedDateTime: userProfile.ModifiedDateTime || "",
          ProfilePicURL: userProfile.ProfilePicURL || "",
          BannerURL: userProfile.BannerURL || ""
        });
        
              
        }

    } catch (err) {
        console.log(err)
    } finally {
        setLoading(false)
    }

  }

  useEffect(() => {
    fetchUserProfile()
  }, [])


  const validateFields = () => {
    const newErrors = {
      UserName: userInfo.UserName.trim() === "",
      FirstName: userInfo.FirstName.trim() === "",
      LastName: userInfo.LastName.trim() === "",
      EmailAddress: !userInfo.EmailAddress.includes("@") || userInfo.EmailAddress.trim() === "",
      PhoneNumber: userInfo.PhoneNumber.trim() === "",
      Description: userInfo.Description.trim() === "",
    };

    return !Object.values(newErrors).some(Boolean);
  };

  const handleUpdateProfile = async() => {

    let isFormComplete = validateFields()
    
 /*    if(!isFormComplete) {
      Toast.show({
        type: "error",
        text1: "Empty Fields!",
        text2: "Please ensure all fields are filled",
        position: "bottom",
     });
      return
    } */
    
    setUpdatingUserInfo(true)

    if(changedProfilePic) {
        const uploaded = await uploadMedia([userInfo.ProfilePicURL as Asset], firebaseStoragelocations.document);
        const userProfilePicFirebaseURL = uploaded[0]?.url || "";
        setUserInfo((prev) => ({...prev, profilePic: userProfilePicFirebaseURL}))
    }

    try {
        const updateProfileResponse = await updateUserProfile(userUUID, userInfo) 
        console.log(updateProfileResponse)
        if(updateProfileResponse.Status === STATUS_CODE.SUCCESS) {
            Toast.show({
                type: "success",
                text1: 'Profile Updated',
                text2: 'Your profile was successfully updated.',
                position: "bottom"
            });
        }

    } catch(err) {
        console.log(err)
    } finally {
        setUpdatingUserInfo(true)
        setUpdatingUserInfo(false)
    }




  }


  const handleChange = (field: string, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const uploadUserProfilePic = async() => {
      try {
        const assets = await pickMedia(true)
        const uri = assets[0]?.uri;
        if (typeof uri === 'string') {
          setUserInfo(prev => ({
            ...prev,
            profilePic: uri
          }));
          setChangedProfilePic(true)
        }
        
      } catch(err) {
        console.log(err)
      }
    }
    
  const removeProfilePic = () => {
    setUserInfo((prev) => ({...prev, profilePic: ""}))
  }

  return (
    <CustomKeyboardAvoidingView>
      <EditProfileHeader />
    {loading ? <ActivityIndicator size={"small"} style={{marginVertical: "50%"}} /> : <ScrollView >
      <View style={styles.editProfilePicContainer}>
        <Image style={styles.profilePic} source={{ uri: userInfo.ProfilePicURL || "https://i.pravatar.cc/150" }} />
        <CustomButton buttonStyle={styles.removeImageIcon} onPress={removeProfilePic} icon={<CloseIcon width={20} height={20} />} />
      </View>
      <CustomButton title={"Edit your picture"} onPress={uploadUserProfilePic} textStyle={styles.edit} />

      <View style={styles.userInfoContianer}>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>User Name</Text>
          <CustomTextInput
            noFlexGrow
            onChangeText={(text) => handleChange("UserName", text)}
            placeholder='Kajal'
            placeholderTextColor={colors.LIGHT_TEXT_COLOR}
            inputStyle={styles.inputField}
            value={userInfo.UserName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>First Name</Text>
          <CustomTextInput
            noFlexGrow
            onChangeText={(text) => handleChange("FirstName", text)}
            placeholder='Kajal'
            placeholderTextColor={colors.LIGHT_TEXT_COLOR}
            inputStyle={styles.inputField}
            value={userInfo.FirstName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Last Name</Text>
          <CustomTextInput
            noFlexGrow
            onChangeText={(text) => handleChange("LastName", text)}
            placeholder='Kajal'
            placeholderTextColor={colors.LIGHT_TEXT_COLOR}
            inputStyle={styles.inputField}
            value={userInfo.LastName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.title}>Email ID</Text>
          <CustomTextInput
            noFlexGrow
            onChangeText={(text) => handleChange("EmailAddress", text)}
            placeholder='kajalgirish9@gmail.com'
            placeholderTextColor={colors.LIGHT_TEXT_COLOR}
            inputStyle={styles.inputField}
            value={userInfo.EmailAddress}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.title}>Phone number</Text>
          <CustomTextInput
            noFlexGrow
            onChangeText={(text) => handleChange("PhoneNumber", text)}
            placeholder='+971562205251'
            placeholderTextColor={colors.LIGHT_TEXT_COLOR}
            inputStyle={styles.inputField}
            value={userInfo.PhoneNumber}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Description</Text>
          <CustomTextInput
            noFlexGrow
            onChangeText={(text) => handleChange("Description", text)}
            placeholder='About me'
            placeholderTextColor={colors.LIGHT_TEXT_COLOR}
            inputStyle={styles.inputField}
            value={userInfo.Description}
          />
        </View>

{/*         <View style={styles.inputContainer}>
          <Text style={styles.title}>Department</Text>
          <CustomTextInput
            noFlexGrow
            onChangeText={(text) => handleChange("department", text)}
            placeholder='IT'
            placeholderTextColor={colors.LIGHT_TEXT_COLOR}
            inputStyle={styles.inputField}
            value={userInfo.department}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.title}>Designation</Text>
          <CustomTextInput
            noFlexGrow
            onChangeText={(text) => handleChange("designation", text)}
            placeholder='Manager'
            placeholderTextColor={colors.LIGHT_TEXT_COLOR}
            inputStyle={styles.inputField}
            value={userInfo.designation}
          />
        </View>
      </View>

      <View style={styles.userInfoContianer}>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Address</Text>
          <CustomTextInput
            noFlexGrow
            onChangeText={(text) => handleChange("address", text)}
            placeholder='Caroline Palms'
            placeholderTextColor={colors.LIGHT_TEXT_COLOR}
            inputStyle={styles.inputField}
            value={userInfo.address}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.title}>Residing Since</Text>
          <CustomTextInput
            noFlexGrow
            onChangeText={(text) => handleChange("residingSince", text)}
            placeholder='June 2022'
            placeholderTextColor={colors.LIGHT_TEXT_COLOR}
            inputStyle={styles.inputField}
            value={userInfo.residingSince}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.title}>Tenant of</Text>
          <CustomTextInput
            noFlexGrow
            onChangeText={(text) => handleChange("tenantOf", text)}
            placeholder='Unit 103'
            placeholderTextColor={colors.LIGHT_TEXT_COLOR}
            inputStyle={styles.inputField}
            value={userInfo.tenantOf}
          />
        </View> */}
      </View>
    </ScrollView>}

      {!loading && <CustomButton 
        loading={updatingUserInfo}
        onPress={handleUpdateProfile}
        buttonStyle={[PRIMARY_BUTTON_STYLES, shadowStyles, styles.save]}
        textStyle={PRIMARY_BUTTON_TEXT_STYLES}
        title={"Save"}
      />}
    </CustomKeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  editProfilePicContainer: {
    alignSelf: "center",
    marginTop: 25,
    gap: 10
  },
  edit: {
    color: colors.ACTIVE_ACCENT_COLOR,
    marginTop: 10,
    textDecorationLine: "underline",
  },
  userInfoContianer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: "5%",
    width: "90%",
    borderRadius: 24,
    gap: 10,
    marginTop: 30,
  },
  removeImageIcon: {
    padding: 4,
    borderRadius: 50,
    position: "absolute",
    right: 3,
    bottom: 3,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: '500'
  },
  inputField: {
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_COLOR,
    width: 200
  },
  inputContainer: {
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  save: {
    marginHorizontal: 16,
    width: 300,
    alignSelf: "center"
  }
})
