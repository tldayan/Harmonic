import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./navigation-types";

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}