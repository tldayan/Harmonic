import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CustomButtonProps } from "../types/button.types";

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
  icon,
  iconPosition = "left",
  disableOpacity = false
}) => {
  return (
    <TouchableOpacity  activeOpacity={disableOpacity ? 1 : 0.5} style={[buttonStyle]} onPress={() => onPress?.()}>
      {(icon && iconPosition === "left") && <View style={styles.icon}>{icon}</View>}
      {title && <Text style={[styles.text, textStyle]}>{title}</Text>}
      {(icon && iconPosition === "right") && <View style={styles.icon}>{icon}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 14,
  },
  icon: {
   /*  marginRight: 8, */
  },
});

export default CustomButton;
