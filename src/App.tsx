import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { SwapTokens } from './components/SwapTokens';
import { Dashboard } from './components/Dashboard';
import { BuyCrypto } from './components/BuyCrypto';
import { SellCrypto } from './components/SellCrypto';
import { ActiveTab } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('swap');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const toggleWalletConnection = async () => {
    if (walletConnected) {
      setWalletConnected(false);
      setWalletAddress(null);
      return;
    }

    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        if (accounts && accounts[0]) {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
          return;
        }
      } catch (err) {
        console.warn('Richiesta provider respinta, uso fallback demo', err);
      }
    }

    setWalletAddress('0x71C8360537ab1e3892782e448b6ef4926');
    setWalletConnected(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <TopBar
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        onToggleConnect={toggleWalletConnection}
      />
      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-10 flex items-center justify-center overflow-y-auto">
          {activeTab === 'swap' && (
            <SwapTokens
              walletConnected={walletConnected}
              onConnectWallet={toggleWalletConnection}
            />
          )}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'buy' && <BuyCrypto />}
          {activeTab === 'sell' && <SellCrypto />}
        </main>
      </div>
    </div>
  );
};

export default App;
