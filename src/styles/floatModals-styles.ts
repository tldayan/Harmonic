import { TextStyle, ViewStyle } from "react-native"
import { colors } from "./colors"

export const modalContainer = {
    backgroundColor: "white",
    borderRadius: 20,
    width: 343, 
    padding: 20,
}

export const modalTitle: TextStyle = {
    fontSize: 19,
    marginBottom: 5,
    fontWeight: "500"
}

export const modalNotice = {
    marginVertical: 10
}

export const modalButtonsContainer: ViewStyle = {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10
}

export const cancelButton = {
    padding: 10,
    flex: 1,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.ACTIVE_ORANGE
}

export const proceedButton = {
    backgroundColor: colors.ACTIVE_ORANGE,
    padding: 10,
    flex: 1,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.ACTIVE_ORANGE
}

export const circleCheckbox: ViewStyle = {
    width: 23,
    height: 23,
    borderRadius: 50,
    borderColor: colors.BORDER_COLOR,
    backgroundColor: colors.BACKGROUND_COLOR,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
}

export const squareCheckbox: ViewStyle = {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: colors.BACKGROUND_COLOR,
    borderColor: colors.BORDER_COLOR,
    borderWidth:1,
    alignItems: 'center',
    justifyContent: "center"
}

