import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { handleResetPassword } from '../services/auth-service'
import { CustomTextInput } from '../components/CustomTextInput'
import { colors } from '../styles/colors'
import CustomButton from '../components/CustomButton'
import { PRIMARY_BUTTON_STYLES } from '../styles/button-styles'
import { ErrorMessageType } from '../types/text-input.types'


interface ForgotPasswordProps {
    onClose: () => void
    email: string
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessageType>>;
    errorMessage: string
}


export default function ForgotPassword({onClose, email, setEmail, setErrorMessage, errorMessage}: ForgotPasswordProps) {

    const [emailSent, setEmailSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const emailInputRef = useRef<any>(null);

    useEffect(() => {
        setTimeout(() => {
            if (emailInputRef.current) {
                emailInputRef.current.focus(); 
            }
        }, 300); 
    }, []);
    

    const initializeResetPassword = async() => {
        setErrorMessage((prev) => ({...prev, email: ""}))
        setEmailSent(false) 

        try {
            setLoading(true)
            await handleResetPassword(email)
            setEmailSent(true)
        } catch (error: any) {
            console.log(error)
            setEmailSent(false)
            setErrorMessage((prev) => ({...prev, email: error.message}))
        } finally {
            setLoading(false)
        }
    }




  return (
    <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.container}>
                <Image style={styles.logo} source={require('../assets/images/Harmonic-Logo-Horizontal-02.png')} />
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.emailText}>
                    We’ll email you instructions to reset your password. If you don’t have access to your email anymore, you can try  
                <Text onPress={() => {}}>
                    <Text style={styles.supportLink}> account recovery</Text>
                </Text>.
                </Text>

                <CustomTextInput ref={emailInputRef} errorMessage={errorMessage} labelStyle={styles.inputLabel} inputStyle={styles.inputField} label='Email' value={email} onChangeText={(e) => setEmail(e)} />
                {emailSent && <Text style={styles.success}>Link to reset your password has been sent to the above email address. The link will expire in 15 minutes.</Text>}
                {emailSent && <TouchableOpacity onPress={initializeResetPassword}><Text style={styles.resend}>Resend link</Text></TouchableOpacity>}
                <CustomButton textStyle={{fontWeight: 500,color : "#FFFFFF"}} buttonStyle={PRIMARY_BUTTON_STYLES} title={!loading ? 'Reset Password' : null} icon={loading ? <ActivityIndicator size="small" color="#fff" /> : null} onPress={initializeResetPassword} />
                <View style={styles.supportContainer}>
                    <Text style={styles.support}>If you still need help, contact</Text>
                    <TouchableOpacity onPress={() => {}}>
                        <Text style={styles.supportLink}> Harmonic Support.</Text>
                    </TouchableOpacity>
                </View>
            </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
    container : {
        backgroundColor: "white",
        borderRadius: 50,
        width: 343, 
        alignSelf: "center",
        padding: 20,
    },
    logo: {
		alignSelf : "center",
		marginBottom : 20,
		height: 27,
		width: 107
	},
    title: {
        fontWeight: 700,
        fontSize: 24,
        textAlign: "center",
        marginBottom : 10
    },
    inputLabel : {
        color : colors.LIGHT_TEXT_COLOR,
        fontWeight : 500,
        fontSize: 14,
        marginBottom: 8
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
        color: "black",
    },
    text: {
		fontWeight : "300",
		textAlign : "center",
		color : colors.TEXT_COLOR,
        marginBottom: 20
	},
    resend: {
        color: colors.ACTIVE_ACCENT_COLOR,
        marginVertical: 15
    },
    success: {
        color : colors.TEXT_COLOR,
    },
    supportContainer: {
/*         marginTop: 20, */
        flexDirection: "row",
        alignItems: "center",
        flexWrap:"wrap",
        justifyContent: "center"
    },
    emailText : {
        textAlign: "center",
        marginBottom: 24,
        color: colors.TEXT_COLOR
    },
    support : {
        textAlign: "center",
        color : colors.TEXT_COLOR,
        
    },
    supportLink: {
        color : colors.ACTIVE_ACCENT_COLOR,
        fontWeight: 500
    }
})