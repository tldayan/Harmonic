import { 
  KeyboardAvoidingView, 
  Modal, 
  ModalProps, 
  Platform, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  TouchableWithoutFeedback, 
  View 
} from 'react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface Props extends ModalProps {
    isOpen: boolean;
    children: React.ReactNode;
    fullScreen?: boolean;
    onClose?: () => void;
}

export const CustomModal: React.FC<Props> = ({ onClose, isOpen, children, fullScreen }) => {
  return (
    <Modal
      transparent={!fullScreen}
      statusBarTranslucent
      animationType={fullScreen ? "slide" : "fade"}
      visible={isOpen}
    >
      <SafeAreaProvider>
        {fullScreen ? (
          // For full-screen modal
          <View style={{ flex: 1 }}>
            {children}
          </View>
        ) : (
          // For non-full-sccreen modal
          <TouchableWithoutFeedback onPress={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.safeArea}>
              <SafeAreaView>
                <ScrollView 
                  scrollEnabled={fullScreen ? true : false} 
                  contentContainerStyle={styles.scrollView} 
                  keyboardShouldPersistTaps="handled"
                >
                    {children} 
                </ScrollView>
              </SafeAreaView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        )}
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
