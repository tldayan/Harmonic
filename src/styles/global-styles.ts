//global-styles.ts  

import { Platform, ViewStyle } from "react-native";
import { colors } from "./colors"

export const shadowStyles = {
  ...Platform.select({
    ios: {
      shadowColor: "black",
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
    },
     android: {
      borderRadius: 50,
      shadowColor: colors.LIGHT_TEXT,
      shadowRadius: 24,
      elevation: 10,
     }
  })

  }


export const CardShadowStyles =  {
  ...Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    android: {
      backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: colors.LIGHT_TEXT,
        shadowRadius: 24,
        elevation: 10,
    },
  }),
};

export const profilePic = {
  width: 34,
  height: 34,
  borderRadius: 50
}

export const defaultInputStyles = {
    borderRadius: 50,
    backgroundColor: "Red",
    borderStyle: "solid",
    borderColor: colors.BORDER_COLOR,
    borderWidth: 1,
    flex: 1,
    height: 42,
    paddingHorizontal: 16,
    color: "black",
  }

export const defaultNumberInputStyles = {
    ...defaultInputStyles,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  }

export const defaultInputLabelStyles = {
  marginVertical: 10,
  color: "black",
  fontWeight: 500
}

export const profilePictureFallbackStyles: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
/*   borderWidth: 1, */
  backgroundColor: colors.BACKGROUND_COLOR,
  justifyContent: "center", 
  alignItems: "center",    
}
