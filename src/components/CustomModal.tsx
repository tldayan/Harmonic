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
    presentationStyle?: "fullScreen" | "pageSheet" | "formSheet" | "overFullScreen";
}

export const CustomModal: React.FC<Props> = ({ onClose, isOpen, children, fullScreen,presentationStyle}) => {
  return (
    <Modal
    presentationStyle={presentationStyle}
      transparent={!fullScreen}
      statusBarTranslucent
      animationType={fullScreen ? "slide" : "fade"}
      visible={isOpen}
    >
      <SafeAreaProvider>
        {fullScreen ? (
          // Full-screen modal
          <View style={{ flex: 1 }}>
            {children}
          </View>
        ) : (
          // Non-full-screen modal
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.safeArea}>
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <SafeAreaView>
                  <ScrollView 
                    scrollEnabled={false} 
                    contentContainerStyle={styles.scrollView} 
                    keyboardShouldPersistTaps="handled"
                  >
                    <TouchableWithoutFeedback onPress={() => {}}>
                      <View /* style={styles.modalContent} */>
                        {children}
                      </View>
                    </TouchableWithoutFeedback>
                  </ScrollView>
                </SafeAreaView>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        )}
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
/*   modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    minWidth: 300,
  }, */
});
