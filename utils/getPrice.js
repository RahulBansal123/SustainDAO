import Web3 from 'web3';
import PriceDataFeedContract from '../abis/PriceDataFeed.json';
import APIConsumerContract from '../abis/APIConsumer.json';

const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(
  PriceDataFeedContract.abi,
  PriceDataFeedContract.networks[80001].address
);
const apiContract = new web3.eth.Contract(
  APIConsumerContract.abi,
  APIConsumerContract.networks[80001].address
);

export const getBTCPrice = async () => {
  let price = (await contract.methods.getLatestPriceBTC().call()) / 10 ** 8;
  price = parseFloat(price).toFixed(2);
  return price;
};

export const getETHPrice = async () => {
  let price = (await contract.methods.getLatestPriceETH().call()) / 10 ** 8;
  price = parseFloat(price).toFixed(2);
  return price;
};

export const getMATICPrice = async () => {
  let price = (await contract.methods.getLatestPriceMATIC().call()) / 10 ** 8;
  price = parseFloat(price).toFixed(2);
  return price;
};

export const getUSDCPrice = async () => {
  let price = (await contract.methods.getLatestPriceUSDC().call()) / 10 ** 8;
  price = parseFloat(price).toFixed(2);
  return price;
};

export const getLINKPrice = async () => {
  let price = (await contract.methods.getLatestPriceLINK().call()) / 10 ** 8;
  price = parseFloat(price).toFixed(2);
  return price;
};

export const fetchInflation = async () => {
  let inflation = await apiContract.methods.yoyInflation().call();
  inflation = parseFloat(inflation).toFixed(2);
  return inflation;
};

export const fetchInflationAgain = async (account) => {
  const res = await apiContract.methods.requestYoyInflation().send({
    from: account,
    gasLimit: '160000',
    gasPrice: web3.utils.toWei('3', 'gwei'),
  });
  console.log(res);
  let inflation = (await apiContract.methods.yoyInflation().call()) / 10 ** 8;
  inflation = parseFloat(inflation).toFixed(2);
  return inflation;
};
