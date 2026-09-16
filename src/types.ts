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
