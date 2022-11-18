const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");
const secret = fs.readFileSync(".secret").toString().trim();

const ALCHEMY_KEY =
  "https://polygon-mumbai.g.alchemy.com/v2/fke1RT6azk_xDaokTyI_iSxw80wuinm_";

const POLYGONSCAN_API_KEY = "A5N32VKC97W7M1H4TTES9MS1GZZWUFJAYY";

module.exports = {
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    polygonscan: POLYGONSCAN_API_KEY,
  },

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    mumbai: {
      provider: () => new HDWalletProvider(secret, ALCHEMY_KEY),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  contracts_directory: "./contracts",
  contracts_build_directory: "./abis",
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  db: {
    enabled: false,
  },
};
