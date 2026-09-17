import hre from "hardhat";

async function main() {
  const BASE_USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bda02913";
  
  console.log("[+] Avvio compilazione e deploy tramite Hardhat (ESM Mode)...");
  const LiquiSwapManager = await hre.ethers.getContractFactory("LiquiSwapManager");
  
  // Esegue il deploy inserendo l'indirizzo USDC nel costruttore
  const contract = await LiquiSwapManager.deploy(BASE_USDC_ADDRESS);

  console.log(`[+] Transazione inviata. In attesa di conferma su Base Mainnet...`);
  await contract.deployed();

  console.log("====================================================");
  console.log(`🎉 DEPLOY COMPLETATO CON SUCCESSO!`);
  console.log(`Indirizzo del contratto: ${contract.address}`);
  console.log("====================================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
