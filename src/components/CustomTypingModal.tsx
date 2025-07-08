import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  ModalProps,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface Props extends ModalProps {
  isOpen?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  disableCloseOnBackground?: boolean;
  blackBackground?: boolean;
  presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
}

export const CustomTypingModal: React.FC<Props> = ({
  isOpen,
  children,
  onClose,
  disableCloseOnBackground,
  blackBackground,
  presentationStyle,
}) => {
  // Treat undefined as true (modal visible by default)
  const shouldBeOpen = isOpen ?? true;

  const slideAnim = useRef(new Animated.Value(0)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [visible, setVisible] = useState(shouldBeOpen);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (shouldBeOpen) {
      setVisible(true);
      slideAnim.setValue(0);
      backgroundAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setVisible(false);
    }
  }, [shouldBeOpen]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0], // slide up on open
  });

  const backgroundOpacity = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5], // fade in background
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      presentationStyle={presentationStyle}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <TouchableWithoutFeedback
            onPress={disableCloseOnBackground ? undefined : onClose}
          >
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: blackBackground ? 'black' : 'rgba(0,0,0,1)' },
                { opacity: blackBackground ? 1 : backgroundOpacity },
              ]}
            />
          </TouchableWithoutFeedback>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}

          >
            <View style={[styles.contentWrapper, { justifyContent: keyboardVisible ? 'flex-end' : 'center' }]}>

              <Animated.View style={[styles.modalContent, { transform: [{ translateY }] }]}>
                {children}
              </Animated.View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16, // optional, small breathing room
  },
  
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 8,
    width: '100%',
    maxWidth: 450,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
