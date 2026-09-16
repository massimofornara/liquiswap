export interface Token {
  symbol: string;
  name: string;
  balance: number;
  priceUsd: number;
  decimals: number;
  address: string;
  icon: string;
}

export type ActiveTab = 'swap' | 'dashboard' | 'buy' | 'sell';

export interface SwapState {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  slippage: number;
  isEstimating: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'swap' | 'buy' | 'sell';
  title: string;
  amount: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}
