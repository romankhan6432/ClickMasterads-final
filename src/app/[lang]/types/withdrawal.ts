export enum PaymentMethod {
  BKASH = 'bkash',
  NAGAD = 'nagad',
  BITGET = 'bitget',
  BINANCE = 'binance'
}

export enum NetworkType {
  BEP20 = 'bep20',
  BEP2 = 'bep2',
  ERC20 = 'erc20',
  TRC20 = 'trc20'
}

export interface WithdrawalFormData {
  method: PaymentMethod;
  network?: NetworkType;
  amount: string;
  recipient: string;
  memo?: string;
}
