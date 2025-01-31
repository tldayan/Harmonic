import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CustomSafeAreaViewProps {
  children: React.ReactNode;
}

export const CustomSafeAreaView: React.FC<CustomSafeAreaViewProps> = ({ children }) => (
  <SafeAreaView style={{ flex: 1 , backgroundColor: '#FFFFFF'}} edges={['top', 'left', 'right']}>
    {children}
  </SafeAreaView>
);
