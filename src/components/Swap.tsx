import React, { useState, useMemo } from 'react';
import { illiquidTokens, referenceTokens, chains } from '../data';
import { Token } from '../types';

const Swap: React.FC = () => {
  const [fromToken, setFromToken] = useState<Token>(illiquidTokens[0]);
  const [toToken, setToToken] = useState<Token>(referenceTokens[0]); // Reference token (high mcap)
  const [amount, setAmount] = useState('1000000');
  const [slippage, setSlippage] = useState('5');
  const [selectedChain, setSelectedChain] = useState('Ethereum');
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTokenModal, setShowTokenModal] = useState<'from' | 'to' | null>(null);
  const [modalFilter, setModalFilter] = useState<'illiquid' | 'reference'>('illiquid');

  const filteredTokens = useMemo(() => {
    if (modalFilter === 'reference') {
      if (searchQuery) {
        return referenceTokens.filter(t =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return referenceTokens;
    } else {
      const tokens = searchQuery
        ? illiquidTokens
        : illiquidTokens.filter(t => t.chain === selectedChain);
      if (searchQuery) {
        return tokens.filter(t =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return tokens;
    }
  }, [searchQuery, selectedChain, modalFilter]);

  // Get the reference token price from the creator price
  const getReferenceTokenPrice = (symbol: string): number => {
    const ref = referenceTokens.find(t => t.symbol === symbol);
    return ref?.price || 0;
  };

  // Calculate the USD value of the illiquid token based on creator-set price
  const getIlliquidTokenUSDValue = (token: Token): number => {
    if (!token.creatorPrice) return 0;
    const refPrice = getReferenceTokenPrice(token.creatorPrice.referenceToken);
    return token.creatorPrice.amount * refPrice;
  };

  // Calculate output amount based on creator-set price
  const calculateOutput = (): { outputAmount: number; usdValue: number; referenceAmount: number } => {
    const amt = parseFloat(amount || '0');
    
    if (fromToken.isIlliquid && fromToken.creatorPrice) {
      // From illiquid token: use creator-set price
      const refSymbol = fromToken.creatorPrice.referenceToken;
      const refAmount = amt * fromToken.creatorPrice.amount; // amount in reference token
      const refPrice = getReferenceTokenPrice(refSymbol);
      const usdValue = refAmount * refPrice;
      
      if (toToken.isIlliquid && toToken.creatorPrice) {
        // Both illiquid: convert through reference
        const toRefPrice = getReferenceTokenPrice(toToken.creatorPrice.referenceToken);
        const toUSDPerToken = toToken.creatorPrice.amount * toRefPrice;
        return { outputAmount: usdValue / toUSDPerToken, usdValue, referenceAmount: refAmount };
      } else {
        // To reference token
        const toPrice = toToken.price || 1;
        return { outputAmount: usdValue / toPrice, usdValue, referenceAmount: refAmount };
      }
    } else if (toToken.isIlliquid && toToken.creatorPrice) {
      // From reference to illiquid: use creator-set price
      const fromPrice = fromToken.price || 1;
      const usdValue = amt * fromPrice;
      const toRefPrice = getReferenceTokenPrice(toToken.creatorPrice.referenceToken);
      const toUSDPerToken = toToken.creatorPrice.amount * toRefPrice;
      return { outputAmount: usdValue / toUSDPerToken, usdValue, referenceAmount: usdValue / getReferenceTokenPrice(toToken.creatorPrice.referenceToken) / toToken.creatorPrice.amount * toToken.creatorPrice.amount };
    } else {
      // Both reference tokens
      const fromPrice = fromToken.price || 1;
      const toPrice = toToken.price || 1;
      const usdValue = amt * fromPrice;
      return { outputAmount: (amt * fromPrice) / toPrice, usdValue, referenceAmount: amt };
    }
  };

  const { outputAmount, usdValue, referenceAmount } = calculateOutput();

  // Price impact for illiquid tokens
  const priceImpact = useMemo(() => {
    const amt = parseFloat(amount || '0');
    if (fromToken.liquidity === 'Very Low') return Math.min(amt * 0.0000001 * 15, 25);
    if (fromToken.liquidity === 'Low') return Math.min(amt * 0.0000001 * 8, 15);
    return Math.min(amt * 0.0000001 * 3, 5);
  }, [amount, fromToken]);

  const fee = (parseFloat(amount || '0') * 0.005).toFixed(6);
  const minReceived = (outputAmount * (1 - parseFloat(slippage) / 100)).toFixed(6);

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

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (num < 0.000001) return num.toExponential(4);
    if (num < 0.01) return num.toFixed(8);
    if (num < 1) return num.toFixed(6);
    if (num < 1000) return num.toFixed(4);
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  return (
    <div className="slide-up space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Swap Illiquid Tokens</h2>
        <p className="text-slate-400 text-sm">
          Prices set by token creators in top market-cap crypto with fiat ramp support
        </p>
      </div>

      {/* Info Banner */}
      <div className="glass-card p-4 border-indigo-500/20 bg-indigo-500/5">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-sm font-medium text-indigo-300">How Creator-Set Pricing Works</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Illiquid token creators establish their token's value in terms of high-market-cap cryptocurrencies 
              (BTC, ETH, USDT, etc.) that support <span className="text-cyan-400">fiat on/off-ramp on any bank account</span>. 
              This ensures transparent, verifiable pricing without needing liquidity pools.
            </p>
          </div>
        </div>
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

      {/* From Token (Illiquid) */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-slate-400 uppercase tracking-wider">From (Illiquid Token)</label>
          <span className="text-xs text-slate-500">Balance: 5,000,000 {fromToken.symbol}</span>
        </div>
        <div className="token-input p-4 flex items-center gap-3">
          <button
            onClick={() => { setShowTokenModal('from'); setModalFilter('illiquid'); }}
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
        
        {/* Creator Price Display */}
        {fromToken.isIlliquid && fromToken.creatorPrice && (
          <div className="mt-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-amber-400">👑 Creator-Set Price</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                fromToken.liquidity === 'Very Low' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {fromToken.liquidity} Liquidity
              </span>
            </div>
            <p className="text-sm text-white font-medium">
              1 {fromToken.symbol} = {fromToken.creatorPrice.amount} {fromToken.creatorPrice.referenceToken}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              ≈ ${formatNumber(getIlliquidTokenUSDValue(fromToken))} USD • MCap: {fromToken.marketCap}
            </p>
          </div>
        )}
        
        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-500">on {fromToken.chain}</span>
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

      {/* To Token (Reference or Illiquid) */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-slate-400 uppercase tracking-wider">To (estimated)</label>
          <span className="text-xs text-slate-500">≈ ${formatNumber(usdValue)} USD</span>
        </div>
        <div className="token-input p-4 flex items-center gap-3">
          <button
            onClick={() => { setShowTokenModal('to'); setModalFilter('reference'); }}
            className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm hover:border-indigo-500 transition-all"
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              toToken.isIlliquid 
                ? 'bg-gradient-to-br from-purple-400 to-pink-500' 
                : 'bg-gradient-to-br from-green-400 to-emerald-500'
            }`}>
              {toToken.symbol.charAt(0)}
            </span>
            {toToken.symbol}
            <span className="text-slate-400">▾</span>
          </button>
          <div className="flex-1 text-right">
            <span className="text-2xl font-bold text-cyan-400">{formatNumber(outputAmount)}</span>
          </div>
        </div>

        {/* Reference token info */}
        {!toToken.isIlliquid && (
          <div className="mt-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-green-400">🏦 Fiat Ramp Available</span>
              <span className="text-xs text-slate-500">MCap Rank #{toToken.marketCapRank}</span>
            </div>
            <p className="text-xs text-slate-400">
              {toToken.symbol} supports on/off-ramp to <span className="text-white">any bank account</span> worldwide. 
              Market Cap: {toToken.marketCap}
            </p>
          </div>
        )}

        {toToken.isIlliquid && toToken.creatorPrice && (
          <div className="mt-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-amber-400">👑 Creator-Set Price</span>
            </div>
            <p className="text-sm text-white font-medium">
              1 {toToken.symbol} = {toToken.creatorPrice.amount} {toToken.creatorPrice.referenceToken}
            </p>
          </div>
        )}
      </div>

      {/* Swap Route & Details */}
      <div className="glass-card p-5 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Swap Route</span>
          <span className="text-xs text-indigo-400">LiquiSwap Router v3</span>
        </div>
        
        {/* Route visualization */}
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="px-2 py-1 rounded bg-orange-500/20 text-orange-400 font-medium">{fromToken.symbol}</span>
            <span className="text-slate-500">→</span>
            {fromToken.isIlliquid && fromToken.creatorPrice && (
              <>
                <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 font-medium">
                  {fromToken.creatorPrice.referenceToken}
                </span>
                <span className="text-slate-500">→</span>
              </>
            )}
            {!toToken.isIlliquid ? (
              <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 font-medium">{toToken.symbol}</span>
            ) : (
              <>
                <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 font-medium">
                  {toToken.creatorPrice?.referenceToken || '???'}
                </span>
                <span className="text-slate-500">→</span>
                <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 font-medium">{toToken.symbol}</span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Route uses creator-set pricing via {fromToken.creatorPrice?.referenceToken || 'reference'} as bridge
          </p>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Effective Rate</span>
          <span className="text-white">1 {fromToken.symbol} = {formatNumber(outputAmount / parseFloat(amount || '1'))} {toToken.symbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">USD Value</span>
          <span className="text-white">${formatNumber(usdValue)}</span>
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
                The creator-set price is used as reference, but actual execution may vary.
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
              <p className="text-sm font-medium text-green-400">Swap completed at creator-set price</p>
              <p className="text-xs text-slate-400">
                {formatNumber(parseFloat(amount))} {fromToken.symbol} → {formatNumber(outputAmount)} {toToken.symbol}
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

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setModalFilter('illiquid')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  modalFilter === 'illiquid'
                    ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400'
                    : 'bg-slate-800 border border-slate-700 text-slate-400'
                }`}
              >
                🪙 Illiquid Tokens
              </button>
              <button
                onClick={() => setModalFilter('reference')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  modalFilter === 'reference'
                    ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                    : 'bg-slate-800 border border-slate-700 text-slate-400'
                }`}
              >
                🏦 High MCap (Fiat Ramp)
              </button>
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={modalFilter === 'reference' ? 'Search high mcap tokens...' : 'Search by name, symbol, or address...'}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4"
            />

            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2">
              {filteredTokens.map(token => (
                <button
                  key={token.address}
                  onClick={() => handleSelectToken(token)}
                  className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 transition-all flex items-center gap-3 text-left"
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    token.isIlliquid 
                      ? 'bg-gradient-to-br from-orange-400 to-red-500' 
                      : 'bg-gradient-to-br from-green-400 to-emerald-500'
                  }`}>
                    {token.symbol.charAt(0)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{token.symbol}</div>
                    <div className="text-xs text-slate-400 truncate">{token.name}</div>
                    {token.creatorPrice && (
                      <div className="text-xs text-amber-400 mt-0.5">
                        Creator: 1 {token.symbol} = {token.creatorPrice.amount} {token.creatorPrice.referenceToken}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    {token.isIlliquid ? (
                      <div className={`text-xs px-2 py-0.5 rounded-full ${
                        token.liquidity === 'Very Low' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {token.liquidity}
                      </div>
                    ) : (
                      <div className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                        🏦 Fiat Ramp
                      </div>
                    )}
                    <div className="text-xs text-slate-500 mt-1">
                      {token.isIlliquid ? token.marketCap : `#${token.marketCapRank} MCap`}
                    </div>
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
