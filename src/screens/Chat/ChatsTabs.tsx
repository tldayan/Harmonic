import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ChatsList from "./ChatList";
import ChatsIcon from "../../assets/icons/chats.svg"
import StoreIcon from "../../assets/icons/store.svg"
import { colors } from "../../styles/colors";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "./ChatScreen";



const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator()

function ChatsTabs() {
    return (
      <Tab.Navigator screenOptions={{
        tabBarShowIcon: true, 
        tabBarIndicatorStyle: { backgroundColor: colors.ACTIVE_ORANGE },
        tabBarStyle: { backgroundColor: 'white' },
        tabBarLabelStyle: { fontWeight: "500"},
        tabBarItemStyle: {flexDirection : "row", alignItems: 'center'}
      }}>
        <Tab.Screen options={{tabBarIcon: () => (
              <ChatsIcon name="account-group" fill={"black"} width={15} height={15} />
            )}} name="Community" component={ChatsList} />
        <Tab.Screen options={{tabBarIcon: () => (
              <StoreIcon name="account-group" fill={"black"} width={15} height={15} />
            )}} name="Store" component={ChatsList} />
      </Tab.Navigator>
    );
  }
  

  export default function ChatsScreen() {

    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="ChatsTabs" component={ChatsTabs}  />
{/*         <Stack.Screen name="ChatScreen" component={ChatScreen} /> */}
      </Stack.Navigator>
    )

  }