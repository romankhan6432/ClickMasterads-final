'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  RedoOutlined,
  DashboardOutlined,
  UserOutlined,
  WalletOutlined,
  CreditCardOutlined,
  SettingOutlined,
  BellOutlined,
  TeamOutlined,
  HistoryOutlined,
  LinkOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { API_CALL } from '@/lib/client';
import { toast } from 'react-toastify';

interface DirectLink {
  _id: string;
  url: string;
  title: string;
  clicks: number;
  status: 'active' | 'inactive';
  createdAt: string;
  rewardPerClick: number;
  totalEarnings: number;
  userId: {
    email: string;
    username: string;
  };
}

export default function DirectLinkPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<DirectLink[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLink, setEditingLink] = useState<DirectLink | null>(null);
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    rewardPerClick: 0.001,
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await API_CALL({ url: '/direct-links' });
      setLinks(res.response?.result || [] as any);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async () => {
    try {
      await API_CALL({
        url: '/direct-links',
        method: 'POST',
        body: {
          url: formData.url,
          title: formData.title,
          rewardPerClick: formData.rewardPerClick
        },
      });
      setShowCreateModal(false);
      setFormData({ url: '', title: '', rewardPerClick: 0.001 });
      fetchLinks();
      toast.success('Link created successfully');
    } catch (error) {
      console.error('Error creating link:', error);
      toast.error('Failed to create link');
    }
  };

  const handleUpdateLink = async (id: string, data: Partial<DirectLink>) => {
    try {
      await API_CALL({
        url: '/direct-links',
        method: 'PUT',
        body: { id, ...data },
      });
      setEditingLink(null);
      fetchLinks();
      toast.success('Link updated successfully');
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error('Failed to update link');
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      await API_CALL({
        url: '/direct-links',
        method: 'DELETE',
        params: { id }
      });
      fetchLinks();
      toast.success('Link deleted successfully');
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard');
  };

  const filteredLinks = links.filter(link => {
    const matchesSearch = (
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.userId.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = selectedStatus === 'all' || link.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalLinks: links.length,
    activeLinks: links.filter(l => l.status === 'active').length,
    totalClicks: links.reduce((sum, l) => sum + l.clicks, 0),
    totalEarnings: links.reduce((sum, l) => sum + l.totalEarnings, 0)
  };

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
      key: '/admin/direct-link',
      icon: <LinkOutlined />,
      label: 'Direct Links'
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

  return (


    <main className="ml-[6%] p-8">
      <div className="flex justify-between items-center mb-8 bg-gray-800/80 p-6 rounded-2xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400">
            <LinkOutlined className="text-2xl" />
          </div>
          Direct Links Management
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-600/20 font-medium"
          >
            <PlusOutlined />
            Create Link
          </button>
          <button
            onClick={fetchLinks}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-600/20 font-medium"
          >
            <RedoOutlined className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/80 rounded-2xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-gray-600 group">
          <div className="flex items-center">
            <div className="p-4 rounded-xl bg-blue-900/30 group-hover:bg-blue-900/40 transition-all duration-300">
              <LinkOutlined className="text-blue-400 text-2xl group-hover:scale-110 transition-transform" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors">Total Links</h2>
              <p className="text-3xl font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">{stats.totalLinks}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/80 rounded-2xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-gray-600 group">
          <div className="flex items-center">
            <div className="p-4 rounded-xl bg-green-900/30 group-hover:bg-green-900/40 transition-all duration-300">
              <WalletOutlined className="text-green-400 text-2xl group-hover:scale-110 transition-transform" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors">Total Earnings</h2>
              <p className="text-3xl font-bold text-white mt-1 group-hover:text-green-400 transition-colors">
                ${stats.totalEarnings}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/80 rounded-2xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-gray-600 group">
          <div className="flex items-center">
            <div className="p-4 rounded-xl bg-yellow-900/30 group-hover:bg-yellow-900/40 transition-all duration-300">
              <LinkOutlined className="text-yellow-400 text-2xl group-hover:scale-110 transition-transform" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors">Total Clicks</h2>
              <p className="text-3xl font-bold text-white mt-1 group-hover:text-yellow-400 transition-colors">{stats.totalClicks}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/80 rounded-2xl shadow-lg border border-gray-700 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-3">
            <LinkOutlined className="text-blue-400" />
            Direct Links
          </h2>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/80 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-2 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-4 text-gray-400 font-medium">Title/URL</th>
                <th className="pb-4 text-gray-400 font-medium">Clicks</th>
                <th className="pb-4 text-gray-400 font-medium">Reward/Click</th>
                <th className="pb-4 text-gray-400 font-medium">Total Earned</th>
                <th className="pb-4 text-gray-400 font-medium">Status</th>
                <th className="pb-4 text-gray-400 font-medium">Created</th>
                <th className="pb-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredLinks.map((link) => (
                <tr key={link._id} className="group hover:bg-gray-700/50 transition-colors">
                  <td className="py-4 px-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-100 group-hover:text-white transition-colors">{link.title}</span>
                      <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors">{link.url}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="font-medium text-gray-100 group-hover:text-white transition-colors">{link.clicks}</span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="font-medium text-green-400">${link.rewardPerClick}</span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="font-medium text-green-400">${link.totalEarnings}</span>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${link.status === 'active'
                        ? 'bg-green-900/40 text-green-400 group-hover:bg-green-900/60'
                        : 'bg-red-900/40 text-red-400 group-hover:bg-red-900/60'
                      } transition-colors`}>
                      {link.status === 'active' ? '● Active' : '● Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(link.url)}
                        className="p-2 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-200"
                        title="Copy URL"
                      >
                        <CopyOutlined />
                      </button>
                      <button
                        onClick={() => setEditingLink(link)}
                        className="p-2 hover:bg-green-600/30 text-green-400 hover:text-green-300 rounded-lg transition-all duration-200"
                        title="Edit Link"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link._id)}
                        className="p-2 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200"
                        title="Delete Link"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingLink) && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700 transform transition-all duration-300 scale-100 animate-slideIn">
            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3">
              {editingLink ? <EditOutlined className="text-blue-400" /> : <PlusOutlined className="text-green-400" />}
              {editingLink ? 'Edit Link' : 'Create New Link'}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">URL</label>
                <input
                  type="url"
                  value={editingLink ? editingLink.url : formData.url}
                  onChange={(e) => editingLink
                    ? setEditingLink({ ...editingLink, url: e.target.value })
                    : setFormData({ ...formData, url: e.target.value })
                  }
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={editingLink ? editingLink.title : formData.title}
                  onChange={(e) => editingLink
                    ? setEditingLink({ ...editingLink, title: e.target.value })
                    : setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Link Title"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Reward Per Click ($)</label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={editingLink ? editingLink.rewardPerClick : formData.rewardPerClick}
                  onChange={(e) => editingLink
                    ? setEditingLink({ ...editingLink, rewardPerClick: parseFloat(e.target.value) })
                    : setFormData({ ...formData, rewardPerClick: parseFloat(e.target.value) })
                  }
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="0.001"
                />
              </div>
              {editingLink && (
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Status</label>
                  <select
                    value={editingLink.status}
                    onChange={(e) => setEditingLink({
                      ...editingLink,
                      status: e.target.value as 'active' | 'inactive'
                    })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingLink(null);
                    setFormData({ url: '', title: '', rewardPerClick: 0.001 });
                  }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editingLink
                    ? handleUpdateLink(editingLink._id, editingLink)
                    : handleCreateLink()
                  }
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {editingLink ? 'Update Link' : 'Create Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>

  );
} 