import React from 'react';
import { SUPPORTED_TOKENS, INITIAL_ACTIVITIES } from '../data';

export const Dashboard: React.FC = () => {
  const totalBalanceUsd = SUPPORTED_TOKENS.reduce(
    (acc, token) => acc + token.balance * token.priceUsd,
    0
  );

  return (
    <div className="w-full max-w-4xl space-y-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur-xl">
          <p className="text-xs text-slate-400 mb-1">Valore Totale Portafoglio</p>
          <p className="text-2xl font-bold tracking-tight text-indigo-400">
            ${totalBalanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-emerald-400 font-medium">▲ +4.25% nelle ultime 24h</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur-xl">
          <p className="text-xs text-slate-400 mb-1">Volume 24h DEX</p>
          <p className="text-2xl font-bold tracking-tight">$18,420,190</p>
          <span className="text-[11px] text-slate-400">Aggiornato in tempo reale</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur-xl">
          <p className="text-xs text-slate-400 mb-1">Gas Medio Network</p>
          <p className="text-2xl font-bold tracking-tight text-emerald-400">14 Gwei</p>
          <span className="text-[11px] text-slate-400">Ottimale per transazioni veloci</span>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
        <h3 className="text-lg font-bold mb-4">Asset nel Portafoglio</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-xs uppercase tracking-wider">
                <th className="pb-3 font-semibold">Asset</th>
                <th className="pb-3 font-semibold">Prezzo</th>
                <th className="pb-3 font-semibold">Saldo</th>
                <th className="pb-3 font-semibold text-right">Controvalore</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {SUPPORTED_TOKENS.map((token) => (
                <tr key={token.symbol} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 flex items-center gap-3 font-medium">
                    <span className="text-xl">{token.icon}</span>
                    <div>
                      <p>{token.name}</p>
                      <p className="text-xs text-slate-400">{token.symbol}</p>
                    </div>
                  </td>
                  <td className="py-3">${token.priceUsd.toLocaleString()}</td>
                  <td className="py-3">{token.balance} {token.symbol}</td>
                  <td className="py-3 text-right font-semibold">
                    ${(token.balance * token.priceUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
        <h3 className="text-lg font-bold mb-4">Attività Recente</h3>
        <div className="space-y-3">
          {INITIAL_ACTIVITIES.map((act) => (
            <div key={act.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <div>
                  <p className="font-semibold text-sm">{act.title}</p>
                  <p className="text-xs text-slate-400">{act.timestamp}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-emerald-400">{act.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
