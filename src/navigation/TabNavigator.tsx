
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types/navigation-types';
import HomeScreen from '../screens/Home/HomeScreen';
import { globalScreenOptions } from './navigationConfig/globalScreenOptions';


export const Tab = createBottomTabNavigator<TabParamList>()


export default function TabNavigator(): JSX.Element {

    return (
        <Tab.Navigator screenOptions={globalScreenOptions} >
            <Tab.Screen name="Home" component={HomeScreen} />
        </Tab.Navigator>
    )

}