import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface CustomButtonProps {
  title?: string | number | null;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode,
  iconPosition?: string
  disableOpacity?: boolean
  loading?: boolean
}
