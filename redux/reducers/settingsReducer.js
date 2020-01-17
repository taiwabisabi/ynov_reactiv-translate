import * as actionTypes from '../actions/settingsActions';

let initialState = {
  settings: false
};

const SettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_SETTINGS:
      return { settings: action.payload };
    default:
      return state;
  }
};

export default SettingsReducer;