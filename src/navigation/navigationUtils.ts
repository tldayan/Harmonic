import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileStackParamList, RootStackParamList } from "../types/navigation-types";

export const Stack = createNativeStackNavigator<RootStackParamList>()
export const ProfileStack = createNativeStackNavigator<ProfileStackParamList>()