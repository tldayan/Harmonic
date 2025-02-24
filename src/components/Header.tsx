import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import BellIcon from "../assets/icons/bell.svg"
import HarmonicLogo from "../assets/icons/harmonic-logo.svg"
import { useUser } from "../context/AuthContext";
import CustomButton from "./CustomButton";
import { CustomModal } from "./CustomModal";
import Notifications from "../modals/Notifications";


const Header = () => {

    const {user} = useUser()

    const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <View style={styles.container}> 
        <HarmonicLogo />
        <CustomButton buttonStyle={styles.bell} onPress={() => setNotificationsOpen(true)} icon={<BellIcon width={20} height={20} />} />
        <CustomButton onPress={() => {}} icon={<Image source={{uri: user?.photoURL ?? ""}} style={styles.profileIcon} />} />

        <CustomModal fullScreen={true} isOpen={notificationsOpen}>
            <Notifications onClose={() => setNotificationsOpen(false)} />
        </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "white",
  },
  bell: {
    marginLeft: "auto",
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginLeft: 14,
  },
});

export default Header;
