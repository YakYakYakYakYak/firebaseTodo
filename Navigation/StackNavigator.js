import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Home from '../Screens/Home';
import Detail from '../Screens/Detail';
import Reward from '../Screens/Reward';
import AddTask from '../Screens/AddTask';
import DateTimePickerApp from '../Screens/DateTimePicker';

import RecurringHome from "../Screens/RecurringHome";
import addRecurringTask from '../Screens/AddRecurringTask';
import DetailRecurring from "../Screens/DetailRecurring";

const Stack = createStackNavigator();

const MainStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: true}}>
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
          <Stack.Screen
            name='DateTimePickerApp'
            component={DateTimePickerApp}
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

const RecurringStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: true}}>
      <Stack.Screen
        name='RecurringHomePage'
        component={RecurringHome}
      />
      <Stack.Screen
        name='DetailRecurring'
        component={DetailRecurring}
      />
      <Stack.Screen
        name='AddRecurringTask'
        component={addRecurringTask}
      />
      <Stack.Screen
        name='DateTimePickerApp'
        component={DateTimePickerApp}
      />
    </Stack.Navigator>
);
}

export { MainStackNavigator, RewardStackNavigator, RecurringStackNavigator };