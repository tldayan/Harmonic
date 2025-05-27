import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
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
          tabBarButton: (props) => (
            <TouchableWithoutFeedback onPress={props.onPress}>
              <View style={props.style}>{props.children}</View>
            </TouchableWithoutFeedback>
          ),
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
          tabBarIconStyle: {/* borderWidth: 2 */},
          tabBarItemStyle: {flexDirection :"row", alignItems:"center", height: 64/* , borderWidth: 1 */},
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
    tabBarIcon: () => (
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.ACTIVE_ORANGE,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PlusIcon width={22} height={22} color="white" />
      </View>
    ),
    tabBarButton: (props) => {
      const { style } = props;
    
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate("AddModal")}
          activeOpacity={0.8}
          style={[style]}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 29,
              backgroundColor: colors.ACTIVE_ORANGE,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PlusIcon strokeWidth={1.5} width={32} height={32} color="white" />
          </View>
        </TouchableOpacity>
      );
    },
    
  }}
/>

      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Stores" component={StoresScreen} />
{/*       <Tab.Screen name="More" component={ModulesScreen} /> */}
    </Tab.Navigator>
  );
}
