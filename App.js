import React from 'react';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import MainTabNavigator from './navigation/MainTabNavigator';
import { Provider } from 'react-redux';
import store from './redux/store';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PaperProvider theme={DarkTheme}>
          <MainTabNavigator/>
        </PaperProvider>
      </Provider>
    );
  }
}

export default App;
