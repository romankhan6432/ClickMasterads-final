'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DashboardOutlined,
  WalletOutlined,
  CreditCardOutlined,
  SettingOutlined,
  BellOutlined,
  TeamOutlined,
  HistoryOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { API_CALL } from '@/lib/client';

import { message } from 'antd';
import UserDetailsModal from '../../components/modals/UserDetailsModal';
import { Table, Card } from 'antd';


interface User {
  _id: string;
  fullName: string;
  telegramId: string;
  status: 'active' | 'banned';
  username: string;
  email: string;
  role: string;
  balance: number;
  totalEarnings: number;
  lastWatchTime: string | null;
  adsWatched: number;
  lastResetDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalUsers: number;
  totalBalance: number;
  totalEarnings: number;
  totalAdsWatched: number;
  newUsersLast24h: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
}

export default function UsersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API_CALL({ url: '/admin/users' });
      setUsers(res.response?.result?.users || []);
      setStats(res.response?.result?.stats || null);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsUserDetailsModalOpen(true);
  };

  const handleUserUpdate = () => {
    fetchUsers();
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await API_CALL({
        url: `/admin/users/${userId}`,
        method: 'DELETE'
      });
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const filteredUsers = users?.filter(user =>
    user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Users'
    },
    {
      key: '/admin/withdrawals',
      icon: <WalletOutlined />,
      label: 'Withdrawals'
    },
    {
      key: '/admin/payment-methods',
      icon: <CreditCardOutlined />,
      label: 'Payment Methods'
    },
    {
      key: '/admin/notifications',
      icon: <BellOutlined />,
      label: 'Notifications'
    },
    {
      key: '/admin/roles',
      icon: <TeamOutlined />,
      label: 'Roles'
    },
    {
      key: '/admin/history',
      icon: <HistoryOutlined />,
      label: 'History'
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Settings'
    }
  ];

  // Columns for Ant Design Table
  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: User) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
            <UserOutlined className="text-gray-400" />
          </div>
          <div className="ml-3">
            <span className="font-medium text-gray-100">{text}</span>
            <p className="text-sm text-gray-400">{record.fullName}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string, record: User) => (
        <div className="flex flex-col">
          <span className="text-gray-300">{text}</span>
          <span className="text-sm text-gray-400">ID: {record.telegramId}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${status === 'active'
            ? 'bg-green-900/20 text-green-400'
            : 'bg-red-900/20 text-red-400'
          }`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <span className="text-xs text-blue-400 capitalize">{role}</span>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number, record: User) => (
        <div className="flex flex-col">
          <span className="text-gray-300">${balance.toFixed(2)}</span>
          <span className="text-sm text-gray-400">
            Total: ${record.totalEarnings.toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      title: 'Joined Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string, record: User) => (
        <div className="flex flex-col">
          <span className="text-gray-300">{new Date(date).toLocaleDateString()}</span>
          <span className="text-sm text-gray-400">
            Ads: {record.adsWatched}
          </span>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleViewUser(record)}
            className="p-2 text-green-400 hover:text-green-500 transition-colors duration-200"
            title="View Details"
          >
            <EyeOutlined />
          </button>
          <button
            onClick={() => handleDeleteUser(record._id)}
            className="p-2 text-red-100 hover:bg-red-100 hover:text-white transition-colors duration-200"
            title="Delete User"
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (

  <>
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center">
          <UserOutlined className="mr-3 text-blue-400" />
          Users Management
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setLoading(true)}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl transition-all duration-300 border border-gray-700 hover:bg-gray-700
                    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}
          >
            <ReloadOutlined className={`${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => {/* Handle add user */ }}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl transition-all duration-300 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <PlusOutlined />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card
          bordered={false}
          className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl sm:rounded-3xl border-blue-500 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] shadow-2xl"
          bodyStyle={{ padding: 0 }}
        >
          <div className="flex items-center p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6">
            <div className="p-4 rounded-xl bg-blue-900/20">
              <UserOutlined className="text-blue-400 text-2xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Users</h2>
              <p className="text-3xl font-bold text-white mt-1">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </Card>
        <Card
          bordered={false}
          className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl sm:rounded-3xl border-blue-500 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] shadow-2xl"
          bodyStyle={{ padding: 0 }}
        >
          <div className="flex items-center p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6">
            <div className="p-4 rounded-xl bg-green-900/20">
              <DashboardOutlined className="text-green-400 text-2xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Earnings</h2>
              <p className="text-3xl font-bold text-white mt-1">${stats?.totalEarnings?.toFixed(2) || 0}</p>
            </div>
          </div>
        </Card>
        <Card
          bordered={false}
          className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl sm:rounded-3xl border-blue-500 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] shadow-2xl"
          bodyStyle={{ padding: 0 }}
        >
          <div className="flex items-center p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6">
            <div className="p-4 rounded-xl bg-yellow-900/20">
              <TeamOutlined className="text-yellow-400 text-2xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">New Users (24h)</h2>
              <p className="text-3xl font-bold text-white mt-1">{stats?.newUsersLast24h || 0}</p>
            </div>
          </div>
        </Card>
        <Card
          bordered={false}
          className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl sm:rounded-3xl border-blue-500 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] shadow-2xl"
          bodyStyle={{ padding: 0 }}
        >
          <div className="flex items-center p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6">
            <div className="p-4 rounded-xl bg-purple-900/20">
              <HistoryOutlined className="text-purple-400 text-2xl" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Ads Watched</h2>
              <p className="text-3xl font-bold text-white mt-1">{stats?.totalAdsWatched || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300"
          />
          <SearchOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-800 overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="bg-black rounded-2xl shadow-lg border-none overflow-hidden"
        />
      </div>


      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isUserDetailsModalOpen}
        onClose={() => setIsUserDetailsModalOpen(false)}
        user={selectedUser}
        onUserUpdate={handleUserUpdate}
      />
   </>
  );
}
