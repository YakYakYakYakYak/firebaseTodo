import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { MainStackNavigator, RewardStackNavigator, RecurringStackNavigator, CalendarNavigator } from "./StackNavigator";

import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#F29913',
      }}
      >
        <Tab.Screen 
            name="Ad-Hoc Tasks" 
            options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="clipboard-list" color={color} size={size} />
                ),
              }}
            component={MainStackNavigator} />
        <Tab.Screen 
            name="Recurring Tasks" 
            options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="reload" color={color} size={size} />
                ),
              }}
            component={RecurringStackNavigator} />
        <Tab.Screen 
            name="Reward" 
            options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="gift" color={color} size={size} />
                ),
              }}
            component={RewardStackNavigator} />
        <Tab.Screen 
            name="Calendar" 
            options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="calendar" color={color} size={size} />
                ),
              }}
            component={CalendarNavigator} />
      </Tab.Navigator>
    );
  };
  
  export default BottomTabNavigator;