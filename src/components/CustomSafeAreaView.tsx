import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CustomSafeAreaViewProps {
  children: React.ReactNode;
}

export const CustomSafeAreaView: React.FC<CustomSafeAreaViewProps> = ({ children }) => (
  <SafeAreaView style={{ flex: 1 , backgroundColor: '#FFFFFF', paddingBottom: Platform.OS === "ios" ? 10 : 0}} edges={['top', 'left', 'right',]}>
    {children}
  </SafeAreaView>
);
