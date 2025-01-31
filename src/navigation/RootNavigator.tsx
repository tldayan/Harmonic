import React from "react"
import LoginScreen from "../screens/Auth/LoginScreen"
import { Stack } from "./navigationUtils"
import TabNavigator from "./TabNavigator"
import SignupScreen from "../screens/Auth/SignupScreen"
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen"
import { globalScreenOptions } from "./navigationConfig/globalScreenOptions"
import { useUser } from "../context/AuthContext"


export const RootNavigator: React.FC = () => {

    const {user} = useUser()

    return (
        <Stack.Navigator screenOptions={globalScreenOptions}>
        {
            user ? (
                <Stack.Screen name="Tabs" component={TabNavigator} />
            ): (
            <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
            )
        }
        </Stack.Navigator>
    )

}