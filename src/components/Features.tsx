import React from 'react';

const Features: React.FC = () => {
  const features = [
    {
      icon: '🏦',
      title: 'Multi-Fiat Support',
      description: 'Accept 50+ fiat currencies with bank transfers, cards, SEPA, and wire transfers.',
    },
    {
      icon: '🔄',
      title: 'Creator-Set Pricing',
      description: 'Illiquid token prices are set by creators in terms of top market-cap crypto (BTC, ETH, USDT...) with fiat ramp on any bank account.',
    },
    {
      icon: '🛡️',
      title: 'Non-Custodial',
      description: 'Your keys, your crypto. We never hold your funds. Direct wallet-to-wallet.',
    },
    {
      icon: '⚡',
      title: 'Instant Settlement',
      description: 'Sub-30 second settlement for crypto transactions. Fiat in 1-3 business days.',
    },
    {
      icon: '🌐',
      title: 'Multi-Chain',
      description: 'Support for Ethereum, BSC, Polygon, Arbitrum, Optimism, and Avalanche.',
    },
    {
      icon: '📱',
      title: 'API & SDK',
      description: 'Integrate our ramp in minutes with our developer-friendly REST API and SDKs.',
    },
  ];

  return (
    <div className="mt-12">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-white mb-2">Why LiquiSwap?</h3>
        <p className="text-sm text-slate-400">Built for the DeFi ecosystem</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="glass-card p-5 hover:border-indigo-500/30 transition-all group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">{feature.icon}</div>
            <h4 className="text-sm font-bold text-white mb-1">{feature.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
