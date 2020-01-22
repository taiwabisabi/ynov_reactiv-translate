import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
  containerAppBar: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Constants.statusBarHeight,
    paddingTop: 60
  },
  containerFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  containerDivide: {
    flex: 1,
    padding: 20,
  },
  containerHome: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Constants.statusBarHeight,
  },
  modalText: {
    color: '#fff',
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    textAlign: 'center'
  },
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  margin: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  padding: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuSettingContent: {
    marginLeft: 20,
    marginTop: 50,
  }
});