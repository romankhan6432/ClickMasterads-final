'use client';

import { RootState } from "@/modules/store";
import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from 'react';

// Add styles for crash animation
const styles = `
@keyframes crash {
    0% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(-20px, 20px) rotate(-15deg); }
    50% { transform: translate(20px, 40px) rotate(15deg); }
    75% { transform: translate(-20px, 60px) rotate(-15deg); }
    100% { transform: translate(0, 80px) rotate(0deg); opacity: 0; }
}

@keyframes explosion {
    0% { transform: scale(0); opacity: 1; }
    50% { transform: scale(2); opacity: 0.8; }
    100% { transform: scale(4); opacity: 0; }
}

.crash-animation {
    animation: crash 1s ease-in forwards;
}

.explosion {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,165,0,0.5) 50%, transparent 100%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: explosion 0.5s ease-out forwards;
    pointer-events: none;
    z-index: 9999;
}
`;

// Add styles to document head
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

interface SpinModalProps {
    isOpen: boolean;
    onClose: () => void;
    dictionary: {
        spinAndEarn: string;
        balance: string;
        totalWon: string;
        totalLost: string;
        close: string;
        betHistory: string;
        multiplier: string;
        cashout: string;
        betAmount: string;
        autoCashout: string;
    };
}

interface BetHistory {
    date: Date;
    amount: number;
    multiplier: number;
    payout: number;
    crypto: string;
    status: 'WIN' | 'LOSS' | 'CASHOUT';
}

const cryptoOptions = [
    { symbol: 'USDT', color: 'from-green-500 to-green-600', minBet: 1, maxBet: 100, icon: '💵' },
    { symbol: 'TRX', color: 'from-red-500 to-red-600', minBet: 10, maxBet: 1000, icon: '⚡' },
    { symbol: 'XLM', color: 'from-blue-500 to-blue-600', minBet: 5, maxBet: 500, icon: '⭐' }
];

export default function SpinModal({ isOpen, onClose, dictionary }: SpinModalProps) {
    const { user } = useSelector((state: RootState) => state.public.auth);
    const [multiplier, setMultiplier] = useState(1.00);
    const [isBetting, setIsBetting] = useState(false);
    const [canCashout, setCanCashout] = useState(false);
    const [currentPayout, setCurrentPayout] = useState(0);
    const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
    const [totalWon, setTotalWon] = useState(0);
    const [totalLost, setTotalLost] = useState(0);
    const [betAmount, setBetAmount] = useState(1);
    const [selectedCrypto, setSelectedCrypto] = useState('USDT');
    const [autoCashoutAt, setAutoCashoutAt] = useState<number | null>(null);
    const [isAutoCashoutEnabled, setIsAutoCashoutEnabled] = useState(false);

    const startBet = () => {
        if (isBetting || !user?.balance || user.balance < betAmount || (isAutoCashoutEnabled && !autoCashoutAt)) return;
        
        setIsBetting(true);
        setCanCashout(true);
        setMultiplier(1.00);

        // Start increasing multiplier
        const interval = setInterval(() => {
            setMultiplier(prev => {
                const crashPoint = Math.random() * 10; // Random crash point between 1x and 10x
                const newMultiplier = prev + 0.01;

                // Check for auto-cashout
                if (isAutoCashoutEnabled && autoCashoutAt && newMultiplier >= autoCashoutAt) {
                    clearInterval(interval);
                    handleCashout();
                    return prev;
                }

                if (newMultiplier >= crashPoint) {
                    clearInterval(interval);
                    handleLoss();
                    return 1.00;
                }

                setCurrentPayout(betAmount * newMultiplier);
                return newMultiplier;
            });
        }, 100);

        return () => clearInterval(interval);
    };

    const handleCashout = () => {
        if (!canCashout) return;

        const payout = betAmount * multiplier;
        const newHistory: BetHistory = {
            date: new Date(),
            amount: betAmount,
            multiplier: multiplier,
            payout: payout,
            crypto: selectedCrypto,
            status: 'CASHOUT'
        };

        setBetHistory(prev => [newHistory, ...prev].slice(0, 10));
        setTotalWon(prev => prev + payout - betAmount);
        resetBet();
    };

    const handleLoss = () => {
        // Add crash animation class
        const rocketElement = document.querySelector('.rocket-element');
        if (rocketElement) {
            rocketElement.classList.add('crash-animation');
        }

        // Add explosion effect
        const explosionElement = document.createElement('div');
        explosionElement.className = 'explosion';
        document.body.appendChild(explosionElement);

        setTimeout(() => {
            const newHistory: BetHistory = {
                date: new Date(),
                amount: betAmount,
                multiplier: multiplier,
                payout: 0,
                crypto: selectedCrypto,
                status: 'LOSS'
            };

            setBetHistory(prev => [newHistory, ...prev].slice(0, 10));
            setTotalLost(prev => prev + betAmount);
            resetBet();

            // Remove explosion effect
            explosionElement.remove();
        }, 1000);
    };

    const resetBet = () => {
        setIsBetting(false);
        setCanCashout(false);
        setMultiplier(1.00);
        setCurrentPayout(0);
    };

    const handleBetChange = (amount: number) => {
        const selectedOption = cryptoOptions.find(opt => opt.symbol === selectedCrypto);
        if (selectedOption) {
            const newAmount = Math.max(selectedOption.minBet, 
                Math.min(selectedOption.maxBet, amount));
            setBetAmount(newAmount);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 md:bg-black/50 md:backdrop-blur-sm md:p-4 md:flex md:items-center md:justify-center">
            <div className="relative h-full md:h-auto w-full md:max-w-sm md:rounded-2xl md:border md:border-gray-800 bg-gray-900 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-10 p-4 border-b border-gray-800 bg-gradient-to-r from-purple-500 to-indigo-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">{dictionary.spinAndEarn}</h2>
                        <button 
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white/80 hover:text-white transition-all hover:bg-black/30 active:scale-95"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] md:max-h-[80vh]">
                    {/* Balance Display */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg ring-4 ring-purple-400/20">
                            <span className="text-2xl">💰</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm text-gray-400">{user?.fullName}</div>
                            <div className="text-xl font-bold text-white">${user?.balance?.toFixed(2) || '0.00'}</div>
                        </div>
                    </div>

                    {/* Crypto Options */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {cryptoOptions.map((crypto) => (
                            <div 
                                key={crypto.symbol} 
                                className={`bg-gradient-to-r ${crypto.color} rounded-xl p-4 text-center cursor-pointer transform hover:scale-105 transition-all ${selectedCrypto === crypto.symbol ? 'ring-2 ring-white' : ''}`}
                                onClick={() => !isBetting && setSelectedCrypto(crypto.symbol)}
                            >
                                <div className="text-2xl mb-1">{crypto.icon}</div>
                                <div className="text-white font-bold">{crypto.symbol}</div>
                                <div className="text-xs text-white/80">{crypto.minBet}-{crypto.maxBet}</div>
                            </div>
                        ))}
                    </div>

                    {/* Multiplier Display with Rocket */}
                    <div className="bg-gray-800/30 rounded-xl p-8 text-center mb-4 border border-gray-700/50 relative overflow-hidden h-[300px]">
                        <div className="relative z-10">
                            <div className={`text-5xl font-bold mb-2 transition-colors ${isBetting ? 'text-green-400' : 'text-white'}`}>
                                {multiplier.toFixed(2)}x
                            </div>
                            <div className="text-lg text-gray-400">
                                Potential Payout: ${currentPayout.toFixed(2)}
                            </div>
                        </div>
                        
                        {/* Rocket Animation */}
                        {isBetting && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="absolute left-0 right-0 bottom-0 h-2 bg-gradient-to-r from-green-500 to-green-600 opacity-30" />
                                <div 
                                    className={`transform transition-transform duration-100 rocket-element ${isBetting ? 'translate-y-0' : 'translate-y-full'}`}
                                    style={{ 
                                        transform: `translateY(-${(multiplier - 1) * 30}px)`,
                                    }}
                                >
                                    <div className="relative w-32 h-32">
                                        <svg viewBox="0 0 24 24" className="w-full h-full">
                                            <defs>
                                                <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#f43f5e" />
                                                    <stop offset="100%" stopColor="#ef4444" />
                                                </linearGradient>
                                                <linearGradient id="rocketShine" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                                                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                                                </linearGradient>
                                                <filter id="glow">
                                                    <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                                                    <feMerge>
                                                        <feMergeNode in="coloredBlur"/>
                                                        <feMergeNode in="SourceGraphic"/>
                                                    </feMerge>
                                                </filter>
                                            </defs>
                                            <g filter="url(#glow)" className="transform scale-150">
                                                {/* Rocket Body */}
                                                <path d="M12 2L9 9h6l-3-7z" fill="url(#rocketBody)"/>
                                                <path d="M12 3L9.5 8h5L12 3z" fill="url(#rocketShine)"/>
                                                {/* Wings */}
                                                <path d="M7 9l2.5-3L12 9H7z" fill="#dc2626">
                                                    <animate attributeName="opacity" values="1;0.7;1" dur="0.5s" repeatCount="indefinite" />
                                                </path>
                                                <path d="M17 9l-2.5-3L12 9h5z" fill="#dc2626">
                                                    <animate attributeName="opacity" values="1;0.7;1" dur="0.5s" repeatCount="indefinite" />
                                                </path>
                                                {/* Engine */}
                                                <path d="M10 9h4v2l-2 1-2-1V9z" fill="#991b1b">
                                                    <animate attributeName="fill" values="#991b1b;#dc2626;#991b1b" dur="0.3s" repeatCount="indefinite" />
                                                </path>
                                            </g>
                                        </svg>
                                        {/* Enhanced Flame Effect */}
                                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                                            <div className="relative w-4 h-24">
                                                <div className="absolute inset-0 animate-pulse">
                                                    <div className="w-full h-full bg-gradient-to-t from-transparent via-yellow-500 to-red-500 rounded-full opacity-75">
                                                        <animate attributeName="height" values="100%;80%;100%" dur="0.3s" repeatCount="indefinite" />
                                                    </div>
                                                </div>
                                                <div className="absolute inset-0 animate-pulse delay-75">
                                                    <div className="w-full h-full bg-gradient-to-t from-transparent via-orange-500 to-yellow-500 rounded-full opacity-50">
                                                        <animate attributeName="height" values="90%;70%;90%" dur="0.4s" repeatCount="indefinite" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bet Amount */}
                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white">Bet Amount</span>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleBetChange(betAmount - 1)}
                                    className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600"
                                >-</button>
                                <input 
                                    type="number"
                                    value={betAmount}
                                    onChange={(e) => handleBetChange(Number(e.target.value))}
                                    className="w-20 bg-gray-700 text-white text-center rounded-lg p-1"
                                />
                                <button 
                                    onClick={() => handleBetChange(betAmount + 1)}
                                    className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600"
                                >+</button>
                            </div>
                        </div>
                    </div>

                    {/* Auto Cashout */}
                    <div className="flex items-center gap-4 mb-4 bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isAutoCashoutEnabled}
                                onChange={(e) => setIsAutoCashoutEnabled(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600"
                                disabled={isBetting}
                            />
                            <span className="text-sm text-gray-300">{dictionary.autoCashout}</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={autoCashoutAt || ''}
                                onChange={(e) => setAutoCashoutAt(e.target.value ? parseFloat(e.target.value) : null)}
                                placeholder="2.00"
                                className="w-24 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                                min="1.01"
                                max="10"
                                step="0.01"
                                disabled={!isAutoCashoutEnabled || isBetting}
                            />
                            <span className="text-sm text-gray-400">x</span>
                        </div>
                    </div>

                    {/* Bet Controls */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <button
                            onClick={startBet}
                            disabled={isBetting || !user?.balance || user.balance < betAmount || (isAutoCashoutEnabled && !autoCashoutAt)}
                            className={`p-4 rounded-xl font-bold text-white ${isBetting
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:scale-95 transition-all'
                            }`}
                        >
                            Place Bet
                        </button>
                        <button
                            onClick={handleCashout}
                            disabled={!canCashout}
                            className={`p-4 rounded-xl font-bold text-white ${!canCashout
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 active:scale-95 transition-all'
                            }`}
                        >
                            Cash Out
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 rounded-xl p-3">
                            <div className="text-sm text-gray-400">{dictionary.totalWon}</div>
                            <div className="text-lg font-bold text-green-500">${totalWon.toFixed(2)}</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-3">
                            <div className="text-sm text-gray-400">{dictionary.totalLost}</div>
                            <div className="text-lg font-bold text-red-500">${totalLost.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Bet History */}
                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                        <h3 className="text-lg font-semibold text-white mb-3">{dictionary.betHistory}</h3>
                        <div className="space-y-2">
                            {betHistory.map((bet, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                    <div className="text-gray-400">
                                        {bet.date.toLocaleDateString()} - {bet.crypto}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">{bet.multiplier.toFixed(2)}x</span>
                                        <span className={bet.status === 'CASHOUT' ? 'text-green-400' : 'text-red-400'}>
                                            ${bet.status === 'CASHOUT' ? bet.payout.toFixed(2) : bet.amount.toFixed(2)}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                                            bet.status === 'CASHOUT' 
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {bet.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
