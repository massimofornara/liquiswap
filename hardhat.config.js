import "@nomiclabs/hardhat-ethers";
import "dotenv/config";

export default {
  solidity: "0.8.20",
  networks: {
    base: {
      url: "https://base.org",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY]
    }
  }
};
