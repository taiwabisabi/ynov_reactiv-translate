import React from "react";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createAppContainer } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HisoryScreeen from "../screens/HistoryScreen";

const tabNavigator = createMaterialBottomTabNavigator(
  {
    History: {
      screen: HisoryScreeen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon color={tintColor} size={25} name={"ios-time"} />
        )
      }
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon color={tintColor} size={25} name={"ios-microphone"} />
        )
      }
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon color={tintColor} size={25} name={"ios-settings"} />
        )
      }
    }
  },
  {
    initialRouteName: "Home",
    labeled: false
  }
);

export default createAppContainer(tabNavigator);
