'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftOutlined,
  SearchOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CopyOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';

interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: string;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  from: string;
  to: string;
  txHash: string;
  fee?: string;
  confirmations?: number;
}

export default function TransactionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [showCopiedTooltip, setShowCopiedTooltip] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data - replace with actual data from Redux store or API
  const allTransactions: Transaction[] = [
    {
      id: '1',
      type: 'incoming',
      amount: '0.5',
      currency: 'BTC',
      status: 'completed',
      timestamp: '2025-04-05T18:30:00',
      from: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      to: '1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1',
      txHash: '0x123...abc',
      fee: '0.0001 BTC',
      confirmations: 12,
    },
    {
      id: '2',
      type: 'outgoing',
      amount: '1000',
      currency: 'USDT',
      status: 'pending',
      timestamp: '2025-04-05T17:45:00',
      from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      to: '0x123...456',
      txHash: '0x456...def',
      fee: '0.5 USDT',
      confirmations: 0,
    },
    {
      id: '3',
      type: 'incoming',
      amount: '2.5',
      currency: 'ETH',
      status: 'completed',
      timestamp: '2025-04-05T16:20:00',
      from: '0x789...ghi',
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      txHash: '0x789...ghi',
      fee: '0.01 ETH',
      confirmations: 24,
    },
    {
      id: '4',
      type: 'outgoing',
      amount: '500',
      currency: 'USDT',
      status: 'failed',
      timestamp: '2025-04-05T15:10:00',
      from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      to: '0x101...jkl',
      txHash: '0x101...jkl',
      fee: '0.5 USDT',
      confirmations: 0,
    },
    {
      id: '5',
      type: 'incoming',
      amount: '1.2',
      currency: 'BTC',
      status: 'completed',
      timestamp: '2025-04-04T14:30:00',
      from: '1B1zP1eP5QGefi2DMPTfTL5SLmv7DivfNb',
      to: '1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1',
      txHash: '0x202...mno',
      fee: '0.0001 BTC',
      confirmations: 36,
    },
    {
      id: '6',
      type: 'outgoing',
      amount: '2000',
      currency: 'USDT',
      status: 'completed',
      timestamp: '2025-04-03T10:15:00',
      from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      to: '0x303...pqr',
      txHash: '0x303...pqr',
      fee: '1 USDT',
      confirmations: 48,
    },
    {
      id: '7',
      type: 'incoming',
      amount: '5.0',
      currency: 'ETH',
      status: 'completed',
      timestamp: '2025-04-02T09:45:00',
      from: '0x404...stu',
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      txHash: '0x404...stu',
      fee: '0.02 ETH',
      confirmations: 72,
    },
    {
      id: '8',
      type: 'outgoing',
      amount: '0.8',
      currency: 'BTC',
      status: 'completed',
      timestamp: '2025-04-01T08:20:00',
      from: '1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1',
      to: '1C1zP1eP5QGefi2DMPTfTL5SLmv7DivfNc',
      txHash: '0x505...vwx',
      fee: '0.0001 BTC',
      confirmations: 96,
    },
    {
      id: '9',
      type: 'incoming',
      amount: '3000',
      currency: 'USDT',
      status: 'completed',
      timestamp: '2025-03-31T07:10:00',
      from: '0x606...yza',
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      txHash: '0x606...yza',
      fee: '1.5 USDT',
      confirmations: 120,
    },
    {
      id: '10',
      type: 'outgoing',
      amount: '3.0',
      currency: 'ETH',
      status: 'completed',
      timestamp: '2025-03-30T06:05:00',
      from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      to: '0x707...bcd',
      txHash: '0x707...bcd',
      fee: '0.01 ETH',
      confirmations: 144,
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    // Implement your refresh logic here
    setTimeout(() => setLoading(false), 1000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setShowCopiedTooltip(id);
    setTimeout(() => setShowCopiedTooltip(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined className="text-green-400" />;
      case 'pending':
        return <ClockCircleOutlined className="text-yellow-400" />;
      case 'failed':
        return <CloseCircleOutlined className="text-red-400" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const isWithinDateRange = (dateString: string, range: 'today' | 'week' | 'month') => {
    const date = new Date(dateString);
    const now = new Date();
    
    switch (range) {
      case 'today':
        return date.toDateString() === now.toDateString();
      case 'week':
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return date >= oneWeekAgo;
      case 'month':
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return date >= oneMonthAgo;
      default:
        return true;
    }
  };

  const filteredTransactions = allTransactions.filter(tx => {
    // Filter by type
    if (transactionFilter !== 'all' && tx.type !== transactionFilter) return false;
    
    // Filter by status
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    
    // Filter by date
    if (dateFilter !== 'all' && !isWithinDateRange(tx.timestamp, dateFilter)) return false;
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        tx.currency.toLowerCase().includes(searchLower) ||
        tx.amount.includes(searchTerm) ||
        tx.from.toLowerCase().includes(searchLower) ||
        tx.to.toLowerCase().includes(searchLower) ||
        tx.txHash.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-8 text-gray-100">
      <div className="ml-[6%] mx-auto max-w-7xl">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-[#162036] hover:bg-[#1E2A45] text-gray-300 transition-all duration-200 rounded-lg mr-4"
          >
            <ArrowLeftOutlined />
            Back to Wallet
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Transaction History</h1>
            <p className="text-gray-400">View and manage all your transactions</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#0F1629] border border-[#1B2B4B] rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#162036] text-white pl-10 pr-4 py-2 rounded-lg border border-[#1B2B4B] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex flex-wrap gap-2">
              <select 
                className="bg-[#162036] text-white px-3 py-2 rounded-lg border border-[#1B2B4B] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={transactionFilter}
                onChange={(e) => setTransactionFilter(e.target.value as 'all' | 'incoming' | 'outgoing')}
              >
                <option value="all">All Types</option>
                <option value="incoming">Incoming</option>
                <option value="outgoing">Outgoing</option>
              </select>
              <select 
                className="bg-[#162036] text-white px-3 py-2 rounded-lg border border-[#1B2B4B] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'completed' | 'pending' | 'failed')}
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <select 
                className="bg-[#162036] text-white px-3 py-2 rounded-lg border border-[#1B2B4B] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 bg-[#0051FF] hover:bg-[#0045CC] text-white rounded-lg transition-all duration-200
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ReloadOutlined className={`${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#162036] hover:bg-[#1E2A45] text-gray-300 rounded-lg transition-all duration-200"
              >
                <DownloadOutlined />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-[#0F1629] border border-[#1B2B4B] rounded-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1B2B4B]">
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">From</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">To</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Fee</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-[#1B2B4B] hover:bg-[#162036]">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-full ${
                            tx.type === 'incoming' ? 'bg-green-900/20' : 'bg-blue-900/20'
                          }`}>
                            {tx.type === 'incoming' ? (
                              <ArrowDownOutlined className="text-green-400" />
                            ) : (
                              <ArrowUpOutlined className="text-blue-400" />
                            )}
                          </div>
                          <span className="text-white capitalize">{tx.type}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-white">
                          {tx.amount} {tx.currency}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-white">{formatDate(tx.timestamp)}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-white truncate max-w-[150px]">{tx.from}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-white truncate max-w-[150px]">{tx.to}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(tx.status)}
                          <span className={`text-sm ${getStatusColor(tx.status)}`}>
                            {tx.status}
                          </span>
                          {tx.confirmations !== undefined && tx.status === 'completed' && (
                            <span className="text-xs text-gray-400 ml-1">
                              ({tx.confirmations} confirmations)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-white">{tx.fee || '-'}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Tooltip title="Copy Transaction Hash">
                            <button
                              onClick={() => copyToClipboard(tx.txHash, `tx-${tx.id}`)}
                              className="p-1 hover:bg-[#1E2A45] rounded-lg transition-colors duration-200"
                            >
                              <CopyOutlined className="text-gray-400 hover:text-white" />
                            </button>
                          </Tooltip>
                          {showCopiedTooltip === `tx-${tx.id}` && (
                            <div className="absolute mt-8 bg-green-500 text-white px-2 py-1 rounded text-xs">
                              Copied!
                            </div>
                          )}
                          <Tooltip title="View on Explorer">
                            <button
                              className="p-1 hover:bg-[#1E2A45] rounded-lg transition-colors duration-200"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400">
                      No transactions found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mb-6">
            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-[#162036] text-gray-500 cursor-not-allowed'
                    : 'bg-[#0051FF] text-white hover:bg-[#0045CC]'
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-[#0051FF] text-white'
                      : 'bg-[#162036] text-gray-300 hover:bg-[#1E2A45]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? 'bg-[#162036] text-gray-500 cursor-not-allowed'
                    : 'bg-[#0051FF] text-white hover:bg-[#0045CC]'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-[#0F1629] border border-[#1B2B4B] rounded-lg p-4">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-sm text-gray-400">Total Transactions</p>
              <p className="text-xl font-bold text-white">{filteredTransactions.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Incoming</p>
              <p className="text-xl font-bold text-green-400">
                {filteredTransactions.filter(tx => tx.type === 'incoming').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Outgoing</p>
              <p className="text-xl font-bold text-blue-400">
                {filteredTransactions.filter(tx => tx.type === 'outgoing').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-xl font-bold text-green-400">
                {filteredTransactions.filter(tx => tx.status === 'completed').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-xl font-bold text-yellow-400">
                {filteredTransactions.filter(tx => tx.status === 'pending').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Failed</p>
              <p className="text-xl font-bold text-red-400">
                {filteredTransactions.filter(tx => tx.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 