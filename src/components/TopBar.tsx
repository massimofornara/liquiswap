import React from 'react';

interface TopBarProps {
  walletConnected: boolean;
  walletAddress: string | null;
  onToggleConnect: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ walletConnected, walletAddress, onToggleConnect }) => {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/30">
          L
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-white">
            Liqui<span className="text-indigo-400">Swap</span>
          </span>
          <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
            DEX v2
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Ethereum Mainnet</span>
        </div>

        <button
          type="button"
          onClick={onToggleConnect}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition text-white border border-indigo-400/30 shadow-md cursor-pointer"
        >
          {walletConnected && walletAddress
            ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
            : 'Connetti Wallet'}
        </button>
      </div>
    </header>
  );
};
