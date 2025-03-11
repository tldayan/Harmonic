import React from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { UserProvider } from './src/context/AuthContext';
import { CustomSafeAreaView } from './src/components/CustomSafeAreaView';
import { RealmProvider } from '@realm/react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import Toast from 'react-native-toast-message';

function App(): React.JSX.Element {
  return (
  <Provider store={store}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, flexGrow : 1 }}>
      <CustomSafeAreaView>   
        <RealmProvider>     
          <UserProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <StatusBar translucent barStyle="dark-content" backgroundColor="white" />
                  <RootNavigator />
              </NavigationContainer>
            </SafeAreaProvider>
          </UserProvider>
        </RealmProvider>
      </CustomSafeAreaView>
    </KeyboardAvoidingView>

    <Toast />
  </Provider>
  );
}

const styles = StyleSheet.create({});

export default App;
