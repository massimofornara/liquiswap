import React from 'react';
import { referenceTokens } from '../data';

const ReferenceTokens: React.FC = () => {
  return (
    <div className="mt-12">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Reference Tokens (Fiat Ramp Enabled)</h3>
        <p className="text-sm text-slate-400">
          Top market-cap cryptocurrencies with on/off-ramp fiat support on <span className="text-cyan-400 font-medium">any bank account</span> worldwide.
          <br />These are the tokens used by creators to set prices for illiquid tokens.
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Rank</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Token</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Price</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Market Cap</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Chain</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Fiat Ramp</th>
              </tr>
            </thead>
            <tbody>
              {referenceTokens.map((token, index) => (
                <tr key={token.symbol} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-slate-500 font-mono text-xs">#{token.marketCapRank}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                        {token.symbol.charAt(0)}
                      </span>
                      <div>
                        <div className="text-white font-medium">{token.symbol}</div>
                        <div className="text-xs text-slate-500">{token.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white font-medium">${token.price?.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-300">{token.marketCap}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">{token.chain}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot"></span>
                      Any Bank
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 glass-card p-4 border-cyan-500/20 bg-cyan-500/5">
        <div className="flex items-start gap-3">
          <span className="text-lg">🏦</span>
          <div>
            <p className="text-sm font-medium text-cyan-300">Universal Fiat Ramp</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              All reference tokens above support direct on/off-ramp to <span className="text-white font-medium">any bank account</span> in 50+ currencies. 
              This means you can buy these tokens with fiat, or sell them back to your bank — making them the ideal 
              <span className="text-amber-400"> pricing reference</span> for illiquid tokens that lack market liquidity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceTokens;
