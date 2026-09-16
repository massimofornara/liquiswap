import React, { useState } from 'react';
import { SUPPORTED_TOKENS } from '../data';

export const BuyCrypto: React.FC = () => {
  const [amountFiat, setAmountFiat] = useState('250');
  const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0]);
  const [status, setStatus] = useState<string | null>(null);

  const cryptoEstimated = (parseFloat(amountFiat || '0') / selectedToken.priceUsd).toFixed(5);

  const handleBuy = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Reindirizzamento verso il provider Fiat On-ramp (Stripe / MoonPay)...');
    setTimeout(() => {
      setStatus(`Ordine di acquisto da €${amountFiat} preparato con successo.`);
    }, 1200);
  };

  return (
    <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl text-white">
      <h2 className="text-xl font-bold tracking-tight mb-2">Compra Crypto con Fiat</h2>
      <p className="text-xs text-slate-400 mb-6">Acquista token direttamente con Carta di Credito, Apple Pay o Bonifico SEPA.</p>

      <form onSubmit={handleBuy} className="space-y-4">
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Importo da Spendere</span>
            <span>Valuta: EUR (€)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-400">€</span>
            <input
              type="number"
              value={amountFiat}
              onChange={(e) => setAmountFiat(e.target.value)}
              className="w-full bg-transparent text-2xl font-semibold focus:outline-none"
              placeholder="100"
              min="10"
              required
            />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Riceverai (stimato)</span>
            <span>Prezzo: ${selectedToken.priceUsd}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold text-indigo-300">{cryptoEstimated}</span>
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

        <button
          type="submit"
          className="w-full py-4 rounded-2xl font-semibold bg-indigo-600 hover:bg-indigo-500 transition duration-150 shadow-lg shadow-indigo-600/30 text-white cursor-pointer"
        >
          Procedi con l'Acquisto
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
