import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withTheme, IconButton, Colors } from 'react-native-paper';

import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';

import axios from 'axios';

const recordingOptions = {
  // android not currently in use, but parameters are required
  android: {
      extension: '.m4a',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
  },
  ios: {
      extension: '.wav',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
  },
};

const audioSettings = {
  allowsRecordingIOS: true,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  playThroughEarpieceAndroid: false,
  staysActiveInBackground: true,
};

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.state = {
      haveRecordingPermissions: false,
      isRecording: false,
      muted: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      isPlaying: false,
    }
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
        isRecording: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async stopRecording() {
    // Stop recording
    this.setState({
      isRecording: false,
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      console.log(error);
    }

    // Get File URi and encoding to Base64
    const { uri } = await FileSystem.getInfoAsync(this.recording.getURI());
    const formData = new FormData();
    formData.append('audio', {
      uri,
      type: 'audio/x-wav',
      // could be anything 
      name: 'speech2text'
    });

    formData.append('from', 'fr-FR');
    formData.append('to', 'pt');

    // Make api call to get translation    
    const ip = await Network.getIpAddressAsync();
    try {
      const { data } = await axios.post(`http://${ip}:3000/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }

    // Create sound player
    await Audio.setAudioModeAsync(audioSettings);
    const { sound } = await this.recording.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
    );
    this.sound = sound;
  }

  onRecordingPressed = () => {
    if (this.state.isRecording) {
      this.stopRecording();
    } else {
      this.beginRecording();
    }
  }

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
    const res = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: res.status === 'granted',
    });
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.theme.colors.surface }]}>
        <IconButton
          color={Colors.red500}
          size={100}
          icon={this.state.isRecording ? 'microphone-off' : 'microphone'}
          animated="true"
          onPress={() => this.onRecordingPressed()} />

        <IconButton
          color={Colors.red500}
          size={100}
          icon={this.state.isPlaying ? 'pause' : 'play'} 
          animated="true"
          onPress={() => this.onPlayPausePressed()} />
      </View>
    );
  }
}

export default withTheme(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
