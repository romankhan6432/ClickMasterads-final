import { WithdrawalsState, WithdrawalAction, WithdrawalActionTypes } from './types';

const initialState: WithdrawalsState = {
  list: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  filters: {}
};

export const withdrawalsReducer = (
  state = initialState,
  action: WithdrawalAction
): WithdrawalsState => {
  switch (action.type) {
    case WithdrawalActionTypes.FETCH_WITHDRAWALS_REQUEST:
    case WithdrawalActionTypes.UPDATE_WITHDRAWAL_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case WithdrawalActionTypes.FETCH_WITHDRAWALS_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload.withdrawals,
        totalPages: action.payload.totalPages
      };

    case WithdrawalActionTypes.UPDATE_WITHDRAWAL_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        list: state.list.map(withdrawal =>
          withdrawal.id === action.payload.id ? action.payload : withdrawal
        )
      };

    case WithdrawalActionTypes.FETCH_WITHDRAWALS_FAILURE:
    case WithdrawalActionTypes.UPDATE_WITHDRAWAL_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case WithdrawalActionTypes.SET_WITHDRAWALS_FILTERS:
      return {
        ...state,
        filters: action.payload,
        currentPage: 1 // Reset to first page when filters change
      };

    default:
      return state;
  }
};
