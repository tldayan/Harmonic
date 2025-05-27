import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation-types";

export const Stack = createNativeStackNavigator<RootStackParamList>()