import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.state = {
      haveRecordingPermissions: false,
      isRecording: false,
      audioString: null,
      muted: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      isPlaying: false,
    }
  }

  async beginRecording() {
    const recording = new Audio.Recording();
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      this.recording = recording;
      console.log(this.recording);
      await this.recording.startAsync();
      this.setState({
        isRecording: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async stopRecording() {
    this.setState({
      isRecording: false,
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      console.log(error);
    }
    const audioString = await FileSystem.readAsStringAsync(this.recording.getURI(), { encoding: FileSystem.EncodingType.Base64 });
    console.log('audio', audioString);
    this.setState({
      audioString
    });
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
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
      <View style={styles.container}>
        <Button
          title="Begin"
          onPress={() => this.beginRecording()} />

        <Button
          title="Stop"
          onPress={() => this.stopRecording()} />

        <Button
          title="Play / Pause"
          onPress={() => this.onPlayPausePressed()} />
      </View>
    );
  }
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
