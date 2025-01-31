import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { UserProvider } from './src/context/AuthContext';
import { CustomSafeAreaView } from './src/components/CustomSafeAreaView';

function App(): React.JSX.Element {
  return (
  <CustomSafeAreaView>   
    <UserProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar translucent barStyle="dark-content" />
            <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </UserProvider>
  </CustomSafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default App;
