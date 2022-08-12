import React from "react";
import { NavigationContainer } from '@react-navigation/native'
import BottomTabNavigator from "./Navigation/TabNavigator.js";

// Nesting Navigation Documentation:
// https://reactnavigation.org/docs/nesting-navigators/
// https://dev.to/easybuoy/combining-stack-tab-drawer-navigations-in-react-native-with-react-navigation-5-da

export default function App() {
  return(
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  )
}