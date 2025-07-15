import React from "react";
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, View } from "react-native";
import { CustomButtonProps } from "../types/button.types";
import { responsiveFontSize } from "../utils/helpers";

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
  icon,
  iconPosition = "left",
  disableOpacity = false,
  loading
}) => {

  const flattenedStyle = StyleSheet.flatten(textStyle || {}) as TextStyle;
  return (
    <TouchableOpacity activeOpacity={disableOpacity ? 1 : 0.5} style={buttonStyle} onPress={() => onPress?.()}>
      {loading ? <ActivityIndicator color={"white"} size={"small"} /> : 
      <>
        {(icon && iconPosition === "left") && <View>{icon}</View>}
        {title && (
          <Text
          style={[
            styles.text,
            { fontSize: responsiveFontSize(flattenedStyle.fontSize ?? 14) },
            textStyle,
          ]}
        >
          {title}
        </Text>
        )}

        {(icon && iconPosition === "right") && <View>{icon}</View>}
      </>
      }

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: "center"
  },
});

export default CustomButton;
