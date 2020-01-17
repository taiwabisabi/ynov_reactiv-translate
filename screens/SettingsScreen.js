import React, { Component } from 'react';
import { View } from 'react-native';
import { withTheme, Appbar, Title, Button, Menu, Caption, Badge } from 'react-native-paper';
import styles from '../styles';
import { googleTranslateApiAvailableLanguages, googleSpeechToTextApiAvailableLanguages } from '../availableLanguages';

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: false,
      to: false,
      languageFrom: null,
      languageTo: null,
    }
  }

  _openMenu = key => this.setState({ [key]: true });

  _closeMenu = key => this.setState({ [key]: false });

  _changeLanguages = (key, value, menu) => {
    this.setState({ [key]: value });
    this._closeMenu(menu);
  };

  render() {
    return (
      <View style={[styles.containerAppBar, { backgroundColor: this.props.theme.colors.surface }]}>
        <Appbar style={styles.top}>
          <Title>Réglages</Title>
        </Appbar>
        <View>
          <Badge style={[styles.margin, { paddingHorizontal: 10 }]}>Valeurs par défaut</Badge>
          <Menu
            visible={this.state.from}
            contentStyle={styles.menuSettingContent}
            onDismiss={() => this._closeMenu('from')}
            anchor={
              <View style={styles.margin}>
                <Caption>Langue de départ</Caption>
                <Button 
                  icon="text-to-speech" 
                  mode="contained" 
                  onPress={() => this._openMenu('from')}>{ this.state.languageFrom ? this.state.languageFrom : "Non définis" }</Button>
              </View>
            }
          >
            {
              googleSpeechToTextApiAvailableLanguages.map(({ code, name }) => (
                <Menu.Item 
                key={code}
                title={name}
                onPress={() => this._changeLanguages('languageFrom', name, 'from') }/>
              ))
            }
          </Menu>
          <Menu
            visible={this.state.to}
            contentStyle={styles.menuSettingContent}
            onDismiss={() => this._closeMenu('to')}
            anchor={
              <View style={styles.margin}>
                <Caption>Langue d'arrivée</Caption>
                <Button 
                  icon="tooltip-text-outline" 
                  mode="contained" 
                  onPress={() => this._openMenu('to')}>{ this.state.languageTo ? this.state.languageTo : "Non définis" }</Button>
              </View>
            }
          >
            {
              googleTranslateApiAvailableLanguages.map(({ code, name }) => (
                <Menu.Item 
                key={code}
                title={name}
                onPress={() => this._changeLanguages('languageTo', name, 'to') }/>
              ))
            }
          </Menu>
        </View>
      </View>
    );
  }
}

export default withTheme(SettingsScreen);