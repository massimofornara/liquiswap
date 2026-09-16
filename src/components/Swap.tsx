import React, { useState, useMemo } from 'react';
import { illiquidTokens, chains } from '../data';
import { Token } from '../types';

const Swap: React.FC = () => {
  const [fromToken, setFromToken] = useState<Token>(illiquidTokens[0]);
  const [toToken, setToToken] = useState<Token>(illiquidTokens[1]);
  const [amount, setAmount] = useState('1000000');
  const [slippage, setSlippage] = useState('5');
  const [selectedChain, setSelectedChain] = useState('Ethereum');
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTokenModal, setShowTokenModal] = useState<'from' | 'to' | null>(null);

  const filteredTokens = useMemo(() => {
    const allTokens = [...illiquidTokens];
    if (searchQuery) {
      return allTokens.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return allTokens.filter(t => t.chain === selectedChain);
  }, [searchQuery, selectedChain]);

  // Simulate price impact for illiquid tokens
  const priceImpact = useMemo(() => {
    const amt = parseFloat(amount || '0');
    if (fromToken.liquidity === 'Very Low') return Math.min(amt * 0.0000001 * 15, 25);
    if (fromToken.liquidity === 'Low') return Math.min(amt * 0.0000001 * 8, 15);
    return Math.min(amt * 0.0000001 * 3, 5);
  }, [amount, fromToken]);

  const exchangeRate = fromToken.price && toToken.price ? fromToken.price / toToken.price : 0;
  const outputAmount = (parseFloat(amount || '0') * exchangeRate * (1 - priceImpact / 100)).toFixed(6);
  const fee = (parseFloat(amount || '0') * 0.005).toFixed(6); // 0.5% swap fee
  const minReceived = (parseFloat(outputAmount) * (1 - parseFloat(slippage) / 100)).toFixed(6);

  const handleSwap = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const handleSelectToken = (token: Token) => {
    if (showTokenModal === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setShowTokenModal(null);
    setSearchQuery('');
  };

  const switchTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  return (
    <div className="slide-up space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Swap Illiquid Tokens</h2>
        <p className="text-slate-400 text-sm">Exchange low-liquidity tokens with our custom AMM routing</p>
      </div>

      {/* Chain Selector */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
        {chains.map(chain => (
          <button
            key={chain.name}
            onClick={() => setSelectedChain(chain.name)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedChain === chain.name
                ? 'bg-indigo-500/20 border border-indigo-500/50 text-white'
                : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <span style={{ color: chain.color }}>{chain.icon}</span>
            {chain.name}
          </button>
        ))}
      </div>

      {/* From Token */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-slate-400 uppercase tracking-wider">From</label>
          <span className="text-xs text-slate-500">Balance: 5,000,000 {fromToken.symbol}</span>
        </div>
        <div className="token-input p-4 flex items-center gap-3">
          <button
            onClick={() => setShowTokenModal('from')}
            className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm hover:border-indigo-500 transition-all"
          >
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-xs">
              {fromToken.symbol.charAt(0)}
            </span>
            {fromToken.symbol}
            <span className="text-slate-400">▾</span>
          </button>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl font-bold text-white outline-none text-right"
          />
        </div>
        <div className="flex justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              fromToken.liquidity === 'Very Low' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {fromToken.liquidity} Liquidity
            </span>
            <span className="text-xs text-slate-500">on {fromToken.chain}</span>
          </div>
          <button
            onClick={() => setAmount('5000000')}
            className="text-xs px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all"
          >
            MAX
          </button>
        </div>
      </div>

      {/* Switch Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          onClick={switchTokens}
          className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center hover:border-indigo-500 hover:rotate-180 transition-all duration-300"
        >
          <span className="text-indigo-400">⇅</span>
        </button>
      </div>

      {/* To Token */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-slate-400 uppercase tracking-wider">To (estimated)</label>
          <span className="text-xs text-slate-500">Balance: 250,000 {toToken.symbol}</span>
        </div>
        <div className="token-input p-4 flex items-center gap-3">
          <button
            onClick={() => setShowTokenModal('to')}
            className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm hover:border-indigo-500 transition-all"
          >
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-xs">
              {toToken.symbol.charAt(0)}
            </span>
            {toToken.symbol}
            <span className="text-slate-400">▾</span>
          </button>
          <div className="flex-1 text-right">
            <span className="text-2xl font-bold text-cyan-400">{outputAmount}</span>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              toToken.liquidity === 'Very Low' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {toToken.liquidity} Liquidity
            </span>
            <span className="text-xs text-slate-500">on {toToken.chain}</span>
          </div>
        </div>
      </div>

      {/* Swap Details */}
      <div className="glass-card p-5 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Swap Details</span>
          <span className="text-xs text-indigo-400">Powered by LiquiSwap Router v3</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Exchange Rate</span>
          <span className="text-white">1 {fromToken.symbol} = {exchangeRate.toFixed(6)} {toToken.symbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Price Impact</span>
          <span className={priceImpact > 10 ? 'text-red-400 font-bold' : priceImpact > 5 ? 'text-yellow-400' : 'text-green-400'}>
            {priceImpact.toFixed(2)}% {priceImpact > 10 && '⚠️'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Swap Fee (0.5%)</span>
          <span className="text-white">{fee} {fromToken.symbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Min. Received</span>
          <span className="text-white">{minReceived} {toToken.symbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Route</span>
          <span className="text-indigo-400 text-xs">{fromToken.symbol} → LiquiSwap Pool → {toToken.symbol}</span>
        </div>

        {/* Slippage */}
        <div className="border-t border-slate-700 pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Slippage Tolerance</span>
            <span className="text-xs text-white">{slippage}%</span>
          </div>
          <div className="flex gap-2">
            {['0.5', '1', '3', '5', '10'].map(s => (
              <button
                key={s}
                onClick={() => setSlippage(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  slippage === s
                    ? 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-400'
                    : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Warning for high price impact */}
      {priceImpact > 10 && (
        <div className="glass-card p-4 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-start gap-3">
            <span className="text-yellow-400 text-lg">⚠️</span>
            <div>
              <p className="text-sm font-medium text-yellow-400">High Price Impact Warning</p>
              <p className="text-xs text-slate-400 mt-1">
                This trade has a significant price impact due to low liquidity. 
                Consider reducing the trade size or using a higher slippage tolerance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSwap}
        className={`w-full py-4 rounded-xl text-white font-bold text-lg ${
          priceImpact > 15 ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/30' : 'glow-button'
        }`}
      >
        {showSuccess ? '✓ Swap Executed Successfully!' : priceImpact > 15 ? '⚠️ Swap Anyway (High Impact)' : `Swap ${fromToken.symbol} → ${toToken.symbol}`}
      </button>

      {showSuccess && (
        <div className="glass-card p-4 border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-green-400">✓</span>
            </div>
            <div>
              <p className="text-sm font-medium text-green-400">Swap completed</p>
              <p className="text-xs text-slate-400">
                {amount} {fromToken.symbol} → {outputAmount} {toToken.symbol}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Token Selection Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Select Token</h3>
              <button
                onClick={() => { setShowTokenModal(null); setSearchQuery(''); }}
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, symbol, or paste address..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4"
            />

            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2">
              {filteredTokens.map(token => (
                <button
                  key={token.address}
                  onClick={() => handleSelectToken(token)}
                  className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 transition-all flex items-center gap-3 text-left"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold">
                    {token.symbol.charAt(0)}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{token.symbol}</div>
                    <div className="text-xs text-slate-400">{token.name}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-0.5 rounded-full ${
                      token.liquidity === 'Very Low' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {token.liquidity}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{token.chain}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Swap;
