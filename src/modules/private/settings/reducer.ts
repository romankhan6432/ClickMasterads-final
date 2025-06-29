'use client';

import { AnyAction } from 'redux';
import { LOAD_SETTINGS, SAVE_SETTINGS, SettingsState    } from './types';
import { initialSettingsState } from './initialState';

export const settingsReducer = ( state: SettingsState = initialSettingsState,  action: AnyAction): SettingsState => {
  switch (action.type) {
    case 'settings/load_success':
      return { ...state, ...action.payload };

    case SAVE_SETTINGS:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
