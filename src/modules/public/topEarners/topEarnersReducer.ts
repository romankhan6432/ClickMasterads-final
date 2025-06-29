import { TopEarnersState } from './types';
import {
    FETCH_TOP_EARNERS,
    FETCH_TOP_EARNERS_SUCCESS,
    FETCH_TOP_EARNERS_FAILURE
} from './topEarnersActions';

const initialState: TopEarnersState = {
    today: [],
    allTime: [],
    loading: false,
    error: null
};

export const topEarnersReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case FETCH_TOP_EARNERS:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_TOP_EARNERS_SUCCESS:
            return {
                ...state,
                today: action.payload.today,
                allTime: action.payload.allTime,
                loading: false
            };
        case FETCH_TOP_EARNERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};
