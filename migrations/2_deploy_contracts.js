const Mint = artifacts.require("MintNFT");
const PriceDataFeed = artifacts.require("PriceDataFeed");
const APIConsumer = artifacts.require("APIConsumer");

module.exports = function (deployer) {
  deployer.deploy(Mint);
  deployer.deploy(PriceDataFeed);
  deployer.deploy(
    APIConsumer,
    "0x17dED59fCd940F0a40462D52AAcD11493C6D8073",
    "8b459447262a4ccf8863962e073576d9"
  );
};
