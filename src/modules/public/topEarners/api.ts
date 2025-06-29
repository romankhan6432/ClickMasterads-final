import { API_CALL } from '@/lib/client';

export const topEarnersApi = {
    getTopEarners: async (period: 'today' | 'all') => {
        const { response } = await API_CALL({ 
            url: `/top-earners?period=${period}`
        });
        return response;
    }
};
