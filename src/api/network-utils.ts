import { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { userAuthType } from "../types/user-types";


export const transformFirebaseUser =(authUser: FirebaseAuthTypes.User) => {
    return {
        FirebaseUserUID: authUser.uid,
        PhoneNumber: authUser.phoneNumber || "", 
        EmailAddress: authUser.email || "",
        FirstName: authUser.displayName ? authUser.displayName.split(" ")[0] : "",
        ProfilePicURL: authUser.photoURL || "",
        IsEmailVerified: authUser.emailVerified || false,
        OrganizationURL: "harmonic", 
        UserAuthenticationMaster: getAuthType(authUser.providerData) 
    }
}


  
  export const getAuthType = (providerData: { providerId: string }[]): string | null => {

    if (!providerData || providerData.length === 0) {
      return null; 
    }
  

    for (const profile of providerData) {
      if (profile.providerId === 'google.com') {
        return userAuthType.GOOGLE;
      } else if (profile.providerId === 'password') {
        return userAuthType.EMAIL;
      } else if (profile.providerId === 'phone') {
        return userAuthType.PHONE_NUMBER;
      } else if (profile.providerId === 'microsoft.com') {
        return userAuthType.MICROSOFT;
      } else {
        return 'Unknown'; 
      }
    }
  
    return 'Unknown';
  };
  