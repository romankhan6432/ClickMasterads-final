export const FETCH_WITHDRAWAL_HISTORY = 'FETCH_WITHDRAWAL_HISTORY';
export const FETCH_WITHDRAWAL_HISTORY_SUCCESS = 'FETCH_WITHDRAWAL_HISTORY_SUCCESS';
export const FETCH_WITHDRAWAL_HISTORY_FAILURE = 'FETCH_WITHDRAWAL_HISTORY_FAILURE';

export const FETCH_WITHDRAWAL_TIMING = 'FETCH_WITHDRAWAL_TIMING';
export const FETCH_WITHDRAWAL_TIMING_SUCCESS = 'FETCH_WITHDRAWAL_TIMING_SUCCESS';
export const FETCH_WITHDRAWAL_TIMING_FAILURE = 'FETCH_WITHDRAWAL_TIMING_FAILURE';

export const fetchWithdrawalHistory = () => ({
    type: FETCH_WITHDRAWAL_HISTORY
});

export const fetchWithdrawalHistorySuccess = (history: any[]) => ({
    type: FETCH_WITHDRAWAL_HISTORY_SUCCESS,
    payload: history
});

export const fetchWithdrawalHistoryFailure = (error: string) => ({
    type: FETCH_WITHDRAWAL_HISTORY_FAILURE,
    payload: error
});

export const fetchWithdrawalTiming = () => ({
    type: FETCH_WITHDRAWAL_TIMING
});

export const fetchWithdrawalTimingSuccess = (timing: any) => ({
    type: FETCH_WITHDRAWAL_TIMING_SUCCESS,
    payload: timing
});

export const fetchWithdrawalTimingFailure = (error: string) => ({
    type: FETCH_WITHDRAWAL_TIMING_FAILURE,
    payload: error
});
