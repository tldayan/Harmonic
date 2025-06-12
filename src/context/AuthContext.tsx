import React, { createContext, useContext, useState, useEffect } from 'react';
import { FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ANDROID_GOOGLE_CLIENT_ID, IOS_GOOGLE_CLIENT_ID} from '../utils/constants';
import { Alert, Platform } from 'react-native';
import { storeUserToken } from '../services/auth-service';
import { getOrganizationBasedModules, getUserAddress, getUserProfile, getUuidBySignIn } from '../api/network-utils';
import { saveDataMMKV } from '../services/storage-service';
import { saveUserProfileToRealm } from '../database/management/realmUtils/saveUserProfileToRealm';
import realmInstance from '../services/realm';
import { saveOrganizationBasedModules } from '../database/management/realmUtils/saveOrganizationBasedModules';
import { useDispatch } from 'react-redux';
import { setUUIDs } from '../store/slices/authSlice';
import { getApp } from '@react-native-firebase/app';
import { saveUserAddressToRealm } from '../database/management/realmUtils/saveUserAddressToRealm';

type UserContextType = {
  user: FirebaseAuthTypes.User | null;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  const dispatch = useDispatch()

  useEffect(() => {
    // Initialize Google Sign-In
    GoogleSignin.configure({
      webClientId: Platform.OS === "android" ? ANDROID_GOOGLE_CLIENT_ID : IOS_GOOGLE_CLIENT_ID,// TO BE CHANGED FOR ANDROID AFTER PACKAGE NAME CHANGE
      offlineAccess: true,
    });

    console.log('CHECKING FOR USER'); 

    

    // Firebase authentication state change listener
    const authInstance = getAuth(getApp())
    const subscriber = authInstance.onAuthStateChanged( async(authUser) => {
      if (!authUser) {
        console.log('No user is logged in'); 
      }
      

      setUser(authUser);
      console.log(authUser)


/*       const userToken = await authUser?.getIdToken(); 
      
      if(userToken) {
        console.log(userToken)
        await storeUserToken(userToken)
      } */
      

      if(authUser !== null) {

        try {
          const {UserUUID, OrganizationUUID} = await getUuidBySignIn(authUser)

          dispatch(setUUIDs({organizationUUID: OrganizationUUID, userUUID: UserUUID}))
          saveDataMMKV({"UserUUID": UserUUID, "OrganizationUUID" : OrganizationUUID})

          const [userProfileResponse, userAddressResponse , OrganizationBasedModulesResponse] =  await Promise.all([getUserProfile(UserUUID), getUserAddress(UserUUID),getOrganizationBasedModules(UserUUID, OrganizationUUID)])
/*           Alert.alert("userProfile", userProfileResponse?.data.Payload)
          Alert.alert("userAddress", userAddressResponse?.data.Payload)
          Alert.alert("orgMofdules", OrganizationBasedModulesResponse?.data.Payload) */
          console.log("userinfor from backend",userProfileResponse?.data.Payload)
          saveUserProfileToRealm(userProfileResponse?.data.Payload)
          if(userAddressResponse?.data.Payload) {
            saveUserAddressToRealm(userAddressResponse?.data.Payload)
          }
          saveOrganizationBasedModules(OrganizationBasedModulesResponse?.data.Payload)


          const userProfile = realmInstance.objects('UserProfile')[0];

          console.log("Saved UserProfile from Realm:", userProfile?.toJSON());
        


        } catch (error) {
          throw error
        } 
      }
      


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