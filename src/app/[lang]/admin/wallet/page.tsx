'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  WalletOutlined,
  ReloadOutlined,
  SendOutlined,
  SwapOutlined,
  CopyOutlined,
  QrcodeOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  MoreOutlined,
  SearchOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
 
import { useDispatch } from 'react-redux';
import { Tooltip } from 'antd';

interface WalletBalance {
  currency: string;
  icon: string;
  balance: string;
  usdValue: number;
  address: string;
  network: string;
  change24h: number;
}

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
}

export default function WalletPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showQRCode, setShowQRCode] = useState<string | null>(null);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [showCopiedTooltip, setShowCopiedTooltip] = useState<string | null>(null);

  // Mock data - replace with actual data from Redux store
  const walletBalances: WalletBalance[] = [
    {
      currency: 'BTC',
      icon: '/images/crypto/btc.png',
      balance: '2.5432',
      usdValue: 125000,
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      network: 'Bitcoin',
      change24h: 2.5,
    },
    {
      currency: 'ETH',
      icon: '/images/crypto/eth.png',
      balance: '15.7845',
      usdValue: 45000,
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      network: 'Ethereum',
      change24h: -1.2,
    },
    {
      currency: 'USDT',
      icon: '/images/crypto/usdt.png',
      balance: '50000.00',
      usdValue: 50000,
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      network: 'Ethereum',
      change24h: 0.1,
    },
  ];

  const recentTransactions: Transaction[] = [
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

  const getTotalUSDValue = () => {
    return walletBalances.reduce((acc, curr) => acc + curr.usdValue, 0);
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

  const filteredTransactions = recentTransactions.filter(tx => {
    if (transactionFilter !== 'all' && tx.type !== transactionFilter) return false;
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    return true;
  });

  const filteredBalances = walletBalances.filter(wallet => 
    wallet.currency.toLowerCase().includes(searchTerm.toLowerCase()) || 
    wallet.network.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 text-gray-100">
      <div className="ml-[6%] mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Hot Wallet</h1>
            <p className="text-gray-400">Manage your crypto assets</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="flex items-center gap-2 px-4 py-2 bg-[#162036] hover:bg-[#1E2A45] text-gray-300 transition-all duration-200"
            >
              {showBalances ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              {showBalances ? 'Hide' : 'Show'} Balances
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-2 bg-[#0051FF] hover:bg-[#0045CC] text-white transition-all duration-200
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ReloadOutlined className={`${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="bg-gradient-to-r from-[#0F1629] to-[#1A2A4A] border border-[#1B2B4B] rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-medium text-gray-300 mb-1">Total Portfolio Value</h2>
              <p className="text-3xl font-bold text-white">
                ${showBalances ? getTotalUSDValue().toLocaleString() : '******'}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-400">24h Change</p>
                <p className="text-lg font-medium text-green-400">+2.3%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">7d Change</p>
                <p className="text-lg font-medium text-red-400">-1.5%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Table */}
        <div className="bg-[#0F1629] border border-[#1B2B4B] mb-6 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#1B2B4B] flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Your Assets</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#162036] text-white pl-10 pr-4 py-2 rounded-lg border border-[#1B2B4B] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1B2B4B]">
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Asset</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Balance</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Price</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">24h Change</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBalances.map((wallet) => (
                  <tr key={wallet.currency} className="border-b border-[#1B2B4B] hover:bg-[#162036]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 relative">
                          <Image
                            src={wallet.icon}
                            alt={wallet.currency}
                            width={32}
                            height={32}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-white">{wallet.currency}</div>
                          <div className="text-sm text-gray-400">{wallet.network}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-medium text-white">
                        {showBalances ? wallet.balance : '******'} {wallet.currency}
                      </div>
                      <div className="text-sm text-gray-400">
                        ${showBalances ? wallet.usdValue.toLocaleString() : '******'}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-medium text-white">
                        ${(wallet.usdValue / parseFloat(wallet.balance)).toFixed(2)}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`${wallet.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {wallet.change24h >= 0 ? '+' : ''}{wallet.change24h}%
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip title="Send">
                          <button className="p-2 hover:bg-[#1E2A45] rounded-lg transition-colors duration-200">
                            <SendOutlined className="text-gray-400 hover:text-white" />
                          </button>
                        </Tooltip>
                        <Tooltip title="Swap">
                          <button className="p-2 hover:bg-[#1E2A45] rounded-lg transition-colors duration-200">
                            <SwapOutlined className="text-gray-400 hover:text-white" />
                          </button>
                        </Tooltip>
                        <Tooltip title="Copy Address">
                          <button 
                            className="p-2 hover:bg-[#1E2A45] rounded-lg transition-colors duration-200"
                            onClick={() => copyToClipboard(wallet.address, `address-${wallet.currency}`)}
                          >
                            <CopyOutlined className="text-gray-400 hover:text-white" />
                          </button>
                        </Tooltip>
                        <Tooltip title="Show QR Code">
                          <button 
                            className="p-2 hover:bg-[#1E2A45] rounded-lg transition-colors duration-200"
                            onClick={() => setShowQRCode(showQRCode === wallet.currency ? null : wallet.currency)}
                          >
                            <QrcodeOutlined className="text-gray-400 hover:text-white" />
                          </button>
                        </Tooltip>
                        <Tooltip title="More Options">
                          <button className="p-2 hover:bg-[#1E2A45] rounded-lg transition-colors duration-200">
                            <MoreOutlined className="text-gray-400 hover:text-white" />
                          </button>
                        </Tooltip>
                      </div>
                      {showQRCode === wallet.currency && (
                        <div className="mt-2 p-2 bg-white rounded-lg inline-block">
                          {/* In a real app, you would use a QR code library here */}
                          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">QR Code for {wallet.currency}</span>
                          </div>
                        </div>
                      )}
                      {showCopiedTooltip === `address-${wallet.currency}` && (
                        <div className="absolute mt-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                          Copied!
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#0F1629] rounded-lg shadow-lg border border-[#1B2B4B] p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
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
              <button 
                className="px-4 py-2 bg-[#0051FF] hover:bg-[#0045CC] text-white rounded-lg transition-all duration-200"
                onClick={() => router.push('/admin/wallet/transactions')}
              >
                View All
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-[#1B2B4B] hover:bg-[#162036] transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      tx.type === 'incoming' ? 'bg-green-900/20' : 'bg-blue-900/20'
                    }`}>
                      {tx.type === 'incoming' ? (
                        <ArrowDownOutlined className="text-green-400" />
                      ) : (
                        <ArrowUpOutlined className="text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {tx.type === 'incoming' ? 'Received' : 'Sent'} {tx.amount} {tx.currency}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(tx.status)}
                      <span className={`text-sm ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>
                    <Tooltip title="Copy Transaction Hash">
                      <button
                        onClick={() => copyToClipboard(tx.txHash, `tx-${tx.id}`)}
                        className="text-gray-500 hover:text-blue-400 transition-colors duration-300"
                      >
                        <CopyOutlined />
                      </button>
                    </Tooltip>
                    {showCopiedTooltip === `tx-${tx.id}` && (
                      <div className="absolute mt-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                        Copied!
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No transactions match your filters
              </div>
            )}
          </div>
        </div>

        {/* Security Warning */}
        <div className="bg-[#261D0D] border border-[#3D2E10] p-4 rounded-lg">
          <div className="flex items-center gap-2 text-[#FFC700]">
            <WarningOutlined />
            <span className="font-medium">Security Notice</span>
          </div>
          <p className="mt-2 text-sm text-[#FFC700]/80">
            This is a hot wallet. For security reasons, please only keep necessary operating funds here and store the majority of funds in cold storage.
          </p>
        </div>
      </div>
    </div>
  );
}
