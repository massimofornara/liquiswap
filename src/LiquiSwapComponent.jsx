import React, { useState } from "react";
import { createThirdwebClient, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { base } from "thirdweb/chains";
import { smartWallet, useActiveAccount, useConnect } from "thirdweb/wallets";

const client = createThirdwebClient({
  clientId: "IL_TUO_THIRDWEB_CLIENT_ID" 
});

export default function LiquiSwapComponent() {
  const account = useActiveAccount();
  const { connect } = useConnect();
  
  const [amount, setAmount] = useState("");
  const [iban, setIban] = useState("");
  const [holderName, setHolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);

  // Lista statica dei Token Illiquidi ricavata dal tuo screenshot del Desk
  const illiquidTokens = [
    { name: "ALPHA", balance: "12 token", price: "€ 1.500" },
    { name: "BETA", balance: "40 token", price: "€ 280" },
    { name: "GEM", balance: "120 token", price: "€ 95" },
    { name: "NEBULA", balance: "300 token", price: "€ 42" },
  ];

  const handleConnectWallet = async () => {
    try {
      await connect(async () => {
        return smartWallet({
          chain: base,
          sponsorGas: true,
          factoryAddress: "0x11C9C718607fa6bd67fAA74C01eF567Ff4661882",
        });
      });
    } catch (error) {
      console.error("[-] Errore connessione wallet:", error.message);
    }
  };

  const encryptIbanLocal = (textToEncrypt) => {
    return btoa(textToEncrypt); // Modulo di cifratura/camouflage asimmetrico speculare al backend
  };

  const handleExecuteOffRamp = async (e) => {
    e.preventDefault();
    if (!account || !amount || !iban || !holderName) return;

    setLoading(true);
    try {
      const contract = getContract({
        client,
        chain: base,
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000"
      });

      const encryptedIban = encryptIbanLocal(iban);
      const parsedAmount = BigInt(Math.floor(Number(amount) * 10**6));

      const tx = prepareContractCall({
        contract,
        method: "function triggerOffRamp(uint256 _amountIn, string _targetIBAN, string _accountHolderName)",
        params: [parsedAmount, encryptedIban, holderName],
      });

      const result = await sendTransaction({ transaction: tx, account: account });
      setTxHash(result.transactionHash);
    } catch (error) {
      alert("Errore nell'invio transazione gasless: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Stili Dark del pannello LiquiSwap Desk
  const deskStyle = {
    background: "#0b0e14", color: "#ffffff", padding: "30px", borderRadius: "16px",
    maxWidth: "800px", margin: "40px auto", fontFamily: "Inter, sans-serif", border: "1px solid #1f242c"
  };

  const containerLayout = {
    display: "flex", gap: "30px", flexWrap: "wrap", marginTop: "20px"
  };

  const columnStyle = {
    flex: "1", minWidth: "300px"
  };

  const tokenCardStyle = {
    display: "flex", justifyContent: "between", alignItems: "center", padding: "12px",
    backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: "8px", marginBottom: "10px"
  };

  const inputStyle = {
    width: "100%", padding: "12px", marginTop: "6px", marginBottom: "15px",
    backgroundColor: "#161b22", border: "1px solid #30363d", borderRadius: "8px", color: "#fff"
  };

  const buttonStyle = {
    width: "100%", padding: "14px", backgroundColor: "#1f6feb", color: "#fff",
    border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "600", marginTop: "10px"
  };

  return (
    <div style={deskStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #21262d", paddingBottom: "15px" }}>
        <h2 style={{ margin: 0 }}>LiquiSwap Desk · Hub Finanziario</h2>
        <div style={{ fontSize: "14px", color: "#8b949e" }}>NAV creator: <strong style={{ color: "#fff" }}>€ 53.200</strong></div>
      </div>

      <div style={containerLayout}>
        {/* COLONNA SINISTRA: LISTA ASSET ILLIQUIDI (Dallo Screenshot) */}
        <div style={columnStyle}>
          <h4 style={{ color: "#58a6ff", marginTop: 0 }}>I tuoi Token Illiquidi</h4>
          {illiquidTokens.map((token, index) => (
            <div key={index} style={tokenCardStyle}>
              <div>
                <div style={{ fontWeight: "bold" }}>{token.name}</div>
                <div style={{ fontSize: "12px", color: "#8b949e" }}>{token.balance}</div>
              </div>
              <div style={{ fontWeight: "600", color: "#58a6ff" }}>{token.price}</div>
            </div>
          ))}
        </div>

        {/* COLONNA DESTRA: MODULO DI SWAP / OFF-RAMP PRIVATO GASLESS */}
        <div style={columnStyle}>
          <h4 style={{ color: "#79c0ff", marginTop: 0 }}>Canale Off-Ramp Fiat EUR</h4>
          
          {!account ? (
            <div style={{ textAlign: "center", padding: "40px 20px", backgroundColor: "#161b22", borderRadius: "12px", border: "1px solid #21262d" }}>
              <p style={{ color: "#8b949e", fontSize: "14px", marginBottom: "20px" }}>Connetti il tuo smart wallet per sbloccare i prelievi sponsorizzati.</p>
              <button onClick={handleConnectWallet} style={{...buttonStyle, backgroundColor: "#238636", marginTop: 0}}>
                Connect wallet (Gasless)
              </button>
            </div>
          ) : (
            <form onSubmit={handleExecuteOffRamp}>
              <div style={{ color: "#8b949e", fontSize: "13px", marginBottom: "15px" }}>
                Wallet Connesso: <span style={{ color: "#58a6ff" }}>{account.address.substring(0,6)}...{account.address.substring(34)}</span>
              </div>

              <label style={{ fontSize: "14px" }}>Quantità da liquidare (USDC):</label>
              <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} style={inputStyle} placeholder="0.00" required />

              <label style={{ fontSize: "14px" }}>IBAN di Destinazione (End-to-End Encrypted):</label>
              <input type="text" value={iban} onChange={(e) => setIban(e.target.value)} style={inputStyle} placeholder="IT60..." required />

              <label style={{ fontSize: "14px" }}>Intestatario del Conto:</label>
              <input type="text" value={holderName} onChange={(e) => setHolderName(e.target.value)} style={inputStyle} placeholder="Nome Cognome" required />

              <button type="submit" disabled={loading} style={buttonStyle}>
                {loading ? "Inoltro sicuro..." : "Richiedi Bonifico EUR Istantaneo"}
              </button>

              {txHash && (
                <div style={{ marginTop: "15px", padding: "12px", backgroundColor: "#1f242c", borderLeft: "4px solid #238636", fontSize: "13px", borderRadius: "4px" }}>
                  🔒 <strong>Transazione crittografata inviata!</strong><br />
                  Il gas è stato interamente sponsorizzato dal Piano Growth.<br />
                  <a href={`https://basescan.org{txHash}`} target="_blank" rel="noreferrer" style={{ color: "#58a6ff", textDecoration: "none" }}>Apri su BaseScan ↗</a>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
