import React from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { UserProvider } from './src/context/AuthContext';
import { CustomSafeAreaView } from './src/components/CustomSafeAreaView';

function App(): React.JSX.Element {
  return (
  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, flexGrow : 1 }}>
    <CustomSafeAreaView>   
      <UserProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar translucent barStyle="dark-content" backgroundColor="white" />
              <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </UserProvider>
    </CustomSafeAreaView>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});

export default App;
