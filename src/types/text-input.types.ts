import { NativeSyntheticEvent, TextInputContentSizeChangeEventData } from "react-native";

export type ErrorMessageType = {
    email: string;
    password: string;
    confirmedPassword: string,
    otpCode: string;
    phone: string;
  };


export type CustomTextInputFieldProps = {
    label?: string
    value: string
    onChangeText: (text:string) => void
    placeholder?: string
    secureTextEntry?: boolean,
    labelStyle?: object,
    mainInputStyle?: object,
    inputStyle?: object,
    errorMessage?: string
    setErrorMessage?: React.Dispatch<React.SetStateAction<ErrorMessageType>>;
    placeholderTextColor?: string
    rightIcon?: React.ReactNode
    leftIcon?: React.ReactNode
    setCountryCode?: (code: string | null) => void
    countryCode?: string | null
    inputMode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
    modalOpen?: boolean
    password?: string
    confirmedPassword?: string
    onPress?: () => void
    multiline?: boolean
    scrollEnabled?: boolean
    onContentSizeChange?: (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => void;
}