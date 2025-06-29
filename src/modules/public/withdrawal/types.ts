export interface WithdrawalHistory {
    _id: string;
    userId: string;
    method: 'bkash' | 'nagad' | 'bitget' | 'binance';
    amount: number;
    originalAmount: number;
    recipient: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    currency: 'USDT' | 'BDT';
    network?: string;
    bdtAmount?: number;
}

export interface WithdrawalTiming {
    lastWithdrawal: string | null;
    nextWithdrawal: string | null;
    canWithdraw: boolean;
}

export interface WithdrawalState {
    withdrawalHistory: WithdrawalHistory[];
    timing: WithdrawalTiming | null;
    loading: boolean;
    error: string | null;
}
