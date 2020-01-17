import { AsyncStorage } from "react-native";

export const SET_SETTINGS = "SET_SETTINGS";
const STORAGE_KEY = "SETTINGS";
const INITIAL_STATE = [
  {
    code: "fr-FR",
    name: "Français (France)"
  },
  {
    code: "en",
    name: "English"
  }
];

export const setSettings = settings => ({
  type: SET_SETTINGS,
  payload: settings
});

export const getStorageSettings = () => {
  return async dispatch => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    const storageSettings = JSON.parse(data) || INITIAL_STATE;
    dispatch(setSettings(storageSettings));
  };
};

export const setStorageSettings = settings => {
  return async dispatch => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    dispatch(setSettings(settings));
  };
};
