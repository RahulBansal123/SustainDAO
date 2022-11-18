import { SET_PRICES, SET_INFLATION } from './constants';

const initialState = {
  prices: { btc: 0, eth: 0, matic: 0, usdc: 0, link: 0 },
  inflation: 0,
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRICES:
      return {
        ...state,
        prices: action.prices,
      };

    case SET_INFLATION:
      return {
        ...state,
        inflation: action.inflation,
      };
    default:
      return state;
  }
};

export default mainReducer;
