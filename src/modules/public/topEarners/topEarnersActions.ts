import { TopEarner } from './types';

export const FETCH_TOP_EARNERS = 'FETCH_TOP_EARNERS';
export const FETCH_TOP_EARNERS_SUCCESS = 'FETCH_TOP_EARNERS_SUCCESS';
export const FETCH_TOP_EARNERS_FAILURE = 'FETCH_TOP_EARNERS_FAILURE';

export const fetchTopEarners = (timeframe: 'today' | 'all') => ({
    type: FETCH_TOP_EARNERS,
    payload: timeframe
});

export const fetchTopEarnersSuccess = (data: { today: TopEarner[], allTime: TopEarner[] }) => ({
    type: FETCH_TOP_EARNERS_SUCCESS,
    payload: data
});

export const fetchTopEarnersFailure = (error: string) => ({
    type: FETCH_TOP_EARNERS_FAILURE,
    payload: error
});
