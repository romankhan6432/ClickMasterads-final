import { call, put, takeLatest, select, Effect } from 'redux-saga/effects';
import { WithdrawalActionTypes, Withdrawal } from './types';
import {
  fetchWithdrawalsSuccess,
  fetchWithdrawalsFailure,
  updateWithdrawalStatusSuccess,
  updateWithdrawalStatusFailure,
  updateWithdrawalStatus
} from './actions';
import { RootState } from '../../store';

// API response types
interface WithdrawalsResponse {
  withdrawals: Withdrawal[];
  totalPages: number;
}

// Replace these with actual API calls
const fetchWithdrawalsFromAPI = async (page: number, filters: Record<string, unknown>): Promise<WithdrawalsResponse> => {
  const response = await fetch(`/api/withdrawals?page=${page}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filters)
  });
  if (!response.ok) throw new Error('Failed to fetch withdrawals');
  return response.json();
};

const updateWithdrawalStatusAPI = async (id: string, status: string): Promise<Withdrawal> => {
  const response = await fetch(`/api/withdrawals/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error('Failed to update withdrawal status');
  return response.json();
};

function* fetchWithdrawalsSaga(): Generator<Effect, void, unknown> {
  try {
    const state = (yield select()) as RootState;
    const { currentPage, filters } = state.private.withdrawals;
    const response = (yield call(fetchWithdrawalsFromAPI, currentPage, filters)) as WithdrawalsResponse;
    yield put(fetchWithdrawalsSuccess(response.withdrawals, response.totalPages));
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(fetchWithdrawalsFailure(error.message));
    } else {
      yield put(fetchWithdrawalsFailure('An unknown error occurred'));
    }
  }
}

function* updateWithdrawalStatusSaga(action: ReturnType<typeof updateWithdrawalStatus>): Generator<Effect, void, unknown> {
  try {
    const { id, status } = action.payload;
    const updatedWithdrawal = (yield call(updateWithdrawalStatusAPI, id, status)) as Withdrawal;
    yield put(updateWithdrawalStatusSuccess(updatedWithdrawal));
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(updateWithdrawalStatusFailure(error.message));
    } else {
      yield put(updateWithdrawalStatusFailure('An unknown error occurred'));
    }
  }
}

export function* withdrawalsSaga(): Generator<Effect, void, unknown> {
  yield takeLatest(WithdrawalActionTypes.FETCH_WITHDRAWALS_REQUEST, fetchWithdrawalsSaga);
  yield takeLatest(WithdrawalActionTypes.UPDATE_WITHDRAWAL_STATUS_REQUEST, updateWithdrawalStatusSaga);
}
