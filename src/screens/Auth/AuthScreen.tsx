import React, { useEffect } from "react";
import { Image, StyleSheet, View, Text, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ScrollView } from "react-native";
import CustomButton from "../../components/CustomButton";
import { colors } from "../../styles/colors";
import { CustomTextInput } from "../../components/CustomTextInput";
import { CustomIconButton } from "../../components/CustomIconButton";
import EyeSlashClose from "../../assets/icons/eye-slash-close.svg"
import EyeSlashOpen from "../../assets/icons/eye-slash-open.svg"
import GoogleIcon from "../../assets/icons/google.svg"
import MicrosoftIcon from "../../assets/icons/microsoft.svg"
import OTPInput from "../../components/OPTInput";;
import { useLogin } from "../../hooks/useLogin";
import checkIcon from '../../assets/images/check.png';
import xIcon from "../../assets/images/x.png";
import { getRectangleColor, responsiveFontSize } from "../../utils/helpers";
import { CustomModal } from "../../components/CustomModal";
import ForgotPassword from "../../modals/ForgotPassword";
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from "../../styles/button-styles";
import { CustomTypingModal } from "../../components/CustomTypingModal";


const AuthScreen = () => {

	const {
		authMode,
		setAuthMode,
		signinByEmail,
		setSigninByEmail,
		email,
		setEmail,
		password,
		confirmedPassword,
		setConfirmedPassword,
		setPassword,
		hidePassword,
		togglePasswordVisibility,
		setErrorMessage,
		errorMessage,
		loading,
		userNumber,
		setUserNumber,
		countryCode,
		setCountryCode,
		setCode,
		confirm,
		initializeAuth,
		handleGoogleLoginClick,
		handleMicrosoftLoginClick,
		passwordCheck,
		forgotPasswordIntiated,
		setForgotPasswordIntiated,
		setConfirm
	  } = useLogin();
	
	
	
	const handleAuthMode = () => {
		if(authMode === "login") {
			setAuthMode("signup")
			setErrorMessage({email: "",password: "", confirmedPassword: "",otpCode: "",phone: ""})
		} else {
			setAuthMode("login")
			setErrorMessage({email: "",password: "", confirmedPassword: "",otpCode: "",phone: ""})
		}
	}

	/* useEffect(() => {
		console.log(authMode)
	},[authMode]) */
	

  return (
	
	<TouchableWithoutFeedback onPress={Keyboard.dismiss} >
		<ScrollView contentContainerStyle={{padding: 32}} style={styles.container} keyboardShouldPersistTaps="handled">
			<Image style={styles.logo} source={require('../../assets/images/Harmonic-Logo-Horizontal-02.png')} />
			<View style={styles.mainSignupContainer}>
				<Text style={styles.title}>{authMode === "login" ? "Welcome back" : "Create Account"}</Text>
				<View style={styles.signupContainer}> 
					<Text style={styles.signUpPrompt}>{ authMode === "login" ? "Don't have an account? " : "Already have an account? " }</Text>
					<CustomButton title={authMode === "login" ? "Sign up" : "Log in"} textStyle={styles.signupText} onPress={handleAuthMode} />
				</View>
			</View>
			
			<View style={styles.signinMethodContainer}>
				<CustomButton buttonStyle={[styles.signinMethodButtons, signinByEmail && styles.activeButtonState]} textStyle={[styles.signinMehtodButtonText, signinByEmail && styles.activeTextState]} title="Email" onPress={() => { setSigninByEmail(true); setConfirm(null); setUserNumber("")}}/>
				<CustomButton buttonStyle={[styles.signinMethodButtons, !signinByEmail && styles.activeButtonState]} textStyle={[styles.signinMehtodButtonText, !signinByEmail && styles.activeTextState]} title="Phone Number" onPress={() => { setSigninByEmail(false); setConfirm(null); setUserNumber("")}} />
			</View>
			{signinByEmail ? 
				<View>
					<CustomTextInput errorMessage={errorMessage.email} inputMode="email" labelStyle={styles.inputLabel} inputStyle={styles.inputField} label="Email" onChangeText={(e) => {setEmail(e)}} placeholder="kajal@sgeme.com" placeholderTextColor={colors.LIGHT_TEXT_COLOR} secureTextEntry={false} setErrorMessage={setErrorMessage} value={email} />
					<CustomTextInput errorMessage={errorMessage.password} rightIcon={<CustomIconButton onPress={togglePasswordVisibility} icon={hidePassword ? <EyeSlashClose width={18} height={18} /> : <EyeSlashOpen width={18} height={18} />} />} labelStyle={styles.inputLabel} inputStyle={styles.inputField} label={authMode === "signup" ? "Create Password" : "Password"} onChangeText={(e) => {setPassword(e); setConfirmedPassword("")}} setErrorMessage={setErrorMessage} secureTextEntry={hidePassword} value={password} />
				

					{(authMode === "signup" && !confirmedPassword && password) && <View style={[styles.content, styles.contentFlexBox]}>
						<View style={[styles.rectangles, styles.rectanglesFlexBox]}>
							<View style={[styles.rectanglesChild, styles.rectanglesLayout, { backgroundColor: getRectangleColor(0, password, passwordCheck) }]} />
							<View style={[styles.rectanglesChild, styles.rectanglesLayout, { backgroundColor: getRectangleColor(1, password, passwordCheck) }]} />
							<View style={[styles.rectanglesInner, styles.rectanglesLayout, { backgroundColor: getRectangleColor(2, password, passwordCheck) }]} />
							<View style={[styles.rectanglesInner, styles.rectanglesLayout, { backgroundColor: getRectangleColor(3, password, passwordCheck) }]} />
						</View>

						<View style={[styles.popoverBody, styles.rectanglesFlexBox]}>
							<Text style={[styles.yourPasswordMust, styles.upperLowerTypo]}>Your password must contain:</Text>
						</View>

						<View style={styles.popoverBody1}>
							<View style={[styles.requirement1, styles.rectanglesFlexBox]}>
								<Image source={passwordCheck.hasLowerCase ? checkIcon : xIcon} style={styles.checkIcon} width={12} height={12}/>
								<Text style={[styles.upperLower, styles.upperLowerTypo]}>Upper & lower case letters</Text>
							</View>
							<View style={[styles.requirement1, styles.rectanglesFlexBox]}>
								<Image source={passwordCheck.hasSymbol ? checkIcon : xIcon} style={styles.checkIcon} width={12} height={12}/>
								<Text style={[styles.upperLower, styles.upperLowerTypo]}>A symbol (#$&)</Text>
							</View>
							<View style={[styles.requirement1, styles.rectanglesFlexBox]}>
								<Image source={passwordCheck.hasNumber ? checkIcon : xIcon} style={styles.checkIcon} width={12} height={12}/>
								<Text style={[styles.upperLower, styles.upperLowerTypo]}>A number</Text>
							</View>
							<View style={[styles.requirement1, styles.rectanglesFlexBox]}>
								<Image source={passwordCheck.isLongEnough ? checkIcon : xIcon} style={styles.checkIcon} width={12} height={12}/>
								<Text style={[styles.upperLower, styles.upperLowerTypo]}>Minimum 8 characters</Text>
							</View>
						</View>
					</View>}


					{authMode === "signup" && passwordCheck.passedChecks === 4 && <CustomTextInput errorMessage={errorMessage.confirmedPassword} labelStyle={styles.inputLabel} inputStyle={styles.inputField} label="Confirm Password" onChangeText={(e) => {setConfirmedPassword(e)}} setErrorMessage={setErrorMessage} secureTextEntry={hidePassword} value={confirmedPassword} password={password} confirmedPassword={confirmedPassword} />}
				</View>
				: 
				<View>
					<CustomTextInput inputStyle={[styles.inputField, styles.numberField]} labelStyle={styles.inputLabel} placeholder="123 456 7890" label="Phone Number*" onChangeText={(e) => setUserNumber(e)} value={userNumber} inputMode="tel" setCountryCode={setCountryCode} countryCode={countryCode ?? undefined} setErrorMessage={setErrorMessage} errorMessage={errorMessage.phone}/>
					{confirm && <OTPInput errorMessage={errorMessage.otpCode} setCode={setCode} />}
				</View>
			}
			
			{(signinByEmail && confirm || !signinByEmail && !confirm || !confirm ) && <View style={styles.separatorContainer}>
				<View style={styles.separator} />
					<Text style={styles.orText}>or</Text>
				<View style={styles.separator} />
			</View>}

			{(signinByEmail && confirm || !signinByEmail && !confirm || !confirm ) && <View style={styles.socialsContainer}>
				<CustomButton textStyle={styles.socialsButtonText} buttonStyle={styles.socialButtons} icon={<GoogleIcon />} title={`Sign ${authMode === "login" ? "in" : "up"} with Google`} onPress={handleGoogleLoginClick} />
				<CustomButton textStyle={styles.socialsButtonText} buttonStyle={styles.socialButtons} icon={<MicrosoftIcon/>} title={`Sign ${authMode === "login" ? "in" : "up"} with Microsoft`} onPress={handleMicrosoftLoginClick} />
			</View>}
			
				
			{(signinByEmail && authMode === "login") && <CustomButton textStyle={styles.forgotPassword} onPress={() => setForgotPasswordIntiated(true)} title="Forgot password?" />}

			{authMode === "signup" && <Text style={styles.termsAndConditions}>By continuing, you acknowledge that you understand and agree to the Terms and Conditions</Text>}
			
			<CustomButton buttonStyle={PRIMARY_BUTTON_STYLES} textStyle={PRIMARY_BUTTON_TEXT_STYLES} onPress={initializeAuth} title={loading ? null : confirm ? "Verify OTP" : userNumber ? "Send OTP" : authMode === "login" ? "Log in" : "Sign up"} icon={loading ? <ActivityIndicator size="small" color="#fff" /> : null}/>
			
			{(confirm && !signinByEmail) && <View style={styles.resendCodeContainer}>
				<Text style={styles.resendCodePrompt}>Didn’t receive OTP? </Text>
				<CustomButton title="Resend code" textStyle={styles.resendText} onPress={() => initializeAuth(true)}/>
			</View>}

			{forgotPasswordIntiated && <CustomTypingModal onClose={() => setForgotPasswordIntiated(false)}>
				<ForgotPassword errorMessage={errorMessage.email} onClose={() => { setErrorMessage(prev => ({ ...prev, email: "", password: ""})); }} email={email} setEmail={setEmail} setErrorMessage={setErrorMessage}/>
			</CustomTypingModal>}
		</ScrollView>
		
	</TouchableWithoutFeedback>
  );
};


          					
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor : "#FFFFFF",
	},
	container: {
		height: 602,
		width: "100%",
		backgroundColor : "#FFFFFF",
		flex: 1,
	},
	logo: {
		alignSelf : "center",
		marginBottom : 20,
		height: 27,
		width: 107
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
		alignItems: "center",
		fontSize: 14,
		lineHeight: 21,
		fontWeight: "500",
		justifyContent: "center"
	},
	signupText: {
		color : colors.ACCENT_COLOR,
		fontWeight: 500,
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
	},
	signinMehtodButtonText: {
		color : colors.TEXT_COLOR,
		fontWeight: 500,
		fontSize: responsiveFontSize(14),
	},
	activeButtonState : {
		borderColor : colors.ACTIVE_ACCENT_COLOR
	},
	activeTextState : {
		color : colors.ACTIVE_ACCENT_COLOR
	},
	inputLabel : {
		marginTop:20,
		color : colors.LIGHT_TEXT_COLOR,
		fontWeight : 500,
		lineHeight: 21,
		fontSize: 14,
		paddingBottom: 2,
		marginBottom: 8
	},
	inputField : {
		borderRadius: 50,
		backgroundColor: "Red",
		borderStyle: "solid",
		borderColor: colors.BORDER_COLOR,
		borderWidth: 1,
		flex: 1,
		height: 42,
		paddingHorizontal: 16,
		color: "black",
	},
	numberField : { 
		borderTopLeftRadius: 0, 
		borderBottomLeftRadius: 0, 
		borderTopRightRadius: 50, 
		borderBottomRightRadius: 50, 
		marginBottom: 0
	},
	separatorContainer: {
		flexDirection: 'row', 
		alignItems: 'center',  
		justifyContent: 'center',
		gap: 20,
		marginTop: 20
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
		marginTop: 20,
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
		overflow: "hidden",
	},
	socialsButtonText : {
		fontWeight: 500,
		marginLeft: 8
	},
	forgotPassword : {
		fontWeight : "500",
		textAlign:"right",
		marginTop: 20,
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
	resendCodeContainer : {
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
	},



	//PASSWORD VALIDATION
	contentFlexBox: {
		marginTop: 20,
		justifyContent: "center",
		alignItems: "center"
	},
		rectanglesFlexBox: {
		flexDirection: "row",
		alignSelf: "stretch"
	},
		rectanglesLayout: {
		height: 2,
		flex: 1
	},
		upperLowerTypo: {
		textAlign: "left",
		color: "#6b7280",
		fontFamily: "Inter-Regular",
		lineHeight: 18
	},
		rectanglesChild: {
		backgroundColor: "#fdba8c"
	},
		rectanglesInner: {
		backgroundColor: "#e5e7eb"
	},
		rectangles: {
		gap: 10
	},
		yourPasswordMust: {
		fontSize: 14,
		flex: 1
	},
		popoverBody: {
		justifyContent: "center",
		alignItems: "center"
	},
		checkIcon: {
		overflow: "hidden"
	},
		upperLower: {
		fontSize: 12
	},
		requirement1: {
		paddingLeft: 8,
		gap: 8,
		alignItems: "center",
		flexDirection: "row"
	},
		popoverBody1: {
		gap: 6,
		alignSelf: "stretch",
		justifyContent: "center"
	},
		content: {
		shadowColor: "rgba(0, 0, 0, 0.1)",
		shadowOffset: {
		width: 0,
		height: 1
		},
		shadowRadius: 3,
		elevation: 3,
		shadowOpacity: 1,
		borderRadius: 8,
		backgroundColor: "#fff",
		borderStyle: "solid",
		borderColor: "#e5e7eb",
		borderWidth: 1,
		width: "100%",
		padding: 12,
		gap: 10,
		overflow: "hidden",
		flex: 1
	}


});
          					
export default AuthScreen;