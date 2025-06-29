'use client';

import { useState } from 'react';
import { UserIcon, WalletIcon, LockClosedIcon, UsersIcon } from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
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
  } | null;
  onUserUpdate: () => void;
}

export default function UserDetailsModal({ isOpen, onClose, user, onUserUpdate }: UserDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceOperation, setBalanceOperation] = useState<'add' | 'subtract'>('add');
  const [selectedRole, setSelectedRole] = useState(user?.role || '');
  const [error, setError] = useState('');

  const handleUpdateBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !balanceAmount) return;
    
    try {
      setLoading(true);
      setError('');
      await fetch(`/api/admin/users/${user._id}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          balance : parseFloat(balanceAmount),
          operation: balanceOperation
        })
      });
      
      onUserUpdate();
      setBalanceAmount('');
    } catch (error) {
      setError('Failed to update balance');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedRole) return;
    
    try {
      setLoading(true);
      setError('');
      await fetch(`/api/admin/users/${user._id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole })
      });
      
      onUserUpdate();
    } catch (error) {
      setError('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async () => {
    if (!user) return;
    
    if (!confirm(`Are you sure you want to ${user.status === 'active' ? 'ban' : 'activate'} this user?`)) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await fetch(`/api/admin/users/${user._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: user.status === 'active' ? 'banned' : 'active'
        })
      });
      
      onUserUpdate();
    } catch (error) {
      setError('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <UserIcon className="w-4 h-4" />
          Details
        </span>
      ),
      children: (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Full Name</h4>
              <p className="text-base text-gray-100 font-medium">{user?.fullName}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Username</h4>
              <p className="text-base text-gray-100 font-medium">{user?.username}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Email</h4>
              <p className="text-base text-gray-100 font-medium">{user?.email}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Telegram ID</h4>
              <p className="text-base text-gray-100 font-medium">{user?.telegramId}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Status</h4>
              <p className={`text-base font-medium inline-flex items-center px-3 py-1 rounded-full ${
                user?.status === 'active' 
                  ? 'bg-green-400/10 text-green-400' 
                  : 'bg-red-400/10 text-red-400'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  user?.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                }`}></span>
                {(user?.status || '').charAt(0).toUpperCase() + (user?.status || '').slice(1)}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Role</h4>
              <p className="text-base text-gray-100 font-medium capitalize">{user?.role}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Balance</h4>
              <p className="text-base text-gray-100 font-medium">${user?.balance.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Total Earnings</h4>
              <p className="text-base text-gray-100 font-medium">${user?.totalEarnings.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Ads Watched</h4>
              <p className="text-base text-gray-100 font-medium">{user?.adsWatched}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Last Watch Time</h4>
              <p className="text-base text-gray-100 font-medium">
                {user?.lastWatchTime ? new Date(user.lastWatchTime).toLocaleString() : 'Never'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Joined Date</h4>
              <p className="text-base text-gray-100 font-medium">{new Date(user?.createdAt || '').toLocaleDateString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Last Updated</h4>
              <p className="text-base text-gray-100 font-medium">{new Date(user?.updatedAt || '').toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <WalletIcon className="w-4 h-4" />
          Balance
        </span>
      ),
      children: (
        <form onSubmit={handleUpdateBalance} className="space-y-6 animate-fadeIn">
          <div className="p-4 rounded-lg bg-gray-800/50">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Amount
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={balanceAmount}
              onChange={(e) => setBalanceAmount(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="p-4 rounded-lg bg-gray-800/50">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Operation
            </label>
            <select
              value={balanceOperation}
              onChange={(e) => setBalanceOperation(e.target.value as 'add' | 'subtract')}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="add">Add to Balance</option>
              <option value="subtract">Subtract from Balance</option>
            </select>
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-3 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </span>
            ) : 'Update Balance'}
          </button>
        </form>
      ),
    },
    {
      key: '3',
      label: (
        <span className="flex items-center gap-2">
          <UsersIcon className="w-4 h-4" />
          Role
        </span>
      ),
      children: (
        <form onSubmit={handleUpdateRole} className="space-y-6 animate-fadeIn">
          <div className="p-4 rounded-lg bg-gray-800/50">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              User Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-3 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </span>
            ) : 'Update Role'}
          </button>
        </form>
      ),
    },
    {
      key: '4',
      label: (
        <span className="flex items-center gap-2">
          <LockClosedIcon className="w-4 h-4" />
          Status
        </span>
      ),
      children: (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-4 rounded-lg bg-gray-800/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-400">Current Status</h4>
              <span className={`inline-flex items-center px-3 py-1 rounded-full ${
                user?.status === 'active' 
                  ? 'bg-green-400/10 text-green-400' 
                  : 'bg-red-400/10 text-red-400'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  user?.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                }`}></span>
                {(user?.status || '').charAt(0).toUpperCase() + (user?.status || '').slice(1)}
              </span>
            </div>
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <button
            onClick={handleToggleBan}
            disabled={loading}
            className={`w-full px-4 py-3 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200
              ${user?.status === 'active'
                ? 'text-white bg-red-500 hover:bg-red-600 focus:ring-red-500'
                : 'text-white bg-green-500 hover:bg-green-600 focus:ring-green-500'
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </span>
            ) : user?.status === 'active' ? 'Ban User' : 'Activate User'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          <span>User Details</span>
        </div>
      }
      width="max-w-4xl"
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
      />
    </Modal>
  );
} 