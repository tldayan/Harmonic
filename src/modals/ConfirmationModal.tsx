import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import CustomButton from '../components/CustomButton'
import { colors } from '../styles/colors'
import ModalsHeader from './ModalsHeader'
import TriangleAlert from "../assets/icons/triangle-alert.svg"

interface ConfirmationModalProps {
    onClose: () => void
    warningText: string,
    setConfirmation: (value: boolean) => void;
}

export default function ConfirmationModal({onClose,setConfirmation, warningText}: ConfirmationModalProps) {


  return (
    <TouchableWithoutFeedback onPress={onClose}>

    
    <View style={styles.container}>
        <ModalsHeader onClose={onClose} title='' />
        <View style={styles.innerContainer}>
            <TriangleAlert width={30} height={30} />
            <Text style={styles.notice}>Are you sure?</Text>
            <Text style={styles.warning}>{warningText}</Text>
        
        <View style={styles.buttonsContainer}>
            <CustomButton textStyle={styles.confirmText} buttonStyle={styles.confirm} onPress={() => {setConfirmation(true);onClose()}} title={"Yes"} />
            <CustomButton textStyle={styles.deleteText} buttonStyle={styles.delete} onPress={onClose} title={"No, Cancel"} />
        </View>
        </View>
        

    </View></TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
    container : {
        backgroundColor: "white",
        borderRadius: 8,
        width: "95%", 
        padding: 32,
    },
    innerContainer :{
        paddingHorizontal: 32
    },
    trash : {
        alignSelf: "center",
        marginBottom: 20
    },
    notice: {
        fontWeight: 500,
        color: colors.TEXT_COLOR,
        textAlign: "center"
    },
    name : {
        color: colors.ACCENT_COLOR,
        textAlign: "center"
    },
    warning: {
        marginTop: 20,
        textAlign: "center"
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
        padding: 10,
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
        padding: 10,
        borderRadius: 40
    },
    deleteText: {
        fontWeight: 500,
        color: "#FFFFFF"
    }

})