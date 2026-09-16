import { Token, ActivityItem } from './types';

export const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 3.421,
    priceUsd: 3450.20,
    decimals: 18,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    icon: '⟠'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 2840.50,
    priceUsd: 1.0,
    decimals: 6,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    icon: '💵'
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    balance: 0.24,
    priceUsd: 64200.0,
    decimals: 8,
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    icon: '₿'
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    balance: 1450.0,
    priceUsd: 0.72,
    decimals: 18,
    address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    icon: '🟣'
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'tx-1',
    type: 'swap',
    title: 'Swap ETH → USDC',
    amount: '+1,725.10 USDC',
    timestamp: '10 min fa',
    status: 'completed'
  },
  {
    id: 'tx-2',
    type: 'buy',
    title: 'Acquisto MATIC',
    amount: '+500 MATIC',
    timestamp: '2 ore fa',
    status: 'completed'
  },
  {
    id: 'tx-3',
    type: 'swap',
    title: 'Swap WBTC → ETH',
    amount: '+1.86 ETH',
    timestamp: '1 giorno fa',
    status: 'completed'
  }
];
