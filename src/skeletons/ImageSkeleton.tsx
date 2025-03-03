import { StyleSheet, View, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { colors } from '../styles/colors';

export default function ImageSkeleton() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    animate.start();

    return () => animate.stop();
  }, [opacity]);

  return <Animated.View style={[styles.postImageContainer, { opacity }]} />;
}

const styles = StyleSheet.create({
  postImageContainer: {
    marginTop: 10,
    width: 150,
    height: 150,
    backgroundColor: colors.LIGHT_COLOR,
    borderRadius: 8,
  },
});
