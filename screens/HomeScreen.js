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
import * as FileSystem from "expo-file-system";
import * as Network from "expo-network";

import axios from "axios";

import styles from "../styles";
import {
  googleTranslateApiAvailableLanguages,
  googleSpeechToTextApiAvailableLanguages
} from "../availableLanguages";
import {
  getStorageSettings,
  setStorageSettings
} from "../redux/actions/settingsActions";

const recordingOptions = {
  // android not currently in use, but parameters are required
  android: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
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
    this.recording = null;
    this.sound = null;
    this.state = {
      haveRecordingPermissions: false,
      isRecording: false,
      isPlaying: false,
      isFetching: false,
      muted: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      results: false
    };
  }

  async beginRecording() {
    // Begin reconding
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

  async stopRecording() {
    // Stop recording
    this.setState({
      isRecording: false
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      console.log(error);
    }

    this.setState({ isFetching: true });

    // Get File URi and encoding to Base64
    const { uri } = await FileSystem.getInfoAsync(this.recording.getURI());
    const formData = new FormData();
    formData.append("audio", {
      uri,
      type: "audio/x-wav",
      name: "speech2text"
    });
    formData.append("from", this.props.settings[0].code);
    formData.append("to", this.props.settings[1].code);

    // Make api call to get translation
    try {
      const ip = await Network.getIpAddressAsync();
      console.log(ip);
      const { data: results } = await axios.post(
        `http://${ip}:3000/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      this.setState({ isFetching: false });
      this.setState({ results });
    } catch (error) {
      console.log(error);
    }

    // Create sound player
    await Audio.setAudioModeAsync(audioSettings);
    const { sound } = await this.recording.createNewLoadedSoundAsync({
      isLooping: false,
      isMuted: this.state.muted,
      volume: this.state.volume,
      rate: this.state.rate,
      shouldCorrectPitch: this.state.shouldCorrectPitch
    });
    this.sound = sound;
    this.onPlayPausePressed();
  }

  onRecordingPressed = () => {
    if (this.state.isRecording) {
      this.stopRecording();
    } else {
      this.beginRecording();
    }
  };

  onPlayPausePressed = () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        this.sound.pauseAsync();
        this.setState({
          isPlaying: false
        });
      } else {
        this.sound.playAsync();
        this.setState({
          isPlaying: true
        });
      }
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
            <Chip style={{ alignSelf: "flex-start" }} icon="text-to-speech">
              {this.props.settings[0] && this.props.settings[0].name}
            </Chip>
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
            <Chip
              style={{ alignSelf: "flex-start" }}
              icon="tooltip-text-outline"
            >
              {this.props.settings[1] && this.props.settings[1].name}
            </Chip>
          </View>
        </View>
        <IconButton
          color={this.props.theme.colors.primary}
          size={100}
          icon={this.state.isRecording ? "microphone-off" : "microphone"}
          animated="true"
          onPress={() => this.onRecordingPressed()}
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
    setSettings: settings => dispatch(setStorageSettings(settings))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchtoProps
)(withTheme(HomeScreen));
