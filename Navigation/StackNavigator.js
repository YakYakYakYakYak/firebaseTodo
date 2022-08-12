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


import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  const navigation = useNavigation();
    return (
        <Stack.Navigator 
          // screenOptions={{
          //   header: () => (
          //     <Button
          //       onPress={() => navigation.navigate('Ad-Hoc Tasks', {screen: 'HomePage'})}
          //       title="Ad-Hoc Tasks"
          //       color="#F29913"
          //     />
          //   ),}}
          screenOptions={{
            header: () => (
              <TouchableOpacity style ={styles.headerBtn} onPress={() => navigation.navigate('Ad-Hoc Tasks', {screen: 'HomePage'})}>
                <Text style={styles.headerText}>AD-HOC TASKS</Text>
              </TouchableOpacity>
            ),}}
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
              <TouchableOpacity style ={styles.headerBtn} onPress={() => navigation.navigate('Reward', {screen: 'RewardPage'})}>
                <Text style={styles.headerText}>REWARDS</Text>
              </TouchableOpacity>
            ),}}
        >
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
              <TouchableOpacity style ={styles.headerBtn} onPress={() => navigation.navigate('Recurring Tasks', {screen: 'RecurringHomePage'})}>
                <Text style={styles.headerText}>RECURRING TASKS</Text>
              </TouchableOpacity>
            ),}}
    >
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
              <TouchableOpacity style ={styles.headerBtn} onPress={() => navigation.navigate('Calendar', {screen: 'CalendarHome'})}>
                <Text style={styles.headerText}>CALENDAR</Text>
              </TouchableOpacity>
            ),}}
    >
      <Stack.Screen
        name='CalendarHome'
        component={CalendarApp}
      />
    </Stack.Navigator>
    );
}

export { MainStackNavigator, RewardStackNavigator, RecurringStackNavigator, CalendarNavigator };

const styles = StyleSheet.create({
  headerBtn: {
    backgroundColor: "#F29913",
    height:50,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 'auto',
  }
})