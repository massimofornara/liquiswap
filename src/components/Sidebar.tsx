import React from 'react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'swap', label: 'Swap Tokens', icon: '⇄' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'buy', label: 'Compra Crypto', icon: '💳' },
    { id: 'sell', label: 'Vendi Crypto', icon: '💰' }
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/40 p-4 hidden md:flex flex-col justify-between shrink-0">
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition duration-150 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
        <p className="font-semibold text-slate-200 mb-1">LiquiSwap Protocol</p>
        <p>Smart Routing attivo con slippage dinamico ottimizzato.</p>
      </div>
    </aside>
  );
};
