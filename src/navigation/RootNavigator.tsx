import React, { useEffect, useState } from "react"
import AuthScreen from "../screens/Auth/AuthScreen"
import { Stack } from "./navigationUtils"
import TabNavigator from "./TabNavigator"
import { globalScreenOptions } from "./navigationConfig/globalScreenOptions"
import { useUser } from "../context/AuthContext"
import HeroScreen from "../screens/Hero/HeroScreen"
import CommentsScreen from "../screens/Others/CommentsScreen"
import ChatScreen from "../screens/Chat/ChatScreen"
import UserInfo from "../screens/Chat/ChatInfo"
import ProfileScreen from "../screens/Profile/ProfileScreen"
import TaskInfo from "../screens/Task/TaskInfo"
import ChatsList from "../screens/Chat/ChatList"
import ChatsScreen from "../screens/Chat/ChatsTabs"
import AddModalScreen from "../modals/BottomTabActions"
import { useAuthMode } from "../context/AuthModeContext"
import { EventScreen } from "../screens/Others/EventScreen"
import EditProfile from "../screens/Profile/EditProfile"
import { Text } from "react-native-gesture-handler"
import { View } from "react-native"
import CustomButton from "../components/CustomButton"
import ChevronLeft from  "../assets/icons/chevron-left.svg"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../types/navigation-types"
import EditProfileHeader from "./CustomHeaders/EditProfileHeader"
import { getUserProfile } from "../api/network-utils"
import { useSelector } from "react-redux"
import { RootState } from "../store/store"
import ProfileFormScreen from "../screens/Profile/ProfileFormScreen"
import LoadingScreen from "../screens/Others/LoadingScreen"

export const RootNavigator: React.FC = () => {

    const {user} = useUser()    
    const userUUID = useSelector((state: RootState) => state.auth.userUUID)
    const [loading, setLoading] = useState(true);
   /*  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>() */
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userProfileResponse = await getUserProfile(userUUID);
                setUserProfile(userProfileResponse?.data.Payload);
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserProfile();
        } else {
            setLoading(false); // skip loading if no user
        }
    }, [user]);


    const userProfileComplete = !userProfile?.FirstName && !userProfile?.PhoneNumber && !userProfile?.EmailAddress

    if (loading) {
            return <LoadingScreen />;
        }

    return (
        <Stack.Navigator screenOptions={globalScreenOptions}>
        {
            (user && userProfileComplete) ? (
            <>
                <Stack.Screen name="Tabs" component={TabNavigator} />
                <Stack.Screen name="Comments" component={CommentsScreen} options={{animation: "slide_from_right"}} />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{animation: "slide_from_right"}} />
                <Stack.Screen name="EditProfile" component={EditProfile} options={{animation: "slide_from_right", headerShown: true, title: "Edit Profile", header: () => (<EditProfileHeader />)}} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} options={{animation: "slide_from_right"}} />
                <Stack.Screen name="ChatInfo" component={UserInfo} options={{animation: "slide_from_right"}} />
                <Stack.Screen name="TaskInfo" component={TaskInfo} options={{animation: "slide_from_right"}} />
                <Stack.Screen name="ChatsScreen" component={ChatsScreen} options={{animation: "slide_from_right"}} />
                <Stack.Screen name="Event" component={EventScreen} options={{animation: "slide_from_right"}} />
                <Stack.Screen name="AddModal" component={AddModalScreen}
                    options={{
                        presentation: "transparentModal",
                        animation: "slide_from_bottom",
                        headerShown: false,
                    }}
                />
            </>

            ) : 
            
            (user && !userProfileComplete) ? (
                <Stack.Screen name="ProfileForm" component={ProfileFormScreen} options={{ headerShown: false, gestureEnabled: false }} />
            ) 
            :
            (
            <>
                <Stack.Screen name="Hero" component={HeroScreen} />
                <Stack.Screen name="Auth" component={AuthScreen} />
            </>
            )
        }
        </Stack.Navigator>
    )

}