import React from 'react';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import MainTabNavigator from './navigation/MainTabNavigator';

class App extends React.Component {
  render() {
    return (
      <PaperProvider theme={DarkTheme}>
        <MainTabNavigator/>
      </PaperProvider>
    );
  }
}

export default App;
