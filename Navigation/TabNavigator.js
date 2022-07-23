import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { MainStackNavigator, RewardStackNavigator } from "./StackNavigator";

import { MaterialCommunityIcons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F29913',
      }}
      >
        <Tab.Screen 
            name="Home" 
            options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="clipboard-list" color={color} size={size} />
                ),
              }}
            component={MainStackNavigator} />
        <Tab.Screen 
            name="Rewards" 
            options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="gift" color={color} size={size} />
                ),
              }}
            component={RewardStackNavigator} />
      </Tab.Navigator>
    );
  };
  
  export default BottomTabNavigator;