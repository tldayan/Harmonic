import React from "react";
import { View, StyleSheet, DimensionValue } from "react-native";

interface ProgressBarProps {
  value: number; 
  max: number;  
  width: DimensionValue;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, width }) => {
  const progress = Math.min(value / max, 1);
  const progressWidth = `${progress * 100}%` as const;

  return (
    <View style={[styles.progressContainer, { width }]}>
      <View style={styles.progressBackground} />
      <View style={[styles.progressFill, { width: progressWidth }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    height: 6,
    position: "relative",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10
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
