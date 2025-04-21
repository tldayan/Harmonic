import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import CustomButton from '../components/CustomButton'
import { colors } from '../styles/colors'
import ModalsHeader from './ModalsHeader'
import TriangleAlert from "../assets/icons/triangle-alert.svg"
import Close from "../assets/icons/close-dark.svg"

interface ConfirmationModalProps {
    onClose: () => void
    warningText: string,
    setConfirmation: () => void;
    confirmText: string,
    declineText: string
}

export default function ConfirmationModal({onClose,setConfirmation, warningText, confirmText, declineText}: ConfirmationModalProps) {


  return (
    <View style={styles.container}>
        {/* <ModalsHeader onClose={onClose} title='' /> */}
        <CustomButton buttonStyle={styles.close} onPress={onClose} icon={<Close width={25} height={25} />} />
        <View style={styles.innerContainer}>
            <TriangleAlert width={30} height={30} />
            <Text style={styles.notice}>Are you sure?</Text>
            <Text style={styles.warning}>{warningText}</Text>
        
        <View style={styles.buttonsContainer}>
            <CustomButton textStyle={styles.confirmText} buttonStyle={styles.confirm} onPress={() => {setConfirmation();onClose()}} title={confirmText} />
            <CustomButton textStyle={styles.deleteText} buttonStyle={styles.delete} onPress={onClose} title={declineText} />
        </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
        backgroundColor: "white",
        borderRadius: 8,
        width: "90%", 
        paddingTop: 20
    },
    innerContainer :{
        alignItems: "center",
        paddingHorizontal: 20 
    },
    trash : {
        alignSelf: "center",
        marginBottom: 20
    },
    notice: {
        marginTop: 5,
        fontWeight: 500,
        fontSize: 18,
        textAlign: "center"
    },
    name : {
        color: colors.ACCENT_COLOR,
        textAlign: "center"
    },
    warning: {
        marginTop: 5,
        textAlign: "center",
        color: colors.LIGHT_TEXT,
    },

    buttonsContainer: {
        marginTop: 20,
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        gap: 8,
        marginBottom: 20
    },
    confirm: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 40,
        borderColor: "#E5E7EB",
        borderWidth: 1,
    },
    confirmText: {
        fontWeight: 500,
        color: "#111928"
    },
    delete: {
        backgroundColor: "#C81E1E",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 40
    },
    deleteText: {
        fontWeight: 500,
        color: "#FFFFFF"
    },
    close: {
        marginLeft: "auto",
        borderColor: colors.ACTIVE_ORANGE,
        position: "absolute",
        right: 15,
        top : 15
    }

})