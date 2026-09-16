import React, { useState, useEffect } from 'react';
import { Token, SwapState } from '../types';
import { SUPPORTED_TOKENS } from '../data';
import { ArrowDownUp, RefreshCw, Settings2, CheckCircle2, AlertCircle } from 'lucide-react';

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
        `Transazione confermata: scambiati ${swapState.fromAmount} ${swapState.fromToken.symbol} per ${swapState.toAmount} ${swapState.toToken.symbol}`
      );
      setSwapState((prev) => ({ ...prev, fromAmount: '', toAmount: '' }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-white">
      {/* Intestazione */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span>Swap Token</span>
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/60">
          <Settings2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Slippage:</span>
          {[0.1, 0.5, 1.0].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSwapState((prev) => ({ ...prev, slippage: s }))}
              className={`px-1.5 py-0.5 rounded transition ${
                swapState.slippage === s ? 'bg-indigo-600 text-white font-medium' : 'hover:text-white'
              }`}
            >
              {s}%
            </button>
          ))}
        </div>
      </div>

      {/* Input Box "Paga" */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 transition-all focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/40">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Paga</span>
          <span className="font-mono">Disponibile: {swapState.fromToken.balance.toFixed(4)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <input
            type="number"
            placeholder="0.0"
            value={swapState.fromAmount}
            onChange={(e) => setSwapState((prev) => ({ ...prev, fromAmount: e.target.value }))}
            className="w-full bg-transparent text-2xl font-bold focus:outline-none placeholder-slate-600 text-white"
          />
          <div className="flex items-center bg-slate-800 hover:bg-slate-750 rounded-xl px-3 py-1.5 border border-slate-700 gap-2 shrink-0 shadow-sm">
            <span className="text-base">{swapState.fromToken.icon}</span>
            <select
              value={swapState.fromToken.symbol}
              onChange={(e) => {
                const selected = tokens.find((t) => t.symbol === e.target.value);
                if (selected) setSwapState((prev) => ({ ...prev, fromToken: selected }));
              }}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-sm"
            >
              {tokens.map((t) => (
                <option key={t.symbol} value={t.symbol} className="bg-slate-900 text-white">
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inversione di direzione */}
      <div className="flex justify-center -my-3.5 relative z-10">
        <button
          type="button"
          onClick={handleInvert}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-indigo-400 hover:text-indigo-300 p-2.5 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Inverti selezione"
        >
          <ArrowDownUp className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Input Box "Ricevi" */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mt-2 transition-all focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/40">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Ricevi (stimato)</span>
          <span className="font-mono">Disponibile: {swapState.toToken.balance.toFixed(4)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <input
            type="text"
            readOnly
            placeholder="0.0"
            value={swapState.isEstimating ? 'Calcolo quote...' : swapState.toAmount}
            className="w-full bg-transparent text-2xl font-bold focus:outline-none text-indigo-300 placeholder-slate-600"
          />
          <div className="flex items-center bg-slate-800 hover:bg-slate-750 rounded-xl px-3 py-1.5 border border-slate-700 gap-2 shrink-0 shadow-sm">
            <span className="text-base">{swapState.toToken.icon}</span>
            <select
              value={swapState.toToken.symbol}
              onChange={(e) => {
                const selected = tokens.find((t) => t.symbol === e.target.value);
                if (selected) setSwapState((prev) => ({ ...prev, toToken: selected }));
              }}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-sm"
            >
              {tokens.map((t) => (
                <option key={t.symbol} value={t.symbol} className="bg-slate-900 text-white">
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Info Pricing & Gas */}
      <div className="mt-4 p-3.5 bg-slate-950/40 rounded-2xl border border-slate-800/80 space-y-1.5 text-xs text-slate-400">
        <div className="flex justify-between items-center">
          <span>Tasso di cambio</span>
          <span className="font-mono text-slate-200">
            1 {swapState.fromToken.symbol} ≈ {(swapState.fromToken.priceUsd / swapState.toToken.priceUsd).toFixed(4)}{' '}
            {swapState.toToken.symbol}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Commissione di rete DEX</span>
          <span className="font-mono text-emerald-400">~$1.42 (0.00041 ETH)</span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        disabled={isSwapping || (walletConnected && (!swapState.fromAmount || Number(swapState.fromAmount) <= 0))}
        onClick={handleExecuteSwap}
        className="w-full mt-6 py-4 px-6 rounded-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 active:scale-[0.99] disabled:opacity-40 transition-all duration-200 shadow-xl shadow-indigo-600/25 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSwapping && <RefreshCw className="w-4 h-4 animate-spin" />}
        <span>
          {!walletConnected
            ? 'Connetti Wallet'
            : isSwapping
            ? 'Conferma transazione in corso...'
            : !swapState.fromAmount
            ? 'Inserisci un importo'
            : 'Esegui Swap'}
        </span>
      </button>

      {/* Feedback Alert */}
      {txSuccess && (
        <div className="mt-4 p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 leading-relaxed">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{txSuccess}</span>
        </div>
      )}
    </div>
  );
};
