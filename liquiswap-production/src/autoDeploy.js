const { createThirdwebClient } = require("thirdweb");
const { base } = require("thirdweb/chains");
const { deployContract } = require("thirdweb/deploys");
const { privateKeyToAccount } = require("thirdweb/wallets");
require("dotenv").config();

const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
const SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
const BASE_USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bda02913";

async function main() {
  if (!SECRET_KEY || !PRIVATE_KEY || SECRET_KEY.includes("INSERISCI") || PRIVATE_KEY.includes("INSERISCI")) {
    console.error("[-] Errore: Controlla il tuo file .env! Assicurati di aver inserito le tue chiavi reali senza i testi di esempio.");
    return;
  }

  console.log("[+] Inizializzazione del client Thirdweb...");
  const client = createThirdwebClient({ secretKey: SECRET_KEY });
  const account = privateKeyToAccount({ client, privateKey: PRIVATE_KEY });

  console.log(`[+] Wallet Deployer pronto: ${account.address}`);
  console.log("[+] Avvio del deploy automatico di LiquiSwapManager su Base Mainnet...");

  try {
    const contractAddress = await deployContract({
      client,
      chain: base,
      account,
      type: "custom",
      contractId: "LiquiSwapManager",
      constructorParams: [BASE_USDC_ADDRESS],
    });

    console.log("====================================================");
    console.log(`🎉 DEPLOY COMPLETATO CON SUCCESSO!`);
    console.log(`Indirizzo del contratto: ${contractAddress}`);
    console.log("====================================================");
  } catch (error) {
    console.error("[-] Errore durante il deploy:", error.message || error);
  }
}

main();
