import React from 'react';
import { referenceTokens, illiquidTokens } from '../data';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Volume', value: '$2.4B', change: '+12.5%', positive: true },
    { label: 'Transactions', value: '1.2M', change: '+8.3%', positive: true },
    { label: 'Supported Tokens', value: '15,420', change: '+340', positive: true },
    { label: 'Avg Settlement', value: '< 28s', change: '-5s', positive: true },
  ];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Overview of your account and platform activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
            <div className="flex items-center gap-2">
              <span className={`badge ${stat.positive ? 'badge-success' : 'badge-danger'}`}>
                {stat.positive ? '↑' : '↓'} {stat.change}
              </span>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reference Tokens */}
        <div className="card">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Reference Tokens</h2>
            <p className="text-sm text-slate-400 mt-1">Top market cap tokens with fiat ramp support</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {referenceTokens.slice(0, 5).map((token) => (
                <div key={token.symbol} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {token.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{token.symbol}</p>
                      <p className="text-xs text-slate-400">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">${token.price?.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Rank #{token.marketCapRank}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Illiquid Tokens */}
        <div className="card">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Illiquid Tokens</h2>
            <p className="text-sm text-slate-400 mt-1">Tokens with creator-set pricing</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {illiquidTokens.slice(0, 5).map((token) => (
                <div key={token.symbol} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {token.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{token.symbol}</p>
                      <p className="text-xs text-slate-400">{token.chain}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {token.creatorPrice && (
                      <>
                        <p className="font-semibold text-white text-sm">
                          1 = {token.creatorPrice.amount} {token.creatorPrice.referenceToken}
                        </p>
                        <p className="text-xs text-slate-400">MCap {token.marketCap}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="mt-6 alert alert-info">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-medium">How Creator Pricing Works</p>
          <p className="text-sm mt-1">
            Illiquid token prices are set by creators in terms of reference tokens (BTC, ETH, USDT, etc.) 
            that support fiat on/off-ramp on any bank account worldwide.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
