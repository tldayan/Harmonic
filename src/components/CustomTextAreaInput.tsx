import * as React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

interface TextAreaInputProps {
  placeholder: string;
  onChangeText?: (text: string) => void;
}

const CustomTextAreaInput: React.FC<TextAreaInputProps> = ({
  placeholder,
  onChangeText,
}) => {
  const [value, setValue] = React.useState("");

  const handleChangeText = (text: string) => {
    setValue(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#6b7280"
          multiline={true}
          numberOfLines={4}
          value={value}
          onChangeText={handleChangeText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    minHeight: 218,
    width: "100%",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
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
    height: "100%",
    paddingTop: 12,
    paddingRight: 0,
    paddingBottom: 16,
    paddingLeft: 0,
  },
  textInput: {
    flex: 1,
    flexShrink: 1,
    flexBasis: "0%",
    minWidth: 240,
    width: "100%",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    color: "#111928",
    paddingHorizontal: 12,
    textAlignVertical: "top",
  },
});

export default CustomTextAreaInput;
