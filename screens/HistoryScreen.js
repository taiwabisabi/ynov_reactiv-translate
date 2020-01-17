import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withTheme } from 'react-native-paper';
import styles from '../styles';

class HistoryScreen extends Component {
  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.theme.colors.surface }]}>
        <Text>History</Text>
      </View>
    );
  }
}

export default withTheme(HistoryScreen);