import React, { useState, useEffect } from 'react';
import { Token, SwapState } from '../types';
import { SUPPORTED_TOKENS } from '../data';

interface SwapTokensProps {
  walletConnected: boolean;
  onConnectWallet: () => void;
}

export const SwapTokens: React.FC<SwapTokensProps> = ({ walletConnected, onConnectWallet }) => {
  const [tokens] = useState<Token[]>(SUPPORTED_TOKENS);
  const [swapState, setSwapState] = useState<SwapState>({
    fromToken: tokens[0],
    toToken: tokens[1],
    fromAmount: '',
    toAmount: '',
    slippage: 0.5,
    isEstimating: false
  });
  const [isSwapping, setIsSwapping] = useState(false);
  const [txSuccess, setTxSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!swapState.fromAmount || isNaN(Number(swapState.fromAmount)) || Number(swapState.fromAmount) <= 0) {
      setSwapState((prev) => ({ ...prev, toAmount: '', isEstimating: false }));
      return;
    }

    const amount = parseFloat(swapState.fromAmount);
    const fromValUsd = amount * swapState.fromToken.priceUsd;
    const rawToAmount = fromValUsd / swapState.toToken.priceUsd;
    const finalToAmount = rawToAmount * (1 - swapState.slippage / 100);

    setSwapState((prev) => ({ ...prev, isEstimating: true }));
    const timer = setTimeout(() => {
      setSwapState((prev) => ({
        ...prev,
        toAmount: finalToAmount.toFixed(5),
        isEstimating: false
      }));
    }, 150);

    return () => clearTimeout(timer);
  }, [swapState.fromAmount, swapState.fromToken, swapState.toToken, swapState.slippage]);

  const handleInvert = () => {
    setSwapState((prev) => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount
    }));
  };

  const handleExecuteSwap = async () => {
    if (!walletConnected) {
      onConnectWallet();
      return;
    }
    setIsSwapping(true);
    setTxSuccess(null);

    try {
      await new Promise((res) => setTimeout(res, 1800));
      setTxSuccess(
        `Swap eseguito: ${swapState.fromAmount} ${swapState.fromToken.symbol} convertiti in ~${swapState.toAmount} ${swapState.toToken.symbol}`
      );
      setSwapState((prev) => ({ ...prev, fromAmount: '', toAmount: '' }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold tracking-tight">Swap</h2>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50">
          <span>Slippage:</span>
          {[0.1, 0.5, 1.0].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSwapState((prev) => ({ ...prev, slippage: s }))}
              className={`px-2 py-0.5 rounded transition ${
                swapState.slippage === s ? 'bg-indigo-600 text-white font-medium' : 'hover:text-white'
              }`}
            >
              {s}%
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 transition focus-within:border-indigo-500">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Paga</span>
          <span>Disponibile: {swapState.fromToken.balance.toFixed(4)}</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="0.0"
            value={swapState.fromAmount}
            onChange={(e) => setSwapState((prev) => ({ ...prev, fromAmount: e.target.value }))}
            className="w-full bg-transparent text-2xl font-semibold focus:outline-none placeholder-slate-500"
          />
          <div className="flex items-center bg-slate-700 rounded-xl px-3 py-1.5 border border-slate-600 gap-2 shrink-0">
            <span className="text-lg">{swapState.fromToken.icon}</span>
            <select
              value={swapState.fromToken.symbol}
              onChange={(e) => {
                const selected = tokens.find((t) => t.symbol === e.target.value);
                if (selected) setSwapState((prev) => ({ ...prev, fromToken: selected }));
              }}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              {tokens.map((t) => (
                <option key={t.symbol} value={t.symbol} className="bg-slate-850 text-white">
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-center -my-3 relative z-10">
        <button
          type="button"
          onClick={handleInvert}
          className="bg-slate-800 border border-slate-600 hover:border-indigo-400 p-2.5 rounded-full shadow-lg transition hover:scale-105 active:scale-95 text-indigo-400 cursor-pointer"
          aria-label="Inverti token"
        >
          ⇅
        </button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 mt-2 transition focus-within:border-indigo-500">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Ricevi (stimato)</span>
          <span>Disponibile: {swapState.toToken.balance.toFixed(4)}</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            readOnly
            placeholder="0.0"
            value={swapState.isEstimating ? 'Calcolo in corso...' : swapState.toAmount}
            className="w-full bg-transparent text-2xl font-semibold focus:outline-none text-indigo-300 placeholder-slate-500"
          />
          <div className="flex items-center bg-slate-700 rounded-xl px-3 py-1.5 border border-slate-600 gap-2 shrink-0">
            <span className="text-lg">{swapState.toToken.icon}</span>
            <select
              value={swapState.toToken.symbol}
              onChange={(e) => {
                const selected = tokens.find((t) => t.symbol === e.target.value);
                if (selected) setSwapState((prev) => ({ ...prev, toToken: selected }));
              }}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              {tokens.map((t) => (
                <option key={t.symbol} value={t.symbol} className="bg-slate-850 text-white">
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 space-y-1 text-xs text-slate-400">
        <div className="flex justify-between">
          <span>Tasso di cambio stimato</span>
          <span className="text-slate-200">
            1 {swapState.fromToken.symbol} ≈ {(swapState.fromToken.priceUsd / swapState.toToken.priceUsd).toFixed(4)}{' '}
            {swapState.toToken.symbol}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Network Fee stimata</span>
          <span className="text-emerald-400">~$1.42 (0.00041 ETH)</span>
        </div>
      </div>

      <button
        type="button"
        disabled={isSwapping || (walletConnected && (!swapState.fromAmount || Number(swapState.fromAmount) <= 0))}
        onClick={handleExecuteSwap}
        className="w-full mt-6 py-4 px-6 rounded-2xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-50 transition duration-200 shadow-lg shadow-indigo-500/25 cursor-pointer disabled:cursor-not-allowed"
      >
        {!walletConnected
          ? 'Connetti Wallet'
          : isSwapping
          ? 'Conferma su Wallet in corso...'
          : !swapState.fromAmount
          ? 'Inserisci un importo'
          : 'Esegui Swap'}
      </button>

      {txSuccess && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs text-center leading-relaxed">
          {txSuccess}
        </div>
      )}
    </div>
  );
};
