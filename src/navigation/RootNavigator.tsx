import React from "react"
import AuthScreen from "../screens/Auth/AuthScreen"
import { Stack } from "./navigationUtils"
import TabNavigator from "./TabNavigator"
import { globalScreenOptions } from "./navigationConfig/globalScreenOptions"
import { useUser } from "../context/AuthContext"
import HeroScreen from "../screens/Hero/HeroScreen"
import CommentsScreen from "../screens/Others/CommentsScreen"
import ChatScreen from "../screens/Chat/ChatScreen"


export const RootNavigator: React.FC = () => {

    const {user} = useUser()

    return (
        <Stack.Navigator screenOptions={globalScreenOptions}>
        {
            user ? (
            <>
                <Stack.Screen name="Tabs" component={TabNavigator} />
                <Stack.Screen name="Comments" component={CommentsScreen} options={{animation: "slide_from_right"}} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} options={{animation: "slide_from_right"}} />
            </>

            ): (
            <>
                <Stack.Screen name="Hero" component={HeroScreen} />
                <Stack.Screen name="Auth" component={AuthScreen} />
            </>
            )
        }
        </Stack.Navigator>
    )

}