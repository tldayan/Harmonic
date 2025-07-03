import FastImage from '@d11/react-native-fast-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MinimalProfileHeaderProps {
  name?: string;
  ProfilePic?: string;
  flex?: boolean;
}

export default function MinimalProfileHeader({
  name,
  ProfilePic = "https://i.pravatar.cc/150",
  flex = false
}: MinimalProfileHeaderProps) {
  return (
    <View style={[styles.mainContainer, flex ? { flex: 1 } : null]}>
      <FastImage
        style={styles.profilePicture}
        source={{
          uri: ProfilePic.trim() || "https://i.pravatar.cc/150",
          priority: FastImage.priority.high,
        }}
      />
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profilePicture: {
    width: 34,
    height: 34,
    borderRadius: 50,
  },
  name: {
    fontWeight: '500',
    fontSize: 15,
    color: '#000',
  },
});
