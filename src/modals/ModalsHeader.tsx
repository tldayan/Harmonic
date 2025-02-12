import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CloseIconDark from "../assets/icons/close-dark.svg"
import CloseIconLight from "../assets/icons/close-light.svg"
import CustomButton from '../components/CustomButton'

interface ModalsHeaderProps {
    title : string,
    onClose: () => void
    lightCloseIcon?: boolean 
}


export default function ModalsHeader({title, onClose, lightCloseIcon}: ModalsHeaderProps) {
  return (
    <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
        <CustomButton buttonStyle={styles.closeButton} onPress={onClose} icon={lightCloseIcon ? <CloseIconLight /> : <CloseIconDark /> } />
    </View>
  )
}

const styles = StyleSheet.create({

    headerContainer: {
        position: "relative",
        marginHorizontal: 20,
        alignItems : 'center',
        justifyContent : "center",
        flexDirection: "row",
        padding: 20,
    },
    closeButton: {
        position: "absolute",
        right: 0
    },
    title : {
        textAlign : "center",
        fontWeight: "bold"
    },

})