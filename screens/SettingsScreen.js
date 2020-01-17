import React, { Component } from "react";
import { View } from "react-native";
import {
  withTheme,
  Appbar,
  Title,
  Button,
  Menu,
  Caption,
  Badge,
} from "react-native-paper";
import { connect } from "react-redux";

import styles from "../styles";
import {
  googleTranslateApiAvailableLanguages,
  googleSpeechToTextApiAvailableLanguages
} from "../availableLanguages";
import {
  getStorageSettings,
  setStorageSettings
} from "../redux/actions/settingsActions";

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: false,
      to: false
    };
  }

  _openMenu = key => this.setState({ [key]: true });

  _closeMenu = key => this.setState({ [key]: false });

  _changeLanguages = (key, value, menu) => {
    const settings = this.props.settings;
    settings[key] = value;
    this.props.setSettings(settings);
    this._closeMenu(menu);
  };

  componentDidMount() {
    this.props.getSettings();
  }

  render() {
    return (
      <View
        style={[
          styles.containerAppBar,
          { backgroundColor: this.props.theme.colors.surface }
        ]}
      >
        <Appbar style={styles.top}>
          <Title>Réglages</Title>
        </Appbar>
        <View>
          <Badge style={[styles.margin, { paddingHorizontal: 10 }]}>
            Valeurs par défaut
          </Badge>
          <Menu
            visible={this.state.from}
            contentStyle={styles.menuSettingContent}
            onDismiss={() => this._closeMenu("from")}
            anchor={
              <View style={styles.margin}>
                <Caption>Langue de départ</Caption>
                <Button
                  icon="text-to-speech"
                  mode="contained"
                  onPress={() => this._openMenu("from")}
                >
                  {this.props.settings[0] && this.props.settings[0].name}
                </Button>
              </View>
            }
          >
            {googleSpeechToTextApiAvailableLanguages.map(({ code, name }) => (
              <Menu.Item
                key={code}
                title={name}
                onPress={() => this._changeLanguages(0, { code, name }, "from")}
              />
            ))}
          </Menu>
          <Menu
            visible={this.state.to}
            contentStyle={styles.menuSettingContent}
            onDismiss={() => this._closeMenu("to")}
            anchor={
              <View style={styles.margin}>
                <Caption>Langue d'arrivée</Caption>
                <Button
                  icon="tooltip-text-outline"
                  mode="contained"
                  onPress={() => this._openMenu("to")}
                >
                  {this.props.settings[1] && this.props.settings[1].name}
                </Button>
              </View>
            }
          >
            {googleTranslateApiAvailableLanguages.map(({ code, name }) => (
              <Menu.Item
                key={code}
                title={name}
                onPress={() => this._changeLanguages(1, { code, name }, "to")}
              />
            ))}
          </Menu>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ settingsReducer }) => {
  return {
    settings: settingsReducer.settings
  };
};

const mapDispatchtoProps = dispatch => {
  return {
    getSettings: () => dispatch(getStorageSettings()),
    setSettings: settings => dispatch(setStorageSettings(settings))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchtoProps
)(withTheme(SettingsScreen));
