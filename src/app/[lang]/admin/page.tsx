'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  DashboardOutlined,
  UserOutlined,
  WalletOutlined,
  TeamOutlined,
  SettingOutlined,
  RedoOutlined,
  HistoryOutlined,
} from '@ant-design/icons';


import { useDispatch } from 'react-redux';
import { selectAdminStats, selectRecentActivities, selectAdminLoading } from '@/modules/private/admin/selectors';
import { fetchAdminStats, fetchRecentActivities } from '@/modules/private/admin/actions';
import { useSelector } from 'react-redux';


export default function AdminPage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const stats = useSelector(selectAdminStats);
  const recentActivities = useSelector(selectRecentActivities);
  const loading = useSelector(selectAdminLoading);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchRecentActivities());
  }, [dispatch]);


  const handleRefresh = () => {
    //dispatch(fetchDashboardStatsRequest());
    //dispatch(fetchRecentActivitiesRequest());
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8 bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 transition-all duration-300">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center">
          <DashboardOutlined className="mr-3 text-blue-400" />
          Dashboard Overview
        </h1>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 shadow-md
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}
        >
          <RedoOutlined className={`${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl sm:rounded-3xl border border-blue-500 p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:shadow-2xl transition-all group min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]">
          <div className="flex items-center">
            <div className="p-4 rounded-xl bg-blue-900/20">
              <UserOutlined className="text-blue-400 text-2xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Users</h2>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl sm:rounded-3xl border border-blue-500 p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:shadow-2xl transition-all group min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]">
          <div className="flex items-center">
            <div className="p-4 rounded-xl bg-green-900/20">
              <WalletOutlined className="text-green-400 text-2xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Withdrawals</h2>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalWithdrawals}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl sm:rounded-3xl border border-blue-500 p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:shadow-2xl transition-all group min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]">
          <div className="flex items-center">
            <div className="p-4 rounded-xl bg-yellow-900/20">
              <HistoryOutlined className="text-yellow-400 text-2xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Pending Withdrawals</h2>
              <p className="text-3xl font-bold text-white mt-1">{stats.pendingWithdrawals}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl sm:rounded-3xl border border-blue-500 p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:shadow-2xl transition-all group min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]">
          <div className="flex items-center">
            <div className="p-4 rounded-xl bg-purple-900/20">
              <TeamOutlined className="text-purple-400 text-2xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">New Users Today</h2>
              <p className="text-3xl font-bold text-white mt-1">{stats.newUsersLast24h}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/admin/users')}
              className="flex items-center p-5 bg-gray-800 rounded-xl hover:bg-blue-900/20 border border-gray-700 transition-all duration-300 group"
            >
              <div className="p-3 rounded-xl bg-blue-900/20 group-hover:bg-blue-900/40 transition-all duration-300">
                <UserOutlined className="text-blue-400 text-xl" />
              </div>
              <span className="ml-3 font-medium text-gray-300 group-hover:text-blue-400">Manage Users</span>
            </button>
            <button
              onClick={() => router.push('/admin/withdrawals')}
              className="flex items-center p-5 bg-gray-800 rounded-xl hover:bg-green-900/20 border border-gray-700 transition-all duration-300 group"
            >
              <div className="p-3 rounded-xl bg-green-900/20 group-hover:bg-green-900/40 transition-all duration-300">
                <WalletOutlined className="text-green-400 text-xl" />
              </div>
              <span className="ml-3 font-medium text-gray-300 group-hover:text-green-400">Process Withdrawals</span>
            </button>
            <button
              onClick={() => router.push('/admin/settings')}
              className="flex items-center p-5 bg-gray-800 rounded-xl hover:bg-gray-700 border border-gray-700 transition-all duration-300 group"
            >
              <div className="p-3 rounded-xl bg-gray-700 group-hover:bg-gray-600 transition-all duration-300">
                <SettingOutlined className="text-gray-400 text-xl" />
              </div>
              <span className="ml-3 font-medium text-gray-300">Settings</span>
            </button>
            <button
              onClick={() => router.push('/admin/history')}
              className="flex items-center p-5 bg-gray-800 rounded-xl hover:bg-purple-900/20 border border-gray-700 transition-all duration-300 group"
            >
              <div className="p-3 rounded-xl bg-purple-900/20 group-hover:bg-purple-900/40 transition-all duration-300">
                <HistoryOutlined className="text-purple-400 text-xl" />
              </div>
              <span className="ml-3 font-medium text-gray-300 group-hover:text-purple-400">History</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-100 flex items-center">
            <HistoryOutlined className="mr-2 text-gray-400" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity: any) => (
              <div key={activity.id} className="flex items-start p-3 rounded-xl hover:bg-gray-800 transition-all duration-300 group">
                <div className="w-2 h-2 mt-2 bg-green-500 rounded-full ring-4 ring-green-900/20"></div>
                <div className="flex-1 ml-4">
                  <p className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="flex items-center justify-center p-6 border border-dashed border-gray-700 rounded-xl text-gray-500">
                <HistoryOutlined className="mr-2" /> No recent activities
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
