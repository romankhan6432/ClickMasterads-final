export interface WithdrawalMethod {
  id: string;
  name: string;
  icon: string;
  fee: string;
  estimatedTime: string;
  supportedCoins: string[];
}

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  minAmount: number;
} 