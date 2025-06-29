// redux/settings/initialState.ts
import { SettingsState } from './types';

export const initialSettingsState: SettingsState = {
  maintenance: {
    isEnabled: false,
    message: '',
    allowedIps: [],
    startTime: null,
    endTime: null,
  },
  bot: {
    token: '',
    username: '',
    adminChatId: '',
  },
  smtp: {
    host: '',
    port: 0,
    username: '',
    password: '',
    secure: false,
  },
  site: {
    name: '',
    contactEmail: '',
    minWithdrawal: 0,
  },
  notifications: {
    email: false,
    withdrawal: false,
  },
};
