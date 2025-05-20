import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, Button, TouchableOpacity } from "react-native";
import BellIcon from "../assets/icons/bell.svg"
import { useUser } from "../context/AuthContext";
import CustomButton from "./CustomButton";
import { CustomModal } from "./CustomModal";
import Notifications from "../modals/Notifications";
import { getOrganizationList } from "../api/network-utils";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import OrganizationsList from "../modals/OrganizationsList";
import { colors } from "../styles/colors";
import Switch from "../assets/icons/switch.svg"
import { handleSignOut } from "../services/auth-service";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation-types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Chat from "../assets/icons/chats.svg"


const Header = () => {

    const {user} = useUser()
    const userUUID = useSelector((state: RootState) => state.auth.userUUID)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const [organizationsList, setOrganizationsList] = useState([])
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [switchingOrganization, setSwitchingOrganization] = useState(false)



      const fetchOranizatoinslist = async() => {
        if(!userUUID) return
        const organizationsList = await getOrganizationList(userUUID)
        setOrganizationsList(organizationsList)
        setOrganization(organizationsList[0])
      }

    useEffect(() => {
      fetchOranizatoinslist()
    }, [userUUID])

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.organization} onPress={() => setSwitchingOrganization(true)}>
        <Image width={30} height={30} resizeMode="cover" source={{uri: organization?.OrganizationShortLogo || ""}} /> 
      </TouchableOpacity>
        
        {/* <CustomButton buttonStyle={styles.organization} onPress={() => setSwitchingOrganization(true)} icon={<Switch width={20} height={20} />} /> */}

        <CustomButton buttonStyle={styles.signOut} title="Sign Out" onPress={handleSignOut} />
        
        <CustomButton buttonStyle={styles.bell} onPress={() => setNotificationsOpen(true)} icon={<BellIcon width={20} height={20} />} />
        <CustomButton buttonStyle={styles.chat} onPress={() => navigation.navigate("ChatsScreen")} icon={<Chat width={20} height={20} />} />
        
        <CustomButton onPress={() => navigation.navigate("Profile")} icon={<Image source={{uri: user?.photoURL ?? ""}} style={styles.profileIcon} />} />

        <CustomModal presentationStyle="fullScreen" fullScreen={true} isOpen={notificationsOpen}>
            <Notifications onClose={() => setNotificationsOpen(false)} />
        </CustomModal>

        <CustomModal isOpen={switchingOrganization} onClose={() => setSwitchingOrganization(false)} fullScreen={false} >
          <OrganizationsList onClose={() => setSwitchingOrganization(false)} setOrganization={setOrganization} organizationsList={organizationsList} />
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
  organization:  {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.LIGHT_COLOR,
    padding: 5,
/*     paddingHorizontal: 10,
    paddingVertical: 5, */
    borderRadius: 5
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
    marginLeft: 14,
  },
  signOut: {
    marginLeft: "auto"
  }
});

export default Header;
