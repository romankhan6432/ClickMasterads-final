'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  BellOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function NotificationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Mock notifications data - replace with actual data from your Redux store
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Withdrawal Processed',
      message: 'User withdrawal request #1234 has been successfully processed',
      timestamp: '2025-04-05T18:30:00',
      read: false,
    },
    {
      id: 2,
      type: 'info',
      title: 'New User Registration',
      message: 'A new user has registered on the platform',
      timestamp: '2025-04-05T17:45:00',
      read: true,
    },
    {
      id: 3,
      type: 'warning',
      title: 'System Warning',
      message: 'High server load detected',
      timestamp: '2025-04-05T16:20:00',
      read: false,
    },
    {
      id: 4,
      type: 'error',
      title: 'Payment Failed',
      message: 'Payment processing failed for transaction #5678',
      timestamp: '2025-04-05T15:10:00',
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlined className="text-green-400" />;
      case 'info':
        return <InfoCircleOutlined className="text-blue-400" />;
      case 'warning':
        return <WarningOutlined className="text-yellow-400" />;
      case 'error':
        return <CloseCircleOutlined className="text-red-400" />;
      default:
        return <BellOutlined className="text-gray-400" />;
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    // Implement your refresh logic here
    setTimeout(() => setLoading(false), 1000);
  };

  const handleMarkAllRead = () => {
    // Implement mark all as read logic
  };

  const handleClearAll = () => {
    // Implement clear all notifications logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-8">
      <div className="ml-[5%] mx-auto">
        <div className="flex justify-between items-center mb-8 bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center">
            <BellOutlined className="mr-3 text-blue-400" />
            Notifications
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all duration-300"
            >
              <CheckCircleOutlined />
              Mark All Read
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all duration-300"
            >
              <DeleteOutlined />
              Clear All
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}
            >
              <ReloadOutlined className={`${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6">
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start p-4 rounded-xl transition-all duration-300 hover:bg-gray-800 border border-gray-800 
                    ${notification.read ? 'opacity-75' : ''}`}
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-100">{notification.title}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-400">{notification.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center p-8 text-gray-500">
                <BellOutlined className="mr-2" /> No notifications
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
