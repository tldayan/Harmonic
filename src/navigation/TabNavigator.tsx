import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../types/navigation-types";
import { globalScreenOptions } from "./navigationConfig/globalScreenOptions";
import StoresScreen from "../screens/Home/StoresScreen";
import ChatScreen from "../screens/Home/ChatScreen";
import ModulesScreen from "../screens/Home/MoreScreen";
import TasksScreen from "../screens/Home/TasksScreen";
import AssetsScreen from "../screens/Home/AssetsScreen";
import SocialScreen from "../screens/Home/SocialScreen";
import SocialIcon from "../assets/icons/social.svg";
import AssetIcon from "../assets/icons/asset.svg";
import ChatIcon from "../assets/icons/messages.svg";
import StoreIcon from "../assets/icons/store.svg";
import TaskIcon from "../assets/icons/clipboard.svg";
import HamburgerIcon from "../assets/icons/hamburger.svg"
import Header from "../components/Header";

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
          tabBarIcon: ({ color }) =>
            IconComponent ? <IconComponent width={16} height={16} fill={color} /> : null, headerShown : true, header: () => <Header />
        };
      }}
    >
      <Tab.Screen name="Social" component={SocialScreen} />
      <Tab.Screen name="Assets" component={AssetsScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Stores" component={StoresScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="More" component={ModulesScreen} />
    </Tab.Navigator>
  );
}
