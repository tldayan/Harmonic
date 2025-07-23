import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureType,
} from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

interface Props {
  children: React.ReactNode;
  onSwipeDown: () => void;
  aspectRatio?: number;
  simultaneousHandlers?: GestureType | React.RefObject<GestureType>;
}

export default function SwipeToDismissWrapper({
  children,
  onSwipeDown,
  aspectRatio = 1,
  simultaneousHandlers,
}: Props) {
  const translateY = useSharedValue(0);

  let panGesture = Gesture.Pan()
    .activeOffsetY(10)
    .failOffsetX([-15, 15])
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
        const shouldClose = event.translationY > 100 || event.velocityY > 1000;
        if (shouldClose) {
          translateY.value = withTiming(1000, { duration: 200 }, (finished) => {
            if (finished) {
              runOnJS(onSwipeDown)();
            }
          });
        } else {
          translateY.value = withSpring(0);
        }
      })
      


  if (simultaneousHandlers) {
    panGesture = panGesture.simultaneousWithExternalGesture(simultaneousHandlers);
  }

  const animatedStyle = useAnimatedStyle(() => {
    const translate = Math.min(translateY.value, 300);
    return {
      transform: [{ translateY: translate }],
      opacity: 1 - translate / 300,
    };
  });
  

  return (
    <GestureDetector gesture={panGesture}>
    <Animated.View style={animatedStyle} collapsable={false}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center',
    backgroundColor: 'black',
    overflow: 'hidden',
  },
});
