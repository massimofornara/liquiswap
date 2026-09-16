import React, { useState } from 'react';
import { fiatCurrencies, referenceTokens, paymentMethods } from '../data';

const BuyCrypto: React.FC = () => {
  const [amount, setAmount] = useState('1000');
  const [fiat, setFiat] = useState(fiatCurrencies[0]);
  const [token, setToken] = useState(referenceTokens[0]);
  const [payment, setPayment] = useState(paymentMethods[0]);
  const [wallet, setWallet] = useState('');
  const [step, setStep] = useState(1);

  const cryptoAmount = (parseFloat(amount || '0') / (token.price || 1)).toFixed(6);
  const fee = (parseFloat(amount || '0') * parseFloat(payment.fee) / 100).toFixed(2);
  const total = (parseFloat(amount || '0') + parseFloat(fee)).toFixed(2);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Buy Crypto</h1>
        <p className="text-slate-400">Purchase cryptocurrency with fiat currency</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${step >= s ? 'text-blue-400' : 'text-slate-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'
              }`}>
                {step > s ? '✓' : s}
              </div>
              <span className="font-medium">
                {s === 1 ? 'Amount' : s === 2 ? 'Payment' : 'Confirm'}
              </span>
            </div>
            {s < 3 && <div className="flex-1 h-px bg-slate-700"></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="card">
        <div className="p-6">
          {/* Step 1: Amount */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="form-label">Amount to Spend</label>
                <div className="flex gap-3">
                  <select
                    value={fiat.code}
                    onChange={(e) => setFiat(fiatCurrencies.find(f => f.code === e.target.value) || fiatCurrencies[0])}
                    className="form-select w-32"
                  >
                    {fiatCurrencies.map(f => (
                      <option key={f.code} value={f.code}>{f.flag} {f.code}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="form-input flex-1"
                  />
                </div>
                <p className="form-helper">Enter the amount you want to spend in fiat currency</p>
              </div>

              <div>
                <label className="form-label">Cryptocurrency to Buy</label>
                <select
                  value={token.symbol}
                  onChange={(e) => setToken(referenceTokens.find(t => t.symbol === e.target.value) || referenceTokens[0])}
                  className="form-select"
                >
                  {referenceTokens.map(t => (
                    <option key={t.symbol} value={t.symbol}>{t.symbol} - {t.name}</option>
                  ))}
                </select>
                <p className="form-helper">Select which cryptocurrency you want to purchase</p>
              </div>

              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400">You will receive</span>
                  <span className="text-2xl font-bold text-green-400">{cryptoAmount} {token.symbol}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Exchange rate</span>
                  <span className="text-slate-300">1 {token.symbol} = ${token.price?.toLocaleString()}</span>
                </div>
              </div>

              <button onClick={() => setStep(2)} className="btn btn-primary w-full">
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="form-label">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPayment(method)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        payment.id === method.id
                          ? 'bg-blue-500/10 border-blue-500'
                          : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <p className="font-semibold text-white">{method.name}</p>
                      <p className="text-sm text-slate-400">Fee: {method.fee}</p>
                      <p className="text-xs text-slate-500">{method.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Destination Wallet Address</label>
                <input
                  type="text"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="0x... or ENS name"
                  className="form-input"
                />
                <p className="form-helper">Enter the wallet address where you want to receive your crypto</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn btn-secondary flex-1">
                  Back
                </button>
                <button onClick={() => setStep(3)} className="btn btn-primary flex-1">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount</span>
                    <span className="text-white font-medium">{fiat.symbol}{amount} {fiat.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment method</span>
                    <span className="text-white font-medium">{payment.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fee ({payment.fee})</span>
                    <span className="text-white font-medium">{fiat.symbol}{fee}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">Total</span>
                      <span className="text-white font-bold text-lg">{fiat.symbol}{total} {fiat.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">You receive</span>
                      <span className="text-green-400 font-bold text-lg">{cryptoAmount} {token.symbol}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="alert alert-info">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">Important</p>
                  <p className="text-sm mt-1">
                    Please verify all details before confirming. Transactions cannot be reversed.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn btn-secondary flex-1">
                  Back
                </button>
                <button className="btn btn-success flex-1">
                  Confirm Purchase
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyCrypto;
