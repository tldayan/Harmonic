import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface CustomButtonProps {
  title: string | null;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode,
  iconPosition?: string
}
