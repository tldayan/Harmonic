import { 
  KeyboardAvoidingView, 
  Modal, 
  ModalProps, 
  Platform, 
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
    halfModal?: boolean
}

export const CustomModal: React.FC<Props> = ({ onClose, isOpen, children, fullScreen, presentationStyle, halfModal }) => {
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
          <View style={styles.fullScreenSafeArea}>
            {children}
          </View>
        ) : (
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={halfModal ? styles.halfModalSafeArea : styles.safeArea}>
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={halfModal ? styles.halfModalContainer : null}>
                  <ScrollView
                    scrollEnabled={false}
                    contentContainerStyle={!halfModal && styles.scrollView}
                    keyboardShouldPersistTaps="handled"
                  >
                    <TouchableWithoutFeedback onPress={() => {}}>
                      <View>{children}</View>
                    </TouchableWithoutFeedback>
                  </ScrollView>
                </View>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        )}
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenSafeArea: {
    flex: 1,
    backgroundColor: 'white',
  },

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

  halfModalSafeArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  halfModalContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
/*     borderWidth: 4, */
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 0,
  },
});
