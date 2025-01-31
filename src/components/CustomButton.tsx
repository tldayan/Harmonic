import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CustomButtonProps } from "../types/button.types";

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
  icon
}) => {
  return (
    <TouchableOpacity style={[buttonStyle]} onPress={() => onPress?.()}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 14,
  },
  icon: {
    marginRight: 8,
    width : 20,
    height: 20
  },
});

export default CustomButton;
