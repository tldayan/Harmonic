import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const globalScreenOptions = {
  headerShown: false,
  animationEnabled: false,
  tabBarStyle: {
    height: height * 0.07,
  },
};

