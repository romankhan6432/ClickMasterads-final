import { WithdrawalState } from './types';
import {
    FETCH_WITHDRAWAL_HISTORY,
    FETCH_WITHDRAWAL_HISTORY_SUCCESS,
    FETCH_WITHDRAWAL_HISTORY_FAILURE,
    FETCH_WITHDRAWAL_TIMING,
    FETCH_WITHDRAWAL_TIMING_SUCCESS,
    FETCH_WITHDRAWAL_TIMING_FAILURE
} from './withdrawalActions';

const initialState: WithdrawalState = {
    withdrawalHistory: [],
    timing: null,
    loading: false,
    error: null
};

export const withdrawalReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case FETCH_WITHDRAWAL_HISTORY:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_WITHDRAWAL_HISTORY_SUCCESS:
            return {
                ...state,
                withdrawalHistory: action.payload,
                loading: false
            };
        case FETCH_WITHDRAWAL_HISTORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case FETCH_WITHDRAWAL_TIMING:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_WITHDRAWAL_TIMING_SUCCESS:
            return {
                ...state,
                timing: action.payload,
                loading: false
            };
        case FETCH_WITHDRAWAL_TIMING_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};
