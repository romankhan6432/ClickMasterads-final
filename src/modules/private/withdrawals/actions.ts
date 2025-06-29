import { WithdrawalActionTypes, Withdrawal, WithdrawalsState } from './types';

export const fetchWithdrawals = () => ({
  type: WithdrawalActionTypes.FETCH_WITHDRAWALS_REQUEST
});

export const fetchWithdrawalsSuccess = (withdrawals: Withdrawal[], totalPages: number) => ({
  type: WithdrawalActionTypes.FETCH_WITHDRAWALS_SUCCESS,
  payload: { withdrawals, totalPages }
});

export const fetchWithdrawalsFailure = (error: string) => ({
  type: WithdrawalActionTypes.FETCH_WITHDRAWALS_FAILURE,
  payload: error
});

export const updateWithdrawalStatus = (id: string, status: string) => ({
  type: WithdrawalActionTypes.UPDATE_WITHDRAWAL_STATUS_REQUEST,
  payload: { id, status }
});

export const updateWithdrawalStatusSuccess = (withdrawal: Withdrawal) => ({
  type: WithdrawalActionTypes.UPDATE_WITHDRAWAL_STATUS_SUCCESS,
  payload: withdrawal
});

export const updateWithdrawalStatusFailure = (error: string) => ({
  type: WithdrawalActionTypes.UPDATE_WITHDRAWAL_STATUS_FAILURE,
  payload: error
});

export const setWithdrawalsFilters = (filters: WithdrawalsState['filters']) => ({
  type: WithdrawalActionTypes.SET_WITHDRAWALS_FILTERS,
  payload: filters
});
