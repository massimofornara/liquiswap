import { createThirdwebClient, getContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { deployContract } from "thirdweb/deploys";
import { privateKeyToAccount } from "thirdweb/wallets";
import fs from 'fs';
import path from 'path';
import solc from 'solc';

const SECRET_KEY = "Z5Bk-8ouqvIVbAm1BrXt4cBJuHf1GfNyuRxCltJUEkJTeL2FZ6uUUSdRf53-FNonQRuikuGV5JrZI1lo7URH8Q";
const PRIVATE_KEY = "59e11e8663a63647e2609c6ca9548b78aff5c5a33bcdd4447baf36d0e02f6162";
const BASE_USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bda02913";

function findImports(importPath) {
    try {
        let actualPath = importPath;
        if (importPath.startsWith('@openzeppelin/')) {
            actualPath = path.resolve(import.meta.dirname, '../node_modules', importPath);
        } else {
            actualPath = path.resolve(import.meta.dirname, importPath);
        }
        return { contents: fs.readFileSync(actualPath, 'utf8') };
    } catch (e) {
        return { error: 'File non trovato' };
    }
}

async function main() {
    console.log("[+] Compilazione e ottimizzazione del bytecode per Base Mainnet...");
    const contractPath = path.resolve(import.meta.dirname, '../contracts/LiquiSwapManager.sol');
    const source = fs.readFileSync(contractPath, 'utf8');

    const input = {
        language: 'Solidity',
        sources: { 'LiquiSwapManager.sol': { contents: source } },
        settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } } }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
    const contractData = output.contracts['LiquiSwapManager.sol']['LiquiSwapManager'];

    const client = createThirdwebClient({ secretKey: SECRET_KEY });
    const account = privateKeyToAccount({ client, privateKey: PRIVATE_KEY });

    console.log(`[+] Connessione stabilita. Wallet di firma: ${account.address}`);
    console.log("[+] Invio del bytecode al gateway di Thirdweb...");

    try {
        // Pubblica il contratto programmaticamente sfruttando i metadati compilati
        const contractAddress = await deployContract({
            client,
            chain: base,
            account,
            type: "custom",
            abi: contractData.abi,
            bytecode: "0x" + contractData.evm.bytecode.object,
            constructorParams: [BASE_USDC_ADDRESS],
        });

        console.log("====================================================");
        console.log(`🎉 DEPLOY COMPLETATO CON SUCCESSO DA TERMINALE!`);
        console.log(`Indirizzo del contratto LiquiSwapManager: ${contractAddress}`);
        console.log("====================================================");
    } catch (error) {
        console.error("[-] Errore durante la pubblicazione cloud:", error.message || error);
    }
}

main();
