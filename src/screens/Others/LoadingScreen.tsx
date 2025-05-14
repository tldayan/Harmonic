
import React from "react";
import { View, ActivityIndicator, StyleSheet, Platform } from "react-native";

const LoadingScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="small" color="#000" />
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
