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

export const setStorageHistory = (history, max) => {
  return async dispatch => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    let storageHistory = JSON.parse(data) || [];
    storageHistory.unshift(history);
    storageHistory = storageHistory.slice(0, max);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storageHistory));
    dispatch(setHistory(storageHistory));
  };
};