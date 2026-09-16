export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  chain: string;
  price?: number;
  liquidity?: string;
  isIlliquid?: boolean;
  logo?: string;
  // For illiquid tokens: price set by the creator in terms of a high-market-cap reference token
  creatorPrice?: CreatorPrice;
  marketCap?: string;
  marketCapRank?: number;
}

export interface CreatorPrice {
  // How many reference tokens = 1 of this illiquid token
  // e.g., { referenceToken: 'ETH', amount: 0.000001 } means 1 PEPE2 = 0.000001 ETH
  referenceToken: string;
  amount: number;
}

export interface FiatCurrency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface Transaction {
  id: string;
  type: 'on-ramp' | 'off-ramp' | 'swap';
  from: string;
  to: string;
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  fee: string;
}

export type TabType = 'on-ramp' | 'off-ramp' | 'swap';
