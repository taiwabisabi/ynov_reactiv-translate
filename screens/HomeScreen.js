import React, { Component } from "react";
import { View } from "react-native";
import { NavigationEvents } from "react-navigation";
import {
  withTheme,
  IconButton,
  Chip,
  Paragraph,
  ActivityIndicator
} from "react-native-paper";
import { connect } from "react-redux";

import { Audio } from "expo-av";
import * as Permissions from "expo-permissions";
import * as Speech from 'expo-speech';

import ApiTranslate from '../services/ApiTranslate';

import styles from "../styles";
import {
  googleTranslateApiAvailableLanguages,
  googleSpeechToTextApiAvailableLanguages
} from "../availableLanguages";
import {
  getStorageSettings,
  setStorageSettings,
} from "../redux/actions/settingsActions";
import {
  setStorageHistory
} from "../redux/actions/historyActions";

const recordingOptions = {
  android: {
    extension: '.amr',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AMR_WB,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_WB,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
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
    };
  }

  _beginRecording = async () => {
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
    }
  }

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
      const { data: results } = await this.ApiTranslate.getTranslate(uri, this.props.settings);
      this.setState({ isFetching: false });
      this.setState({ results });
      this.props.setStorageHistory({...results, dateTimestamp: + new Date()}, this.props.settings[2]);
    } catch (error) {
      console.log(error);
      this.setState({ isFetching: false });
    }

    await this._createSound(uri);
    this._onSpeechPlayStopPressed();
  }

  _createSound = async uri => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({uri});
      soundObject.setIsLoopingAsync(true);
      this.sound = soundObject;
    } catch (error) {
      console.log(error);
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

  async componentDidMount() {
    this.props.getSettings();
    const res = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: res.status === "granted"
    });
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: this.props.theme.colors.surface }
        ]}
      >
        <NavigationEvents onWillFocus={() => this.props.getSettings()} />
        <View style={[styles.containerFixed]}>
          <View style={[styles.containerDivide]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Chip icon="text-to-speech">
                {this.props.settings[0] && this.props.settings[0].name}
              </Chip>
              {
                this.state.results && (
                  <Chip
                    icon={this.state.isSoundPlaying ? "stop" : "play"}
                    onPress={this._onSoundPlayStopPressed}>
                    {this.state.isSoundPlaying ? "Stop" : "Play"}
                  </Chip>
                )
              }
            </View>
            <View style={{ padding: 10, alignItems: "flex-start" }}>
              {this.state.isFetching ? (
                <ActivityIndicator
                  animating={true}
                  color={this.props.theme.colors.primary}
                />
              ) : (
                <Paragraph>
                  {this.state.results && this.state.results.from.text}
                </Paragraph>
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
                <Paragraph>
                  {this.state.results && this.state.results.to.text}
                </Paragraph>
              )}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Chip
                style={{ alignSelf: "flex-start" }}
                icon="tooltip-text-outline"
              >
                {this.props.settings[1] && this.props.settings[1].name}
              </Chip>
              {
                this.state.results && (
                  <Chip
                    icon={this.state.isSpeechPlaying ? "stop" : "play"}
                    onPress={this._onSpeechPlayStopPressed}>
                    {this.state.isSpeechPlaying ? "Stop" : "Play"}
                  </Chip>
                )
              }
            </View>
          </View>
        </View>
        <IconButton
          color={this.props.theme.colors.primary}
          size={100}
          icon={this.state.isRecording ? "microphone-off" : "microphone"}
          animated="true"
          onPress={() => this._onRecordingPressed()}
        />
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
    setStorageHistory: history => dispatch(setStorageHistory(history))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchtoProps
)(withTheme(HomeScreen));
