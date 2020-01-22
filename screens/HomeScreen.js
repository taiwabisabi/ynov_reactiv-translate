import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import { NavigationEvents } from "react-navigation";
import {
  withTheme,
  IconButton,
  Chip,
  Paragraph,
  ActivityIndicator,
  Dialog,
  Portal,
  Button,
  Headline,
  Modal,
  Text,
  Provider
} from "react-native-paper";
import { connect } from "react-redux";

import { Audio } from "expo-av";
import * as Permissions from "expo-permissions";
import * as Speech from "expo-speech";

import ApiTranslate from "../services/ApiTranslate";

import styles from "../styles";
import {
  googleTranslateApiAvailableLanguages,
  googleSpeechToTextApiAvailableLanguages
} from "../availableLanguages";
import {
  getStorageSettings,
  setStorageSettings
} from "../redux/actions/settingsActions";
import { setStorageHistory } from "../redux/actions/historyActions";

const recordingOptions = {
  android: {
    extension: ".amr",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AMR_WB,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_WB,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000
  },
  ios: {
    extension: ".wav",
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false
  }
};

const audioSettings = {
  allowsRecordingIOS: true,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  playThroughEarpieceAndroid: false,
  staysActiveInBackground: true
};

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.ApiTranslate = new ApiTranslate();
    this.recording = null;
    this.sound = null;
    this.speech = null;
    this.state = {
      haveRecordingPermissions: false,
      isRecording: false,
      isSoundPlaying: false,
      isSpeechPlaying: false,
      isFetching: false,
      results: false,
      overSettings: false,
      visibleModal: false,
    };
  }

  _beginRecording = async () => {
    this._reset();
    const recording = new Audio.Recording();
    try {
      await Audio.setAudioModeAsync(audioSettings);
      await recording.prepareToRecordAsync(recordingOptions);
      this.recording = recording;
      await this.recording.startAsync();
      this.setState({
        isRecording: true
      });
    } catch (error) {
      console.log(error);
      this._reset();
    }
  };

  _stopRecording = async () => {
    this.setState({ isRecording: false });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      console.log(error);
    }

    this.setState({ isFetching: true });
    const uri = this.recording.getURI();
    try {
      const { data: results } = await this.ApiTranslate.getTranslate(
        uri,
        this.state.overSettings
      );
      this.setState({ isFetching: false });
      this.setState({ results });
      this.props.setStorageHistory(
        { ...results, dateTimestamp: +new Date() },
        this.props.settings[2]
        );
    } catch (error) {
      console.log(error);
      this._reset();
    }

    await this._createSound(uri);
    this._onSpeechPlayStopPressed();
  };

  _createSound = async uri => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri });
      soundObject.setIsLoopingAsync(true);
      this.sound = soundObject;
    } catch (error) {
      console.log(error);
      this._reset();
    }
  };

  _onRecordingPressed = () => {
    if (this.state.isRecording) {
      this._stopRecording();
    } else {
      this._beginRecording();
    }
  };

  _onSoundPlayStopPressed = () => {
    if (this.sound != null) {
      if (this.state.isSoundPlaying) {
        this.sound.stopAsync();
        this.setState({
          isSoundPlaying: false
        });
      } else {
        this.sound.playAsync();
        this.setState({
          isSoundPlaying: true
        });
      }
    }
  };

  _onSpeechPlayStopPressed = () => {
    if (this.state.isSpeechPlaying) {
      Speech.stop();
      this.setState({
        isSpeechPlaying: false
      });
    } else {
      Speech.speak(this.state.results.to.text, {
        onDone: () => {
          Speech.stop();
          this.setState({
            isSpeechPlaying: false
          });
        }
      });
      this.setState({
        isSpeechPlaying: true
      });
    }
  };

  _openMenu = key => this.setState({ [key]: true });

  _closeMenu = key => this.setState({ [key]: false });

  _showModal = () => this.setState({ visibleModal: true });

  _hideModal = () => this.setState({ visibleModal: false });

  _changeLanguages = (key, value, menu = false) => {
    const overSettings = this.state.overSettings;
    overSettings[key] = value;
    this.setState({ overSettings })
    if (menu) this._closeMenu(menu);
  };

  _reset = () => {
    this.setState({ results: false, isFetching: false, isRecording: false });
    if (this.state.isSoundPlaying) this._onSoundPlayStopPressed();
    if (this.state.isSpeechPlaying) this._onSpeechPlayStopPressed();
  };

  _onWillFocus = () => {
    this.props.getSettings();
    this.setState({ overSettings: this.props.settings });
  }

  async componentDidMount() {
    this.props.getSettings();
    this.setState({ overSettings: this.props.settings });
    const res = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: res.status === "granted"
    });
  }

  render() {
      console.log(this.props, '________________--------')
      console.log(styles, 'STYLE________________--------')
    return (
      <View
        style={[
          styles.containerHome,
        ]}
      >
        <NavigationEvents onWillFocus={() => this._onWillFocus()} />
        <View style={[styles.containerFixed]}>
          <View style={[styles.containerDivide]}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Chip
                icon="text-to-speech"
                onPress={() => this._openMenu("from")}
                onLongPress={() => this._changeLanguages(0, this.props.settings[0])}
              >
                {this.state.overSettings[0] && this.state.overSettings[0].name}
              </Chip>
              {this.state.results && (
                <Chip
                  icon={this.state.isSoundPlaying ? "stop" : "play"}
                  onPress={this._onSoundPlayStopPressed}
                >
                  {this.state.isSoundPlaying ? "Stop" : "Play"}
                </Chip>
              )}
            </View>
            <View style={{ padding: 10, alignItems: "flex-start" }}>
              {this.state.isFetching ? (
                <ActivityIndicator
                  animating={true}
                  color={this.props.theme.colors.primary}
                />
              ) : (
                <ScrollView>
                  <Paragraph>
                    {this.state.results && this.state.results.from.text}
                  </Paragraph>
                </ScrollView>
              )}
            </View>
          </View>
          <View
            style={[styles.containerDivide, { justifyContent: "flex-end" }]}
          >
            <View style={{ padding: 10, alignItems: "flex-start" }}>
              {this.state.isFetching ? (
                <ActivityIndicator
                  animating={true}
                  color={this.props.theme.colors.primary}
                />
              ) : (
                <ScrollView>
                  <Headline>
                    {this.state.results && this.state.results.to.text}
                  </Headline>
                </ScrollView>
              )}
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Chip
                style={{ alignSelf: "flex-start" }}
                icon="tooltip-text-outline"
                onPress={() => this._openMenu("to")}
                onLongPress={() => this._changeLanguages(1, this.props.settings[1])}
              >
                {this.state.overSettings[1] && this.state.overSettings[1].name}
              </Chip>
              {this.state.results && (
                <Chip
                  icon={this.state.isSpeechPlaying ? "stop" : "play"}
                  onPress={this._onSpeechPlayStopPressed}
                >
                  {this.state.isSpeechPlaying ? "Stop" : "Play"}
                </Chip>
              )}
            </View>
          </View>
        </View>
        {this.state.overSettings && (
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
                          this.state.overSettings[0].code == code
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
        )}
        {this.state.overSettings && (
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
                          this.state.overSettings[1].code == code
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
        )}
            <IconButton
                style={[
                    {marginBottom: 250}
                ]}
                color={this.props.theme.colors.primary}
                size={100}
                icon={this.state.isRecording ? "microphone-off" : "microphone"}
                animated="true"
                onPress={() => this._onRecordingPressed()}
            />
            <Provider>
                <Portal>
                    <Button
                        style={{ backgroundColor: this.props.theme.colors.primary, marginHorizontal: 80, marginTop: 200}}
                        onPress={this._showModal}
                    >
                        Comment ça marche ?
                    </Button>
                    <Modal
                        visible={this.state.visibleModal}
                        onDismiss={this._hideModal}
                    >
                        <Text style={[styles.modalText, { marginTop: 50, fontSize: 26}]}>Pour commencer</Text>
                        <Text style={styles.modalText }>1. Appuyez sur le micro pour lancer l'enregistrement</Text>
                        <Text style={styles.modalText }>2. Ré-appuyez sur le micro une fois que vous avez fini de parler pour terminer l'enregistrement</Text>

                        <Text style={[styles.modalText, { marginTop: 50, fontSize: 26}]}>Tool Tip</Text>
                        <Text style={styles.modalText }>Vous pouvez choisir directement vos langues depuis l'écran d'accueil, cliquez dessus pour voir le menu de choix apparaitre</Text>
                        <Text style={styles.modalText }>Appuyez prolongé sur un de ces menus pour remettre les valeurs par défaut</Text>
                    </Modal>
                </Portal>
            </Provider>
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
    setSettings: settings => dispatch(setStorageSettings(settings)),
    setStorageHistory: (history, max) => dispatch(setStorageHistory(history, max))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchtoProps
)(withTheme(HomeScreen));
