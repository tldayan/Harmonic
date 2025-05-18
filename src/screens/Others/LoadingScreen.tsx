
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

const LoadingScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="small" color={colors.ACTIVE_ORANGE} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingScreen;
