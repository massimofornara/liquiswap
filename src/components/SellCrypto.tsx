import React, { useState } from 'react';
import { fiatCurrencies, referenceTokens, paymentMethods } from '../data';

const SellCrypto: React.FC = () => {
  const [amount, setAmount] = useState('0.5');
  const [token, setToken] = useState(referenceTokens[0]);
  const [fiat, setFiat] = useState(fiatCurrencies[1]);
  const [payment, setPayment] = useState(paymentMethods[2]);
  const [bankDetails, setBankDetails] = useState({ name: '', iban: '', bank: '' });

  const fiatAmount = (parseFloat(amount || '0') * (token.price || 1)).toFixed(2);
  const fee = (parseFloat(fiatAmount) * parseFloat(payment.fee) / 100).toFixed(2);
  const netAmount = (parseFloat(fiatAmount) - parseFloat(fee)).toFixed(2);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Sell Crypto</h1>
        <p className="text-slate-400">Convert your cryptocurrency to fiat currency</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="card">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Transaction Details</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="form-label">Cryptocurrency to Sell</label>
              <select
                value={token.symbol}
                onChange={(e) => setToken(referenceTokens.find(t => t.symbol === e.target.value) || referenceTokens[0])}
                className="form-select"
              >
                {referenceTokens.map(t => (
                  <option key={t.symbol} value={t.symbol}>{t.symbol} - {t.name}</option>
                ))}
              </select>
              <p className="form-helper">Select which cryptocurrency you want to sell</p>
            </div>

            <div>
              <label className="form-label">Amount to Sell</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="form-input"
              />
              <p className="form-helper">Enter the amount of crypto you want to sell</p>
            </div>

            <div>
              <label className="form-label">Receive Currency</label>
              <select
                value={fiat.code}
                onChange={(e) => setFiat(fiatCurrencies.find(f => f.code === e.target.value) || fiatCurrencies[0])}
                className="form-select"
              >
                {fiatCurrencies.map(f => (
                  <option key={f.code} value={f.code}>{f.flag} {f.code} - {f.name}</option>
                ))}
              </select>
              <p className="form-helper">Select the fiat currency you want to receive</p>
            </div>

            <div>
              <label className="form-label">Payout Method</label>
              <div className="space-y-2">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPayment(method)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      payment.id === method.id
                        ? 'bg-blue-500/10 border-blue-500'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{method.icon}</span>
                        <div>
                          <p className="font-medium text-white">{method.name}</p>
                          <p className="text-xs text-slate-400">{method.time}</p>
                        </div>
                      </div>
                      <span className="text-sm text-slate-400">Fee: {method.fee}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Bank Details & Summary */}
        <div className="space-y-6">
          <div className="card">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Bank Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Account Holder Name</label>
                <input
                  type="text"
                  value={bankDetails.name}
                  onChange={(e) => setBankDetails({...bankDetails, name: e.target.value})}
                  placeholder="John Doe"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">IBAN / Account Number</label>
                <input
                  type="text"
                  value={bankDetails.iban}
                  onChange={(e) => setBankDetails({...bankDetails, iban: e.target.value})}
                  placeholder="DE89 3704 0044 0532 0130 00"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  value={bankDetails.bank}
                  onChange={(e) => setBankDetails({...bankDetails, bank: e.target.value})}
                  placeholder="Deutsche Bank"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400">You sell</span>
                <span className="text-white font-medium">{amount} {token.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gross amount</span>
                <span className="text-white font-medium">{fiat.symbol}{fiatAmount} {fiat.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fee ({payment.fee})</span>
                <span className="text-red-400 font-medium">-{fiat.symbol}{fee}</span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">You receive</span>
                <span className="text-2xl font-bold text-green-400">{fiat.symbol}{netAmount} {fiat.code}</span>
              </div>

              <button className="btn btn-success w-full mt-4">
                Confirm Sale
              </button>

              <div className="alert alert-info mt-4">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">
                  Funds will be sent to your bank account within {payment.time}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellCrypto;
