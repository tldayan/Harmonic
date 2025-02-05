import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CloseIcon from "../assets/icons/close.svg"

interface ModalsHeaderProps {
    title : string,
    onClose: () => void
}


export default function ModalsHeader({title, onClose}: ModalsHeaderProps) {
  return (
    <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <CloseIcon />
        </TouchableOpacity>
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