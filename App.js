import React from 'react';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';

import HomeScreen from './screens/HomeScreen';

class App extends React.Component {
  render() {
    return (
      <PaperProvider theme={DarkTheme}>
        <HomeScreen/>
      </PaperProvider>
    );
  }
}

export default App;
