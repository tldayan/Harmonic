import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ChevronDown from "../assets/icons/chevron-down.svg";
import { colors } from "../styles/colors";

interface SelectInputProps {
  placeholder: string;
  onSelect?: () => void;
  leftIcon?: React.ReactNode;  
  rightIcon?: React.ReactNode;
}

const CustomSelectInput: React.FC<SelectInputProps> = ({
  placeholder,
  onSelect,
  leftIcon,
  rightIcon,
}) => {
  return (
    <TouchableOpacity
      style={styles.selectInput}
      onPress={onSelect}
      activeOpacity={0.7}
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
  );
};

const styles = StyleSheet.create({
  selectInput: {
    alignItems: "stretch",
    borderRadius: 9999,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 12,
    flex: 1,
    flexShrink: 1,
    flexBasis: "0%",
    marginTop: 10,
    minHeight: 42,
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "400",
    lineHeight: 1,
  },
  content: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  placeholderContainer: {
    alignSelf: "stretch",
    marginTop: "auto",
    marginBottom: "auto",
    flex: 1,
    flexShrink: 1,
    flexBasis: "0%",
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
  dropdownIcon: {
    aspectRatio: 1,
    width: 10,
    height: 10,
    alignSelf: "stretch",
    marginTop: "auto",
    marginBottom: "auto",
    flexShrink: 0,
  },
});

export default CustomSelectInput;
