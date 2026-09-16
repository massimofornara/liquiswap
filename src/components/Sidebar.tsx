import React from 'react';
import { ActiveTab } from '../types';
import { ArrowLeftRight, LayoutDashboard, CreditCard, DollarSign, Layers } from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'swap' as ActiveTab, label: 'Instant Swap', icon: ArrowLeftRight },
    { id: 'dashboard' as ActiveTab, label: 'Portfolio DEX', icon: LayoutDashboard },
    { id: 'buy' as ActiveTab, label: 'Compra Crypto', icon: CreditCard },
    { id: 'sell' as ActiveTab, label: 'Vendi Crypto', icon: DollarSign }
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-dex-950/60 p-4 hidden md:flex flex-col justify-between shrink-0">
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition duration-150 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-semibold text-slate-200 mb-1">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Smart Liquidity Router</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">Miglior prezzo garantito tramite aggregazione liquidity pool Uniswap & Sushiswap.</p>
      </div>
    </aside>
  );
};
