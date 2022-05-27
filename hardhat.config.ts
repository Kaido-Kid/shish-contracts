import * as dotenv from 'dotenv'

import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

dotenv.config()

const config: HardhatUserConfig = {
  solidity: '0.8.13',
  networks: {
    mumbai: {
      url: 'https://matic-mumbai.chainstacklabs.com',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    },
    polygon: {
      url: 'https://polygon-rpc.com/',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 40e9
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'USD'
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  }
}

export default config
