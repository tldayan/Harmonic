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
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const userProfiles = realmInstance.objects('UserProfile');

    if (userProfiles.length > 0) {
      setUserProfile(userProfiles[0]);
    }

    const listener = () => {
      if (userProfiles.length > 0) {
        setUserProfile(userProfiles[0]);
      } else {
        setUserProfile(null);
      }
    };

    userProfiles.addListener(listener);

    return () => {
      userProfiles.removeListener(listener);
    };
  }, []);

  const loading = !!user && !userProfile;

  const userProfileComplete =
    !!userProfile?.FirstName && !!userProfile?.EmailAddress;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={globalScreenOptions}>
      {user && userProfileComplete ? (
        <>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="Comments" component={CommentsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="ChatInfo" component={UserInfo} />
          <Stack.Screen name="TaskInfo" component={TaskInfo} />
          <Stack.Screen name="ChatsScreen" component={ChatsScreen} />
          <Stack.Screen name="Event" component={EventScreen} />
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
          {(props) => <ProfileFormScreen {...props} setUserProfile={setUserProfile} />}
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
