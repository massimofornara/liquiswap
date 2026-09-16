import React, { useState } from 'react';
import { SUPPORTED_TOKENS } from '../data';

export const SellCrypto: React.FC = () => {
  const [tokenAmount, setTokenAmount] = useState('1');
  const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0]);
  const [status, setStatus] = useState<string | null>(null);

  const fiatEstimated = (parseFloat(tokenAmount || '0') * selectedToken.priceUsd).toFixed(2);

  const handleSell = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Inizializzazione liquidazione Off-Ramp su conto IBAN...');
    setTimeout(() => {
      setStatus(`Riceverai circa €${fiatEstimated} sul tuo conto registrato.`);
    }, 1200);
  };

  return (
    <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl text-white">
      <h2 className="text-xl font-bold tracking-tight mb-2">Vendi Crypto in Euro</h2>
      <p className="text-xs text-slate-400 mb-6">Converti i tuoi asset crypto direttamente sul tuo conto corrente bancario.</p>

      <form onSubmit={handleSell} className="space-y-4">
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Quantità da Vendere</span>
            <span>Saldo: {selectedToken.balance} {selectedToken.symbol}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <input
              type="number"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              className="w-full bg-transparent text-2xl font-semibold focus:outline-none"
              placeholder="0.0"
              step="any"
              required
            />
            <select
              value={selectedToken.symbol}
              onChange={(e) => {
                const token = SUPPORTED_TOKENS.find((t) => t.symbol === e.target.value);
                if (token) setSelectedToken(token);
              }}
              className="bg-slate-700 text-white font-semibold rounded-xl px-3 py-1.5 border border-slate-600 focus:outline-none cursor-pointer"
            >
              {SUPPORTED_TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Ricevi sul Conto (EUR)</span>
            <span>Commissione: 0.8%</span>
          </div>
          <div className="text-2xl font-semibold text-emerald-400">
            ≈ €{fiatEstimated}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl font-semibold bg-rose-600 hover:bg-rose-500 transition duration-150 shadow-lg shadow-rose-600/30 text-white cursor-pointer"
        >
          Liquidare in Euro
        </button>
      </form>

      {status && (
        <div className="mt-4 p-3 rounded-xl bg-slate-800 text-xs text-slate-300 text-center border border-slate-700">
          {status}
        </div>
      )}
    </div>
  );
};
