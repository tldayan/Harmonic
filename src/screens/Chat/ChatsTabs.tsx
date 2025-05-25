import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ChatsList from "./ChatList";
import ChatsIcon from "../../assets/icons/chats.svg"
import StoreIcon from "../../assets/icons/store.svg"
import { colors } from "../../styles/colors";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "./ChatScreen";
import { Text, View } from "react-native";
import CustomButton from "../../components/CustomButton";
import ChevronLeft from "../../assets/icons/chevron-left.svg"
import { useNavigation } from "@react-navigation/native";


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

    const navigation = useNavigation()


    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ChatsTabs">
          {() => (
            <View style={{ flex: 1, backgroundColor: "white"}}>
              <CustomButton buttonStyle={{marginHorizontal: "4%"}} onPress={() => navigation.goBack()} icon={<ChevronLeft width={23} height={23} />} />
              <ChatsTabs />
            </View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }