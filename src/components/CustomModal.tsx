import { Modal, ModalProps, StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface Props extends ModalProps {
    isOpen: boolean;
    children: React.ReactNode;
    withInput?: boolean;
}

export const CustomModal: React.FC<Props> = ({ isOpen, children, withInput}) => {

    
  return (
    <Modal statusBarTranslucent animationType="slide" visible={isOpen} >
        {children}
    </Modal>

  )
}

const styles = StyleSheet.create({})