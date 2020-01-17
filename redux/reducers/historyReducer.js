import * as actionTypes from '../actions/historyActions';

let initialState = {
  history: []
};

const HistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_HISTORY:
      return {
        ...state,
        history: action.payload
      };
    default:
      return state;
  }
};

export default HistoryReducer;