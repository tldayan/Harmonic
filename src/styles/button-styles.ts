import { colors } from "./colors";
import { TextStyle, ViewStyle } from "react-native";

export const PRIMARY_BUTTON_STYLES: ViewStyle = {
    height: 41,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center", 
    backgroundColor: colors.PRIMARY_COLOR,
    flexDirection: "row",
    gap: 8
}

export const PRIMARY_BUTTON_TEXT_STYLES: TextStyle = {
    fontWeight: 500,
	color : "#FFFFFF"
}