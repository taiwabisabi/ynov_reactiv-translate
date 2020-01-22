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

const historyParams = [5, 10, 20, 30, 40, 50];

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: false,
      to: false,
      history: false
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
          <View style={styles.margin}>
            <Caption>Nombre de traduction enregistrées</Caption>
            <Button
              icon="history"
              mode="contained"
              onPress={() => this._openMenu("history")}
            >
              {this.props.settings[2] && this.props.settings[2]}
            </Button>
          </View>
          <Portal>
            <Dialog
              visible={this.state.from}
              onDismiss={() => this._closeMenu("from")}
            >
              <Dialog.Actions>
                <ScrollView style={{ maxHeight: 500 }}>
                  {googleSpeechToTextApiAvailableLanguages.map(
                    ({ code, name }) => (
                      <Button
                        key={code}
                        color={
                          this.props.settings[0].code == code
                            ? this.props.theme.colors.accent
                            : this.props.theme.colors.primary
                        }
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
                <ScrollView style={{ maxHeight: 500 }}>
                  {googleTranslateApiAvailableLanguages.map(
                    ({ code, name }) => (
                      <Button
                        key={code}
                        color={
                          this.props.settings[1].code == code
                            ? this.props.theme.colors.accent
                            : this.props.theme.colors.primary
                        }
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
          <Portal>
            <Dialog
              visible={this.state.history}
              onDismiss={() => this._closeMenu("history")}
            >
              <Dialog.Actions>
                <ScrollView style={{ maxHeight: 500 }}>
                  {historyParams.map(num => (
                    <Button
                      key={num}
                      color={
                        this.props.settings[2] == num
                          ? this.props.theme.colors.accent
                          : this.props.theme.colors.primary
                      }
                      onPress={() => this._changeLanguages(2, num, "history")}
                    >
                      {num}
                    </Button>
                  ))}
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
