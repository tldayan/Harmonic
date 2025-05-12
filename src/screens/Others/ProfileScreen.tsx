import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Edit from "../../assets/icons/editPage.svg"
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'
import { getUserProfile } from '../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

export default function ProfileScreen() {

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const {userUUID} = useSelector((state: RootState) => state.auth)
  
  const fetchUserProfile = async() => {

    try {

      const userProfileResponse = await getUserProfile(userUUID)
      setUserProfile(userProfileResponse?.data.Payload)
       
    } catch (err) {
      console.log(err)
    }

  }

  useEffect(() => {

    fetchUserProfile()

  }, [])


  return (
    <View>
      <View style={styles.mainProfileInfoContainer}>
        <Image style={styles.profilePic} source={{uri: "https://i.pravatar.cc/150"}} />
        <View style={styles.profileInfoContainer}>
          <View style={styles.tenantInfoContainer}>
            <View>
              <Text style={styles.name}>{userProfile?.FirstName} {userProfile?.LastName}</Text>
              <Text>Tenant at 103</Text>
            </View>
            <CustomButton onPress={() => navigation.navigate("EditProfile")} icon={<Edit width={18} height={18} />} />
          </View>
          <View style={styles.userStatsContainer}>
            <View>
              <Text style={styles.statTitle}>Connections</Text>
              <Text>100</Text>
            </View>
            <View>
              <Text style={styles.statTitle}>Posts</Text>
              <Text>100</Text>
            </View>
            <View>
              <Text style={styles.statTitle}>Tasks</Text>
              <Text>100</Text>
            </View>
          </View>
        </View>  
      </View> 
      <Text style={styles.about}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veniam magnam optio nobis quae. Enim, nobis voluptatibus. Maiores aliquid, porro vel earum tempore quasi non autem maxime voluptates necessitatibus sunt vero.</Text>
    </View>
  )
}

const styles = StyleSheet.create({

  mainProfileInfoContainer: {
/*     borderWidth: 1, */
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: "row",
    gap: 10
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  name: {
    fontSize: 16
  },
  tenantInfoContainer: {
/*     borderWidth: 1, */
    flexDirection: "row",
    justifyContent: "space-between"
  },
  profileInfoContainer: {
/*     borderWidth: 1, */
    gap: 10,
    flex: 1,
  },
  userStatsContainer: {
    borderWidth: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: "auto"
    
  },
  statTitle: {
    fontWeight: 500,
    fontSize: 16
  },
  about: {
    marginHorizontal: 16,
    marginTop: 10
  }

})