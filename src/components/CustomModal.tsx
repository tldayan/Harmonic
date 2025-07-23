import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
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
  fullScreen?: boolean;
  onClose?: () => void;
  presentationStyle?: "fullScreen" | "pageSheet" | "formSheet" | "overFullScreen";
  disableCloseOnBackground?: boolean;
  blackBackground?: boolean;
}

export const CustomModal: React.FC<Props> = ({
  onClose,
  isOpen,
  children,
  fullScreen,
  presentationStyle,
  blackBackground,
  disableCloseOnBackground,
}) => {
  console.log("rendering modal")
  const [visible, setVisible] = useState(isOpen ?? true);

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 30,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => callback());
  };

  useEffect(() => {
    if (isOpen === undefined || isOpen) {
      setVisible(true);
      if (!fullScreen) animateIn();
    } else {
      if (!fullScreen) {
        animateOut(() => setVisible(false));
      } else {
        setVisible(false);
      }
    }
  }, [isOpen, fullScreen]);

  if (!visible) return null;

  return (
    <Modal
      presentationStyle={presentationStyle}
      transparent={!fullScreen}
      statusBarTranslucent
      animationType={fullScreen ? "slide" : "none"}
      visible={visible}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView>
        <SafeAreaProvider>
          {fullScreen ? (
            <View style={styles.fullScreenSafeArea}>
              {children}
            </View>
          ) : (
            <TouchableWithoutFeedback
              onPress={disableCloseOnBackground ? () => {} : onClose}
            >
              <Animated.View
                style={[
                  styles.safeArea,
                  {
                    backgroundColor: blackBackground
                      ? backdropOpacity.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,1)'],
                        })
                      : backdropOpacity.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'],
                        }),
                  },
                ]}
              >
                <KeyboardAvoidingView  sge
                  behavior={'padding'}
                  style={{ flex: 1 }}
                >
                  <View style={styles.contentWrapper}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                      <Animated.View
                        style={{
                          transform: [{ translateY }],
                          opacity: contentOpacity,
                          width: '100%',
                        }}
                      >
                        {children}
                      </Animated.View>
                    </TouchableWithoutFeedback>
                  </View>
                </KeyboardAvoidingView>
              </Animated.View>
            </TouchableWithoutFeedback>
          )}
        </SafeAreaProvider>
      </GestureHandlerRootView>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
