'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLoading } from '../../../providers/LoadingProvider';

export default function MainContent() {
    const [balance, setBalance] = useState<string>('0.000');
    const [adCount, setAdCount] = useState<number>(0);
    const [isCountdownVisible, setIsCountdownVisible] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(15);
    const [isAutoMode, setIsAutoMode] = useState<boolean>(false);
    const [directLinks, setDirectLinks] = useState<{ link1: string; link2: string }>({ link1: '', link2: '' });
    const [error, setError] = useState<string | null>(null);
    const { showLoading, hideLoading } = useLoading();
    const autoAdIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const countdownIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const fetchUserState = useCallback(async () => {
        try {
            setError(null);
            const response = await fetch('/api/user-state');
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch user state');
            }

            setBalance(data.balance.toFixed(3));
            setAdCount(data.adsWatched);
            setTimer(data.timeRemaining);
            setDirectLinks(data.directLinks);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user state';
            setError(errorMessage);
            console.error('Error fetching user state:', error);
        }
    }, []);

    useEffect(() => {
        fetchUserState();
    }, [fetchUserState]);

    const showRewardedAd = async () => {
        try {
            setError(null);
            setIsCountdownVisible(true);
            
            const response = await fetch('/api/ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adType: 'regular' })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to process ad');
            }

            setBalance(data.newBalance.toFixed(3));
            setAdCount(data.adsWatched);

            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }

            countdownIntervalRef.current = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        if (countdownIntervalRef.current) {
                            clearInterval(countdownIntervalRef.current);
                        }
                        setIsCountdownVisible(false);
                        setTimer(15);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to show ad';
            setError(errorMessage);
            console.error('Error showing ad:', error);
        } finally {
            hideLoading();
        }
    };

    const startAutoAds = () => {
        setIsAutoMode((prev) => !prev);
    };

    useEffect(() => {
        if (isAutoMode) {
            const runAutoAd = async () => {
                try {
                    setError(null);
                    const response = await fetch('/api/ads', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ adType: 'auto' })
                    });

                    const data = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(data.error || 'Failed to process auto ad');
                    }

                    setBalance(data.newBalance.toFixed(3));
                    setAdCount(data.adsWatched);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to process auto ad';
                    setError(errorMessage);
                    console.error('Error in auto ad mode:', error);
                    setIsAutoMode(false);
                }
            };

            autoAdIntervalRef.current = setInterval(runAutoAd, 15000);
            runAutoAd(); // Run immediately on auto mode start
        }

        return () => {
            if (autoAdIntervalRef.current) {
                clearInterval(autoAdIntervalRef.current);
            }
        };
    }, [isAutoMode]);

    const handleDirectLink = useCallback((url: string) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }, []);

    return (
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-8 max-w-4xl flex flex-col items-center justify-center">
            <div className="bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6 space-y-3 sm:space-y-6 w-full text-center">
                <h1 className="text-xl sm:text-3xl font-bold text-white rgb-animate py-2 sm:py-4 px-3 sm:px-6 rounded-xl shadow-lg text-center leading-tight">
                    Watch Ads & Earn Rewards
                </h1>
                <p className="text-sm sm:text-lg text-white bg-gradient-to-r from-emerald-600 to-teal-800 py-2 sm:py-4 px-3 sm:px-6 rounded-xl shadow-lg text-center leading-relaxed">
                    Click the button below to watch a video ad and earn your reward!
                </p>
                
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 bg-gray-900/50 p-4 rounded-xl">
                    <div className="text-base sm:text-xl font-bold text-yellow-400 text-center">
                        Balance
                        <div className="text-lg sm:text-2xl">${balance}</div>
                    </div>
                    <div className="text-base sm:text-xl font-bold text-emerald-400 text-center">
                        Total Ads
                        <div className="text-lg sm:text-2xl">{adCount}</div>
                    </div>
                </div>
                
                {isCountdownVisible && (
                    <div className="text-lg sm:text-2xl font-bold text-indigo-400 bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-3">
                        Closing in: <span className="text-xl sm:text-3xl">{timer}</span> seconds
                    </div>
                )}

                <div className="space-y-2 sm:space-y-4 flex flex-col items-center">
                    <button
                        className="w-full max-w-md h-11 sm:h-14 px-4 sm:px-8 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-800 hover:from-indigo-700 hover:to-purple-900 text-sm sm:text-base text-center flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={showRewardedAd}
                        disabled={isCountdownVisible}
                    >
                        {isCountdownVisible ? 'Ad in Progress...' : 'Watch Ads'}
                    </button>
                    <button
                        className={`w-full max-w-md h-11 sm:h-14 px-4 sm:px-8 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${
                            isAutoMode
                                ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900'
                                : 'bg-gradient-to-r from-amber-600 to-orange-800 hover:from-amber-700 hover:to-orange-900'
                        } text-sm sm:text-base text-center flex items-center justify-center`}
                        onClick={startAutoAds}
                    >
                        {isAutoMode ? 'Stop Auto Ads' : 'Start Auto Ads'}
                    </button>
                    
                    {directLinks.link1 && (
                        <button
                            className="w-full max-w-md h-11 sm:h-14 px-4 sm:px-8 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-rose-600 to-pink-800 hover:from-rose-700 hover:to-pink-900 text-sm sm:text-base text-center flex items-center justify-center"
                            onClick={() => handleDirectLink(directLinks.link1)}
                        >
                            Direct Link 1
                        </button>
                    )}
                    
                    {directLinks.link2 && (
                        <button
                            className="w-full max-w-md h-11 sm:h-14 px-4 sm:px-8 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-cyan-600 to-blue-800 hover:from-cyan-700 hover:to-blue-900 text-sm sm:text-base text-center flex items-center justify-center"
                            onClick={() => handleDirectLink(directLinks.link2)}
                        >
                            Direct Link 2
                        </button>
                    )}
                </div>
                
                <div className="bg-gradient-to-r from-amber-600 to-orange-800 rounded-xl p-4 mt-6">
                    <p className="text-white text-xs sm:text-sm font-medium">
                        Watch the complete ad to receive your reward. Auto mode will automatically watch ads every 15 seconds.
                    </p>
                </div>
            </div>
        </div>
    );
}