import React from "react";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createAppContainer } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import { IconButton } from "react-native-paper";

import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HisoryScreeen from "../screens/HistoryScreen";

const tabNavigator = createMaterialBottomTabNavigator(
  {
    History: {
      screen: HisoryScreeen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <IconButton icon="history" size={25} color={tintColor} style={{ marginTop: -5 }}/>
        )
      }
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <IconButton icon="microphone" size={30} color={tintColor} style={{ marginTop: -7.5 }}/>
        )
      }
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <IconButton icon="settings" size={25} color={tintColor} style={{ marginTop: -5 }}/>
        )
      }
    }
  },
  {
    initialRouteName: "Home",
    labeled: false,
  }
);

export default createAppContainer(tabNavigator);
