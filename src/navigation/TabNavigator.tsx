
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types/navigation-types';
import HomeScreen from '../screens/Home/HomeScreen';
import { globalScreenOptions } from './navigationConfig/globalScreenOptions';
import WorkRequestScreen from '../screens/Home/WorkRequestScreen';
import StoresScreen from '../screens/Home/StoresScreen';
import ChatScreen from '../screens/Home/ChatScreen';
import DepartmentsScreen from '../screens/Home/DepartmentsScreen';
import ModulesScreen from '../screens/Home/ModulesScreen';


export const Tab = createBottomTabNavigator<TabParamList>()


export default function TabNavigator(): JSX.Element {

    return (
        <Tab.Navigator screenOptions={globalScreenOptions} >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="WorkRequests" component={WorkRequestScreen} />
            <Tab.Screen name="Store" component={StoresScreen} />
            <Tab.Screen name="Chat" component={ChatScreen} />
            <Tab.Screen name='Departments' component={DepartmentsScreen} />
            <Tab.Screen name="Modules" component={ModulesScreen} />
        </Tab.Navigator>
    )

}