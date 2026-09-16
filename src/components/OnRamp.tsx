import React, { useState } from 'react';
import { fiatCurrencies, referenceTokens, paymentMethods } from '../data';

const OnRamp: React.FC = () => {
  const [fiatAmount, setFiatAmount] = useState('1000');
  const [selectedFiat, setSelectedFiat] = useState(fiatCurrencies[0]);
  const [selectedToken, setSelectedToken] = useState(referenceTokens[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [walletAddress, setWalletAddress] = useState('');
  const [step, setStep] = useState(1);

  const cryptoAmount = (parseFloat(fiatAmount || '0') / (selectedToken.price || 1)).toFixed(6);
  const fee = (parseFloat(fiatAmount || '0') * parseFloat(selectedPayment.fee) / 100).toFixed(2);
  const total = (parseFloat(fiatAmount || '0') + parseFloat(fee)).toFixed(2);

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
          <span className="text-xs text-zinc-500">Fiat → Crypto</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Buy Crypto</h1>
        <p className="text-sm text-zinc-500 mt-1">Purchase top market-cap tokens with fiat currency. Direct to any wallet.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <button
              onClick={() => setStep(s)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                step === s ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                step > s ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                'bg-white/[0.03] text-zinc-500 border border-white/[0.06]'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === s ? 'bg-indigo-500/20 text-indigo-400' :
                step > s ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-white/[0.06] text-zinc-500'
              }`}>
                {step > s ? '✓' : s}
              </span>
              {s === 1 ? 'Amount' : s === 2 ? 'Payment' : 'Confirm'}
            </button>
            {s < 3 && <div className="flex-1 h-px bg-white/[0.06]"></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="space-y-5">
        {/* Amount Section */}
        <div className="card p-6">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-4 block">You Pay</label>
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
            <input
              type="number"
              value={fiatAmount}
              onChange={(e) => setFiatAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-transparent text-2xl font-bold text-white outline-none text-right font-mono"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {['100', '500', '1000', '5000', '10000'].map(amount => (
              <button
                key={amount}
                onClick={() => setFiatAmount(amount)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  fiatAmount === amount
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:text-zinc-300 hover:border-white/[0.1]'
                }`}
              >
                {selectedFiat.symbol}{parseInt(amount).toLocaleString()}
              </button>
            ))}
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

        {/* Receive Section */}
        <div className="card p-6">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-4 block">You Receive</label>
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
            <div className="flex-1 text-right">
              <span className="text-2xl font-bold text-emerald-400 font-mono">{cryptoAmount}</span>
              <span className="text-sm text-zinc-500 ml-2">{selectedToken.symbol}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-zinc-500">1 {selectedToken.symbol} = ${selectedToken.price?.toLocaleString()}</span>
            <span className="badge badge-green text-[10px]">Best rate</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="card p-6">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-4 block">Payment Method</label>
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

        {/* Wallet Address */}
        <div className="card p-6">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-4 block">Destination Wallet</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x... or ENS name"
            className="w-full input-field px-4 py-3.5 text-white placeholder-zinc-600 outline-none text-sm font-mono"
          />
          <p className="text-xs text-zinc-600 mt-2">Tokens will be sent directly to this address</p>
        </div>

        {/* Summary */}
        <div className="card p-6 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="space-y-3">
            {[
              { label: 'Amount', value: `${selectedFiat.symbol}${parseFloat(fiatAmount || '0').toLocaleString()} ${selectedFiat.code}` },
              { label: `Fee (${selectedPayment.fee})`, value: `${selectedFiat.symbol}${fee}` },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-zinc-500">{item.label}</span>
                <span className="text-zinc-300 font-mono">{item.value}</span>
              </div>
            ))}
            <div className="divider my-2"></div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-white">Total</span>
              <span className="text-sm font-bold text-white font-mono">{selectedFiat.symbol}{parseFloat(total).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-500">You receive</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{cryptoAmount} {selectedToken.symbol}</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button className="w-full py-4 rounded-xl btn-primary text-sm font-semibold relative z-10">
          <span className="relative z-10">Buy {selectedToken.symbol}</span>
        </button>

        <p className="text-center text-xs text-zinc-600">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default OnRamp;
