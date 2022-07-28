import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Home from '../Screens/Home';
import Detail from '../Screens/Detail';
import Reward from '../Screens/Reward';
import AddTask from '../Screens/AddTask';
const Stack = createStackNavigator();

const MainStackNavigator = () => {
    return (
        <Stack.Navigator 
        screenOptions={{headerShown: false}}
        >
          <Stack.Screen
            name='HomePage'
            component={Home}
          />
          <Stack.Screen
            name='Detail'
            component={Detail}
            />
          <Stack.Screen
            name='AddTask'
            component={AddTask}
            />
        </Stack.Navigator>
    );
  }

const RewardStackNavigator = () => {
    return (
        <Stack.Navigator
        screenOptions={{headerShown: false}}
        >
        <Stack.Screen name="RewardPage" component={Reward} />
        </Stack.Navigator>
    );
}

export { MainStackNavigator, RewardStackNavigator };