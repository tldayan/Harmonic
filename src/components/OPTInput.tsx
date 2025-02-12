import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { OtpInput } from 'react-native-otp-entry'
import { colors } from '../styles/colors';

interface OTPInputProps {
    setCode: (code: string) => void; 
    errorMessage: string
}

export default function OTPInput({ setCode, errorMessage }: OTPInputProps) {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.enterOTP}>Enter OTP</Text>
      <OtpInput 
        numberOfDigits={6}
        focusColor="black"
        autoFocus={false}
        hideStick={false}
        blurOnFilled={true}
        disabled={false}
        type="numeric"
        secureTextEntry={false}
        focusStickBlinkingDuration={500}
        onTextChange={(text) => setCode(text)}
        /* onFilled={(text) => {
          console.log(`OTP is ${text}`);
          setCode(text);
        }} */
        textInputProps={{
          accessibilityLabel: "One-Time Password",
        }}
        theme={{
          containerStyle: styles.container,
          pinCodeContainerStyle: styles.pinCodeContainer,
          pinCodeTextStyle: styles.pinCodeText,
          focusStickStyle: styles.focusStick,
          focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          placeholderTextStyle: styles.placeholderText,
          filledPinCodeContainerStyle: styles.filledPinCodeContainer,
          disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
        }}
      />
    {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    <Text style={styles.alert}>Quick! Enter your OTP which is valid for 15 minutes.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    mainContainer : {
        marginTop: 20,
    },
    container: {
/*     borderWidth : 1, */
    marginVertical : 4,
    alignItems: 'center',
    justifyContent: "space-between",
    gap : 5
  },
  enterOTP: {
    marginBottom: 8,
    fontWeight: 500
  },
  alert: {
    marginTop: 8,
    color : colors.TEXT_COLOR
  },
  pinCodeContainer: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinCodeText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight : 800
  },
  activePinCodeContainer: {
    borderColor: 'black', 
  },
  focusStick: {
    backgroundColor: 'black',
    width: 2, 
    height: 25, 
    borderRadius: 2.5, 
  },
  placeholderText: {
    color: '#bbb',
    fontSize: 18,
  },
  filledPinCodeContainer: {
    backgroundColor: 'white',
  },
  disabledPinCodeContainer: {
    backgroundColor: '#ddd',
  },
  errorText: {
    color: 'red',
    marginTop: 2
  }
});
