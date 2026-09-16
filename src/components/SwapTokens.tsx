import React, { useState, useMemo } from 'react';
import { illiquidTokens, referenceTokens, chains } from '../data';
import { Token } from '../types';

const SwapTokens: React.FC = () => {
  const [fromToken, setFromToken] = useState<Token>(illiquidTokens[0]);
  const [toToken, setToToken] = useState<Token>(referenceTokens[0]);
  const [amount, setAmount] = useState('1000000');
  const [slippage, setSlippage] = useState('5');
  const [selectedChain, setSelectedChain] = useState('Ethereum');

  const filteredFromTokens = useMemo(() => 
    illiquidTokens.filter(t => t.chain === selectedChain),
    [selectedChain]
  );

  const getReferenceTokenPrice = (symbol: string): number => {
    const ref = referenceTokens.find(t => t.symbol === symbol);
    return ref?.price || 0;
  };

  const getIlliquidTokenUSDValue = (token: Token): number => {
    if (!token.creatorPrice) return 0;
    const refPrice = getReferenceTokenPrice(token.creatorPrice.referenceToken);
    return token.creatorPrice.amount * refPrice;
  };

  const calculateOutput = (): { outputAmount: number; usdValue: number } => {
    const amt = parseFloat(amount || '0');
    
    if (fromToken.isIlliquid && fromToken.creatorPrice) {
      const refSymbol = fromToken.creatorPrice.referenceToken;
      const refAmount = amt * fromToken.creatorPrice.amount;
      const refPrice = getReferenceTokenPrice(refSymbol);
      const usdValue = refAmount * refPrice;
      
      if (toToken.isIlliquid && toToken.creatorPrice) {
        const toRefPrice = getReferenceTokenPrice(toToken.creatorPrice.referenceToken);
        const toUSDPerToken = toToken.creatorPrice.amount * toRefPrice;
        return { outputAmount: usdValue / toUSDPerToken, usdValue };
      } else {
        const toPrice = toToken.price || 1;
        return { outputAmount: usdValue / toPrice, usdValue };
      }
    } else if (toToken.isIlliquid && toToken.creatorPrice) {
      const fromPrice = fromToken.price || 1;
      const usdValue = amt * fromPrice;
      const toRefPrice = getReferenceTokenPrice(toToken.creatorPrice.referenceToken);
      const toUSDPerToken = toToken.creatorPrice.amount * toRefPrice;
      return { outputAmount: usdValue / toUSDPerToken, usdValue };
    } else {
      const fromPrice = fromToken.price || 1;
      const toPrice = toToken.price || 1;
      const usdValue = amt * fromPrice;
      return { outputAmount: (amt * fromPrice) / toPrice, usdValue };
    }
  };

  const { outputAmount, usdValue } = calculateOutput();

  const priceImpact = useMemo(() => {
    const amt = parseFloat(amount || '0');
    if (fromToken.liquidity === 'Very Low') return Math.min(amt * 0.0000001 * 15, 25);
    if (fromToken.liquidity === 'Low') return Math.min(amt * 0.0000001 * 8, 15);
    return Math.min(amt * 0.0000001 * 3, 5);
  }, [amount, fromToken]);

  const fee = (parseFloat(amount || '0') * 0.005).toFixed(6);
  const minReceived = (outputAmount * (1 - parseFloat(slippage) / 100)).toFixed(6);

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (num < 0.000001) return num.toExponential(4);
    if (num < 0.01) return num.toFixed(8);
    if (num < 1) return num.toFixed(6);
    if (num < 1000) return num.toFixed(4);
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const switchTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Swap Tokens</h1>
        <p className="text-slate-400">Exchange illiquid tokens at creator-set prices</p>
      </div>

      {/* Info Alert */}
      <div className="alert alert-info mb-6">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-medium">Creator-Set Pricing</p>
          <p className="text-sm mt-1">
            Illiquid token prices are set by creators in terms of reference tokens (BTC, ETH, USDT, etc.) 
            that support fiat on/off-ramp on any bank account.
          </p>
        </div>
      </div>

      {/* Chain Selector */}
      <div className="mb-6">
        <label className="form-label">Select Blockchain</label>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {chains.map(chain => (
            <button
              key={chain.name}
              onClick={() => setSelectedChain(chain.name)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedChain === chain.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span className="mr-2">{chain.icon}</span>
              {chain.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="p-6 space-y-6">
          {/* From Token */}
          <div>
            <label className="form-label">From (Illiquid Token)</label>
            <div className="flex gap-3">
              <select
                value={fromToken.symbol}
                onChange={(e) => setFromToken(filteredFromTokens.find(t => t.symbol === e.target.value) || filteredFromTokens[0])}
                className="form-select w-48"
              >
                {filteredFromTokens.map(t => (
                  <option key={t.symbol} value={t.symbol}>{t.symbol} - {t.name}</option>
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
            {fromToken.creatorPrice && (
              <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <p className="text-xs text-amber-400 font-medium mb-1">Creator-Set Price</p>
                <p className="text-sm text-white">
                  1 {fromToken.symbol} = {fromToken.creatorPrice.amount} {fromToken.creatorPrice.referenceToken}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  ≈ ${formatNumber(getIlliquidTokenUSDValue(fromToken))} USD • MCap {fromToken.marketCap}
                </p>
              </div>
            )}
          </div>

          {/* Switch Button */}
          <div className="flex justify-center">
            <button
              onClick={switchTokens}
              className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center transition-all"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Token */}
          <div>
            <label className="form-label">To (Estimated)</label>
            <div className="flex gap-3">
              <select
                value={toToken.symbol}
                onChange={(e) => setToToken(referenceTokens.find(t => t.symbol === e.target.value) || referenceTokens[0])}
                className="form-select w-48"
              >
                {referenceTokens.map(t => (
                  <option key={t.symbol} value={t.symbol}>{t.symbol} - {t.name}</option>
                ))}
              </select>
              <div className="form-input flex-1 flex items-center justify-end">
                <span className="text-xl font-bold text-green-400">{formatNumber(outputAmount)}</span>
              </div>
            </div>
            <p className="form-helper mt-2">≈ ${formatNumber(usdValue)} USD</p>
          </div>

          {/* Route Details */}
          <div className="bg-slate-800 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white mb-3">Swap Details</h3>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Exchange Rate</span>
              <span className="text-white">1 {fromToken.symbol} = {formatNumber(outputAmount / parseFloat(amount || '1'))} {toToken.symbol}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Price Impact</span>
              <span className={priceImpact > 10 ? 'text-red-400 font-semibold' : priceImpact > 5 ? 'text-amber-400' : 'text-green-400'}>
                {priceImpact.toFixed(2)}%
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Swap Fee (0.5%)</span>
              <span className="text-white">{fee} {fromToken.symbol}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Minimum Received</span>
              <span className="text-white">{minReceived} {toToken.symbol}</span>
            </div>
          </div>

          {/* Slippage */}
          <div>
            <label className="form-label">Slippage Tolerance</label>
            <div className="flex gap-2">
              {['0.5', '1', '3', '5', '10'].map(s => (
                <button
                  key={s}
                  onClick={() => setSlippage(s)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    slippage === s
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>

          {/* Warning */}
          {priceImpact > 10 && (
            <div className="alert alert-warning">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-medium">High Price Impact Warning</p>
                <p className="text-sm mt-1">
                  This trade has significant price impact due to low liquidity. Proceed with caution.
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button className={`btn w-full ${priceImpact > 15 ? 'btn-danger' : 'btn-primary'}`}>
            {priceImpact > 15 ? 'Swap Anyway (High Impact)' : `Swap ${fromToken.symbol} to ${toToken.symbol}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapTokens;
