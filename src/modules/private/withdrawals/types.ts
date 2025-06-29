export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: string;
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalsState {
  list: Withdrawal[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  filters: {
    status?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

export enum WithdrawalActionTypes {
  FETCH_WITHDRAWALS_REQUEST = 'FETCH_WITHDRAWALS_REQUEST',
  FETCH_WITHDRAWALS_SUCCESS = 'FETCH_WITHDRAWALS_SUCCESS',
  FETCH_WITHDRAWALS_FAILURE = 'FETCH_WITHDRAWALS_FAILURE',
  UPDATE_WITHDRAWAL_STATUS_REQUEST = 'UPDATE_WITHDRAWAL_STATUS_REQUEST',
  UPDATE_WITHDRAWAL_STATUS_SUCCESS = 'UPDATE_WITHDRAWAL_STATUS_SUCCESS',
  UPDATE_WITHDRAWAL_STATUS_FAILURE = 'UPDATE_WITHDRAWAL_STATUS_FAILURE',
  SET_WITHDRAWALS_FILTERS = 'SET_WITHDRAWALS_FILTERS'
}

export type WithdrawalAction =
  | { type: WithdrawalActionTypes.FETCH_WITHDRAWALS_REQUEST }
  | { type: WithdrawalActionTypes.FETCH_WITHDRAWALS_SUCCESS; payload: { withdrawals: Withdrawal[]; totalPages: number } }
  | { type: WithdrawalActionTypes.FETCH_WITHDRAWALS_FAILURE; payload: string }
  | { type: WithdrawalActionTypes.UPDATE_WITHDRAWAL_STATUS_REQUEST; payload: { id: string; status: string } }
  | { type: WithdrawalActionTypes.UPDATE_WITHDRAWAL_STATUS_SUCCESS; payload: Withdrawal }
  | { type: WithdrawalActionTypes.UPDATE_WITHDRAWAL_STATUS_FAILURE; payload: string }
  | { type: WithdrawalActionTypes.SET_WITHDRAWALS_FILTERS; payload: WithdrawalsState['filters'] };
