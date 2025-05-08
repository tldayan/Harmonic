import { useMemo, useState } from "react";
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { auth, handleGoogleLogin, handleLogin, handleMicrosoftLogin, signInWithPhoneNumber, verifyOtpCode } from "../services/auth-service";
import { ErrorMessageType } from "../types/text-input.types";
import { useAuthMode } from "../context/AuthModeContext";

export const useLogin = () => {
  
/* const [authMode, setAuthMode] = useState("login") */
const { authMode, setAuthMode } = useAuthMode();
const [signinByEmail, setSigninByEmail] = useState<boolean>(true);
const [email, setEmail] = useState<string>("");
const [password, setPassword] = useState<string>("");
const [confirmedPassword, setConfirmedPassword] = useState<string>("")
const [hidePassword, setHidePassword] = useState<boolean>(true);
const [errorMessage, setErrorMessage] = useState<ErrorMessageType>({email: "",password: "", confirmedPassword: "",otpCode: "",phone: ""});
const [loading, setLoading] = useState<boolean>(false);
const [forgotPasswordIntiated, setForgotPasswordIntiated] = useState(false)

// Phone Auth
const [userNumber, setUserNumber] = useState<string>("");
const [countryCode, setCountryCode] = useState<string | null>("1"); 
const [code, setCode] = useState<string>(''); 
const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };


  const passwordCheck = useMemo(() => {
      const symbolsRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/;  
      const numbersRegex = /[0-9]/;  
      const lowerCaseRegex = /[a-z]/; 
      const upperCaseRegex = /[A-Z]/; 
      const minLength = 8; 
      
      const checks = {
        hasSymbol: symbolsRegex.test(password),
        hasNumber: numbersRegex.test(password),
        hasLowerCase: (lowerCaseRegex.test(password) && upperCaseRegex.test(password)),
        isLongEnough: password.length >= minLength,
      };
      
      const passedChecks = Object.values(checks).filter(Boolean).length;
      
      return { ...checks, passedChecks };
  }, [password]);



  const initializeAuth = async (isResend = false) => {
    setErrorMessage({email: "",password: "", confirmedPassword: "",otpCode: "",phone: ""})

    //SIGNUP
    if(authMode === "signup") {

      if(!password) {
        setErrorMessage((prev) => ({...prev, password : "Please create a password"}))
        return  
      } else if (passwordCheck.passedChecks !== 4) {
        setErrorMessage((prev) => ({...prev, password : "Your password must pass the below requirements"}))
      }

      if(password !== confirmedPassword) {
        setErrorMessage((prev) => ({...prev, confirmedPassword : "Enter correct password"}))
        return
      }

      try {
        setLoading(true)
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
  
        console.log("User created:", userCredential.user);

      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage((prev) => ({...prev, email: "The email address is already in use by another account."}))
        } else if (error.code === 'auth/invalid-email') {
          setErrorMessage((prev) => ({...prev, email: "The email address is not valid."}))
        } else if (error.code === 'auth/weak-password') {
          setErrorMessage((prev) => ({...prev, password: "The password is too weak."}))
        } else {
          console.error("Error creating user:", error.message);
        }
      } finally {
        setLoading(false)
      }
    }

    //LOGIN
    if (signinByEmail && authMode === "login") {

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
          setErrorMessage((prev) => ({ ...prev, otpCode: "Please enter OTP" }));
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
        setErrorMessage(prev => ({ ...prev, otpCode: "Invalid OTP" }));
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
    authMode,
    setAuthMode,
    signinByEmail,
    setSigninByEmail,
    email,
    setEmail,
    password,
    setPassword,
    confirmedPassword,
    setConfirmedPassword,
    hidePassword,
    togglePasswordVisibility,
    setErrorMessage,
    errorMessage,
    loading,
    userNumber,
    setUserNumber,
    countryCode,
    setCountryCode,
    code,
    setCode,
    confirm,
    initializeAuth,
    handleGoogleLoginClick,
    handleMicrosoftLoginClick,
    passwordCheck,
    forgotPasswordIntiated,
    setForgotPasswordIntiated,
    setLoading,
    setConfirm
  };
};
