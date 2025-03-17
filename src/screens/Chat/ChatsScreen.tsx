import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ChatsList from "./ChatList";
import ChatsIcon from "../../assets/icons/chats.svg"
import { colors } from "../../styles/colors";



const Tab = createMaterialTopTabNavigator();

export default function ChatsScreen() {
    return (
      <Tab.Navigator screenOptions={{
        tabBarShowIcon: true, 
        tabBarIndicatorStyle: { backgroundColor: colors.ACCENT_COLOR },
        tabBarStyle: { backgroundColor: 'white' },
        tabBarLabelStyle: { fontWeight: "500"},
        tabBarItemStyle: {flexDirection : "row", alignItems: 'center'}
      }}>
        <Tab.Screen options={{tabBarIcon: () => (
              <ChatsIcon name="account-group" fill="red" width={15} height={15} />
            )}} name="Community" component={ChatsList} />
        <Tab.Screen name="Store" component={ChatsList} />
      </Tab.Navigator>
    );
  }