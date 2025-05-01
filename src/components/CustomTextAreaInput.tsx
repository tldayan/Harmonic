import * as React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { colors } from "../styles/colors";

interface TextAreaInputProps {
  placeholder: string;
  onChangeText?: (text: string) => void;
  flex?: boolean;
  multiline?: boolean;
}

const CustomTextAreaInput: React.FC<TextAreaInputProps> = ({
  placeholder,
  onChangeText,
  flex,
  multiline = false,
}) => {
  const [value, setValue] = React.useState("");

  const handleChangeText = (text: string) => {
    setValue(text);
    onChangeText?.(text);
  };

  return (
    <View
      style={[
        styles.container,
        multiline && { minHeight: flex ? 218 : 100 },
        !multiline && { height: 42 },
      ]}
    >
      <View style={[styles.input, multiline ? {paddingVertical : 12} : null]}>
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.textAreaInput,
            !multiline && { height: "100%" },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.LIGHT_TEXT}
          multiline={multiline}
          value={value}
          onChangeText={handleChangeText}
          textAlignVertical={multiline ? "top" : "center"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: "100%",
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "400",
    gap: 8,
  },
  input: {
    borderRadius: 24,
    backgroundColor: "#F9FAFB",
    display: "flex",
    width: "100%",
    gap: 10,
    flex: 1,
/*     paddingVertical: 12, */
    paddingHorizontal: 0,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#111928",
    paddingHorizontal: 12,
  },
  textAreaInput: {
    minWidth: 240,
  },
});

export default CustomTextAreaInput;
