import axios from 'axios';
import { WithdrawalHistory, WithdrawalTiming } from './types';
import { API_CALL } from '@/lib/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const withdrawalApi = {
    getWithdrawalHistory: async ()  => {
        const { response } = await API_CALL({ url : '/withdrawals'});
        return response?.result
    },

    createWithdrawal: async (data: {
        method: 'bkash' | 'nagad' | 'bitget' | 'binance';
        amount: number;
        recipient: string;
        network?: string;
    }) => {
        const { response } = await API_CALL({ url : '/withdrawals', method : 'POST',   body : data });
        return response
        
    },

    cancelWithdrawal: async (id: string) => {
        const response = await axios.delete(`${API_URL}/withdrawals`, {
            data: { id }
        });
        return response.data;
    },

    getWithdrawalTiming: async ()  => {
        const { response } = await API_CALL({ url : '/withdrawals/timing'});
        return response
    }
};
