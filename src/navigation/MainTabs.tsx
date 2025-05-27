import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "../components/Header";
import TabNavigator from "./TabNavigator";

export default function MainTabs(): JSX.Element {
  return (
    <View style={styles.container}>
      <Header />
      <TabNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
