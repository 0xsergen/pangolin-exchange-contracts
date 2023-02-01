require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
const { CHAINS } = require("@pangolindex/sdk");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Create hardhat networks from @pangolindex/sdk
let networksFromSdk = {};
for (const chain of Object.values(CHAINS)) {
  networksFromSdk[chain.id] = {
    url: chain.rpc_uri,
    chainId: chain.chain_id,
    accounts: [process.env.PRIVATE_KEY],
  };
}
networksFromSdk["hardhat"] = {
  chainId: 43112,
  initialDate: "2021-10-10",
};
networksFromSdk["localhost"] = {
  accounts: [process.env.PRIVATE_KEY],
  forking: {
    enabled: true,
    url: "https://eth.bd.evmos.org:8545",
    accounts: [process.env.PRIVATE_KEY],
  },
};
networksFromSdk["evmos_mainnet"] = {
  url: "https://eth.bd.evmos.org:8545",
  chainId: 9001,
  accounts: [process.env.PRIVATE_KEY],
};

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// To learn which networks are defined
task(
  "networks",
  "Lists all networks defined in the hardhat.config.js file",
  async () => {
    // Load the hardhat.config.js file
    const configFilePath = path.resolve(__dirname, "hardhat.config.js");
    const config = require(configFilePath);

    // Get the networks defined in the config file
    const networks = config.networks;

    // Print the name of each network
    for (const networkName in networks) {
      console.log(networkName);
    }
  }
);

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.4.16",
      },
      {
        version: "0.5.16",
      },
      {
        version: "0.6.2",
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.7.0",
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000,
          },
        },
      },
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000,
          },
        },
      },
    ],
    overrides: {
      "contracts/mini-chef-zapper/MiniChefV2Zapper.sol": {
        version: "0.8.11",
      },
      "contracts/WAVAX.sol": {
        version: "0.5.17",
        settings: {
          // For mocking
          outputSelection: {
            "*": {
              "*": ["storageLayout"],
            },
          },
        },
      },
    },
  },
  networks: networksFromSdk,
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      ropsten: process.env.ETHERSCAN_API_KEY,
      rinkeby: process.env.ETHERSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      kovan: process.env.ETHERSCAN_API_KEY,
      // binance smart chain
      bsc: process.env.BSCSCAN_API_KEY,
      bscTestnet: process.env.BSCSCAN_API_KEY,
      // huobi eco chain
      heco: process.env.HECOINFO_API_KEY,
      hecoTestnet: process.env.HECOINFO_API_KEY,
      // fantom mainnet
      opera: process.env.FTMSCAN_API_KEY,
      ftmTestnet: process.env.FTMSCAN_API_KEY,
      // optimism
      optimisticEthereum: process.env.OPTIMISTIC_ETHERSCAN_API_KEY,
      // optimisticKovan: process.env.OPTIMISTIC_ETHERSCAN_API_KEY, // to avoid the error
      // polygon
      polygon: process.env.POLYGONSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      // arbitrum
      arbitrumOne: process.env.ARBISCAN_API_KEY,
      arbitrumTestnet: process.env.ARBISCAN_API_KEY,
      // avalanche
      avalanche: process.env.SNOWTRACE_API_KEY,
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY,
      // moonbeam
      moonriver: process.env.MOONRIVER_MOONSCAN_API_KEY,
      moonbaseAlpha: process.env.MOONBEAM_MOONSCAN_API_KEY,
      // xdai and sokol don't need an API key, but you still need
      // to specify one; any string placeholder will work
      xdai: "api-key",
      sokol: "api-key",
      flare: "api-key",
      coston2: "api-key",
      evmos_mainnet: "api-key",
    },
    // adding support for non-supported explorers
    // see Hardhat Docs for additional information
    // https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan#adding-support-for-other-networks
    customChains: [
      {
        network: "flare",
        chainId: 14,
        urls: {
          apiURL: "https://flare-explorer.flare.network/api",
          browserURL: "https://flare-explorer.flare.network/",
        },
      },
      {
        network: "coston2",
        chainId: 114,
        urls: {
          apiURL: "https://coston2-explorer.flare.network/api",
          browserURL: "https://coston2-explorer.flare.network/",
        },
      },
      {
        network: "evmos_mainnet",
        chainId: 9001,
        urls: {
          apiURL: "https://blockscout.evmos.org/api",
          browserURL: "https://blockscout.evmos.org/",
        },
      },
    ],
  },
};
