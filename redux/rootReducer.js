import { combineReducers } from 'redux';
import settingsReducer from './reducers/settingsReducer';
import historyReducer from './reducers/historyReducer';

const reducers = combineReducers({ settingsReducer, historyReducer });

export default reducers;