import { createThirdwebClient, getContract, watchContractEvents } from "thirdweb";
import { base } from "thirdweb/chains";
import axios from "axios";
import fs from "fs";
import path from "path";
import 'dotenv/config';

const SECRET_KEY = "Z5Bk-8ouqvIVbAm1BrXt4cBJuHf1GfNyuRxCltJUEkJTeL2FZ6uUUSdRf53-FNonQRuikuGV5JrZI1lo7URH8Q";
const DEPLOYED_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

const TELEGRAM_BOT_TOKEN = "8804871661:AAFP2cWi2tyxfr-mOBcxejj8qcaq0dKpNVg";
const TELEGRAM_CHAT_ID = "5590994774";

const client = createThirdwebClient({ secretKey: SECRET_KEY });
const PRIVATE_KEY_PEM = fs.readFileSync(path.resolve(import.meta.dirname, '../private.pem'), 'utf8');

async function sendTelegramAlert(message) {
  try {
    // Spezziamo l'URL in blocchi separati per impedire a Git Bash Windows di alterare la stringa
    const p1 = "ht" + "tps:/";
    const p2 = "/ap" + "i.teleg" + "ram.or" + "g/bo" + "t";
    const url = p1 + p2 + TELEGRAM_BOT_TOKEN + "/sendMessage";
    
    const response = await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown"
    });
    if (response.data.ok) {
      console.log("[🎉 Telegram Success] Messaggio recapitato sul telefono di Massimo!");
    }
  } catch (error) {
    console.error("[-] Errore invio notifica Telegram:", error.response?.data || error.message);
  }
}

const decryptIbanOnBackend = (encryptedText) => {
    try {
        return Buffer.from(encryptedText, 'base64').toString('utf8');
    } catch (e) {
        return null;
    }
};

async function startListener() {
  console.log("[+] Avvio del listener in corso...");
  
  // Innesco immediato del messaggio di test pulito
  await sendTelegramAlert("🚀 *LiquiSwap Desk Attivo!*\nIl backend è in esecuzione su Base Mainnet. Pronto a ricevere transazioni crittografate.");

  if (DEPLOYED_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    console.log("[i] Monitoraggio locale attivo. Imposta l'indirizzo del contratto nel file .env quando lo pubblicherai.");
    return;
  }

  const contract = getContract({ client, chain: base, address: DEPLOYED_CONTRACT_ADDRESS });
  console.log(`[+] Webhook in ascolto eventi...`);

  watchContractEvents({
    contract,
    events: ["event OffRampTriggered(address indexed user, address indexed tokenPaid, uint256 amountIn, string targetIBAN, string accountHolderName)"],
    onEvents: async (events) => {
      for (const event of events) {
        const { user, amountIn, targetIBAN } = event.args;
        const amountInEur = (Number(amountIn) / 10**6).toFixed(2);
        
        await sendTelegramAlert(`🚨 *Nuova Richiesta Off-Ramp!*\n👤 Utente: \`${user}\`\n💵 Importo: \${amountInEur} USDC\n🔒 IBAN (Cifrato): \`${targetIBAN}\``);
      }
    },
  });
}

startListener();
