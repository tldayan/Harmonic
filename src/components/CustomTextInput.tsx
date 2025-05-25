import React, { forwardRef, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CustomTextInputFieldProps } from "../types/text-input.types";
import { colors } from "../styles/colors";
import ChevronDown from "../assets/icons/chevron-down.svg";
import { CustomModal } from "./CustomModal";
import { CountryCodes } from "../modals/CountryCodes";

export const CustomTextInput = forwardRef<TextInput, CustomTextInputFieldProps>(
  (
    {
      label,
      value,
      onChangeText,
      placeholder,
      secureTextEntry,
      mainInputStyle,
      inputStyle,
      labelStyle,
      placeholderTextColor,
      errorMessage,
      setErrorMessage,
      rightIcon,
      leftIcon,
      inputMode,
      countryCode,
      setCountryCode,
      password,
      confirmedPassword,
      onPress,
      hasError,
      multiline,
      noFlexGrow,
      scrollEnabled,
      disabled,
      noBackground
    },
    ref 
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const toggleDropdown = () => {
      setIsDropdownVisible(!isDropdownVisible);
    };

    const handleTextChange = (text: string) => {
      if (errorMessage && setErrorMessage) {
        setErrorMessage({
          email: "",
          password: "",
          confirmedPassword: "",
          otpCode: "",
          phone: "",
        });
      }
      onChangeText(text);
    };

    const confirmedPasswordCheck = useMemo(() => password === confirmedPassword, [confirmedPassword]);

    return (
      <View style={[styles.container, noFlexGrow ? null : {flexGrow: 1}]}>
        {label && <Text style={[labelStyle, isFocused && { color: colors.BLACK_TEXT_COLOR }]}>{label}</Text>}
        <View style={[styles.inputWrapper, mainInputStyle, noBackground ? { backgroundColor: "transparent" } : null]}>
        {inputMode === "tel" && (
          <TouchableOpacity 
            style={[styles.numberInput, disabled ? {opacity: 0.5} : null]} 
            onPress={!disabled ? toggleDropdown : undefined} 
            activeOpacity={disabled ? 1 : 0.7}
          >
            <Text style={styles.countryCode}>+{countryCode}</Text>
            <ChevronDown width={10} height={10} />
          </TouchableOpacity>
        )}

          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <TextInput
            onPress={onPress}
            scrollEnabled={scrollEnabled}
            ref={ref}
            multiline={multiline}
            inputMode={inputMode}
            value={value}
            editable={!disabled}
            onChangeText={handleTextChange}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            secureTextEntry={secureTextEntry}
            style={[
              styles.input,
              inputStyle,
              ((errorMessage || hasError) && { backgroundColor: colors.RED_SHADE, borderColor: "red" }),
              (isFocused && !errorMessage) && { borderColor: colors.ACTIVE_ACCENT_COLOR },
              value === confirmedPassword && confirmedPasswordCheck && {
                backgroundColor: "#f3faf7",
                borderColor: "#0e9f6e",
              },
              disabled && { opacity: 0.7 }
            ]}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>

        <CustomModal fullScreen={true} isOpen={isDropdownVisible}>
          <CountryCodes setIsDropdownVisible={setIsDropdownVisible} setCountryCode={setCountryCode || (() => {})} />
        </CustomModal>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
/*     borderWidth: 2, */
/*     flexGrow: 1 */
  },
  inputWrapper: {
 /*    borderWidth:1, */
    backgroundColor: colors.BACKGROUND_COLOR,
    borderRadius : 50,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: "100%"
  },
  input: {
    height: 40,
    borderColor: '#ccc',
/*     borderWidth: 1, */
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingRight: 40,
/*     flex: 1, */
  },
  numberInput: {
    borderColor: colors.BORDER_COLOR,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderWidth: 1,
    backgroundColor: "#F3F4F6",
    fontWeight: 500,
    height : "100%",
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent :"center",
    gap : 6
  },
  dropdown: {
    position: 'absolute',
    width: '60%',
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 200,
    zIndex: 1,
    marginTop: 5,
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 25
  },
  countryOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  countryContent : {
    flexDirection : "row",
    alignItems: "center",
    gap: 8
  },
  countryCode: {
    fontWeight: 500
  },
  countryText : {
    fontWeight: 400
  },
  rightIconContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{translateY: "-50%"}],
    zIndex: 2
  },
  leftIconContainer: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{translateY: "-50%"}],
    zIndex: 2
  },
  errorText: {
    color: 'red',
    marginTop: 5
  },
});