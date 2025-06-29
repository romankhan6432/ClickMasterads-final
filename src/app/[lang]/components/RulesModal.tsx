'use client';

interface RulesModalProps {
    isOpen: boolean;
    onClose: () => void;
    dictionary?: {
        rules: string;
        close: string;
        general: string;
        earnings: string;
        withdrawals: string;
        safety: string;
    };
}

export default function RulesModal({ 
    isOpen, 
    onClose,
    dictionary = {
        rules: 'Rules & Guidelines',
        close: 'Close',
        general: 'General Rules',
        earnings: 'Earnings',
        withdrawals: 'Withdrawals',
        safety: 'Safety & Security'
    }
}: RulesModalProps) {
    if (!isOpen) return null;

    const rules = {
        general: [
            'Watch ads to earn rewards',
            'One account per user',
            'Complete daily tasks for bonuses',
            'Follow community guidelines',
            'Report any issues to support'
        ],
        earnings: [
            'Earn per valid ad view',
            'Daily earnings are capped',
            'Bonus rewards for consistency',
            'Extra earnings from referrals',
            'Achievement rewards available'
        ],
        withdrawals: [
            'Minimum withdrawal: $10',
            'Processed within 24 hours',
            'Verified account required',
            'Multiple payment methods',
            'Weekly withdrawal limits'
        ],
        safety: [
            'Keep your account secure',
            'Never share your credentials',
            'Use official channels only',
            'Beware of scam attempts',
            'Enable 2FA for protection'
        ]
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 md:bg-black/50 md:backdrop-blur-sm md:p-4 md:flex md:items-center md:justify-center">
            <div className="relative h-full md:h-auto w-full md:max-w-2xl md:rounded-2xl md:border md:border-gray-800 bg-gray-900 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-10 p-4 border-b border-gray-800 bg-gradient-to-r from-purple-500 to-indigo-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">{dictionary.rules}</h2>
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
                    {/* General Rules */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                                📋
                            </div>
                            <h3 className="text-lg font-semibold text-white">{dictionary.general}</h3>
                        </div>
                        <div className="pl-2 space-y-2">
                            {rules.general.map((rule, index) => (
                                <div key={index} className="flex items-start gap-2 text-gray-300">
                                    <span className="text-purple-400 mt-1">•</span>
                                    <p>{rule}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Earnings */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                                💰
                            </div>
                            <h3 className="text-lg font-semibold text-white">{dictionary.earnings}</h3>
                        </div>
                        <div className="pl-2 space-y-2">
                            {rules.earnings.map((rule, index) => (
                                <div key={index} className="flex items-start gap-2 text-gray-300">
                                    <span className="text-purple-400 mt-1">•</span>
                                    <p>{rule}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Withdrawals */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                                💳
                            </div>
                            <h3 className="text-lg font-semibold text-white">{dictionary.withdrawals}</h3>
                        </div>
                        <div className="pl-2 space-y-2">
                            {rules.withdrawals.map((rule, index) => (
                                <div key={index} className="flex items-start gap-2 text-gray-300">
                                    <span className="text-purple-400 mt-1">•</span>
                                    <p>{rule}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Safety */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                                🔒
                            </div>
                            <h3 className="text-lg font-semibold text-white">{dictionary.safety}</h3>
                        </div>
                        <div className="pl-2 space-y-2">
                            {rules.safety.map((rule, index) => (
                                <div key={index} className="flex items-start gap-2 text-gray-300">
                                    <span className="text-purple-400 mt-1">•</span>
                                    <p>{rule}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
