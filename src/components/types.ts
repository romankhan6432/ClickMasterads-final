export type WithdrawalMethod = 'crypto' | 'mobile_money';

export interface MobileMoneyProvider {
  id: string;
  name: string;
  icon: string;
  country: string;
  currency: string;
  processingTime: string;
  fee: string;
}

export interface Coin {
  symbol: string;
  name: string;
  icon: string;
  balance: string;
  price: string;
  change24h: string;
}

export interface Network {
  name: string;
  symbol: string;
  icon: string;
  fee: string;
  estimatedTime: string;
  minAmount: string;
  maxAmount: string;
  status: 'active' | 'congested' | 'suspended';
  confirmations: number;
}

export interface StepProps {
  onNext: () => void;
  onBack: () => void;
} 