import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    baseSepolia: {
      url: `${process.env.ALCHEMY_URL_BASE_SEPOLIA}`,
      accounts: [(process.env.TEST_PRIVATE_KEY as `0x`) || ""],
      gasPrice: 1500000000,
    },
  
  },
  etherscan: {
    apiKey: {
            "base-mainnet": process.env.ETHERSCAN_API_KEY || "",
      //"base-sepolia": process.env.ETHERSCAN_API_KEY || "",
    },
    customChains: [

      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
};

export default config;
