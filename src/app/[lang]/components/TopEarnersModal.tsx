'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/modules/store';
import { fetchTopEarners } from '@/modules/public/topEarners/topEarnersActions';
import { useTranslation } from 'react-i18next';

interface TopEarnersModalProps {
    isOpen: boolean;
    onClose: () => void;

}

export default function TopEarnersModal({ isOpen, onClose }: TopEarnersModalProps) {
    const [activeTab, setActiveTab] = useState('today');
    const dispatch = useDispatch();
    const { today, allTime, loading } = useSelector((state: RootState) => state.public.topEarners);
    const { t } = useTranslation();

    useEffect(() => {
        if (isOpen) {
            // Initial fetch
            dispatch(fetchTopEarners('today'));
            
            // Set up auto-refresh interval (every 60 seconds)
            const intervalId = setInterval(() => {
                dispatch(fetchTopEarners('today'));
            }, 60000);

            // Cleanup interval on unmount or when modal closes
            return () => clearInterval(intervalId);
        }
    }, [isOpen, dispatch]);

    // Add effect to fetch data when tab changes
    useEffect(() => {
        if (isOpen) {
            dispatch(fetchTopEarners(activeTab === 'today' ? 'today' : 'all'));
        }
    }, [activeTab, isOpen, dispatch]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 md:bg-black/50 md:backdrop-blur-sm md:p-4 md:flex md:items-center md:justify-center">
            <div className="relative h-full md:h-auto w-full md:max-w-sm md:rounded-2xl md:border md:border-gray-800 bg-gray-900 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-10 p-4 border-b border-gray-800 bg-gradient-to-r from-purple-500 to-indigo-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">{t('topEarners')}</h2>
                        <button 
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white/80 hover:text-white transition-all hover:bg-black/30 active:scale-95"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] md:max-h-[80vh]">
                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-gray-800/50 rounded-lg">
                        <button
                            onClick={() => setActiveTab('today')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                                activeTab === 'today'
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {t('today')}
                        </button>
                        <button
                            onClick={() => setActiveTab('allTime')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                                activeTab === 'allTime'
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                            }`}
                        >
                             {t('allTime')}
                        </button>
                    </div>

                    {/* Leaderboard Headers */}
                    <div className="grid grid-cols-12 gap-2 px-4 text-sm text-gray-400">
                        <div className="col-span-2">{t('rank')}</div>
                        <div className="col-span-6"> {t('user')}</div>
                        <div className="col-span-4 text-right"> {t('earned')}</div>
                    </div>

                    {/* Leaderboard List */}
                    <div className="space-y-2">
                        {loading ? (
                            <div className="text-center py-8 text-gray-400">
                                 {t('loading')}
                            </div>
                        ) : (activeTab === 'today' ? today : allTime).map((entry: any, index: number) => (
                            <div 
                                key={index}
                                className={`grid grid-cols-12 gap-2 p-4 rounded-xl ${
                                    entry.isCurrentUser
                                    ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/20'
                                    : 'bg-gray-800/30'
                                }`}
                            >
                                <div className="col-span-2 font-medium text-gray-300">#{entry?.rank}</div>
                                <div className="col-span-6 font-medium text-white truncate  ">
                                    {entry?.name.slice(0,10)}
                                    {entry.isCurrentUser && (
                                        <span className="ml-1 text-xs text-purple-400">(You)</span>
                                    )}
                                </div>
                                <div className="col-span-4 text-right font-medium text-white">
                                    ${entry.earned.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {!loading && ((activeTab === 'today' ? today : allTime).length === 0) && (
                        <div className="text-center py-8 text-gray-400">
                            {t('noDataAvailable')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
