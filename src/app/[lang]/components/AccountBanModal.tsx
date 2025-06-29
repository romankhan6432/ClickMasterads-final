'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { securityCheck } from '../utils/securityCheck';
import { useRouter } from 'next/navigation';

interface AccountBanModalProps {
    isOpen: boolean;
    onClose: () => void;
    banReason?: string;
    banDuration?: string;
}

interface SecurityMetrics {
    clickInterval: number;
    patternMatch: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    detectionMessage: string;
}

const AccountBanModal: React.FC<AccountBanModalProps> = React.memo(({
    isOpen,
    onClose,
    banReason = 'Suspicious activity detected',
    banDuration = '24 hours'
}) => {
    const router = useRouter();
    const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
        clickInterval: 0,
        patternMatch: 0,
        riskLevel: 'Low',
        detectionMessage: 'Analyzing activity...'
    });

    useEffect(() => {
        const checkSecurity = async () => {
            const result = await securityCheck.checkSecurity();
            
            // Calculate pattern match percentage based on click consistency
            const patternMatch = result.isAutoClicker ? 98 : 
                               result.isScriptDetected ? 75 : 
                               result.clickCount > 3 ? 45 : 0;

            // Calculate average click interval
            const clickInterval = result.clickCount > 1 ? 
                Math.round((result.lastClickTime - Date.now()) / result.clickCount) : 0;

            // Determine risk level
            const riskLevel = result.isAutoClicker ? 'High' : 
                            result.isScriptDetected ? 'Medium' : 'Low';

            setSecurityMetrics({
                clickInterval: Math.abs(clickInterval),
                patternMatch,
                riskLevel,
                detectionMessage: result.message
            });
        };

        // Check security every 2 seconds
        const interval = setInterval(checkSecurity, 2000);
        return () => clearInterval(interval);
    }, []);

    // Record click when modal is interacted with
    const handleInteraction = useCallback(() => {
        securityCheck.recordClick();
    }, []);

    // Add click listener to document
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('click', handleInteraction);
            return () => {
                document.removeEventListener('click', handleInteraction);
                securityCheck.reset(); // Reset when modal closes
            };
        }
    }, [isOpen, handleInteraction]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={(e) => {
                handleInteraction();
                onClose();
            }} />

            {/* Modal Container */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-gray-800/95 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg mx-auto">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                           
                            <button
                                onClick={(e) => {
                                    handleInteraction();
                                    onClose();
                                }}
                                className="text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg">
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Warning Icon */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
                            <div className="relative flex justify-center">
                                <div className="w-20 h-20 bg-red-500/10 rounded-full p-4 border-2 border-red-500/50 animate-pulse">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full text-red-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Suspension Message */}
                        <div className="text-center space-y-4">
                            <div className="flex flex-col items-center space-y-2">
                                <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-red-500/20 to-red-900/20 border border-red-500/30 shadow-lg shadow-red-500/10">
                                    <div className="relative mr-2">
                                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </div>
                                    <span className="font-bold tracking-wider text-red-500 uppercase">Account Suspended</span>
                                </div>
                                <div className="text-xs text-red-400/80">Last Updated: Just Now</div>
                            </div>
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-300 animate-pulse">Account Access Blocked</h3>
                            <div className="space-y-4 text-gray-300">
                                <p className="text-base">Your account has been suspended due to:</p>
                                <div className="relative overflow-hidden">
                                    <div className="absolute inset-0 bg-red-500/10 blur-xl" />
                                    <div className="relative bg-gradient-to-r from-gray-800/90 to-gray-900/90 p-5 rounded-xl border border-red-500/20 shadow-lg">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl transform translate-x-16 -translate-y-8" />
                                        <p className="relative font-medium text-white text-lg">
                                            {banReason}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ban Details */}
                        <div className="bg-gradient-to-r from-gray-800 to-gray-700/30 rounded-xl p-6 space-y-4 border border-gray-600/30 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                                        <svg className="w-6 h-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-400">Ban Duration</h4>
                                        <p className="text-lg font-bold text-yellow-500">{banDuration}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">Started</p>
                                    <p className="text-sm font-medium text-white">2 hours ago</p>
                                </div>
                            </div>
                            <div className="pt-2">
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full animate-pulse"
                                        style={{ width: '75%' }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-400">
                                    <span>Time Elapsed</span>
                                    <span>Time Remaining: 22h</span>
                                </div>
                            </div>
                        </div>

                        {/* Prevention Tips */}
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-red-500/10 shadow-lg space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <svg className="w-6 h-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-lg text-red-400">Important Security Notice</h4>
                            </div>
                            
                            <div className="grid gap-3">
                                <div className="p-4 bg-gray-800/50 rounded-lg border border-red-500/5 hover:bg-gray-800/80 transition-colors duration-200 space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <div className="p-1.5 bg-red-500/10 rounded-lg">
                                            <svg className="w-5 h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-red-400">Auto-Clicker Detection</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    securityMetrics.riskLevel === 'High' ? 'bg-red-500/10 text-red-500' :
                                                    securityMetrics.riskLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    'bg-green-500/10 text-green-500'
                                                }`}>{securityMetrics.riskLevel} Risk</span>
                                            </div>
                                            <p className="text-sm text-gray-400">{securityMetrics.detectionMessage}</p>
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                <div className="bg-gray-900/50 p-2 rounded border border-red-500/10">
                                                    <div className="text-xs text-gray-500">Click Interval</div>
                                                    <div className="text-sm text-red-400 font-medium">{securityMetrics.clickInterval}ms</div>
                                                </div>
                                                <div className="bg-gray-900/50 p-2 rounded border border-red-500/10">
                                                    <div className="text-xs text-gray-500">Pattern Match</div>
                                                    <div className="text-sm text-red-400 font-medium">{securityMetrics.patternMatch}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-3 bg-gray-800/50 rounded-lg border border-red-500/5 flex items-start space-x-3 hover:bg-gray-800/80 transition-colors duration-200">
                                    <div className="p-1 bg-red-500/10 rounded">
                                        <svg className="w-4 h-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-300">Maintain reasonable intervals between ad views</span>
                                </div>
                                
                                <div className="p-3 bg-gray-800/50 rounded-lg border border-red-500/5 flex items-start space-x-3 hover:bg-gray-800/80 transition-colors duration-200">
                                    <div className="p-1 bg-red-500/10 rounded">
                                        <svg className="w-4 h-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-300">Use only one device at a time</span>
                                </div>
                            </div>
                        </div>

                        {/* Support Contact */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-400 mb-3">If you believe this is a mistake, please contact support</p>
                            <button 
                                onClick={onClose}
                                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

AccountBanModal.displayName = 'AccountBanModal';

export default AccountBanModal;
