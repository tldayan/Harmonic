import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ChevronDown from "../assets/icons/chevron-down.svg";
import { colors } from "../styles/colors";

interface SelectInputProps {
  placeholder: string;
  onSelect?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hasError?: boolean;
  label?: string;
  labelStyle?: object;
  errorMessage?: string;
}

const CustomSelectInput: React.FC<SelectInputProps> = ({
  placeholder,
  onSelect,
  leftIcon,
  rightIcon,
  hasError,
  label,
  labelStyle,
  errorMessage,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            labelStyle,
            isFocused && { color: colors.BLACK_TEXT_COLOR },
          ]}
        >
          {label}
        </Text>
      )}
      <TouchableOpacity
        style={[
          styles.selectInput,
          hasError && {
            borderColor: "red",
            backgroundColor: colors.RED_SHADE,
          },
        ]}
        onPress={() => {
          handleFocus();
          onSelect?.();
        }}
        activeOpacity={0.7}
        onBlur={handleBlur}
      >
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>{placeholder}</Text>
          </View>
          {rightIcon ? (
            <View style={styles.iconContainer}>{rightIcon}</View>
          ) : (
            <ChevronDown width={12} height={12} />
          )}
        </View>
      </TouchableOpacity>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
/*     borderWidth: 1, */
  },
  label: {
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 5,
  },
  selectInput: {
    borderRadius: 9999,
    backgroundColor: colors.BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    paddingHorizontal: 12,
    minHeight: 42,
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  placeholderContainer: {
    flex: 1,
  },
  placeholderText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "400",
  },
  iconContainer: {
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    fontSize: 12,
  },
});

export default CustomSelectInput;
