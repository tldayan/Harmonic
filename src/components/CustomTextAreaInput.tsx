import * as React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { colors } from "../styles/colors";

interface TextAreaInputProps {
  placeholder: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  flex?: boolean;
  multiline?: boolean;
  noInput?: boolean;
  onPressInput?: (event: GestureResponderEvent) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const CustomTextAreaInput: React.FC<TextAreaInputProps> = ({
  placeholder,
  onChangeText,
  onFocus,
  flex,
  multiline = false,
  noInput = false,
  onPressInput,
  leftIcon,
  rightIcon,
}) => {
  const [value, setValue] = React.useState("");

  const handleChangeText = (text: string) => {
    setValue(text);
    onChangeText?.(text);
  };

  const inputContent = (
    <>
      {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.textAreaInput,
          !multiline && { height: "100%" },
        ]}
        placeholder={placeholder}
        multiline={multiline}
        value={value}
        onChangeText={handleChangeText}
        onFocus={onFocus}
        editable={!noInput}
        placeholderTextColor={colors.LIGHT_TEXT}
        textAlignVertical={multiline ? "top" : "center"}
        scrollEnabled={true}
        pointerEvents={noInput ? "none" : "auto"}
      />
      {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
    </>
  );

  return (
    <View
      style={[
        styles.container,
        multiline && { minHeight: flex ? 218 : 100 },
        !multiline && { height: 42 },
      ]}
    >
      <TouchableOpacity
        style={[styles.input, !noInput ? {flexDirection :"column", alignItems: "flex-start"} : null  ,multiline ? { paddingVertical: 12 } : null]}
        onPress={noInput ? onPressInput : undefined}
        activeOpacity={noInput ? 0.7 : 1}
      >
        {inputContent}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: "100%",
    fontSize: 14,
    flexShrink: 1,
    color: "#6b7280",
    fontWeight: "400",
    gap: 8,
  },
  input: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    backgroundColor: "#F9FAFB",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    flex: 1,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#111928",
    paddingHorizontal: 8,
  },
  textAreaInput: {
    minWidth: 240,
    maxHeight: 218,
  },
  icon: {
    paddingHorizontal: 4,
  },
});

export default CustomTextAreaInput;
