import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import {
  withTheme,
  Appbar,
  Title,
  Button,
  Caption,
  Badge,
  Dialog,
  Portal
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
          <Portal>
            <Dialog
              visible={this.state.from}
              onDismiss={() => this._closeMenu("from")}
            >
              <Dialog.Actions>
                <ScrollView style={{ height: 500 }}>
                  {googleSpeechToTextApiAvailableLanguages.map(
                    ({ code, name }) => (
                      <Button
                        key={code}
                        onPress={() =>
                          this._changeLanguages(0, { code, name }, "from")
                        }
                      >
                        {name}
                      </Button>
                    )
                  )}
                </ScrollView>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <Portal>
            <Dialog
              visible={this.state.to}
              onDismiss={() => this._closeMenu("to")}
            >
              <Dialog.Actions>
                <ScrollView style={{ height: 500 }}>
                  {googleTranslateApiAvailableLanguages.map(
                    ({ code, name }) => (
                      <Button
                        key={code}
                        onPress={() =>
                          this._changeLanguages(1, { code, name }, "to")
                        }
                      >
                        {name}
                      </Button>
                    )
                  )}
                </ScrollView>
              </Dialog.Actions>
            </Dialog>
          </Portal>
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
