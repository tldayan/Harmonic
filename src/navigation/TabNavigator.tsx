import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, View } from "react-native";
import { TabParamList } from "../types/navigation-types";
import { globalScreenOptions } from "./navigationConfig/globalScreenOptions";
import StoresScreen from "../screens/Tabs/StoresScreen";
import ModulesScreen from "../screens/Tabs/MoreScreen";
import TasksScreen from "../screens/Task/TasksScreen";
import AssetsScreen from "../screens/Tabs/AssetsScreen";
import SocialScreen from "../screens/Tabs/SocialScreen";
import SocialIcon from "../assets/icons/social.svg";
import AssetIcon from "../assets/icons/asset.svg";
import ChatIcon from "../assets/icons/messages.svg";
import StoreIcon from "../assets/icons/store.svg";
import TaskIcon from "../assets/icons/clipboard.svg";
import HamburgerIcon from "../assets/icons/hamburger.svg";
import Header from "../components/Header";
import { colors } from "../styles/colors";
import ChatsTabs from "../screens/Chat/ChatsTabs";

export const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator(): JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        let IconComponent;

        if (route.name === "Social") {
          IconComponent = SocialIcon;
        } else if (route.name === "Assets") {
          IconComponent = AssetIcon;
        } else if (route.name === "Tasks") {
          IconComponent = TaskIcon;
        } else if (route.name === "Stores") {
          IconComponent = StoreIcon;
        } else if (route.name === "Chat") {
          IconComponent = ChatIcon;
        } else {
          IconComponent = HamburgerIcon;
        }

        return {
          ...globalScreenOptions,
          headerShown: true,
          header: () => <Header />,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
              {IconComponent ? (
                <IconComponent
                  width={22}
                  height={22}
                  fill={focused ? colors.ACTIVE_ORANGE : color}
                />
              ) : null}
            </View>
          ),
          tabBarStyle: {
            position: "absolute",
            bottom: 10,
            width: "80%",
            marginHorizontal: "10%",
            elevation: 0,
            backgroundColor: "white",
            borderRadius: 50,
            height: 64,
            paddingHorizontal: 10,
            borderWidth: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarItemStyle: Platform.OS === "android" && {flexDirection: "row", alignItems: "center"},
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.ACTIVE_ORANGE,
          tabBarInactiveTintColor: "gray",
        };
      }}
    >
      <Tab.Screen name="Social" component={SocialScreen} />
      <Tab.Screen name="Assets" component={AssetsScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Stores" component={StoresScreen} />
      <Tab.Screen name="Chat" component={ChatsTabs} />
      <Tab.Screen name="More" component={ModulesScreen} />
    </Tab.Navigator>
  );
}
