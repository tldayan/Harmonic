import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, TouchableOpacity, View } from "react-native";
import { TabParamList } from "../types/navigation-types";
import { globalScreenOptions } from "./navigationConfig/globalScreenOptions";
import StoresScreen from "../screens/Tabs/StoresScreen";
import ModulesScreen from "../screens/Tabs/MoreScreen";
import TasksScreen from "../screens/Task/TasksScreen";
import AssetsScreen from "../screens/Tabs/AssetsScreen";
import SocialScreen from "../screens/Tabs/SocialScreen";
import SocialIcon from "../assets/icons/social.svg";
import AssetIcon from "../assets/icons/asset.svg";
import StoreIcon from "../assets/icons/store.svg";
import TaskIcon from "../assets/icons/clipboard.svg";
import HamburgerIcon from "../assets/icons/hamburger.svg";
import Header from "../components/Header";
import { colors } from "../styles/colors";
import PlusIcon from "../assets/icons/plus.svg"

export const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator(): JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        let IconComponent: React.ElementType | undefined;

        if (route.name === "Social") {
          IconComponent = SocialIcon;
        } else if (route.name === "Assets") {
          IconComponent = AssetIcon;
        } else if (route.name === "Tasks") {
          IconComponent = TaskIcon;
        } else if (route.name === "Stores") {
          IconComponent = StoreIcon;
        } else if (route.name === "More") {
          IconComponent = HamburgerIcon;
        }

        return {
          ...globalScreenOptions,
          headerShown: true,
          header: () => <Header />,
          tabBarIcon: ({ color, focused }) => (
            <View style={[{ alignItems: "center", height: "100%" }, Platform.OS === "android" ? {justifyContent: "center"} : null]}>
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
            width: "86%",
            marginHorizontal: "7%",
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
          tabBarItemStyle: Platform.OS === "android" && { flexDirection: "row", alignItems: "center" },
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.ACTIVE_ORANGE,
          tabBarInactiveTintColor: "gray",
        };
      }}
    >
      <Tab.Screen name="Social" component={SocialScreen} />
      {/* <Tab.Screen name="Assets" component={AssetsScreen} /> */}
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen
        name="Add"
        component={() => null}
        options={{
          tabBarButton: () => (
            <TouchableOpacity
              onPress={() => {
                
              }}
              style={{
                position: "absolute", 
                top: 5, 
                left: 10,          
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.ACTIVE_ORANGE,
                padding: 10,
                borderRadius: 30,
                transform: [{ translateX: "-0%" }, { translateY: "-20%" }],
              }}
            >
          <PlusIcon width={20} height={20} fill="white" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <Tab.Screen name="Stores" component={StoresScreen} />
      <Tab.Screen name="More" component={ModulesScreen} />
    </Tab.Navigator>
  );
}
