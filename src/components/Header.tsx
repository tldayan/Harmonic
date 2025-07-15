import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import BellIcon from "../assets/icons/bell.svg";
import Chat from "../assets/icons/chat.svg";
import { useUser } from "../context/AuthContext";
import CustomButton from "./CustomButton";
import { CustomModal } from "./CustomModal";
import Notifications from "../modals/Notifications";
import OrganizationsList from "../modals/OrganizationsList";
import { useBottomSheet } from "./BottomSheetContext";
import { getOrganizationList } from "../api/network-utils";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { colors } from "../styles/colors";
import { handleSignOut } from "../services/auth-service";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation-types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CardShadowStyles, profilePictureFallbackStyles } from "../styles/global-styles";
import FastImage from "@d11/react-native-fast-image";
import User from "../assets/icons/user.svg"

const Header = () => {
  const { user } = useUser();
  const userUUID = useSelector((state: RootState) => state.auth.userUUID);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [organizationsList, setOrganizationsList] = useState([]);
  const [organization, setOrganization] = useState<Organization | null>(null);

  const { open: openBottomSheet, close: closeBottomSheet } = useBottomSheet();

  const fetchOrganizationsList = async () => {
    if (!userUUID) return;
    const organizations = await getOrganizationList(userUUID);
    setOrganizationsList(organizations);
    setOrganization(organizations[0]);
  };

  useEffect(() => {
    fetchOrganizationsList();
  }, [userUUID]);

  const openOrganizationListSheet = () => {
    openBottomSheet(
      <OrganizationsList
        onClose={closeBottomSheet}
        setOrganization={setOrganization}
        organizationsList={organizationsList}
      />,
      { snapPoints: ["60%"] }
    );
  };

  return (
    <View style={[styles.container, CardShadowStyles]}>
      <TouchableOpacity style={styles.organization} onPress={openOrganizationListSheet}>
        {organization?.OrganizationShortLogo ? (
          <FastImage
            style={{width: 30, height: 30}}
            resizeMode="cover"
            source={{ uri: organization.OrganizationShortLogo,priority: FastImage.priority.high }}
          />
        ) : (
          <View style={[styles.profileIcon, { backgroundColor: "#ccc" }]} />
        )}
      </TouchableOpacity>

      <CustomButton
        buttonStyle={styles.signOut}
        title="Sign Out"
        onPress={handleSignOut}
      />

      <CustomButton
        buttonStyle={styles.bell}
        onPress={() => setNotificationsOpen(true)}
        icon={<BellIcon width={20} height={20} />}
      />

      <CustomButton
        buttonStyle={styles.chat}
        onPress={() => navigation.navigate("ChatsScreen")}
        icon={<Chat width={20} height={20} />}
      />

      <CustomButton
        buttonStyle={{ marginLeft: 14 }}
        onPress={() => navigation.navigate("Profile", { userUUID })}
        icon={
          user?.photoURL ? <FastImage
            source={{ uri: user?.photoURL ?? "", priority: FastImage.priority.high}}
            style={styles.profileIcon}
          /> : 
          <View style={profilePictureFallbackStyles}>
            <User color='red' width={18} height={18} />
          </View>
        }
      />
             

      {notificationsOpen && (
        <CustomModal presentationStyle="fullScreen" fullScreen={true}>
          <Notifications onClose={() => setNotificationsOpen(false)} />
        </CustomModal>
      )}
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
    marginBottom: 1,
  },
  organization: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.LIGHT_COLOR,
    padding: 5,
    borderRadius: 5,
  },
  bell: {
    marginLeft: "auto",
  },
  chat: {
    marginLeft: 15,
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  signOut: {
    marginLeft: "auto",
  },
});

export default Header;
