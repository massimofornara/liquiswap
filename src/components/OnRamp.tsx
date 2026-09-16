import React, { useState } from 'react';
import { fiatCurrencies, popularTokens, paymentMethods } from '../data';

const OnRamp: React.FC = () => {
  const [fiatAmount, setFiatAmount] = useState('1000');
  const [selectedFiat, setSelectedFiat] = useState(fiatCurrencies[0]);
  const [selectedToken, setSelectedToken] = useState(popularTokens[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [walletAddress, setWalletAddress] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const cryptoAmount = (parseFloat(fiatAmount || '0') / (selectedToken.price || 1)).toFixed(6);
  const fee = (parseFloat(fiatAmount || '0') * parseFloat(selectedPayment.fee) / 100).toFixed(2);
  const total = (parseFloat(fiatAmount || '0') + parseFloat(fee)).toFixed(2);

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="slide-up space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Buy Crypto with Fiat</h2>
        <p className="text-slate-400 text-sm">Convert your fiat currency to crypto instantly</p>
      </div>

      {/* Fiat Input */}
      <div className="glass-card p-5">
        <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">You Pay (Fiat)</label>
        <div className="token-input p-4 flex items-center gap-3">
          <select
            value={selectedFiat.code}
            onChange={(e) => setSelectedFiat(fiatCurrencies.find(f => f.code === e.target.value) || fiatCurrencies[0])}
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm cursor-pointer focus:outline-none focus:border-indigo-500"
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
            className="flex-1 bg-transparent text-2xl font-bold text-white outline-none text-right"
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-500">≈ ${(parseFloat(fiatAmount || '0')).toFixed(2)} USD</span>
          <div className="flex gap-2">
            {['100', '500', '1000', '5000'].map(amount => (
              <button
                key={amount}
                onClick={() => setFiatAmount(amount)}
                className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-indigo-500/20 transition-all"
              >
                {amount}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
          <span className="text-indigo-400">↓</span>
        </div>
      </div>

      {/* Token Output */}
      <div className="glass-card p-5">
        <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">You Receive (Crypto)</label>
        <div className="token-input p-4 flex items-center gap-3">
          <select
            value={selectedToken.symbol}
            onChange={(e) => setSelectedToken(popularTokens.find(t => t.symbol === e.target.value) || popularTokens[0])}
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm cursor-pointer focus:outline-none focus:border-indigo-500"
          >
            {popularTokens.map(t => (
              <option key={t.symbol} value={t.symbol}>{t.symbol} - {t.name}</option>
            ))}
          </select>
          <div className="flex-1 text-right">
            <span className="text-2xl font-bold text-cyan-400">{cryptoAmount}</span>
            <span className="text-sm text-slate-400 ml-2">{selectedToken.symbol}</span>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-500">1 {selectedToken.symbol} = ${selectedToken.price?.toLocaleString()}</span>
          <span className="text-xs text-green-400">Best rate guaranteed</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="glass-card p-5">
        <label className="text-xs text-slate-400 uppercase tracking-wider mb-3 block">Payment Method</label>
        <div className="grid grid-cols-2 gap-3">
          {paymentMethods.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedPayment(method)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPayment.id === method.id
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className="text-lg mb-1">{method.icon}</div>
              <div className="text-sm font-medium text-white">{method.name}</div>
              <div className="text-xs text-slate-400">Fee: {method.fee}</div>
              <div className="text-xs text-slate-500">{method.time}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Wallet Address */}
      <div className="glass-card p-5">
        <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Destination Wallet</label>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="0x... or ENS name"
          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Summary */}
      <div className="glass-card p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Amount</span>
          <span className="text-white">{selectedFiat.symbol}{fiatAmount} {selectedFiat.code}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Fee ({selectedPayment.fee})</span>
          <span className="text-white">{selectedFiat.symbol}{fee} {selectedFiat.code}</span>
        </div>
        <div className="border-t border-slate-700 pt-3 flex justify-between text-sm font-bold">
          <span className="text-slate-300">Total</span>
          <span className="text-white">{selectedFiat.symbol}{total} {selectedFiat.code}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">You receive</span>
          <span className="text-cyan-400 font-bold">{cryptoAmount} {selectedToken.symbol}</span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full py-4 rounded-xl glow-button text-white font-bold text-lg"
      >
        {showSuccess ? '✓ Order Placed Successfully!' : `Buy ${selectedToken.symbol}`}
      </button>

      {showSuccess && (
        <div className="glass-card p-4 border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-green-400">✓</span>
            </div>
            <div>
              <p className="text-sm font-medium text-green-400">Transaction initiated</p>
              <p className="text-xs text-slate-400">You will receive {cryptoAmount} {selectedToken.symbol} shortly</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnRamp;
