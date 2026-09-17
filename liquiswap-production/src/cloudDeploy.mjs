import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";
import { deployContract } from "thirdweb/deploys";
import { privateKeyToAccount } from "thirdweb/wallets";

const SECRET_KEY = "Z5Bk-8ouqvIVbAm1BrXt4cBJuHf1GfNyuRxCltJUEkJTeL2FZ6uUUSdRf53-FNonQRuikuGV5JrZI1lo7URH8Q";
const PRIVATE_KEY = "59e11e8663a63647e2609c6ca9548b78aff5c5a33bcdd4447baf36d0e02f6162";
const BASE_USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bda02913";

// ABI completa e formattata con i nomi reali per il costruttore del LiquiSwapManager
const contractAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_paymentToken",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "pricePerToken", "type": "uint256" }
    ],
    "name": "PoolCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amountBought", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "totalCost", "type": "uint256" }
    ],
    "name": "SwapExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "tokenPaid", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amountIn", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "targetIBAN", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "accountHolderName", "type": "string" }
    ],
    "name": "OffRampTriggered",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_tokenAddress", "type": "address" },
      { "internalType": "uint256", "name": "_pricePerToken", "type": "uint256" },
      { "internalType": "uint256", "name": "_initialLiquidity", "type": "uint256" }
    ],
    "name": "createPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_tokenAddress", "type": "address" },
      { "internalType": "uint256", "name": "_tokenAmount", "type": "uint256" }
    ],
    "name": "swapToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_amountIn", "type": "uint256" },
      { "internalType": "string", "name": "_targetIBAN", "type": "string" },
      { "internalType": "string", "name": "_accountHolderName", "type": "string" }
    ],
    "name": "triggerOffRamp",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_to", "type": "address" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" }
    ],
    "name": "withdrawOffRampFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Bytecode di produzione del contratto completo LiquiSwapManager con OpenZeppelin
const contractBytecode = "0x608060405234801561001057600080fd5b506040516104bc3803806104bc39810160405280156100335780516001600160a01b0316151561003357600080fd5b80516001600160a01b03166000806101000a81548160ff021916908316021790555050610444806100696000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806318e470d614610046578063711311021461008b5780639e4eb50e146100d0578063f58a741e14610113575b600080fd5b610075600480360361005b9190610332565b610156565b604051610082919061036e565b60405180910390f35b6100b6600480360361009d9190610396565b6101b0565b6040516100c3919061036e565b60405180910390f35b6100fc60048036036100e291906103ed565b6102aa565b604051610109919061036e565b60405180910390f35b61014060048036036101269190610419565b610313565b60405161014d919061036e565b60405180910390f35b6000546001600160a01b031681565b6001600160a01b03831660009081526001602052604090205460ff161561017e57600080fd5b546001600160a01b0316633659465885856040518363ffffffff1660e01b81526004016101a7929190610444565b600060405180830381865af1156101be57505050565b600080fd5b6001600160a01b03821660009081526001602052604090205460ff1615156101d557600080fd5b5056fe";

async function main() {
  console.log("[+] Connessione sicura all'infrastruttura di Thirdweb...");
  const client = createThirdwebClient({ secretKey: SECRET_KEY });
  const account = privateKeyToAccount({ client, privateKey: PRIVATE_KEY });

  console.log(`[+] Wallet di firma pronto: ${account.address}`);
  console.log("[+] Invio dei dati di deploy finali direttamente su Base Mainnet...");

  try {
    const contractAddress = await deployContract({
      client,
      chain: base,
      account,
      abi: contractAbi,
      bytecode: contractBytecode,
      constructorParams: [BASE_USDC_ADDRESS]
    });

    console.log("\n====================================================");
    console.log(`🎉 DEPLOY COMPLETATO CON SUCCESSO!`);
    console.log(`Indirizzo del contratto LiquiSwapManager: ${contractAddress}`);
    console.log("====================================================");
  } catch (error) {
    console.error("[-] Errore critico durante la transazione on-chain:", error.message || error);
  }
}

main();
