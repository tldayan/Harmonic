import React from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Alert } from "react-native";
import CustomButton from "../../components/CustomButton";
import { colors } from "../../styles/colors";
import { CustomTextInput } from "../../components/CustomTextInput";
import { CustomIconButton } from "../../components/IconButton";
import EyeSlash from "../../assets/icons/eye-slash.svg"
import GoogleIcon from "../../assets/icons/google.svg"
import MicrosoftIcon from "../../assets/icons/microsoft.svg"
import CheckIcon from "../../assets/icons/check.svg"
import OTPInput from "../../components/OPTInput";
import { LoginScreenProps } from "../../types/navigation-screen-types";
import { ROUTES } from "../../navigation/routes";
import { useLogin } from "../../hooks/useLogin";


const LoginScreen = ({navigation}: LoginScreenProps) => {

	const {
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
	  } = useLogin();
	

  return (
	<TouchableWithoutFeedback onPress={Keyboard.dismiss} >
		<View style={styles.container}>
			<Image style={styles.logo} source={require('../../assets/images/Harmonic-Logo-Horizontal-02.png')} />
			<View style={styles.mainSignupContainer}>
				<Text style={styles.title}>Welcome back</Text>
				<View style={styles.signupContainer}>
					<Text style={styles.signUpPrompt}>Don't have an account? </Text>
					<CustomButton title="Sign up" textStyle={styles.signupText} onPress={() => {navigation.navigate(ROUTES.SIGNUP)}} />
				</View>
			</View>
			
			<View style={styles.signinMethodContainer}>
				<CustomButton buttonStyle={[styles.signinMethodButtons, signinByEmail && styles.activeButtonState]} textStyle={[styles.signinMehtodButtonText, signinByEmail && styles.activeTextState]} title="Email" onPress={() => { setSigninByEmail(true)}}/>
				<CustomButton buttonStyle={[styles.signinMethodButtons, !signinByEmail && styles.activeButtonState]} textStyle={[styles.signinMehtodButtonText, !signinByEmail && styles.activeTextState]} title="Phone Number" onPress={() => { setSigninByEmail(false)}} />
			</View>
			{signinByEmail ? 
				<View>
					<CustomTextInput errorMessage={errorMessage.email} inputMode="email" labelStyle={styles.inputLabel} inputStyle={styles.inputField} label="Email" onChangeText={(e) => {setEmail(e)}} placeholder="kajal@sgeme.com" placeholderTextColor={colors.LIGHT_TEXT_COLOR} secureTextEntry={false} value={email} />
					<CustomTextInput errorMessage={errorMessage.password} rightIcon={<CustomIconButton onPress={togglePasswordVisibility} icon={<EyeSlash width={16} height={16} />} />} labelStyle={styles.inputLabel} inputStyle={styles.inputField} label="Password" onChangeText={(e) => {setPassword(e)}} secureTextEntry={hidePassword} value={password} />
				</View>
				: 
				<View>
					<CustomTextInput inputStyle={[styles.inputField, styles.numberField]} labelStyle={styles.inputLabel} placeholder="123 456 7890" label="Phone Number*" onChangeText={(e) => setUserNumber(e)} value={userNumber} inputMode="tel" setCountryCode={setCountryCode} countryCode={countryCode} errorMessage={errorMessage.phone}/>
					{confirm && <OTPInput errorMessage={errorMessage.otpCode} setCode={setCode} />}
				</View>
			}
			{!confirm && <View style={styles.separatorContainer}>
				<View style={styles.separator} />
				<Text style={styles.orText}>or</Text>
				<View style={styles.separator} />
			</View>}

			{(!confirm && signinByEmail) && <View style={styles.socialsContainer}>
				<CustomButton textStyle={styles.socialsButtonText} buttonStyle={styles.socialButtons} icon={<GoogleIcon />} title="Sign in with Google" onPress={handleGoogleLoginClick} />
				<CustomButton textStyle={styles.socialsButtonText} buttonStyle={styles.socialButtons} icon={<MicrosoftIcon/>} title="Sign in with Microsoft" onPress={handleMicrosoftLoginClick} />
			</View>}
			
			{signinByEmail && <View style={styles.authOptionsContainer}>
				<View style={styles.rememberMeContainer}>
					<TouchableOpacity onPress={() => setRememberUser(prev => !prev)} style={[styles.checkbox, rememberUser && {...styles.rememberMeActive}]}>
						{rememberUser && <CheckIcon width={10} height={10} />}
					</TouchableOpacity>
					<Text style={styles.rememberMe}>Remember me</Text>
				</View>
				<CustomButton textStyle={styles.forgotPassword} onPress={() => navigation.navigate("ForgotPassword")} title="Forgot password?" />
			</View>}
			{/* {!signinByEmail && <Text style={styles.termsAndConditions}>By continuing, you acknowledge that you understand and agree to the Terms and Conditions
				Some helper text here</Text>} */}
			<CustomButton buttonStyle={styles.signinButton} textStyle={styles.signinText} onPress={initializeLogin} title={loading ? null : "Sign in"} icon={loading ? <ActivityIndicator size="small" color="#fff" /> : null}/>
			{confirm && <View style={styles.resendCodeContainer}>
				<Text style={styles.resendCodePrompt}>Didn’t receive OTP? </Text>
				<CustomButton title="Resend code" textStyle={styles.resendText} onPress={() => initializeLogin(true)}/>
			</View>}
		</View>
	</TouchableWithoutFeedback>
  );
};


          					
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor : "#FFFFFF"
	},
	container: {
	/* 	borderWidth: 1, */
		height: 602,
		padding : 32,
		width: "100%",
		backgroundColor : "#FFFFFF",
		flex: 1,
	},
	logo: {
		alignSelf : "center",
		marginBottom : 20,
		resizeMode: "contain",
	},
	mainSignupContainer: {
		alignItems: "center",
		gap: 10,
		marginBottom : 27
	},
	title: {
		alignSelf: "stretch",
		fontSize: 24,
		lineHeight: 30,
		fontWeight: "700",
		fontFamily: "Inter-Bold",
		color: "#111928",
		textAlign: "center"
	},
	signupContainer: {
		flexDirection : "row",
		fontSize: 14,
		lineHeight: 21,
		fontWeight: "500",
		justifyContent: "center"
	},
	signupText: {
		color : colors.ACCENT_COLOR,
		fontWeight: 500
	},
	signUpPrompt : {
		color: colors.TEXT_COLOR,
		fontWeight : 500
	},
	signinMethodContainer : {
		flexDirection : "row",
		height : 43,
		borderRadius: 23,
		backgroundColor : colors.BACKGROUND_COLOR,
		alignItems : "center",
		justifyContent : "center",
		padding : 5.76,
		gap: 3.66,
		marginBottom: 20
	},
	signinMethodButtons: {
		borderRadius: 50,
		backgroundColor: colors.BACKGROUND_COLOR,
		borderStyle: "solid",
		borderColor: colors.BORDER_COLOR,
		borderWidth: 1,
		flex: 1,
		width: "50%",
		height: 31,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 8,
		paddingVertical: 4
	},
	signinMehtodButtonText: {
		color : colors.TEXT_COLOR,
		fontWeight: 500,
		fontSize: 14,
	},
	activeButtonState : {
		borderColor : colors.ACTIVE_ACCENT_COLOR
	},
	activeTextState : {
		color : colors.ACTIVE_ACCENT_COLOR
	},
	inputLabel : {
		color : colors.LIGHT_TEXT_COLOR,
		fontWeight : 500,
		lineHeight: 21,
		fontSize: 14,
		paddingBottom: 2
	},
	inputField : {
		borderRadius: 50,
		backgroundColor: colors.BACKGROUND_COLOR,
		borderStyle: "solid",
		borderColor: colors.BORDER_COLOR,
		borderWidth: 1,
		width: "100%",
		height: 42,
		paddingHorizontal: 16,
		color: colors.LIGHT_TEXT_COLOR
	},
	numberField : { 
		borderTopLeftRadius: 0, 
		borderBottomLeftRadius: 0, 
		borderTopRightRadius: 50, 
		borderBottomRightRadius: 50 
	},
	separatorContainer: {
		flexDirection: 'row', 
		alignItems: 'center',  
		justifyContent: 'center',
		height: 24, 
		gap: 20,
		marginBottom : 20
	  },
	orText: {
		fontSize: 16,
		lineHeight: 24,
		fontWeight: "500",
		fontFamily: "Inter-Medium",
		color: colors.TEXT_COLOR,
		textAlign: "center",
	  },
	separator: {
		flex: 1,
		height: 1, 
		backgroundColor: "#e5e7eb",
	  },
	socialsContainer: {
		gap : 20
	  },
	socialButtons : {
		borderRadius: 50,
		borderStyle: "solid",
		borderColor: "#e5e7eb",
		borderWidth: 1,
		width: "100%",
		height: 50,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		overflow: "hidden"
	},
	socialsButtonText : {
		fontWeight: 500
	},
	checkbox: {
		width: 16,
		height: 16,
		borderWidth: 1,
		borderColor: colors.BORDER_COLOR,
		borderRadius: 4,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor : "transparent",
		marginRight: 8,
	},
	authOptionsContainer : {
		marginTop : 20,
		flexDirection : "row",
		alignItems : "center",
		justifyContent: "space-between"
	},
	rememberMeContainer : {
		flexDirection : "row",
		alignItems : "center",
	},
	rememberMe : {
		fontWeight : 500,
		color : colors.TEXT_COLOR
	},
	rememberMeActive:  {
		backgroundColor: colors.ACTIVE_ACCENT_COLOR,
		 borderWidth: 0
	},
	forgotPassword : {
		fontWeight : "500",
		color: colors.ACCENT_COLOR
	},
	termsAndConditions : {
		fontWeight : "300",
		textAlign : "center",
		color : colors.TEXT_COLOR,
		marginTop: 20
	},
	signinButton: {
		height: 41,
		marginTop: 20,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center", 
		backgroundColor: colors.PRIMARY_COLOR,
		flexDirection: "row", 
	  },
	signinText: {
		fontWeight: 500,
		color : "#FFFFFF"
	},
	resendCodeContainer : {
		marginTop: 20,
		flexDirection : "row",
		lineHeight: 21,
		fontWeight: "500",
		justifyContent: "center"
	}, 
	resendCodePrompt: {
		color: colors.LIGHT_TEXT_COLOR,
		fontWeight : 500
	},
	resendText: {
		color : colors.ACCENT_COLOR,
		fontWeight: 500
	}
	
});
          					
export default LoginScreen;