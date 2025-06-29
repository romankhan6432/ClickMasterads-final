import { AchievementState } from './types';
import {
    FETCH_ACHIEVEMENTS,
    FETCH_ACHIEVEMENTS_SUCCESS,
    FETCH_ACHIEVEMENTS_FAILURE,
    UPDATE_ACHIEVEMENT,
    UPDATE_ACHIEVEMENT_SUCCESS,
    UPDATE_ACHIEVEMENT_FAILURE
} from './achievementActions';

const initialState: AchievementState = {
    achievements: [],
    loading: false,
    error: null
};

export const achievementReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case FETCH_ACHIEVEMENTS:
        case UPDATE_ACHIEVEMENT:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_ACHIEVEMENTS_SUCCESS:
        case UPDATE_ACHIEVEMENT_SUCCESS:
            return {
                ...state,
                achievements: action.payload,
                loading: false
            };
        case FETCH_ACHIEVEMENTS_FAILURE:
        case UPDATE_ACHIEVEMENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};
