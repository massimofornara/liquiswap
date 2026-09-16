import React from 'react';
import { Wallet, Globe, ArrowRightLeft, ShieldCheck } from 'lucide-react';

interface TopBarProps {
  walletConnected: boolean;
  walletAddress: string | null;
  onToggleConnect: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ walletConnected, walletAddress, onToggleConnect }) => {
  return (
    <header className="w-full px-6 py-3.5 flex items-center justify-between border-b border-slate-800/80 bg-dex-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <ArrowRightLeft className="w-5 h-5 text-white stroke-[2.5]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-white">
            Liqui<span className="text-indigo-400">Swap</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            PRO
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse" />
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>Ethereum Mainnet</span>
        </div>

        <button
          type="button"
          onClick={onToggleConnect}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border cursor-pointer ${
            walletConnected
              ? 'bg-slate-900 text-emerald-400 border-emerald-500/30 hover:bg-slate-800'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/30 shadow-lg shadow-indigo-600/20 hover:brightness-110 active:scale-95'
          }`}
        >
          {walletConnected ? <ShieldCheck className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
          <span>
            {walletConnected && walletAddress
              ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
              : 'Connetti Wallet'}
          </span>
        </button>
      </div>
    </header>
  );
};
