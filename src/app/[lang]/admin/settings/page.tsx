'use client';

import { useState, useEffect, FormEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { message } from 'antd';
import {
  DashboardOutlined,
 
  SettingOutlined,
  
  SaveOutlined,
} from '@ant-design/icons';

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // Maintenance Settings State
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [allowedIps, setAllowedIps] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Bot Configuration State
  const [botToken, setBotToken] = useState('');
  const [botUsername, setBotUsername] = useState('');
  const [adminChatId, setAdminChatId] = useState('');

  // Load settings on page load
  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (!response.ok) {
        throw new Error('Failed to load settings');
      }

      const data = await response.json();

      // Load maintenance settings
      const maintenanceResponse = await fetch('/api/admin/maintenance');
      if (maintenanceResponse.ok) {
        const maintenanceData = await maintenanceResponse.json();
        setMaintenanceEnabled(maintenanceData.isEnabled);
        setMaintenanceMessage(maintenanceData.message || '');
        setAllowedIps(maintenanceData.allowedIps?.join(', ') || '');
        setStartTime(maintenanceData.startTime ? new Date(maintenanceData.startTime).toISOString().slice(0, 16) : '');
        setEndTime(maintenanceData.endTime ? new Date(maintenanceData.endTime).toISOString().slice(0, 16) : '');
      }

      // Update bot settings
      if (data.bot_config) {
        const botConfig = JSON.parse(data.bot_config.value);
        setBotToken(botConfig.token || '');
        setBotUsername(botConfig.username || '');
        setAdminChatId(botConfig.adminChatId || '');
      }

      // Update SMTP settings
      if (data.smtp_config) {
        const smtpConfig = JSON.parse(data.smtp_config.value);
        setSmtpHost(smtpConfig.host || '');
        setSmtpPort(smtpConfig.port?.toString() || '');
        setSmtpUsername(smtpConfig.username || '');
        setSmtpPassword(smtpConfig.password || '');
        setSmtpSecure(smtpConfig.secure || false);
      }

      // Update site settings
      if (data.site_config) {
        const siteConfig = JSON.parse(data.site_config.value);
        setSiteName(siteConfig.name || '');
        setContactEmail(siteConfig.contactEmail || '');
        setMinWithdrawal(siteConfig.minWithdrawal?.toString() || '');
      }

      // Update notification settings
      if (data.notification_config) {
        const notificationConfig = JSON.parse(data.notification_config.value);
        setEmailNotifications(notificationConfig.email || false);
        setWithdrawalNotifications(notificationConfig.withdrawal || false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      message.error('Failed to load settings');
    }
  };

  // Load settings when component mounts
  useEffect(() => {
    loadSettings();
  }, []);

  // SMTP Configuration State
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(false);

  // Site Settings State
  const [siteName, setSiteName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [minWithdrawal, setMinWithdrawal] = useState('');

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [withdrawalNotifications, setWithdrawalNotifications] = useState(false);
 
  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save maintenance settings
      await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isEnabled: maintenanceEnabled,
          message: maintenanceMessage,
          allowedIps: allowedIps.split(',').map(ip => ip.trim()).filter(ip => ip),
          startTime: startTime ? new Date(startTime) : null,
          endTime: endTime ? new Date(endTime) : null
        })
      });

      const settings = {
        bot: {
          token: botToken,
          username: botUsername,
          adminChatId: adminChatId
        },
        smtp: {
          host: smtpHost,
          port: parseInt(smtpPort),
          username: smtpUsername,
          password: smtpPassword,
          secure: smtpSecure
        },
        site: {
          name: siteName,
          contactEmail,
          minWithdrawal: parseFloat(minWithdrawal)
        },
        notifications: {
          email: emailNotifications,
          withdrawal: withdrawalNotifications
        }
      };

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      message.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    
          <form onSubmit={handleSaveSettings} className="ml-[5%] p-8">
            <div className="flex justify-between items-center mb-8 bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 transition-all duration-300">
              <h1 className="text-2xl font-bold text-gray-100 flex items-center">
                <SettingOutlined className="mr-3 text-green-400" />
                <span className="text-green-400">Settings</span>
              </h1>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/admin')}
                  className="flex items-center gap-2 px-6 py-3 text-green-400 rounded-xl transition-all duration-300 shadow-md"
                  style={{ backgroundColor: 'rgba(163, 163, 163, 0.52)' }}
                >
                  <DashboardOutlined />
                  <span className="text-green-400">Dashboard</span>
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 shadow-md
                    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}
                >
                  <SaveOutlined className={`${loading ? 'animate-spin' : ''}`} />
                  Save Changes
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Maintenance Settings - moved to top */}
              <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-100">Maintenance Mode</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                    <div>
                      <h3 className="font-medium text-gray-100">Maintenance Mode</h3>
                      <p className="text-sm text-gray-400">Enable maintenance mode to restrict access to the site</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={maintenanceEnabled}
                        onChange={(e) => setMaintenanceEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Maintenance Message</label>
                    <textarea
                      value={maintenanceMessage}
                      onChange={(e) => setMaintenanceMessage(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter maintenance message"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Allowed IPs (comma-separated)</label>
                    <input
                      type="text"
                      value={allowedIps}
                      onChange={(e) => setAllowedIps(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter allowed IPs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Start Time</label>
                      <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">End Time</label>
                      <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bot Configuration */}
              <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-100">Bot Configuration</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Bot Token</label>
                    <input
                      type="password"
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter Telegram bot token"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Bot Username</label>
                    <input
                      type="text"
                      value={botUsername}
                      onChange={(e) => setBotUsername(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="@YourBotUsername"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Admin Chat ID</label>
                    <input
                      type="text"
                      value={adminChatId}
                      onChange={(e) => setAdminChatId(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter admin chat ID"
                    />
                  </div>
                </div>
              </div>

              {/* SMTP Configuration */}
              <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-100">SMTP Configuration</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">SMTP Host</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">SMTP Port</label>
                    <input
                      type="number"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">SMTP Username</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter SMTP username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">SMTP Password</label>
                    <input
                      type="password"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter SMTP password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">From Email</label>
                    <input
                      type="email"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="noreply@example.com"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={withdrawalNotifications}
                        onChange={(e) => setWithdrawalNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="text-sm font-medium text-gray-400">Enable SSL/TLS</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-100">General Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Site Name</label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter site name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter contact email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Minimum Withdrawal Amount</label>
                    <input
                      type="number"
                      value={minWithdrawal}
                      onChange={(e) => setMinWithdrawal(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter minimum amount"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-100">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                    <div>
                      <h3 className="font-medium text-gray-100">Email Notifications</h3>
                      <p className="text-sm text-gray-400">Receive email notifications for important updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                    <div>
                      <h3 className="font-medium text-gray-100">Withdrawal Notifications</h3>
                      <p className="text-sm text-gray-400">Get notified for new withdrawal requests</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={withdrawalNotifications}
                        onChange={(e) => setWithdrawalNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
     
  );
}
