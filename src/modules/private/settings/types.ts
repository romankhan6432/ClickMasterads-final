'use client';

export const LOAD_SETTINGS = 'settings/load';
export const SAVE_SETTINGS = 'settings/save';

export interface MaintenanceSettings {
  isEnabled: boolean;
  message: string;
  allowedIps: string[];
  startTime: string | null;
  endTime: string | null;
}

export interface BotConfig {
  token: string;
  username: string;
  adminChatId: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  secure: boolean;
}

export interface SiteConfig {
  name: string;
  contactEmail: string;
  minWithdrawal: number;
}

export interface NotificationConfig {
  email: boolean;
  withdrawal: boolean;
}

export interface SettingsState {
  maintenance: MaintenanceSettings;
  bot: BotConfig;
  smtp: SmtpConfig;
  site: SiteConfig;
  notifications: NotificationConfig;
}
