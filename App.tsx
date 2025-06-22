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
import { SocketProvider } from './src/context/SocketContext';
import { AuthModeProvider } from './src/context/AuthModeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetProvider } from './src/components/BottomSheetContext';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SocketProvider>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, flexGrow : 1 }}>
            <CustomSafeAreaView>
              <RealmProvider>
                <AuthModeProvider>
                  <UserProvider>
                  <BottomSheetProvider>
                    <SafeAreaProvider>
                      <NavigationContainer>
                        <StatusBar translucent barStyle="dark-content" backgroundColor="white" />
                        <RootNavigator />
                      </NavigationContainer>
                    </SafeAreaProvider>
                    </BottomSheetProvider>
                  </UserProvider>
                </AuthModeProvider>
              </RealmProvider>
            </CustomSafeAreaView>
          </KeyboardAvoidingView>
          <Toast />
        </SocketProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
