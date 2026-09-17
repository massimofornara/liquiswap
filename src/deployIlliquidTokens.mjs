import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";
import { deployContract } from "thirdweb/deploys";
import { privateKeyToAccount } from "thirdweb/wallets";

const SECRET_KEY = "Z5Bk-8ouqvIVbAm1BrXt4cBJuHf1GfNyuRxCltJUEkJTeL2FZ6uUUSdRf53-FNonQRuikuGV5JrZI1lo7URH8Q";
const PRIVATE_KEY = "59e11e8663a63647e2609c6ca9548b78aff5c5a33bcdd4447baf36d0e02f6162";

// Lista dei token illiquidi del tuo Desk da lanciare in produzione
const tokensToDeploy = [
  { name: "LiquiSwap Alpha Token", symbol: "ALPHA", supply: 1000000n },
  { name: "LiquiSwap Beta Token", symbol: "BETA", supply: 5000000n },
  { name: "LiquiSwap Gem Token", symbol: "GEM", supply: 10000000n },
  { name: "LiquiSwap Nebula Token", symbol: "NEBULA", supply: 25000000n }
];

async function main() {
  console.log("[+] Connessione all'infrastruttura Cloud di Thirdweb...");
  const client = createThirdwebClient({ secretKey: SECRET_KEY });
  const account = privateKeyToAccount({ client, privateKey: PRIVATE_KEY });
  
  console.log(`[+] Wallet di firma: ${account.address}`);
  console.log("[+] Avvio della generazione automatica dei contratti ERC-20...");

  for (const token of tokensToDeploy) {
    console.log(`\n[⚙️] Elaborazione di ${token.name} (${token.symbol})...`);
    try {
      // Sfrutta il tunnel di deploy standard pre-compilato di Thirdweb per i token stabili
      const tokenAddress = await deployContract({
        client,
        chain: base,
        account,
        type: "token", // Tipo pre-compilato di Thirdweb per ERC-20 standard con supply prefissata
        params: {
          name: token.name,
          symbol: token.symbol,
          primarySaleRecipient: account.address
        }
      });
      
      console.log(`====================================================`);
      console.log(`🎉 TOKEN ${token.symbol} DISPIEGATO CON SUCCESSO!`);
      console.log(`Indirizzo on-chain: ${tokenAddress}`);
      console.log(`====================================================`);
    } catch (error) {
      console.error(`[-] Errore durante il deploy di ${token.symbol}:`, error.message || error);
    }
  }
}

main();
