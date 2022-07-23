import { NavigationContainer } from '@react-navigation/native'
import BottomTabNavigator from "./Navigation/TabNavigator.js";

export default function App() {
  return(
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  )
}