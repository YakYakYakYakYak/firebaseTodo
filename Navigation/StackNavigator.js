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
import TimePickerApp from "../Screens/TimePicker";

import AddReward from '../Screens/AddReward';

import CalendarApp from '../Screens/Calendar';


import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  const navigation = useNavigation();
    return (
        <Stack.Navigator 
          screenOptions={{
            header: () => (
              <Button
                onPress={() => navigation.navigate('Ad-Hoc Tasks', {screen: 'HomePage'})}
                title="Ad-Hoc Tasks"
                color="#F29913"
              />
            ),}}>
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
  const navigation = useNavigation();
    return (
        <Stack.Navigator 
        screenOptions={{
          header: () => (
            <Button
              onPress={() => navigation.navigate('Reward', {screen: 'RewardPage'})}
              title="Rewards"
              color="#F29913"
            />
          ),}}>
          <Stack.Screen
              name="RewardPage" 
              component={Reward}
          />
          <Stack.Screen
              name='AddReward'
              component={AddReward}
            />
        </Stack.Navigator>
    );
}

const RecurringStackNavigator = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator 
      screenOptions={{
        header: () => (
          <Button
            onPress={() => navigation.navigate('Recurring Tasks', {screen: 'RecurringHomePage'})}
            title="Recurring Tasks"
            color="#F29913"
          />
        ),}}>
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
        name='TimePickerApp'
        component={TimePickerApp}
      />
    </Stack.Navigator>
    );
}

const CalendarNavigator = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator 
      screenOptions={{
        header: () => (
          <Button
            onPress={() => navigation.navigate('Calendar', {screen: 'CalendarHome'})}
            title="Calendar"
            color="#F29913"
          />
        ),}}>
      <Stack.Screen
        name='CalendarHome'
        component={CalendarApp}
      />
    </Stack.Navigator>
    );
}

export { MainStackNavigator, RewardStackNavigator, RecurringStackNavigator, CalendarNavigator };