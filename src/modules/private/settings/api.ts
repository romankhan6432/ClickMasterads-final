'use client';

import axios from 'axios';
import { SettingsState } from './types';

export const fetchSettingsAPI = async (): Promise<SettingsState> => {
  const response = await axios.get('/api/admin/settings');
  return response.data;
};

export const saveSettingsAPI = async (settings: Partial<SettingsState>): Promise<SettingsState> => {
  const response = await axios.post('/api/admin/settings', settings);
  return response.data;
};
