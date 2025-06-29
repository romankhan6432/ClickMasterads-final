import { Achievement } from './types';

export const FETCH_ACHIEVEMENTS = 'FETCH_ACHIEVEMENTS';
export const FETCH_ACHIEVEMENTS_SUCCESS = 'FETCH_ACHIEVEMENTS_SUCCESS';
export const FETCH_ACHIEVEMENTS_FAILURE = 'FETCH_ACHIEVEMENTS_FAILURE';

export const UPDATE_ACHIEVEMENT = 'UPDATE_ACHIEVEMENT';
export const UPDATE_ACHIEVEMENT_SUCCESS = 'UPDATE_ACHIEVEMENT_SUCCESS';
export const UPDATE_ACHIEVEMENT_FAILURE = 'UPDATE_ACHIEVEMENT_FAILURE';

export const fetchAchievements = () => ({
    type: FETCH_ACHIEVEMENTS
});

export const fetchAchievementsSuccess = (achievements: Achievement[]) => ({
    type: FETCH_ACHIEVEMENTS_SUCCESS,
    payload: achievements
});

export const fetchAchievementsFailure = (error: string) => ({
    type: FETCH_ACHIEVEMENTS_FAILURE,
    payload: error
});

export const updateAchievement = (type: string, progress: number) => ({
    type: UPDATE_ACHIEVEMENT,
    payload: { type, progress }
});

export const updateAchievementSuccess = (achievements: Achievement[]) => ({
    type: UPDATE_ACHIEVEMENT_SUCCESS,
    payload: achievements
});

export const updateAchievementFailure = (error: string) => ({
    type: UPDATE_ACHIEVEMENT_FAILURE,
    payload: error
});
