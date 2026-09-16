import React from 'react';
import { referenceTokens, illiquidTokens } from '../data';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Volume', value: '$2.4B', change: '+12.5%', trend: 'up', icon: 'chart' },
    { label: 'Transactions', value: '1.2M', change: '+8.3%', trend: 'up', icon: 'activity' },
    { label: 'Illiquid Tokens', value: '15,420', change: '+340', trend: 'up', icon: 'token' },
    { label: 'Avg. Settlement', value: '< 28s', change: '-5s', trend: 'down', icon: 'clock' },
  ];

  const recentActivity = [
    { type: 'swap', from: 'PEPE2', to: 'ETH', amount: '5.2M', time: '2m ago', status: 'completed' },
    { type: 'on-ramp', from: 'USD', to: 'BTC', amount: '$12,500', time: '5m ago', status: 'completed' },
    { type: 'swap', from: 'MOON', to: 'USDT', amount: '890K', time: '12m ago', status: 'completed' },
    { type: 'off-ramp', from: 'ETH', to: 'EUR', amount: '2.4 ETH', time: '18m ago', status: 'pending' },
    { type: 'swap', from: 'GEM', to: 'SOL', amount: '1.2M', time: '24m ago', status: 'completed' },
  ];

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'chart': return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      );
      case 'activity': return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      );
      case 'token': return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      );
      case 'clock': return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Overview of protocol activity and reference tokens</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={stat.label} className="card p-5 group hover:border-white/[0.1]" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 group-hover:border-indigo-500/20 group-hover:bg-indigo-500/[0.06] transition-all">
                {getIcon(stat.icon)}
              </div>
              <span className={`badge ${stat.trend === 'up' ? 'badge-green' : 'badge-cyan'}`}>
                {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white font-mono tracking-tight">{stat.value}</div>
            <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-3 card overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Latest transactions across the protocol</p>
            </div>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              View all →
            </button>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {recentActivity.map((activity, index) => (
              <div key={index} className="px-6 py-3.5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activity.type === 'swap' ? 'bg-indigo-500/10 text-indigo-400' :
                  activity.type === 'on-ramp' ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-amber-500/10 text-amber-400'
                }`}>
                  {activity.type === 'swap' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                  ) : activity.type === 'on-ramp' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{activity.from}</span>
                    <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                    <span className="text-sm font-medium text-white">{activity.to}</span>
                  </div>
                  <span className="text-xs text-zinc-500">{activity.time}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-white">{activity.amount}</div>
                  <span className={`badge text-[10px] ${activity.status === 'completed' ? 'badge-green' : 'badge-amber'}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reference Tokens */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.04]">
            <h3 className="text-sm font-semibold text-white">Reference Tokens</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Top market cap with fiat ramp</p>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {referenceTokens.slice(0, 6).map((token) => (
              <div key={token.symbol} className="px-6 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 border border-emerald-500/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-400">{token.symbol.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{token.symbol}</div>
                  <div className="text-xs text-zinc-500">#{token.marketCapRank}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-white">${token.price?.toLocaleString()}</div>
                  <div className="text-xs text-zinc-500">{token.marketCap}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Illiquid Tokens Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Illiquid Tokens</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Creator-set prices via reference tokens</p>
          </div>
          <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {illiquidTokens.slice(0, 8).map((token) => (
            <div key={token.symbol} className="card p-4 hover:border-white/[0.1] group cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400/20 to-red-400/20 border border-orange-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-400">{token.symbol.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{token.symbol}</div>
                    <div className="text-[10px] text-zinc-500">{token.chain}</div>
                  </div>
                </div>
                <span className={`badge text-[10px] ${token.liquidity === 'Very Low' ? 'badge-red' : 'badge-amber'}`}>
                  {token.liquidity}
                </span>
              </div>
              {token.creatorPrice && (
                <div className="pt-3 border-t border-white/[0.04]">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Creator Price</div>
                  <div className="text-xs font-mono text-white">
                    1 {token.symbol} = {token.creatorPrice.amount} {token.creatorPrice.referenceToken}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">MCap: {token.marketCap}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
