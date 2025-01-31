import React, { createContext, useContext, useState, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ANDROID_GOOGLE_CLIENT_ID, IOS_GOOGLE_CLIENT_ID} from '../utils/constants';
import { Platform } from 'react-native';

type UserContextType = {
  user: FirebaseAuthTypes.User | null;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Initialize Google Sign-In
    GoogleSignin.configure({
      webClientId: Platform.OS === "android" ? ANDROID_GOOGLE_CLIENT_ID : IOS_GOOGLE_CLIENT_ID,// TO BE CHANGED FOR ANDROID AFTER PACKAGE NAME CHANGE
      offlineAccess: true,
    });

    console.log('CHECKING FOR USER'); 

    // Firebase authentication state change listener
    const subscriber = auth().onAuthStateChanged((authUser) => {
      if (!authUser) {
        console.log('No user is logged in'); // Log when no user is logged in
      }
      setUser(authUser); // Update user state
      setInitializing(false); // Stop initializing once Firebase auth state is resolved
    });

    return subscriber; // Clean up listener on unmount
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};