import React, { useState, useMemo } from 'react';
import { illiquidTokens, referenceTokens, chains } from '../data';
import { Token } from '../types';

const Swap: React.FC = () => {
  const [fromToken, setFromToken] = useState<Token>(illiquidTokens[0]);
  const [toToken, setToToken] = useState<Token>(referenceTokens[0]);
  const [amount, setAmount] = useState('1000000');
  const [slippage, setSlippage] = useState('5');
  const [selectedChain, setSelectedChain] = useState('Ethereum');
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
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-indigo">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 pulse-soft"></span>
            Creator Pricing
          </span>
          <span className="text-xs text-zinc-500">•</span>
          <span className="text-xs text-zinc-500">Illiquid Token Exchange</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Swap Tokens</h1>
        <p className="text-sm text-zinc-500 mt-1">Exchange illiquid tokens at creator-set prices via high market-cap reference tokens.</p>
      </div>

      {/* Chain Selector */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6">
        {chains.map(chain => (
          <button
            key={chain.name}
            onClick={() => setSelectedChain(chain.name)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedChain === chain.name
                ? 'bg-white/[0.06] border border-white/[0.1] text-white'
                : 'bg-white/[0.02] border border-white/[0.04] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.08]'
            }`}
          >
            <span style={{ color: chain.color }} className="text-sm">{chain.icon}</span>
            {chain.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* From Token */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">From</label>
            <span className="text-xs text-zinc-500">Balance: <span className="text-zinc-300 font-mono">5.0M {fromToken.symbol}</span></span>
          </div>
          
          <div className="input-field p-4 flex items-center gap-3">
            <button
              onClick={() => { setShowTokenModal('from'); setModalFilter('illiquid'); }}
              className="token-chip"
            >
              <span className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-400/30 to-red-500/30 border border-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-400">
                {fromToken.symbol.charAt(0)}
              </span>
              {fromToken.symbol}
              <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-2xl font-bold text-white outline-none text-right font-mono w-full"
              />
              <button
                onClick={() => setAmount('5000000')}
                className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 hover:bg-indigo-500/20 transition-all"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Creator Price */}
          {fromToken.isIlliquid && fromToken.creatorPrice && (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/[0.04] border border-amber-500/10">
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Creator-Set Price</span>
                <span className={`badge text-[10px] ml-auto ${fromToken.liquidity === 'Very Low' ? 'badge-red' : 'badge-amber'}`}>
                  {fromToken.liquidity}
                </span>
              </div>
              <div className="text-sm font-mono text-white">
                1 {fromToken.symbol} = {fromToken.creatorPrice.amount} {fromToken.creatorPrice.referenceToken}
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                ≈ ${formatNumber(getIlliquidTokenUSDValue(fromToken))} USD • MCap {fromToken.marketCap}
              </div>
            </div>
          )}
        </div>

        {/* Switch */}
        <div className="flex justify-center -my-1 relative z-10">
          <button
            onClick={switchTokens}
            className="w-9 h-9 rounded-xl bg-[#0c0c10] border border-white/[0.08] flex items-center justify-center hover:border-indigo-500/30 hover:bg-indigo-500/[0.04] transition-all group"
          >
            <svg className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
            </svg>
          </button>
        </div>

        {/* To Token */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">To (estimated)</label>
            <span className="text-xs text-zinc-500">≈ <span className="text-zinc-300 font-mono">${formatNumber(usdValue)}</span></span>
          </div>
          
          <div className="input-field p-4 flex items-center gap-3">
            <button
              onClick={() => { setShowTokenModal('to'); setModalFilter('reference'); }}
              className="token-chip"
            >
              <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                toToken.isIlliquid 
                  ? 'bg-gradient-to-br from-purple-400/30 to-pink-500/30 border border-purple-500/20 text-purple-400' 
                  : 'bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 border border-emerald-500/20 text-emerald-400'
              }`}>
                {toToken.symbol.charAt(0)}
              </span>
              {toToken.symbol}
              <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div className="flex-1 text-right">
              <span className="text-2xl font-bold text-emerald-400 font-mono">{formatNumber(outputAmount)}</span>
            </div>
          </div>

          {/* Reference token info */}
          {!toToken.isIlliquid && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Fiat Ramp Available</span>
                <span className="badge badge-green text-[10px] ml-auto">#{toToken.marketCapRank}</span>
              </div>
              <div className="text-xs text-zinc-500">
                {toToken.symbol} supports on/off-ramp to any bank account. MCap: {toToken.marketCap}
              </div>
            </div>
          )}
        </div>

        {/* Route & Details */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Route Details</label>
            <span className="badge badge-indigo text-[10px]">LiquiSwap Router v3</span>
          </div>

          {/* Route visualization */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-[11px] font-semibold text-orange-400">{fromToken.symbol}</span>
              <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              {fromToken.isIlliquid && fromToken.creatorPrice && (
                <>
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-semibold text-indigo-400">
                    {fromToken.creatorPrice.referenceToken}
                  </span>
                  <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
              {!toToken.isIlliquid ? (
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">{toToken.symbol}</span>
              ) : (
                <>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">
                    {toToken.creatorPrice?.referenceToken}
                  </span>
                  <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[11px] font-semibold text-purple-400">{toToken.symbol}</span>
                </>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            {[
              { label: 'Effective Rate', value: `1 ${fromToken.symbol} = ${formatNumber(outputAmount / parseFloat(amount || '1'))} ${toToken.symbol}` },
              { label: 'USD Value', value: `$${formatNumber(usdValue)}` },
              { label: 'Price Impact', value: `${priceImpact.toFixed(2)}%`, color: priceImpact > 10 ? 'text-rose-400' : priceImpact > 5 ? 'text-amber-400' : 'text-emerald-400' },
              { label: 'Swap Fee (0.5%)', value: `${fee} ${fromToken.symbol}` },
              { label: 'Min. Received', value: `${minReceived} ${toToken.symbol}` },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-zinc-500">{item.label}</span>
                <span className={`font-mono ${item.color || 'text-zinc-300'}`}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Slippage */}
          <div className="mt-4 pt-4 border-t border-white/[0.04]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-500">Slippage Tolerance</span>
              <span className="text-xs font-mono text-white">{slippage}%</span>
            </div>
            <div className="flex gap-2">
              {['0.5', '1', '3', '5', '10'].map(s => (
                <button
                  key={s}
                  onClick={() => setSlippage(s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    slippage === s
                      ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                      : 'bg-white/[0.02] border border-white/[0.06] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.1]'
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Warning */}
        {priceImpact > 10 && (
          <div className="card p-4 border-amber-500/20 bg-amber-500/[0.03]">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-400">High Price Impact</p>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  This trade has significant price impact due to low liquidity. Creator-set price is used as reference.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button className={`w-full py-4 rounded-xl text-sm font-semibold relative z-10 ${
          priceImpact > 15 
            ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/20' 
            : 'btn-primary'
        }`}>
          <span className="relative z-10">
            {priceImpact > 15 ? '⚠️ Swap Anyway (High Impact)' : `Swap ${fromToken.symbol} → ${toToken.symbol}`}
          </span>
        </button>
      </div>

      {/* Token Selection Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="card w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Select Token</h3>
              <button
                onClick={() => { setShowTokenModal(null); setSearchQuery(''); }}
                className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-6 pt-4 flex gap-2">
              <button
                onClick={() => setModalFilter('illiquid')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  modalFilter === 'illiquid'
                    ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400'
                    : 'bg-white/[0.02] border border-white/[0.06] text-zinc-500 hover:text-zinc-300'
                }`}
              >
                🪙 Illiquid
              </button>
              <button
                onClick={() => setModalFilter('reference')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  modalFilter === 'reference'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-white/[0.02] border border-white/[0.06] text-zinc-500 hover:text-zinc-300'
                }`}
              >
                🏦 High MCap
              </button>
            </div>
            
            <div className="px-6 py-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, symbol, or address..."
                className="w-full input-field px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-3 space-y-1">
              {filteredTokens.map(token => (
                <button
                  key={token.address}
                  onClick={() => handleSelectToken(token)}
                  className="w-full p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all flex items-center gap-3 text-left"
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    token.isIlliquid 
                      ? 'bg-gradient-to-br from-orange-400/20 to-red-500/20 border border-orange-500/20 text-orange-400' 
                      : 'bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 border border-emerald-500/20 text-emerald-400'
                  }`}>
                    {token.symbol.charAt(0)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{token.symbol}</div>
                    <div className="text-xs text-zinc-500 truncate">{token.name}</div>
                    {token.creatorPrice && (
                      <div className="text-[10px] text-amber-400/80 mt-0.5 font-mono">
                        1 {token.symbol} = {token.creatorPrice.amount} {token.creatorPrice.referenceToken}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    {token.isIlliquid ? (
                      <span className={`badge text-[10px] ${token.liquidity === 'Very Low' ? 'badge-red' : 'badge-amber'}`}>
                        {token.liquidity}
                      </span>
                    ) : (
                      <span className="badge badge-green text-[10px]">🏦 Fiat</span>
                    )}
                    <div className="text-[10px] text-zinc-600 mt-1">{token.isIlliquid ? token.marketCap : `#${token.marketCapRank}`}</div>
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
