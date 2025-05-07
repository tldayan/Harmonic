import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, TouchableOpacity, View } from "react-native";
import { RootStackParamList, TabParamList } from "../types/navigation-types";
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
import EventsIcon from "../assets/icons/calendar.svg"
import Header from "../components/Header";
import { colors } from "../styles/colors";
import PlusIcon from "../assets/icons/plus.svg"
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import EventsScreen from "../screens/Tabs/EventsScreen";

export const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator(): JSX.Element {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const EmptyScreen = () => null;
  
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
        } else if (route.name === "Events") {
          IconComponent = EventsIcon;
        } else if (route.name === "More") {
          IconComponent = HamburgerIcon;
        }

        return {
          ...globalScreenOptions,
          headerShown: true,
          header: () => <Header />,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: "absolute"}}>
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
            borderRadius: 50,
            height: 64,
            borderWidth: 1,
          },
          tabBarHideOnKeyboard: true,
          tabBarItemStyle: {flexDirection :"row", alignItems:"center", height: 64},
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
        component={EmptyScreen}
        options={{
          tabBarButton: () => (
            <TouchableOpacity
            onPress={() => {
              navigation.navigate("AddModal");
            }}
              style={{
                position: "absolute", 
                top: "50%",    
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.ACTIVE_ORANGE,
                padding: 10,
                borderRadius: 30,
                transform: [{ translateX: "25%" }, { translateY: "-50%" }],
              }}
            >
          <PlusIcon width={20} height={20} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Stores" component={StoresScreen} />
{/*       <Tab.Screen name="More" component={ModulesScreen} /> */}
    </Tab.Navigator>
  );
}
