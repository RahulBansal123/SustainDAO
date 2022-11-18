import { SET_PRICES, SET_INFLATION } from './constants';

export const fetchCryptoPrices = (prices) => {
  return {
    type: SET_PRICES,
    prices: prices,
  };
};

export const setCurrentInflation = (inflation) => {
  return {
    type: SET_INFLATION,
    inflation,
  };
};
