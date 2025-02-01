export type CustomTextInputFieldProps = {
    label: string
    value: string
    onChangeText: (text:string) => void
    placeholder?: string
    secureTextEntry?: boolean,
    labelStyle: object,
    inputStyle?: object,
    errorMessage?: string
    placeholderTextColor?: string
    rightIcon?: React.ReactNode
    setCountryCode?: (code: string | null) => void
    countryCode?: string | null
    inputMode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
    modalOpen?: boolean
    
}