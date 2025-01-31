import { useState } from "react";
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { handleGoogleLogin, handleLogin, handleMicrosoftLogin, signInWithPhoneNumber, verifyOtpCode } from "../services/auth-service";

export const useLogin = () => {
  
const [signinByEmail, setSigninByEmail] = useState<boolean>(true);
const [email, setEmail] = useState<string>("");
const [password, setPassword] = useState<string>("");
const [hidePassword, setHidePassword] = useState<boolean>(true);
const [rememberUser, setRememberUser] = useState<boolean>(false);
const [errorMessage, setErrorMessage] = useState<{ email: string; password: string; otpCode: string; phone: string }>({email: "",password: "",otpCode: "",phone: ""});
const [loading, setLoading] = useState<boolean>(false);

// Phone Auth
const [userNumber, setUserNumber] = useState<string>("");
const [countryCode, setCountryCode] = useState<string | null>("+1"); 
const [code, setCode] = useState<string>(''); 
const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const initializeLogin = async (isResend = false) => {
    if (signinByEmail) {

      setErrorMessage((prev) => ({ ...prev, email: "", password: "" }));
  
      try {
        setLoading(true);
        await handleLogin(email, password);
        setErrorMessage((prev) => ({ ...prev, email: "", password: "" }));
      } catch (error: any) {
        setErrorMessage((prev) => ({
          ...prev,
          email: error.email,
          password: error.password
        }));
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage((prev) => ({ ...prev, phone: "", otpCode: "" }));
  
      if (!isResend && confirm && userNumber) {

        if(code.length !== 6) {
          setErrorMessage((prev) => ({ ...prev, otpCode: "Enter OTP" }));
          return
        }

        try {
          await confirmCode();
          return; 
        } catch (error) {
          console.error("Error confirming OTP code:", error);
          setErrorMessage((prev) => ({ ...prev, otpCode: "Failed to confirm code." }));
          return;
        }
      }
  
      try {
        setLoading(true);
        const phoneAuthConfirmation = await signInWithPhoneNumber(countryCode, userNumber);
        setConfirm(phoneAuthConfirmation);
      } catch (error: any) {
        console.log(error.code);
  
        if (error.code === "auth/too-many-requests") {
          setErrorMessage((prev) => ({
            ...prev,
            phone: "Too many requests, try again later.",
          }));
        } else if (error.code === "auth/invalid-phone-number") {
          setErrorMessage((prev) => ({
            ...prev,
            phone: "Invalid phone number.",
          }));
        } else if (error.code === "auth/popup-closed-by-user") {
          setErrorMessage((prev) => ({
            ...prev,
            phone: "Login session cancelled",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            phone: error.message,
          }));
        }
      } finally {
        setLoading(false);
      }
    }
  };
  

  const confirmCode = async () => {
    try {
      setLoading(true);

      if (!confirm) {
        setErrorMessage(prev => ({...prev, otpCode: "No confirmation result available. Please try again."}));
        return;
      }

      if (!code) {
        setErrorMessage(prev => ({...prev,otpCode: "OTP code is required."}));
        return;
      }

      const errorMessageFromVerification = await verifyOtpCode(confirm, code);

      setErrorMessage(prev => ({...prev,otpCode: errorMessageFromVerification || ""}));
    } catch (error: any) {
      if (error?.code === "auth/invalid-verification-code") {
        console.log(error.code)
        setErrorMessage(prev => ({ ...prev, otpCode: "Invalid Verification Code" }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginClick = () => {
    setLoading(true)
    handleGoogleLogin(setLoading);
  };

  const handleMicrosoftLoginClick = () => {
    
    setLoading(true)
    handleMicrosoftLogin();
    setLoading(false)
  };

  return {
    signinByEmail,
    setSigninByEmail,
    email,
    setEmail,
    password,
    setPassword,
    hidePassword,
    togglePasswordVisibility,
    rememberUser,
    setRememberUser,
    errorMessage,
    loading,
    userNumber,
    setUserNumber,
    countryCode,
    setCountryCode,
    code,
    setCode,
    confirm,
    initializeLogin,
    handleGoogleLoginClick,
    handleMicrosoftLoginClick,
  };
};
