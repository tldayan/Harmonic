import React, { useEffect, useRef } from "react";
import { View, StyleSheet, DimensionValue, Animated } from "react-native";

interface ProgressBarProps {
  value: number;
  max: number;
  width: DimensionValue;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, width }) => {
  const progress = Math.min(value / max, 1);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.progressContainer, { width }]}>
      <View style={styles.progressBackground} />
      <Animated.View style={[styles.progressFill, { width: widthInterpolate }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    height: 6,
    position: "relative",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
  },
  progressBackground: {
    height: 6,
    width: "100%",
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    position: "absolute",
  },
  progressFill: {
    height: 6,
    borderRadius: 2,
    backgroundColor: "#FF8A4C",
    position: "absolute",
    left: 0,
  },
});

export default ProgressBar;
