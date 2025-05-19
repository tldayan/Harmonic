import React, { useEffect, useState } from "react";
import { Stack } from "./navigationUtils";
import TabNavigator from "./TabNavigator";
import { globalScreenOptions } from "./navigationConfig/globalScreenOptions";
import { useUser } from "../context/AuthContext";
import HeroScreen from "../screens/Hero/HeroScreen";
import AuthScreen from "../screens/Auth/AuthScreen";
import CommentsScreen from "../screens/Others/CommentsScreen";
import ChatScreen from "../screens/Chat/ChatScreen";
import UserInfo from "../screens/Chat/ChatInfo";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import TaskInfo from "../screens/Task/TaskInfo";
import ChatsList from "../screens/Chat/ChatList";
import ChatsScreen from "../screens/Chat/ChatsTabs";
import AddModalScreen from "../modals/BottomTabActions";
import { EventScreen } from "../screens/Others/EventScreen";
import EditProfile from "../screens/Profile/EditProfile";
import ProfileFormScreen from "../screens/Profile/ProfileFormScreen";
import LoadingScreen from "../screens/Others/LoadingScreen";
import realmInstance from "../services/realm";

export const RootNavigator: React.FC = () => {
  console.log("Root Nav")
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userAddress, setUserAddress] = useState<UserAddress | null>(null);

  useEffect(() => {
    const userProfiles = realmInstance.objects<UserProfile>('UserProfile');
    const userAddresses = realmInstance.objects<UserAddress>('UserAddress');
  
    // Initial load
    if (userProfiles.length > 0) {
      setUserProfile({ ...userProfiles[0] }); 
    }
    if (userAddresses.length > 0) {
      setUserAddress({ ...userAddresses[0] });
    }
  
    // Listeners
    const profileListener = () => {
      console.log("Profile change detected.");
      if (userProfiles.length > 0) {
        setUserProfile({ ...userProfiles[0] });
      } else {
        setUserProfile(null);
      }
    };
  
    const addressListener = () => {
      console.log("Address change detected.");
      if (userAddresses.length > 0) {
        setUserAddress({ ...userAddresses[0] });
      } else {
        setUserAddress(null);
      }
    };
  
    userProfiles.addListener(profileListener);
    userAddresses.addListener(addressListener);
  
    return () => {
      userProfiles.removeListener(profileListener);
      userAddresses.removeListener(addressListener);
    };
  }, []);


  
  const loading = !!user && !userProfile;
  console.log(userProfile)
  const userProfileComplete =
  !!userProfile?.FirstName &&
  !!userProfile?.EmailAddress &&
  !!userProfile?.PhoneNumber &&
  !!userProfile?.Description;


    console.log(userProfileComplete)

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={globalScreenOptions}>
      {user && userProfileComplete ? (
        <>
          <Stack.Screen name="Tabs" component={TabNavigator} options={{animation: "slide_from_right"}} />
          <Stack.Screen name="Comments" component={CommentsScreen} options={{animation: "slide_from_right"}} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{animation: "slide_from_right"}} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{animation: "slide_from_right"}} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} options={{animation: "slide_from_right"}} />
          <Stack.Screen name="ChatInfo" component={UserInfo} options={{animation: "slide_from_right"}} />
          <Stack.Screen name="TaskInfo" component={TaskInfo} options={{animation: "slide_from_right"}} />
          <Stack.Screen name="ChatsScreen" component={ChatsScreen} options={{animation: "slide_from_right"}} />
          <Stack.Screen name="Event" component={EventScreen} options={{animation: "slide_from_right"}} />
          <Stack.Screen
            name="AddModal"
            component={AddModalScreen}
            options={{
              presentation: "transparentModal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
        </>
      ) : user && !userProfileComplete ? (
        <Stack.Screen name="ProfileForm" options={{ headerShown: false }}>
          {(props) => <ProfileFormScreen {...props} userProfile={userProfile} userAddress={userAddress} setUserProfile={setUserProfile} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Hero" component={HeroScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
