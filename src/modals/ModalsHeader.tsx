import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CloseIconDark from "../assets/icons/close-dark.svg"
import CloseIconLight from "../assets/icons/close-light.svg"
import CustomButton from '../components/CustomButton'
import ChevronLeft from "../assets/icons/chevron-left.svg"

interface ModalsHeaderProps {
    title?: string,
    onClose: () => void
    lightCloseIcon?: boolean
    goBack?: boolean
    goBackFunc?: () => void
}


export default function ModalsHeader({title, onClose, lightCloseIcon, goBack = false, goBackFunc}: ModalsHeaderProps) {
  return (
    <View style={[styles.headerContainer]}>
        {(goBack && goBackFunc) && <CustomButton buttonStyle={styles.goBackButton} onPress={goBackFunc} icon={<ChevronLeft />} />}
        <Text style={styles.title}>{title}</Text>
        <CustomButton buttonStyle={styles.closeButton} onPress={onClose} icon={lightCloseIcon ? <CloseIconLight /> : <CloseIconDark /> } />
    </View>
  )
}

const styles = StyleSheet.create({

    headerContainer: {
        position: "relative",
/*         borderWidth: 1, */
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
    goBackButton: {
        position: "absolute",
        left: 0
    },
    title : {
        textAlign : "center",
        fontWeight: 500
    },

})