import { Modal, ModalProps, StyleSheet, View } from 'react-native'
import React from 'react'

interface Props extends ModalProps {
    isOpen: boolean;
    children: React.ReactNode;
    fullScreen?: boolean;
}

export const CustomModal: React.FC<Props> = ({ isOpen, children, fullScreen}) => {
    
  return (
    <>
      <Modal transparent={fullScreen ? false : true} statusBarTranslucent animationType={fullScreen ? "slide" : "fade"} visible={isOpen} >
        {children}
      </Modal>
    </>

  )
}

const styles = StyleSheet.create({
})