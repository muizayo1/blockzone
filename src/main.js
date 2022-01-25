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

// connect to celo wallet
const connectCeloWallet = async function() {
    if (window.celo) {
        notification("⚠️ Please approve this DApp to use it.")
        try {
            await window.celo.enable()
            notificationOff()

            const web3 = new Web3(window.celo)
            kit = newKitFromWeb3(web3)

            // accessing user account
            const accounts = await kit.web3.eth.getAccounts()
            kit.defaultAccount = accounts[0]

            // setting contract on the web3 using the kit
            contract = new kit.web3.eth.Contract(BlockzoneAbi, BlockzoneContractAddress)
        } catch (error) {
            // error validation response
            notification(`⚠️ ${error}.`)
        }
    } else {
        // installation notice
        notification("⚠️ Please install the CeloExtensionWallet.")
    }
}

// approve traction notification
async function approve(_price) {
    // setting the cUSD contract on the web3 using the kit
    const cUSDContract = new kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)

    const result = await cUSDContract.methods
        .approve(BlockzoneContractAddress, _price)
        .send({ from: kit.defaultAccount })
    return result
}

// getting total balance in cUSD
const getBalance = async function() {
    const totalBalance = await kit.getTotalBalance(kit.defaultAccount)
        // shifting and converting the balance to currency format
        //  using the "priceToCurrency()" below
    const cUSDBalance = priceToCurrency(totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS))
    document.querySelector("#balance").textContent = cUSDBalance
}

// price to currency format
function priceToCurrency(price) {
    return parseFloat(price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// notification on
function notification(_message) {
    document.querySelector(".alert").style.display = "block"
    document.querySelector("#notification").textContent = _message
}

// notification off
function notificationOff() {
    document.querySelector(".alert").style.display = "none"
}

// load functions on start
window.addEventListener("load", async() => {
    notification("Getting ready...")
    await connectCeloWallet()
    await getBalance()
    notificationOff()
})

document
    .querySelector("#applyNow")
    .addEventListener("click", async() => {
        notification("⌛ Waiting for payment approval...")
        try {
            await approve(clothes[index].price.toString())
        } catch (error) {
            notification(`⚠️ ${error}.`)
        }
        notification(`⌛ Awaiting payment for "Admission"...`)
        try {
            const result = await contract.methods
                .applyForAdmission(index, new BigNumber(parseFloat(2e18)).shiftedBy(ERC20_DECIMALS))
                .send({ from: kit.defaultAccount })
            notification(`🎉 You successfully bought "Admission".`)
            console.log(result)
            getBalance()
        } catch (error) {
            notification(`⚠️ ${error}.`)
        }
    })