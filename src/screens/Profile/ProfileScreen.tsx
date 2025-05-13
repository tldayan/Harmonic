import { Image, StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Edit from "../../assets/icons/editPage.svg"
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'
import { getUserProfile } from '../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import ImageIcon from "../../assets/icons/image-2.svg"
import Calender from "../../assets/icons/calendar.svg"
import Clipboard from "../../assets/icons/clipboard.svg"
import { colors } from '../../styles/colors'
import SocialScreen from '../Tabs/SocialScreen'
import EventsScreen from '../Tabs/EventsScreen'
import TasksScreen from '../Task/TasksScreen'
import { CardShadowStyles } from '../../styles/global-styles'
import EditIcon from "../../assets/icons/pencil-edit.svg"
import ChevronLeft from "../../assets/icons/chevron-left.svg"

const Tab = createMaterialTopTabNavigator()

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const [loading, setLoading] = useState(true)
  const { userUUID } = useSelector((state: RootState) => state.auth)

  const fetchUserProfile = async () => {
    try {
      const userProfileResponse = await getUserProfile(userUUID)
      setUserProfile(userProfileResponse?.data.Payload)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {/* Header: Profile Info */}
    <View style={[styles.mainProfileInfoContainer, /* CardShadowStyles */]}>
      <CustomButton buttonStyle={styles.back} onPress={() => navigation.goBack()} icon={<ChevronLeft width={23} height={23} />} />
      {loading ? <ActivityIndicator size={"small"} style={{marginVertical: "10%"}} /> : <View>
        <View style={styles.mainInnerProfileInfoContainer}>
          <Image style={styles.profilePic} source={{ uri: "https://i.pravatar.cc/150" }} />
          <View style={styles.profileInfoContainer}>
            <View style={styles.tenantInfoContainer}>
              <View>
                <Text style={styles.name}>{userProfile?.FirstName} {userProfile?.LastName}</Text>
                <Text>Tenant at 103</Text>
              </View>
              <CustomButton buttonStyle={styles.edit} onPress={() => navigation.navigate("EditProfile")} icon={<EditIcon width={20} height={20} />} />
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
      </View>}
      <Text style={styles.about}>{userProfile?.Description}</Text>
  </View>

      {/* Tabs Section */}
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            tabBarShowIcon: true,
            tabBarIndicatorStyle: { backgroundColor: colors.ACTIVE_ORANGE },
            tabBarStyle: { backgroundColor: "transparent", borderBottomWidth: 1, borderColor: colors.BORDER_COLOR, shadowColor: "transparent" },
            tabBarLabelStyle: { fontWeight: "500" },
            tabBarItemStyle: { flexDirection: "row", alignItems: 'center' }
          }}
        >
          <Tab.Screen
            name="SocialScreen"
            options={{
              tabBarIcon: ({focused}) => <ImageIcon width={18} height={18} fill={focused ? "black" : colors.LIGHT_TEXT_COLOR} />,
              tabBarLabel: () => null,
            }}
          >
            {() => <SocialScreen filterUserPosts />}
          </Tab.Screen>

          <Tab.Screen
            name="EventsScreen"
            options={{
              tabBarIcon: ({focused}) => <Calender width={18} height={18} fill={focused ? "black" : colors.LIGHT_TEXT_COLOR} />,
              tabBarLabel: () => null,
            }}
          >
            {() => <EventsScreen filterUserEvents />}
          </Tab.Screen>
          <Tab.Screen
            name="TasksScreen"
            options={{
              tabBarIcon: ({focused}) => <Clipboard width={18} height={18} fill={focused ? "black" : colors.LIGHT_TEXT_COLOR} />,
              tabBarLabel: () => null,
            }}
          >
            {() => <TasksScreen filterUserTasks />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainProfileInfoContainer: {
    width: "90%",
    marginHorizontal: "5%",
/*     borderWidth: 1, */
/*     marginVertical: 20,
    width: "96%",
    backgroundColor : "white",
    borderRadius: 24,
    marginHorizontal: "2%", */
  },  
  mainInnerProfileInfoContainer: {
/*     marginHorizontal: 16, */
    marginTop: 15,
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
    flexDirection: "row",
    justifyContent: "space-between"
  },
  profileInfoContainer: {
    gap: 10,
    flex: 1,
  },
  userStatsContainer: {
/*     borderWidth: 1, */
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: "auto"
  },
  statTitle: {
    fontWeight: '500',
    fontSize: 16
  },
  about: {
/*     marginHorizontal: 16, */
    marginVertical: 10
  },
   edit: {
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 25,
    borderColor: colors.BORDER_COLOR,
    justifyContent: "center",
    alignItems: "center"
   },
   back: {
    marginTop: 15
   }
})
