import { firebase } from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import * as Keychain from 'react-native-keychain';
import { deleteDataMMKV } from "./storage-service";




//HANDLE LOGIN BY EMAIL & PASSWORD
export const handleLogin = async(email:string, password:string) => {

  if (!email) {
    throw { email: "Email is required." }
  }

  if (!password) {
    throw { password: "Password is required." }
  }

    try {

      const user = await firebase.auth().signInWithEmailAndPassword(email,password)

    } catch (error: any) {
      let errorResponse = { email: "", password: "" };
    
      if (error.code === "auth/wrong-password") {
        errorResponse.password = "Incorrect password. Please try again.";
      } else if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
        errorResponse.email = "No account found with this email.";
      } else if (error.code === "auth/user-disabled") {
        errorResponse.email = "This account has been disabled.";
      } else if (error.code === "auth/invalid-credential") {
        errorResponse.email = "Invalid Credentials. Please try again.";
        errorResponse.password = "Invalid Credentials. Please try again.";
      } else {
        errorResponse.email = "Something went wrong. Please try again.";
        errorResponse.password = "Something went wrong. Please try again.";
      }
    
      throw errorResponse; 
    }

  }

  //HANDLE LOGIN VIA GOOGLE
  export const handleGoogleLogin = async(setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {

    try {

      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog : true})
            
      const signInResult = await GoogleSignin.signIn()
            
      let idToken = signInResult.data?.idToken;

      if (!idToken) {
        setLoading(false)
        throw new Error('No ID token found');
      }
 /*      console.log(idToken) */
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
      return firebase.auth().signInWithCredential(googleCredential);

    } catch (error) {
      console.log(error)
    }
    
  }


  //HANDLE SIGNOUT FROM ALL METHODS
 export const handleSignOut = async() => {
    try {

      const existingGoogleUser = GoogleSignin.getCurrentUser()
      if(existingGoogleUser) {
        await GoogleSignin.revokeAccess() 
      }
      
      await firebase.auth().signOut()
      
      deleteDataMMKV("UserUUID")
      deleteDataMMKV("OrganizationUUID")
      
      console.log("user signed out")
    } catch(error) {
      console.error("Error signing out:", error);
    }
  }

  //HANDLE MICROSOFT LOGIN
  export const handleMicrosoftLogin = async() => {

    const provider = new firebase.auth.OAuthProvider('microsoft.com');

    provider.addScope('offline_access');

    provider.setCustomParameters({
      prompt: 'consent',
      // Optional "tenant" parameter for optional use of Azure AD tenant.
      // e.g., specific ID - 9aaa9999-9999-999a-a9aa-9999aa9aa99a or domain - example.com
      // defaults to "common" for tenant-independent tokens.
      tenant: '1b7d48c5-098a-4d09-be81-1e6e5654d232',
    });
  

    try {

      const signinResult = await firebase.auth().signInWithRedirect(provider);

    /*   console.log(signinResult.user.getIdToken()) */

    } catch (error: any) {
      console.log('Microsoft login error:', error);
    }
  };

  


  //HANDLE PHONE AUTH
  export const signInWithPhoneNumber = async (countryCode: string | null, phoneNumber: string) => {
    if (!countryCode) {
      throw new Error("Country code is required");
    }
    console.log(phoneNumber)
    if (phoneNumber === "") {
      throw new Error("Please enter a phone number");
    }
  
    const joinedNumber = `+${countryCode}${phoneNumber}`;

  
    const confirmation = await firebase.auth().signInWithPhoneNumber(joinedNumber);
    console.log(confirmation)
    return confirmation;
  }
  

  export const verifyOtpCode = async (confirm: FirebaseAuthTypes.ConfirmationResult, code: string): Promise<any> => {
    try {

      const authVerification = await confirm.confirm(code);
      console.log(authVerification); 
      return authVerification;
      
    } catch (error) {
      throw error
    }
  };
  



//RESET PASSWORD BY EMAIL
 export const handleResetPassword = async (email: string) => {
    try {
      if (!email) {
        throw new Error("Email is required for password reset.");
      }

     await firebase.auth().sendPasswordResetEmail(email);

    } catch (error: any) {
      throw new Error(error.message);
    }
  };


//STORE USER TOKEN IN KEYCHAIN SERVICE
export const storeUserToken = async (userToken: string) => {
  try {
    
    const result = await Keychain.setGenericPassword("userToken", userToken);
    
    if (result) {
      console.log("Token stored successfully");

    } else {
      console.log("Failed to store token");
    }

  } catch (error) {
    console.error("Failed to access Keychain", error);
  }
};