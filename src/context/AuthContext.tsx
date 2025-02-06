import React, { createContext, useContext, useState, useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ANDROID_GOOGLE_CLIENT_ID, IOS_GOOGLE_CLIENT_ID} from '../utils/constants';
import { Platform } from 'react-native';
import { storeUserToken } from '../services/auth-service';
import { transformFirebaseUser } from '../api/network-utils';
import { apiClient } from '../api/api-client';
import { ENDPOINTS } from '../api/endpoints';
import { getDataMMKV, saveDataMMKV } from '../services/storage-service';
import { saveUserProfileToRealm } from '../utils/realmUtils/saveUserProfileToRealm';
import realmInstance from '../services/realm';
import { saveOrganizationBasedModules } from '../utils/realmUtils/saveOrganizationBasedModules';

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
    const subscriber = auth().onAuthStateChanged( async(authUser) => {
      if (!authUser) {
        console.log('No user is logged in'); 
      }
      

      setUser(authUser);
      console.log("checking") 
      console.log(authUser)


      const userToken = await authUser?.getIdToken(); 
      if(userToken) {
        await storeUserToken(userToken)
      }
      

      if(authUser !== null) {

        try {
          const response = await apiClient(ENDPOINTS.AUTH.SIGN_IN, transformFirebaseUser(authUser), {}, 'POST');
          saveDataMMKV({"UserUUID": response.Payload.UserUUID, "OrganizationUUID" : response.Payload.OrganizationUUID}) 
          console.log(response)

          const response2 = await apiClient(ENDPOINTS.USER.PROFILE, {},{}, "GET", {UserUUID: getDataMMKV("UserUUID") ?? "", LoggedInUserUUID: getDataMMKV("UserUUID") ?? ""})
          /* console.log(response2) */

          saveUserProfileToRealm(response2.Payload)
          const userProfile = realmInstance.objects('UserProfile').filtered('UserUUID == $0', getDataMMKV("UserUUID"));
          console.log("Saved UserProfile from Realm:", userProfile.toJSON());


          const response3 = await apiClient(ENDPOINTS.ORGANIZATION.FETCH_MODULES, {}, {}, "GET", {userUUID: getDataMMKV("UserUUID") ?? "", organizationUUID: getDataMMKV("OrganizationUUID") ?? ""});
          /* console.log(response3); */
          
          //TO BE REFACTORED
          saveOrganizationBasedModules(response3.Payload)
          const modules = realmInstance.objects('OrganizationBasedModules');
          console.log("Saved Modules from Realm:", modules.toJSON());


        } catch (error) {
          console.error("Error fetching modules:", error);
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