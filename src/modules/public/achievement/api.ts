import { API_CALL } from '@/lib/client';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const achievementApi = {
    getAchievements: async () => {
        const { response } = await API_CALL({ url : '/achievements'});
        return response
    },

    updateAchievement: async (type: string, progress: number) => {
        const response = await axios.put(`${API_URL}/achievements`, { type, progress });
        return response.data.achievements;
    }
};
