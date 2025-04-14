import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  ModalProps,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


interface Props extends ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  fullScreen?: boolean;
  onClose?: () => void;
  presentationStyle?: "fullScreen" | "pageSheet" | "formSheet" | "overFullScreen";
  halfModal?: boolean;
  disableCloseOnBackground?: boolean;
}

export const CustomModal: React.FC<Props> = ({
  onClose,
  isOpen,
  children,
  fullScreen,
  presentationStyle,
  halfModal,
  disableCloseOnBackground
}) => {
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(isOpen);
  const [contentKey, setContentKey] = useState(0);

  useEffect(() => {
    if (halfModal) {
      if (isOpen) {
        setVisible(true);
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
        setContentKey(prev => prev + 1);
      } else {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }
    } else {
      setVisible(isOpen);
      if (isOpen) setContentKey(prev => prev + 1);
    }
  }, [isOpen]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  return (
    <Modal
      presentationStyle={presentationStyle}
      transparent={!fullScreen}
      statusBarTranslucent
      animationType={fullScreen ? "slide" : "fade"}
      visible={visible}
    >
      <GestureHandlerRootView>
      <SafeAreaProvider>
        {fullScreen ? (
          <View style={styles.fullScreenSafeArea} key={contentKey}>
            {children}
          </View>
        ) : (
          <TouchableWithoutFeedback onPress={disableCloseOnBackground ? () => {} : onClose}>
            <View style={halfModal ? styles.halfModalSafeArea : styles.safeArea}>
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <Animated.View
                  style={[
                    halfModal ? styles.halfModalContainer : null,
                    halfModal ? { transform: [{ translateY }] } : null
                  ]}
                  key={contentKey}
                >
                  <ScrollView
                    scrollEnabled={false}
                    contentContainerStyle={!halfModal && styles.scrollView}
                    keyboardShouldPersistTaps="handled"
                  >
                    <TouchableWithoutFeedback onPress={() => {}}>
                      <View>{children}</View>
                    </TouchableWithoutFeedback>
                  </ScrollView>
                </Animated.View>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        )}
      </SafeAreaProvider></GestureHandlerRootView>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 0,
  },
});
