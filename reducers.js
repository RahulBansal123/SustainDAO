import { combineReducers } from 'redux';

import mainReducer from './containers/main/reducers';

const reducers = {
  main: mainReducer,
};

export default combineReducers(reducers);
