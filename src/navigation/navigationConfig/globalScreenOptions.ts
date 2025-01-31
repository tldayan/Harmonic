import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const globalScreenOptions = {
  headerShown: false,
  animation: "fade" as const,
  tabBarStyle: {
    height: height * 0.07,
  },
};
