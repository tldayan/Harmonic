//global-styles.ts  

import { Platform } from "react-native";
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