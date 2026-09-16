import React, { useState } from 'react';
import { fiatCurrencies, referenceTokens, paymentMethods } from '../data';

const OffRamp: React.FC = () => {
  const [cryptoAmount, setCryptoAmount] = useState('0.5');
  const [selectedToken, setSelectedToken] = useState(referenceTokens[0]);
  const [selectedFiat, setSelectedFiat] = useState(fiatCurrencies[1]); // EUR default
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[2]); // SEPA
  const [bankDetails, setBankDetails] = useState({ iban: '', name: '', bank: '' });

  const fiatAmount = (parseFloat(cryptoAmount || '0') * (selectedToken.price || 1)).toFixed(2);
  const feePercent = parseFloat(selectedPayment.fee) / 100;
  const fee = (parseFloat(fiatAmount) * feePercent).toFixed(2);
  const netAmount = (parseFloat(fiatAmount) - parseFloat(fee)).toFixed(2);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-green">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-soft"></span>
            Live
          </span>
          <span className="text-xs text-zinc-500">•</span>
          <span className="text-xs text-zinc-500">Crypto → Fiat</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Sell Crypto</h1>
        <p className="text-sm text-zinc-500 mt-1">Convert your crypto to fiat and withdraw to any bank account worldwide.</p>
      </div>

      <div className="space-y-5">
        {/* Crypto Input */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">You Sell</label>
            <span className="text-xs text-zinc-500">Available: <span className="text-zinc-300 font-mono">2.45 {selectedToken.symbol}</span></span>
          </div>
          <div className="input-field p-4 flex items-center gap-4">
            <select
              value={selectedToken.symbol}
              onChange={(e) => setSelectedToken(referenceTokens.find(t => t.symbol === e.target.value) || referenceTokens[0])}
              className="select-custom font-medium"
            >
              {referenceTokens.map(t => (
                <option key={t.symbol} value={t.symbol}>{t.symbol} — {t.name}</option>
              ))}
            </select>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input
                type="number"
                value={cryptoAmount}
                onChange={(e) => setCryptoAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-2xl font-bold text-white outline-none text-right font-mono w-full"
              />
              <button
                onClick={() => setCryptoAmount('2.45')}
                className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 hover:bg-indigo-500/20 transition-all"
              >
                MAX
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-zinc-500">1 {selectedToken.symbol} = ${selectedToken.price?.toLocaleString()}</span>
            <span className="badge badge-cyan text-[10px]">Rate locked 30s</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </div>
        </div>

        {/* Fiat Output */}
        <div className="card p-6">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-4 block">You Receive</label>
          <div className="input-field p-4 flex items-center gap-4">
            <select
              value={selectedFiat.code}
              onChange={(e) => setSelectedFiat(fiatCurrencies.find(f => f.code === e.target.value) || fiatCurrencies[0])}
              className="select-custom font-medium"
            >
              {fiatCurrencies.map(f => (
                <option key={f.code} value={f.code}>{f.flag} {f.code}</option>
              ))}
            </select>
            <div className="flex-1 text-right">
              <span className="text-2xl font-bold text-emerald-400 font-mono">{parseFloat(netAmount).toLocaleString()}</span>
              <span className="text-sm text-zinc-500 ml-2">{selectedFiat.code}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-zinc-500">≈ ${parseFloat(fiatAmount).toLocaleString()} USD</span>
            <span className="badge badge-green text-[10px]">Best rate</span>
          </div>
        </div>

        {/* Payout Method */}
        <div className="card p-6">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-4 block">Payout Method</label>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedPayment.id === method.id
                    ? 'border-indigo-500/30 bg-indigo-500/[0.04] shadow-sm shadow-indigo-500/5'
                    : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03]'
                }`}
              >
                <div className="text-xl mb-2">{method.icon}</div>
                <div className="text-sm font-medium text-white">{method.name}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-zinc-500">Fee {method.fee}</span>
                  <span className="text-zinc-700">•</span>
                  <span className="text-xs text-zinc-500">{method.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bank Details */}
        <div className="card p-6">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-4 block">Bank Account</label>
          <div className="space-y-3">
            <input
              type="text"
              value={bankDetails.name}
              onChange={(e) => setBankDetails({...bankDetails, name: e.target.value})}
              placeholder="Account Holder Name"
              className="w-full input-field px-4 py-3.5 text-white placeholder-zinc-600 outline-none text-sm"
            />
            <input
              type="text"
              value={bankDetails.iban}
              onChange={(e) => setBankDetails({...bankDetails, iban: e.target.value})}
              placeholder="IBAN / Account Number"
              className="w-full input-field px-4 py-3.5 text-white placeholder-zinc-600 outline-none text-sm font-mono"
            />
            <input
              type="text"
              value={bankDetails.bank}
              onChange={(e) => setBankDetails({...bankDetails, bank: e.target.value})}
              placeholder="Bank Name"
              className="w-full input-field px-4 py-3.5 text-white placeholder-zinc-600 outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-2 mt-3 px-1">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-xs text-zinc-500">Bank details encrypted end-to-end</span>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-6 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">You sell</span>
              <span className="text-zinc-300 font-mono">{cryptoAmount} {selectedToken.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Gross amount</span>
              <span className="text-zinc-300 font-mono">{selectedFiat.symbol}{parseFloat(fiatAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Fee ({selectedPayment.fee})</span>
              <span className="text-rose-400 font-mono">-{selectedFiat.symbol}{fee}</span>
            </div>
            <div className="divider my-2"></div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-white">You receive</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{selectedFiat.symbol}{parseFloat(netAmount).toLocaleString()} {selectedFiat.code}</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button className="w-full py-4 rounded-xl btn-primary text-sm font-semibold relative z-10">
          <span className="relative z-10">Sell {selectedToken.symbol} for {selectedFiat.code}</span>
        </button>

        <p className="text-center text-xs text-zinc-600">
          Funds will be sent to your bank account within {selectedPayment.time}
        </p>
      </div>
    </div>
  );
};

export default OffRamp;
