"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from "next-auth/react";
import { ArrowUpOutlined, ArrowDownOutlined, FilterOutlined, ReloadOutlined, SearchOutlined, CloseOutlined, WalletOutlined, HistoryOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

// Define transaction type
interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal';
  symbol: string;
  amount: number;
  usdValue: number;
  date: Date;
  status: 'completed' | 'pending';
  txHash: string;
}

// Mock transaction data
const mockTransactions: Transaction[] = [
  { 
    id: 1, 
    type: 'deposit', 
    symbol: 'BTC', 
    amount: 0.1, 
    usdValue: 5000,
    date: new Date(Date.now() - 86400000 * 2), 
    status: 'completed',
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  },
  { 
    id: 2, 
    type: 'withdrawal', 
    symbol: 'ETH', 
    amount: 0.5, 
    usdValue: 1000,
    date: new Date(Date.now() - 86400000 * 5), 
    status: 'completed',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  { 
    id: 3, 
    type: 'deposit', 
    symbol: 'USDT', 
    amount: 500, 
    usdValue: 500,
    date: new Date(Date.now() - 86400000 * 7), 
    status: 'completed',
    txHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456'
  },
  { 
    id: 4, 
    type: 'withdrawal', 
    symbol: 'BTC', 
    amount: 0.05, 
    usdValue: 2500,
    date: new Date(Date.now() - 86400000 * 10), 
    status: 'pending',
    txHash: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12'
  },
  { 
    id: 5, 
    type: 'deposit', 
    symbol: 'ETH', 
    amount: 1.0, 
    usdValue: 2000,
    date: new Date(Date.now() - 86400000 * 15), 
    status: 'completed',
    txHash: '0x90abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678'
  },
];

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSymbol, setSelectedSymbol] = useState('all');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session } = useSession();
  const { t } = useTranslation();

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFilter = () => {
    let filtered = [...transactions];
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(tx => tx.type === selectedType);
    }
    
    // Filter by symbol
    if (selectedSymbol !== 'all') {
      filtered = filtered.filter(tx => tx.symbol === selectedSymbol);
    }
    
    // Filter by date range
    if (startDate && endDate) {
      const start = startDate.startOf('day').toDate();
      const end = endDate.endOf('day').toDate();
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate >= start && txDate <= end;
      });
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.symbol.toLowerCase().includes(query) || 
        tx.txHash.toLowerCase().includes(query) ||
        tx.type.toLowerCase().includes(query)
      );
    }
    
    setFilteredTransactions(filtered);
    setShowFilters(false);
  };

  const handleReset = () => {
    setSelectedType('all');
    setSelectedSymbol('all');
    setStartDate(null);
    setEndDate(null);
    setSearchQuery('');
    setFilteredTransactions(transactions);
    setShowFilters(false);
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'bg-[#0ECB81]' : 'bg-[#F0B90B]';
  };

  const getTypeColor = (type: string) => {
    return type === 'deposit' ? 'text-[#0ECB81]' : 'text-[#F6465D]';
  };

  const getSymbolColor = (symbol: string) => {
    switch(symbol) {
      case 'BTC': return 'bg-[#F7931A]';
      case 'ETH': return 'bg-[#627EEA]';
      case 'USDT': return 'bg-[#26A17B]';
      default: return 'bg-[#F0B90B]';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0C0D0F]">
      {/* Header */}
      <div className="bg-[#1E2026] p-4 sticky top-0 z-10 border-b border-[#2B3139]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <HistoryOutlined className="text-[#F0B90B] mr-2 text-lg" />
            <h1 className="text-lg font-bold text-white">{t('transactions.title', 'Transaction History')}</h1>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-[#2B3139] text-white rounded-full p-2 flex items-center justify-center"
            >
              <FilterOutlined />
            </button>
            <button 
              onClick={handleReset}
              className="bg-[#2B3139] text-white rounded-full p-2 flex items-center justify-center"
            >
              <ReloadOutlined />
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder={t('transactions.search', 'Search by asset, hash...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2B3139] text-white border-none rounded-lg pl-10 pr-4 py-2 text-sm"
          />
          <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A6ADBA]" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A6ADBA]"
            >
              <CloseOutlined />
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-[#1E2026] p-4 border-b border-[#2B3139]">
          <div className="space-y-3">
            <div>
              <label className="block text-[#A6ADBA] text-xs mb-1">{t('transactions.type', 'Type')}</label>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setSelectedType('all')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${selectedType === 'all' ? 'bg-[#F0B90B] text-[#0C0D0F]' : 'bg-[#2B3139] text-white'}`}
                >
                  {t('transactions.allTypes', 'All')}
                </button>
                <button 
                  onClick={() => setSelectedType('deposit')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${selectedType === 'deposit' ? 'bg-[#0ECB81] text-white' : 'bg-[#2B3139] text-white'}`}
                >
                  {t('transactions.deposit', 'Deposit')}
                </button>
                <button 
                  onClick={() => setSelectedType('withdrawal')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${selectedType === 'withdrawal' ? 'bg-[#F6465D] text-white' : 'bg-[#2B3139] text-white'}`}
                >
                  {t('transactions.withdrawal', 'Withdraw')}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-[#A6ADBA] text-xs mb-1">{t('transactions.symbol', 'Asset')}</label>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setSelectedSymbol('all')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${selectedSymbol === 'all' ? 'bg-[#F0B90B] text-[#0C0D0F]' : 'bg-[#2B3139] text-white'}`}
                >
                  {t('transactions.allAssets', 'All')}
                </button>
                <button 
                  onClick={() => setSelectedSymbol('BTC')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${selectedSymbol === 'BTC' ? 'bg-[#F7931A] text-white' : 'bg-[#2B3139] text-white'}`}
                >
                  BTC
                </button>
                <button 
                  onClick={() => setSelectedSymbol('ETH')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${selectedSymbol === 'ETH' ? 'bg-[#627EEA] text-white' : 'bg-[#2B3139] text-white'}`}
                >
                  ETH
                </button>
                <button 
                  onClick={() => setSelectedSymbol('USDT')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${selectedSymbol === 'USDT' ? 'bg-[#26A17B] text-white' : 'bg-[#2B3139] text-white'}`}
                >
                  USDT
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-[#A6ADBA] text-xs mb-1">{t('transactions.dateRange', 'Date Range')}</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  className="w-full bg-[#2B3139] text-white border-none rounded-lg px-3 py-2 text-sm"
                  onChange={(e) => setStartDate(e.target.value ? dayjs(e.target.value) : null)}
                />
                <input
                  type="date"
                  className="w-full bg-[#2B3139] text-white border-none rounded-lg px-3 py-2 text-sm"
                  onChange={(e) => setEndDate(e.target.value ? dayjs(e.target.value) : null)}
                />
              </div>
            </div>
            
            <button 
              onClick={handleFilter}
              className="w-full bg-[#F0B90B] text-[#0C0D0F] border-none rounded-lg py-2 font-medium text-sm"
            >
              {t('transactions.applyFilters', 'Apply')}
            </button>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#F0B90B]"></div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">🔍</div>
                <div className="text-[#A6ADBA] text-sm">{t('transactions.noTransactions', 'No transactions found')}</div>
              </div>
            ) : (
              filteredTransactions.map((tx) => (
                <div key={tx.id} className="bg-[#1E2026] rounded-lg p-4 border border-[#2B3139]">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full ${getSymbolColor(tx.symbol)} flex items-center justify-center mr-2`}>
                        <span className="text-white font-bold">{tx.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{tx.symbol}</div>
                        <div className="text-[#A6ADBA] text-xs">{dayjs(tx.date).format('YYYY-MM-DD HH:mm')}</div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(tx.status)} text-white`}>
                      {tx.status === 'completed' ? t('transactions.completed', 'Completed') : t('transactions.pending', 'Pending')}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <div className={getTypeColor(tx.type)}>
                      {tx.type === 'deposit' ? (
                        <span className="flex items-center"><ArrowDownOutlined className="mr-1" /> {t('transactions.deposit', 'Deposit')}</span>
                      ) : (
                        <span className="flex items-center"><ArrowUpOutlined className="mr-1" /> {t('transactions.withdrawal', 'Withdrawal')}</span>
                      )}
                    </div>
                    <div className="text-white font-medium">
                      {tx.type === 'deposit' ? '+' : '-'}{tx.amount} {tx.symbol}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-[#A6ADBA] text-xs">{t('transactions.usdValue', 'USD Value')}</div>
                    <div className="text-white font-medium">${tx.usdValue.toLocaleString()}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-[#A6ADBA] text-xs">{t('transactions.txHash', 'Transaction Hash')}</div>
                    <a 
                      href={`https://etherscan.io/tx/${tx.txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#F0B90B] text-xs truncate max-w-[150px]"
                      title={tx.txHash}
                    >
                      {tx.txHash.substring(0, 8)}...{tx.txHash.substring(tx.txHash.length - 8)}
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
} 