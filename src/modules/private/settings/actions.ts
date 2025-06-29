'use client';

import { SettingsState } from './types';

export const LOAD_SETTINGS = 'settings/load';
export const LOAD_SETTINGS_SUCCESS = 'settings/load_success';
export const LOAD_SETTINGS_FAILURE = 'settings/load_failure';

export const SAVE_SETTINGS = 'settings/save';
export const SAVE_SETTINGS_SUCCESS = 'settings/save_success';
export const SAVE_SETTINGS_FAILURE = 'settings/save_failure';

export const loadSettings = () => ({ type: LOAD_SETTINGS });
export const saveSettings = (payload: Partial<SettingsState>) => ({ type: SAVE_SETTINGS, payload });
