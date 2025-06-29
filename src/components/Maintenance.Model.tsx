'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/modules/store';
import { MaintenanceSettings } from '@/modules/private/settings/types';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { FaTelegramPlane } from 'react-icons/fa';
import Link from 'next/link';

export default function MaintenanceModel() {
    const maintenanceData = useSelector((state: RootState) => state.private.settings.maintenance);
    const [isOpen, setIsOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        if (maintenanceData?.isEnabled) {
            setIsOpen(true);
        }
    }, [maintenanceData]);

    useEffect(() => {
        if (maintenanceData?.endTime && maintenanceData?.startTime) {
            const endTime = new Date(maintenanceData.endTime).getTime();
            const startTime = new Date(maintenanceData.startTime).getTime();
            const totalDuration = endTime - startTime;

            const updateTimer = () => {
                const now = Date.now();
                const remaining = Math.max(0, endTime - now);
                const elapsed = Math.min(now - startTime, totalDuration);

                if (remaining <= 0) {
                    setTimeLeft(0);
                    setElapsedTime(totalDuration);
                    setProgress(100);
                    return;
                }

                setTimeLeft(remaining);
                setElapsedTime(elapsed);
                setProgress((elapsed / totalDuration) * 100);
            };

            updateTimer();
            const timer = setInterval(updateTimer, 1000);

            return () => clearInterval(timer);
        }
    }, [maintenanceData?.endTime, maintenanceData?.startTime]);

    if (!maintenanceData?.isEnabled) {
        return null;
    }

    const formatTime = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatDateTime = (date: string) => {
        return new Date(date).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent animate-pulse-slow"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative w-full h-full md:h-auto md:max-w-2xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-none md:rounded-2xl shadow-2xl p-4 md:p-8 mx-auto flex flex-col justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" style={{ animationDelay: '1s' }}></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent" style={{ animationDelay: '2s' }}></div>

                <div className="text-center space-y-6 md:space-y-8 relative z-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping-slow"></div>
                        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-full flex items-center justify-center relative z-10">
                            <span className="text-4xl md:text-5xl animate-rotate-slow">🔧</span>
                        </div>
                    </div>


                    <div className="text-2xl md:text-4xl font-bold tracking-wide animate-rgb-flicker"> Under Maintenance</div>

                    <style jsx global>{`
                        @keyframes rgbFlicker {
                            0% { color: rgb(255, 0, 0); }
                            33% { color: rgb(0, 255, 0); }
                            66% { color: rgb(0, 0, 255); }
                            100% { color: rgb(255, 0, 0); }
                        }
                        @keyframes ping-slow {
                            0% { transform: scale(1); opacity: 0.5; }
                            50% { transform: scale(1.2); opacity: 0.2; }
                            100% { transform: scale(1); opacity: 0.5; }
                        }
                        @keyframes bounce-slow {
                            0%, 100% { transform: translateY(0) rotate(0deg); }
                            50% { transform: translateY(-5px) rotate(180deg); }
                        }
                        @keyframes rotate-slow {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                        @keyframes pulse-slow {
                            0%, 100% { transform: scale(1); opacity: 0.2; }
                            50% { transform: scale(1.2); opacity: 0.1; }
                        }
                        .animate-rgb-flicker {
                            animation: rgbFlicker 2s infinite;
                            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                        }
                        .animate-ping-slow {
                            animation: ping-slow 2s infinite;
                        }
                        .animate-bounce-slow {
                            animation: bounce-slow 2s infinite;
                        }
                        .animate-pulse-slow {
                            animation: pulse-slow 4s infinite;
                        }
                        .animate-rotate-slow {
                            animation: rotate-slow 4s linear infinite;
                        }
                    `}</style>

                    <p className="text-lg md:text-xl text-gray-300 px-4">
                        {maintenanceData.message || 'We are currently performing maintenance. Please check back later.'}
                    </p>

                    {maintenanceData.endTime && maintenanceData.startTime && (
                        <div className="space-y-4 md:space-y-6 px-4">
                            <div className="relative w-full bg-gray-800/50 rounded-full h-4 md:h-5 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-20"></div>
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 h-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center md:justify-start text-gray-400">
                                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                                        Progress: {Math.min(Math.round(progress), 100)}%
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start text-gray-400">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                        Elapsed: {formatTime(elapsedTime)}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center md:justify-end text-gray-400">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                                        Remaining: {formatTime(timeLeft)}
                                    </div>
                                    <div className="flex items-center justify-center md:justify-end text-gray-400">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
                                        End: {formatDateTime(maintenanceData.endTime)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}




                </div>

                <div className="mt-8 text-white text-center space-y-4">

                    <p className="text-sm md:text-base text-gray-400">
                        Connecting the world through innovation. Follow us for updates.
                    </p>



                    {/* Contact Info */}
                    <div className="text-sm text-gray-300">
                        channel: <a href="https://t.me/Nur6432" className="underline hover:text-white">https://t.me/Nur6432</a> <br />
                       admin: <a href="https://t.me/@nurislamroman" target="_blank" className="underline hover:text-white">@nurislamroman</a>
                    </div>
                    {/* Social Icons */}
                    <div className="flex justify-center gap-4 text-2xl text-white">
                        <a href="https://www.facebook.com/romankhan6432" target="_blank" rel="noopener noreferrer">
                            <FaFacebook className="hover:text-blue-500 transition-colors duration-200" />
                        </a>
                       
                        <Link  href="https://t.me/Nur6432" target="_blank" rel="noopener noreferrer">

                        
                            <svg
                                className="w-6 h-6 hover:text-blue-400 transition-colors duration-200"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.04 17.75c-.39 0-.32-.15-.45-.52l-1.13-3.72L17.14 7.5" />
                                <path
                                    d="M9.04 17.75c.3 0 .43-.14.6-.3l1.6-1.54 3.33 2.43c.61.33 1.05.16 1.2-.57L19.98 5.8c.2-.84-.33-1.22-.89-1.03L3.42 10.36c-.81.32-.8.79-.14 1 .59.18 1.3.4 2.01.63l11.72-7.37"
                                    fillRule="evenodd"
                                />
                            </svg>
                        </Link>

                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitter className="hover:text-blue-400 transition-colors duration-200" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="hover:text-pink-500 transition-colors duration-200" />
                        </a>
                        
                    </div>

                    <p className="text-xs text-gray-500">© {new Date().getFullYear()} ROMAN. All rights reserved.</p>
                </div>


            </div>
        </div>




    );
}

///https://www.facebook.com/romankhan6432

////https://t.me/Nur6432








