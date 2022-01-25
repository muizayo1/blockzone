// imports
import Web3 from 'web3'
import { newKitFromWeb3 } from '@celo/contractkit'
import BigNumber from "bignumber.js"
import BlockzoneAbi from '../contract/blockzone.abi.json'
import erc20Abi from '../contract/erc20.abi.json'

// setting global var, let, const
const ERC20_DECIMALS = 18
const BlockzoneContractAddress = "0x5cdE27FDA57279EAC3c74F820889Fd61FEdF4642" // Blockzone contact address
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1" // cUSD contract address

let kit // the kit
let contract // the contract