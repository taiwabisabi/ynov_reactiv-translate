import { AsyncStorage } from 'react-native';

export const SET_HISTORY = 'SET_HISTORY';
const STORAGE_KEY = 'HISTORY';

export const setHistory = history => ({
  type: SET_HISTORY,
  payload: history
});

export const getStorageHistory = () => {
  return async dispatch => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    const storageHistory = JSON.parse(data) || [];
    dispatch(setHistory(storageHistory));
  };
};

export const setStorageHistory = history => {
  return async dispatch => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    const storageHistory = JSON.parse(data) || [];
    storageHistory.push(history);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storageHistory));
    dispatch(setHistory(storageHistory));
  };
};