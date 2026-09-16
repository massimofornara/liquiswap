import React from 'react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="w-full px-4 py-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
            L
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              LiquiSwap
            </h1>
            <p className="text-xs text-slate-500">Fiat Ramp & Illiquid Token Exchange</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-slate-800/50 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('on-ramp')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'on-ramp'
                ? 'tab-active text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="mr-1">📥</span> On-Ramp
          </button>
          <button
            onClick={() => setActiveTab('off-ramp')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'off-ramp'
                ? 'tab-active text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="mr-1">📤</span> Off-Ramp
          </button>
          <button
            onClick={() => setActiveTab('swap')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'swap'
                ? 'tab-active text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="mr-1">🔄</span> Swap Illiquid
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot"></div>
            <span className="text-xs text-green-400 font-medium">Live</span>
          </div>
          <button className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-medium text-slate-300 hover:border-indigo-500/50 transition-all">
            Connect Wallet
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex items-center gap-1 mt-4 bg-slate-800/50 rounded-xl p-1 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('on-ramp')}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
            activeTab === 'on-ramp' ? 'tab-active text-white' : 'text-slate-400'
          }`}
        >
          📥 On-Ramp
        </button>
        <button
          onClick={() => setActiveTab('off-ramp')}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
            activeTab === 'off-ramp' ? 'tab-active text-white' : 'text-slate-400'
          }`}
        >
          📤 Off-Ramp
        </button>
        <button
          onClick={() => setActiveTab('swap')}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
            activeTab === 'swap' ? 'tab-active text-white' : 'text-slate-400'
          }`}
        >
          🔄 Swap Illiquid
        </button>
      </nav>
    </header>
  );
};

export default Header;
