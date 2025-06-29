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
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { API_CALL } from '@/lib/client';
import { Table, Button, Tag, Tooltip } from 'antd';
import 'antd/dist/reset.css';
import AdminLayout from '../layout';

interface Withdrawal {
  _id: string;
  userId?: {
    email?: string;
    username?: string;
  };
  telegramId?: string;
  activityType?: string;
  amount?: number;
  bdtAmount?: number;
  method: string;
  recipient?: string;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
  metadata?: {
    ipAddress?: string;
    deviceInfo?: string;
    originalAmount?: number;
    currency?: string;
    fee?: number;
    amountAfterFee?: number;
    feeType?: string;
  };
  createdAt: string;
  __v?: number;
}

export default function WithdrawalsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    handleRefresh();
  }, []);


  const handleRefresh = () => {
    setLoading(true);
    API_CALL({ url: '/withdrawals' })
      .then((res) => {
        setWithdrawals(res.response?.result as any);
        console.log(res.response?.result);
      })
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id: string) => {
    try {
      setLoading(true);
      const { status } = await API_CALL({
        url: `/withdrawals/${id}`,
        method: 'PUT',
        body: { status: 'approved' }
      });

      if (status === 200) {
        handleRefresh();
      }
    } catch (error) {
      console.error('Error approving withdrawal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setLoading(true);
      const { status } = await API_CALL({
        url: `/withdrawals/${id}`,
        method: 'PUT',
        body: { status: 'rejected' }
      });

      if (status === 200) {
        handleRefresh();
      }
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/admin/withdrawals/${id}`);
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const username = withdrawal.userId?.username || '';
    const email = withdrawal.userId?.email || '';
    const method = withdrawal.method || '';
    const matchesSearch = [username, email, method]
      .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || withdrawal.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: withdrawals.reduce((sum, w) => sum + (w.amount ?? w.bdtAmount ?? 0), 0),
    approved: withdrawals.filter(w => w.status === 'approved').length,
    pending: withdrawals.filter(w => w.status === 'pending').length
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

  const isCrypto = (method: string) => {
    const cryptoMethods = ['usdt', 'btc', 'eth', 'bnb', 'trx', 'crypto'];
    return cryptoMethods.some(c => method.toLowerCase().includes(c));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getMethodBadge = (method: string) => {
    if (isCrypto(method)) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-900/30 border border-yellow-400 text-yellow-300 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm">
          <ThunderboltOutlined className="text-yellow-400" /> {method}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm">
        <CreditCardOutlined className="text-blue-400" /> {method}
      </span>
    );
  };

  const handleAutoPay = (id: string) => {
    // TODO: Implement auto pay logic for crypto withdrawals
    alert('Auto Pay for crypto withdrawal: ' + id);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleOutlined className="text-green-400" />;
      case 'rejected':
        return <CloseCircleOutlined className="text-red-400" />;
      default:
        return <ClockCircleOutlined className="text-yellow-400" />;
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4 bg-gradient-to-br from-[#181A20] to-[#23272F] p-8 rounded-3xl shadow-2xl border border-[#262A35]">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <WalletOutlined className="text-yellow-400 text-3xl" />
          Withdrawals <span className="text-lg font-light text-[#C0C0C0] ml-2">Admin Panel</span>
        </h1>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 px-6 py-3 bg-[#23272F] hover:bg-[#2B3139] text-white rounded-2xl font-semibold shadow transition-all duration-200 border border-[#30343E]"
          >
            <DashboardOutlined /> Dashboard
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 bg-[#F0B90B] hover:bg-[#FFD666] text-[#181A20] rounded-2xl font-bold shadow transition-all duration-200 border border-yellow-400
          ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'}`}
          >
            <RedoOutlined className={`${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-[#20232B] rounded-3xl shadow-xl border border-[#262A35] p-8 flex items-center gap-6 hover:shadow-2xl transition-all group">
          <div className="p-5 rounded-2xl bg-blue-900/20 group-hover:bg-blue-900/40 transition-all">
            <WalletOutlined className="text-[#F0B90B] text-4xl group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#C0C0C0] uppercase tracking-wider">Total Withdrawals</h2>
            <p className="text-4xl font-extrabold text-white mt-1">${stats.total.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-[#20232B] rounded-3xl shadow-xl border border-[#262A35] p-8 flex items-center gap-6 hover:shadow-2xl transition-all group">
          <div className="p-5 rounded-2xl bg-green-900/20 group-hover:bg-green-900/40 transition-all">
            <CheckCircleOutlined className="text-green-400 text-4xl group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#C0C0C0] uppercase tracking-wider">Approved</h2>
            <p className="text-4xl font-extrabold text-white mt-1">{stats.approved}</p>
          </div>
        </div>
        <div className="bg-[#20232B] rounded-3xl shadow-xl border border-[#262A35] p-8 flex items-center gap-6 hover:shadow-2xl transition-all group">
          <div className="p-5 rounded-2xl bg-yellow-900/20 group-hover:bg-yellow-900/40 transition-all">
            <ClockCircleOutlined className="text-yellow-400 text-4xl group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#C0C0C0] uppercase tracking-wider">Pending</h2>
            <p className="text-4xl font-extrabold text-white mt-1">{stats.pending}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#181A20] rounded-3xl shadow-2xl border border-[#23272F] p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Recent Withdrawals</h2>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 md:min-w-[220px]">
              <input
                type="text"
                placeholder="Search withdrawals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#23272F] border border-[#30343E] rounded-2xl px-5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 placeholder:text-[#C0C0C0]"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#23272F] border border-[#30343E] rounded-2xl px-5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <Table
  dataSource={filteredWithdrawals}
  rowKey="_id"
  size="small"
  pagination={{ pageSize: 10 }}
  bordered
  style={{ background: '#181A20', borderRadius: 16 }}
  columns={[
    {
      title: <span style={{ color: '#FFD666', fontWeight: 700 }}>User</span>,
      dataIndex: 'userId',
      key: 'user',
      render: (userId: any) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 500 }}>{userId?.username ?? 'N/A'}</span>
          <span style={{ fontSize: 11, color: '#aaa' }}>{userId?.email ?? 'N/A'}</span>
        </div>
      ),
    },
    {
      title: <span style={{ color: '#FFD666', fontWeight: 700 }}>Telegram ID</span>,
      dataIndex: 'telegramId',
      key: 'telegramId',
      render: (val: string) => (
        <span style={{ fontFamily: 'monospace', color: '#FFD666', fontSize: 11 }}>{val || 'N/A'}</span>
      ),
    },
    {
      title: <span style={{ color: '#FFD666', fontWeight: 700 }}>Amount</span>,
      dataIndex: 'amount',
      key: 'amount',
      render: (_: any, row: any) => row.metadata?.originalAmount && row.metadata?.currency ? (
        <span style={{ color: '#4ade80', fontWeight: 500, fontSize: 12 }}>
          {row.metadata.originalAmount} {row.metadata.currency.toUpperCase()} <span style={{ color: '#888' }}>({((row.amount ?? row.bdtAmount) ?? 0).toFixed(2)})</span>
        </span>
      ) : (
        <span style={{ color: '#4ade80', fontWeight: 500, fontSize: 12 }}>{((row.amount ?? row.bdtAmount) ?? 0).toFixed(2)}</span>
      ),
    },
    {
      title: <span style={{ color: '#FFD666', fontWeight: 700 }}>Net Amount</span>,
      dataIndex: 'netAmount',
      key: 'netAmount',
      render: (_: any, row: any) => row.metadata?.amountAfterFee && row.metadata?.currency ? (
        <span style={{ color: '#60a5fa', fontWeight: 500, fontSize: 12 }}>{row.metadata.amountAfterFee} {row.metadata.currency.toUpperCase()}</span>
      ) : (
        <span style={{ color: '#888', fontSize: 11 }}>N/A</span>
      ),
    },
    {
      title: <span style={{ color: '#FFD666', fontWeight: 700 }}>Payment Method</span>,
      dataIndex: 'method',
      key: 'method',
      render: (method: string) => getMethodBadge(method),
    },
    {
      title: <span style={{ color: '#FFD666', fontWeight: 700 }}>Recipient</span>,
      dataIndex: 'recipient',
      key: 'recipient',
      render: (val: string) => (
        <span style={{ fontFamily: 'monospace', color: '#eee', fontSize: 11 }}>{val || 'N/A'}</span>
      ),
    },
    {
      title: <span style={{ color: '#FFD666', fontWeight: 700 }}>Status</span>,
      dataIndex: 'status',
      key: 'status',
      render: (status: string, row: any) => (
        <Tag color={
          status === 'approved' ? 'green' :
          status === 'rejected' ? 'red' : 'gold'
        } style={{ fontSize: 11, borderRadius: 8, padding: '2px 8px' }}>
          {getStatusIcon(status)} {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: <span style={{ color: '#FFD666', fontWeight: 700 }}>Date</span>,
      dataIndex: 'createdAt',
      key: 'date',
      render: (createdAt: string) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 500 }}>{new Date(createdAt).toLocaleDateString()}</span>
          <span style={{ fontSize: 11, color: '#aaa' }}>{new Date(createdAt).toLocaleTimeString()}</span>
        </div>
      ),
    },
    {
      title: <span style={{ color: '#FFD666', fontWeight: 700 }}>Actions</span>,
      key: 'actions',
      render: (_: any, row: any) => (
        <div style={{ display: 'flex', gap: 6 }}>
          {row.status === 'pending' && (
            <>
              <Button
                size="small"
                type="primary"
                style={{ background: '#22c55e', borderColor: '#22c55e', fontSize: 11, minWidth: 56 }}
                onClick={() => handleApprove(row._id)}
                loading={loading}
              >Approve</Button>
              <Button
                size="small"
                danger
                style={{ fontSize: 11, minWidth: 56 }}
                onClick={() => handleReject(row._id)}
                loading={loading}
              >Reject</Button>
              {isCrypto(row.method) && (
                <Button
                  size="small"
                  style={{ background: '#FFD666', borderColor: '#FFD666', color: '#181A20', fontWeight: 700, fontSize: 11 }}
                  onClick={() => handleAutoPay(row._id)}
                  loading={loading}
                  icon={<ThunderboltOutlined style={{ color: '#ad850e' }} />}
                >Auto Pay</Button>
              )}
              <Button
                size="small"
                style={{ background: '#2563eb', borderColor: '#2563eb', color: '#fff', fontSize: 11 }}
                onClick={() => handleViewDetails(row._id)}
              >Details</Button>
            </>
          )}
          {row.status !== 'pending' && (
            <>
              <span style={{ fontSize: 12, color: '#aaa', marginRight: 4 }}>{row.status === 'approved' ? 'Approved' : 'Rejected'}</span>
              <Button
                size="small"
                style={{ background: '#2563eb', borderColor: '#2563eb', color: '#fff', fontSize: 11 }}
                onClick={() => handleViewDetails(row._id)}
              >Details</Button>
            </>
          )}
        </div>
      ),
    },
  ]}
/> 
      </div>
    </AdminLayout>
  ) 
}
