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

// Reference tokens = crypto with highest market cap that support fiat on/off-ramp on ANY bank account
export const referenceTokens: Token[] = [
  { symbol: 'BTC', name: 'Bitcoin', address: 'native', decimals: 8, chain: 'Bitcoin', price: 104500.00, liquidity: 'High', marketCap: '$2.07T', marketCapRank: 1 },
  { symbol: 'ETH', name: 'Ethereum', address: 'native', decimals: 18, chain: 'Ethereum', price: 3450.00, liquidity: 'High', marketCap: '$415B', marketCapRank: 2 },
  { symbol: 'USDT', name: 'Tether', address: '0xdAC1...7eC6', decimals: 6, chain: 'Ethereum', price: 1.00, liquidity: 'High', marketCap: '$139B', marketCapRank: 3 },
  { symbol: 'BNB', name: 'BNB', address: 'native', decimals: 18, chain: 'BSC', price: 695.00, liquidity: 'High', marketCap: '$101B', marketCapRank: 4 },
  { symbol: 'SOL', name: 'Solana', address: 'native', decimals: 9, chain: 'Solana', price: 172.00, liquidity: 'High', marketCap: '$82B', marketCapRank: 5 },
  { symbol: 'USDC', name: 'USD Coin', address: '0xA0b8...69d1', decimals: 6, chain: 'Ethereum', price: 1.00, liquidity: 'High', marketCap: '$44B', marketCapRank: 6 },
  { symbol: 'XRP', name: 'XRP', address: 'native', decimals: 6, chain: 'XRP Ledger', price: 2.35, liquidity: 'High', marketCap: '$137B', marketCapRank: 7 },
  { symbol: 'ADA', name: 'Cardano', address: 'native', decimals: 6, chain: 'Cardano', price: 0.98, liquidity: 'High', marketCap: '$34B', marketCapRank: 8 },
  { symbol: 'AVAX', name: 'Avalanche', address: 'native', decimals: 18, chain: 'Avalanche', price: 38.50, liquidity: 'High', marketCap: '$15.8B', marketCapRank: 9 },
  { symbol: 'DOGE', name: 'Dogecoin', address: 'native', decimals: 8, chain: 'Dogecoin', price: 0.225, liquidity: 'High', marketCap: '$33B', marketCapRank: 10 },
];

// Popular tokens for on/off-ramp (subset of reference tokens)
export const popularTokens: Token[] = referenceTokens.slice(0, 6);

// Illiquid tokens with CREATOR-SET PRICES in terms of reference tokens (high market cap crypto)
// The creator establishes: "1 of my token = X amount of [reference token]"
export const illiquidTokens: Token[] = [
  {
    symbol: 'PEPE2',
    name: 'Pepe 2.0',
    address: '0x1234...abcd',
    decimals: 18,
    chain: 'Ethereum',
    liquidity: 'Very Low',
    isIlliquid: true,
    marketCap: '$1.2M',
    creatorPrice: { referenceToken: 'ETH', amount: 0.0000003 },
  },
  {
    symbol: 'MOON',
    name: 'MoonDAO Token',
    address: '0x5678...efgh',
    decimals: 18,
    chain: 'Ethereum',
    liquidity: 'Low',
    isIlliquid: true,
    marketCap: '$850K',
    creatorPrice: { referenceToken: 'USDT', amount: 0.0023 },
  },
  {
    symbol: 'SHIB3',
    name: 'Shiba 3.0',
    address: '0x9abc...1234',
    decimals: 18,
    chain: 'Ethereum',
    liquidity: 'Very Low',
    isIlliquid: true,
    marketCap: '$420K',
    creatorPrice: { referenceToken: 'ETH', amount: 0.000000015 },
  },
  {
    symbol: 'DOGE4',
    name: 'Doge 4.0',
    address: '0xdef0...5678',
    decimals: 18,
    chain: 'BSC',
    liquidity: 'Low',
    isIlliquid: true,
    marketCap: '$2.1M',
    creatorPrice: { referenceToken: 'BNB', amount: 0.000014 },
  },
  {
    symbol: 'FLOKI3',
    name: 'Floki 3.0',
    address: '0x3456...9abc',
    decimals: 18,
    chain: 'BSC',
    liquidity: 'Very Low',
    isIlliquid: true,
    marketCap: '$680K',
    creatorPrice: { referenceToken: 'BNB', amount: 0.0000045 },
  },
  {
    symbol: 'ROCKET',
    name: 'Rocket Token',
    address: '0x7890...def0',
    decimals: 18,
    chain: 'Polygon',
    liquidity: 'Low',
    isIlliquid: true,
    marketCap: '$3.4M',
    creatorPrice: { referenceToken: 'USDC', amount: 0.015 },
  },
  {
    symbol: 'GEM',
    name: 'GemStone',
    address: '0xabcd...3456',
    decimals: 18,
    chain: 'Arbitrum',
    liquidity: 'Very Low',
    isIlliquid: true,
    marketCap: '$290K',
    creatorPrice: { referenceToken: 'ETH', amount: 0.00000023 },
  },
  {
    symbol: 'APESWAP',
    name: 'ApeSwap Legacy',
    address: '0xef01...7890',
    decimals: 18,
    chain: 'BSC',
    liquidity: 'Low',
    isIlliquid: true,
    marketCap: '$1.8M',
    creatorPrice: { referenceToken: 'BNB', amount: 0.00015 },
  },
  {
    symbol: 'NEBULA',
    name: 'Nebula Finance',
    address: '0x2345...6789',
    decimals: 18,
    chain: 'Ethereum',
    liquidity: 'Very Low',
    isIlliquid: true,
    marketCap: '$560K',
    creatorPrice: { referenceToken: 'SOL', amount: 0.0058 },
  },
  {
    symbol: 'QUANTUM',
    name: 'QuantumDAO',
    address: '0x4567...8901',
    decimals: 18,
    chain: 'Arbitrum',
    liquidity: 'Low',
    isIlliquid: true,
    marketCap: '$1.5M',
    creatorPrice: { referenceToken: 'BTC', amount: 0.0000000095 },
  },
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
