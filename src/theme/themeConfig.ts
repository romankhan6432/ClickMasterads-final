import { ThemeConfig } from 'antd';

const baseToken = {
  borderRadius: 6,
  colorPrimary: '#1890ff',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',
};

const darkToken = {
  ...baseToken,
  colorBgBase: '#0A0A0A',
  colorBgContainer: '#141414',
  colorBgElevated: '#1f1f1f',
  colorBgLayout: '#0A0A0A',
  colorText: 'rgba(255,255,255,0.85)',
  colorTextSecondary: 'rgba(255,255,255,0.65)',
  colorBorder: 'rgba(255,255,255,0.1)',
  colorBorderSecondary: 'rgba(255,255,255,0.1)',
};

const lightToken = {
  ...baseToken,
  colorBgBase: '#ffffff',
  colorBgContainer: '#ffffff',
  colorBgElevated: '#ffffff',
  colorBgLayout: '#f5f5f5',
  colorText: 'rgba(0,0,0,0.85)',
  colorTextSecondary: 'rgba(0,0,0,0.65)',
  colorBorder: '#d9d9d9',
  colorBorderSecondary: '#f0f0f0',
};

const darkComponents = {
  Layout: {
    headerBg: '#0A0A0A',
    bodyBg: '#0A0A0A',
    triggerBg: '#141414',
  },
  Card: {
    colorBgContainer: '#141414',
    colorBorderSecondary: 'rgba(255,255,255,0.1)',
  },
  Input: {
    colorBgContainer: '#1f1f1f',
    colorBorder: 'rgba(255,255,255,0.1)',
  },
  Select: {
    colorBgContainer: '#1f1f1f',
    colorBorder: 'rgba(255,255,255,0.1)',
    controlItemBgActive: '#141414',
  },
  Table: {
    colorBgContainer: '#141414',
    colorText: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
  Menu: {
    darkItemBg: '#0A0A0A',
    darkSubMenuItemBg: '#141414',
  },
  Button: {
    controlHeight: 32,
  },
};

const lightComponents = {
  Layout: {
    headerBg: '#ffffff',
    bodyBg: '#f5f5f5',
    triggerBg: '#fff',
  },
  Card: {
    colorBgContainer: '#ffffff',
    colorBorderSecondary: '#f0f0f0',
  },
  Input: {
    colorBgContainer: '#ffffff',
    colorBorder: '#d9d9d9',
  },
  Select: {
    colorBgContainer: '#ffffff',
    colorBorder: '#d9d9d9',
    controlItemBgActive: '#f5f5f5',
  },
  Table: {
    colorBgContainer: '#ffffff',
    colorText: 'rgba(0,0,0,0.85)',
    fontSize: 14,
  },
  Menu: {
    itemBg: '#ffffff',
    subMenuItemBg: '#f5f5f5',
  },
  Button: {
    controlHeight: 32,
  },
};

const theme: ThemeConfig = {
  token: darkToken,
  components: darkComponents,
};

export const getThemeConfig = (isDark: boolean): ThemeConfig => ({
  token: isDark ? darkToken : lightToken,
  components: isDark ? darkComponents : lightComponents,
});

export default theme;
