import { Token, FiatCurrency } from './types';

export const fiatCurrencies: FiatCurrency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
];

export const popularTokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', address: '0xEeee...eEEee', decimals: 18, chain: 'Ethereum', price: 3450.00, liquidity: 'High' },
  { symbol: 'USDC', name: 'USD Coin', address: '0xA0b8...69d1', decimals: 6, chain: 'Ethereum', price: 1.00, liquidity: 'High' },
  { symbol: 'USDT', name: 'Tether', address: '0xdAC1...7eC6', decimals: 6, chain: 'Ethereum', price: 1.00, liquidity: 'High' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260...4742', decimals: 8, chain: 'Ethereum', price: 67200.00, liquidity: 'High' },
  { symbol: 'DAI', name: 'Dai', address: '0x6B17...1468', decimals: 18, chain: 'Ethereum', price: 1.00, liquidity: 'High' },
];

export const illiquidTokens: Token[] = [
  { symbol: 'PEPE2', name: 'Pepe 2.0', address: '0x1234...abcd', decimals: 18, chain: 'Ethereum', price: 0.0000001, liquidity: 'Very Low', isIlliquid: true },
  { symbol: 'MOON', name: 'MoonDAO Token', address: '0x5678...efgh', decimals: 18, chain: 'Ethereum', price: 0.0023, liquidity: 'Low', isIlliquid: true },
  { symbol: 'SHIB3', name: 'Shiba 3.0', address: '0x9abc...1234', decimals: 18, chain: 'Ethereum', price: 0.00000005, liquidity: 'Very Low', isIlliquid: true },
  { symbol: 'DOGE4', name: 'Doge 4.0', address: '0xdef0...5678', decimals: 18, chain: 'BSC', price: 0.00001, liquidity: 'Low', isIlliquid: true },
  { symbol: 'FLOKI3', name: 'Floki 3.0', address: '0x3456...9abc', decimals: 18, chain: 'BSC', price: 0.000003, liquidity: 'Very Low', isIlliquid: true },
  { symbol: 'ROCKET', name: 'Rocket Token', address: '0x7890...def0', decimals: 18, chain: 'Polygon', price: 0.015, liquidity: 'Low', isIlliquid: true },
  { symbol: 'GEM', name: 'GemStone', address: '0xabcd...3456', decimals: 18, chain: 'Arbitrum', price: 0.0008, liquidity: 'Very Low', isIlliquid: true },
  { symbol: 'APESWAP', name: 'ApeSwap Legacy', address: '0xef01...7890', decimals: 18, chain: 'BSC', price: 0.0001, liquidity: 'Low', isIlliquid: true },
];

export const chains = [
  { name: 'Ethereum', color: '#627EEA', icon: '⟠' },
  { name: 'BSC', color: '#F0B90B', icon: '⬡' },
  { name: 'Polygon', color: '#8247E5', icon: '⬟' },
  { name: 'Arbitrum', color: '#28A0F0', icon: '◈' },
  { name: 'Optimism', color: '#FF0420', icon: '⊕' },
  { name: 'Avalanche', color: '#E84142', icon: '▲' },
];

export const paymentMethods = [
  { id: 'bank', name: 'Bank Transfer', icon: '🏦', fee: '1.5%', time: '1-3 business days' },
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', fee: '3.5%', time: 'Instant' },
  { id: 'sepa', name: 'SEPA Transfer', icon: '🇪🇺', fee: '0.5%', time: '1-2 business days' },
  { id: 'wire', name: 'Wire Transfer', icon: '🔌', fee: '2.0%', time: '2-5 business days' },
];
