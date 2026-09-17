const fs = require('fs');
const path = require('path');
const solc = require('solc');
const { ethers } = require('ethers');
require('dotenv').config();

const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
const BASE_USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bda02913";

// Risolutore formale di OpenZeppelin per solc nativo
function findImports(importPath) {
    try {
        let actualPath = importPath;
        if (importPath.startsWith('@openzeppelin/')) {
            actualPath = path.resolve(__dirname, '../node_modules', importPath);
        } else {
            actualPath = path.resolve(__dirname, importPath);
        }
        return { contents: fs.readFileSync(actualPath, 'utf8') };
    } catch (e) {
        return { error: 'File non trovato: ' + importPath };
    }
}

async function main() {
    if (!PRIVATE_KEY || PRIVATE_KEY.includes("INSERISCI")) {
        console.error("[-] Errore: DEPLOYER_PRIVATE_KEY mancante nel file .env");
        return;
    }

    console.log("[+] Lettura e compilazione di LiquiSwapManager.sol...");
    const contractPath = path.resolve(__dirname, '../contracts/LiquiSwapManager.sol');
    const source = fs.readFileSync(contractPath, 'utf8');

    const input = {
        language: 'Solidity',
        sources: { 'contracts/LiquiSwapManager.sol': { contents: source } },
        settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } } }
    };

    // Esegue la compilazione passando il callback come secondo argomento
    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

    if (output.errors) {
        let hasErrors = false;
        output.errors.forEach(err => {
            if (err.severity === 'error') {
                console.error("[-] Errore Compilazione:", err.message);
                hasErrors = true;
            }
        });
        if (hasErrors) return;
    }

    const contractData = output.contracts['contracts/LiquiSwapManager.sol']['LiquiSwapManager'];
    if (!contractData) {
        console.error("[-] Errore: Contratto non trovato nei metadati compilati.");
        return;
    }

    const abi = contractData.abi;
    const bytecode = contractData.evm.bytecode.object;

    console.log("[+] Connessione alla rete Base Mainnet...");
    // Endpoint RPC ufficiale standard di Base Mainnet
    const provider = new ethers.providers.JsonRpcProvider("https://mainnet.base.org");
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(`[+] Wallet verificato: ${wallet.address}`);

    const balance = await wallet.getBalance();
    if (balance.eq(0)) {
        console.error(`[-] Errore: Il wallet ${wallet.address} ha 0 ETH su rete Base Mainnet.`);
        return;
    }

    console.log("[+] Invio transazione di deploy on-chain...");
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    try {
        const contract = await factory.deploy(BASE_USDC_ADDRESS);
        console.log(`[+] Transazione pubblicata! Hash: ${contract.deployTransaction.hash}`);
        console.log("[+] In attesa di conferma sui blocchi di Base...");

        await contract.deployed();

        console.log("\n====================================================");
        console.log(`🎉 DEPLOY COMPLETATO CON SUCCESSO!`);
        console.log(`Indirizzo del contratto: ${contract.address}`);
        console.log("====================================================");
    } catch (error) {
        console.error("[-] Errore durante l'invio on-chain:", error.message);
    }
}

main();
