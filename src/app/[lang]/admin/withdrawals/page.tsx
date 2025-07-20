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


interface Withdrawal {
  _id: string;
  userId?: {
    email?: string;
    username?: string;
    telegramUsername?: string;
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
    <div className="min-h-screen bg-[#0F1117] p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 bg-size-200 animate-gradient p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-blue-300">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <WalletOutlined className="text-white text-xl sm:text-2xl lg:text-3xl" />
              <span className="text-white">Withdrawals</span>
            </div>
           
          </h1>

        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl sm:rounded-3xl border border-blue-500 p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:shadow-2xl transition-all group min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]">
            <div className="p-3 sm:p-4 lg:p-5 rounded-2xl bg-blue-900/40 group-hover:bg-blue-900/60 transition-all flex-shrink-0">
              <WalletOutlined className="text-white text-2xl sm:text-3xl lg:text-4xl group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-sm sm:text-base font-semibold uppercase tracking-wider" style={{ color: 'lime' }}>Total Withdrawals</h2>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">${stats.total.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl sm:rounded-3xl border border-blue-500 p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:shadow-2xl transition-all group min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]">
            <div className="p-3 sm:p-4 lg:p-5 rounded-2xl bg-purple-900/40 group-hover:bg-purple-900/60 transition-all flex-shrink-0">
              <CheckCircleOutlined className="text-white text-2xl sm:text-3xl lg:text-4xl group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-sm sm:text-base font-semibold uppercase tracking-wider" style={{ color: 'lime' }}>Approved</h2>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">{stats.approved}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl sm:rounded-3xl border border-blue-500 p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:shadow-2xl transition-all group min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] sm:col-span-2 lg:col-span-1">
            <div className="p-3 sm:p-4 lg:p-5 rounded-2xl bg-indigo-900/40 group-hover:bg-indigo-900/60 transition-all flex-shrink-0">
              <ClockCircleOutlined className="text-white text-2xl sm:text-3xl lg:text-4xl group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-sm sm:text-base font-semibold uppercase tracking-wider" style={{ color: 'lime' }}>Pending</h2>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-[#181A20] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#23272F] p-4 sm:p-6 lg:p-8 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Recent Withdrawals</h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[200px] lg:min-w-[220px]">
                <input
                  type="text"
                  placeholder="Search withdrawals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#23272F] border border-[#30343E] rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 placeholder:text-[#C0C0C0] text-sm sm:text-base"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#23272F] border border-[#30343E] rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table
              dataSource={filteredWithdrawals}
              rowKey="_id"
              size="small"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: false,
                showQuickJumper: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
              }}
              bordered
              style={{ background: '#181A20', borderRadius: 16 }}
              scroll={{ x: 'max-content' }}
              columns={[
                {
                  title: <span style={{ color: '#FFD666', fontWeight: 700, fontSize: '12px' }}>User</span>,
                  dataIndex: 'userId',
                  key: 'user',
                  width: 120,
                  render: (userId: any) => (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 500, fontSize: '11px' }}>{userId?.user ?? 'N/A'}</span>
                      <span style={{ fontSize: 10, color: '#aaa' }}>{userId?.email ?? 'N/A'}</span>
                    </div>
                  ),
                },
                {
                  title: <span style={{ color: '#FFD666', fontWeight: 700, fontSize: '12px' }}>Telegram ID</span>,
                  dataIndex: 'telegramId',
                  key: 'telegramId',
                  width: 100,
                  render: (val: string) => (
                    <span style={{ fontFamily: 'monospace', color: '#FFD666', fontSize: 10 }}>{val || 'N/A'}</span>
                  ),
                },
                {
                  title: <span style={{ color: '#FFD666', fontWeight: 700, fontSize: '12px' }}>Username</span>,
                  dataIndex: 'userId',
                  key: 'username',
                  width: 100,
                  render: (userId: any) => (
                    <span style={{ fontFamily: 'monospace', color: '#FFD666', fontSize: 10 }}>
                      {userId?.username || userId?.telegramUsername || 'N/A'}
                    </span>
                  ),
                },
                {
                  title: <span style={{ color: '#FFD666', fontWeight: 700, fontSize: '12px' }}>Amount</span>,
                  dataIndex: 'amount',
                  key: 'amount',
                  width: 120,
                  render: (_: any, row: any) => row.metadata?.originalAmount && row.metadata?.currency ? (
                    <span style={{ color: '#4ade80', fontWeight: 500, fontSize: 11 }}>
                      {row.metadata.originalAmount} {row.metadata.currency.toUpperCase()} <span style={{ color: '#888' }}>({((row.amount ?? row.bdtAmount) ?? 0).toFixed(2)})</span>
                    </span>
                  ) : (
                    <span style={{ color: '#4ade80', fontWeight: 500, fontSize: 11 }}>{((row.amount ?? row.bdtAmount) ?? 0).toFixed(2)}</span>
                  ),
                },
                {
                  title: <span style={{ color: '#FFD666', fontWeight: 700, fontSize: '12px' }}>Net Amount</span>,
                  dataIndex: 'netAmount',
                  key: 'netAmount',
                  width: 100,
                  render: (_: any, row: any) => row.metadata?.amountAfterFee && row.metadata?.currency ? (
                    <span style={{ color: '#60a5fa', fontWeight: 500, fontSize: 11 }}>{row.metadata.amountAfterFee} {row.metadata.currency.toUpperCase()}</span>
                  ) : (
                    <span style={{ color: '#888', fontSize: 10 }}>N/A</span>
                  ),
                },
                {
                  title: <span style={{ color: '#FFD666', fontWeight: 700, fontSize: '12px' }}>Payment Method</span>,
                  dataIndex: 'method',
                  key: 'method',
                  width: 120,
                  render: (method: string) => getMethodBadge(method),
                },
                {
                  title: <span style={{ color: '#FFD666', fontWeight: 700, fontSize: '12px' }}>Recipient</span>,
                  dataIndex: 'recipient',
                  key: 'recipient',
                  width: 150,
                  render: (val: string) => (
                    <span style={{ fontFamily: 'monospace', color: '#eee', fontSize: 10 }}>{val || 'N/A'}</span>
                  ),
                },
                {
                  title: <span style={{ color: '#FFD666', fontWeight: 700, fontSize: '12px' }}>Status</span>,
                  dataIndex: 'status',
                  key: 'status',
                  width: 100,
                  render: (status: string, row: any) => (
                    <Tag color={
                      status === 'approved' ? 'green' :
                      status === 'rejected' ? 'red' : 'gold'
                    } style={{ fontSize: 10, borderRadius: 6, padding: '1px 6px' }}>
                      {getStatusIcon(status)} {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Tag>
                  ),
                },
                {
                  title: <span style={{ color: '#FFD666', fontWeight: 700, fontSize: '12px' }}>Date</span>,
                  dataIndex: 'createdAt',
                  key: 'date',
                  width: 120,
                  render: (createdAt: string) => (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 500, fontSize: 11 }}>{new Date(createdAt).toLocaleDateString()}</span>
                      <span style={{ fontSize: 10, color: '#aaa' }}>{new Date(createdAt).toLocaleTimeString()}</span>
                    </div>
                  ),
                },
                {
                  title: <span style={{ color: '#FFD666', fontWeight: 700, fontSize: '12px' }}>Actions</span>,
                  key: 'actions',
                  width: 200,
                  render: (_: any, row: any) => (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {row.status === 'pending' && (
                        <>
                          <Button
                            size="small"
                            type="primary"
                            style={{ background: '#22c55e', borderColor: '#22c55e', fontSize: 10, minWidth: 50, height: 24 }}
                            onClick={() => handleApprove(row._id)}
                            loading={loading}
                          >Approve</Button>
                          <Button
                            size="small"
                            danger
                            style={{ fontSize: 10, minWidth: 50, height: 24 }}
                            onClick={() => handleReject(row._id)}
                            loading={loading}
                          >Reject</Button>
                          {isCrypto(row.method) && (
                            <Button
                              size="small"
                              style={{ background: '#FFD666', borderColor: '#FFD666', color: '#181A20', fontWeight: 700, fontSize: 10, height: 24 }}
                              onClick={() => handleAutoPay(row._id)}
                              loading={loading}
                              icon={<ThunderboltOutlined style={{ color: '#ad850e' }} />}
                            >Auto Pay</Button>
                          )}
                          <Button
                            size="small"
                            style={{ background: '#2563eb', borderColor: '#2563eb', color: '#fff', fontSize: 10, height: 24 }}
                            onClick={() => handleViewDetails(row._id)}
                          >Details</Button>
                        </>
                      )}
                      {row.status !== 'pending' && (
                        <>
                          <span style={{ fontSize: 10, color: '#aaa', marginRight: 4 }}>{row.status === 'approved' ? 'Approved' : 'Rejected'}</span>
                          <Button
                            size="small"
                            style={{ background: '#2563eb', borderColor: '#2563eb', color: '#fff', fontSize: 10, height: 24 }}
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
        </div>
      </div>
    </div>
  ) 
}
