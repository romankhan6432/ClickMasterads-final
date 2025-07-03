'use client';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    dictionary?: {
        about: string;
        close: string;
        welcome: string;
        description: string;
        features: string;
        howItWorks: string;
        support: string;
        version: string;
        rules: string;
        general: string;
        earnings: string;
        withdrawals: string;
        safety: string;
    };
}

export default function AboutModal({
    isOpen,
    onClose,
    dictionary = {
        // Header texts
        about: 'About ClickMaster',
        close: 'Close',

        // Welcome section
        welcome: 'Welcome to ClickMaster',
        description: 'Your trusted platform for earning rewards by watching ads',

        // Section titles
        features: 'Amazing Features',
        howItWorks: 'How It Works',
        support: 'Get Support',
        rules: 'Rules & Guidelines',
        general: 'General Rules',
        earnings: 'Earnings',
        withdrawals: 'Withdrawals',
        safety: 'Safety & Security',

        // Footer
        version: 'Version'
    }






}: AboutModalProps) {
    if (!isOpen) return null;




    const features = [
        { icon: '💰', title: 'Earn Rewards', description: 'Get paid for watching advertisements' },
        { icon: '🎯', title: 'Daily Tasks', description: 'Complete tasks for bonus earnings' },
        { icon: '🔄', title: 'Auto-Play', description: 'Automated ad viewing experience' },
        { icon: '📊', title: 'Statistics', description: 'Track your earnings and progress' },
        { icon: '🏆', title: 'Achievements', description: 'Unlock rewards for milestones' },
        { icon: '💳', title: 'Easy Withdrawals', description: 'Multiple payment options available' }
    ];



    const howItWorks = [
        'Sign in with your Telegram account',
        'Watch ads to earn rewards',
        'Complete daily tasks for bonuses',
        'Track your progress and achievements',
        'Withdraw earnings when ready'
    ];

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
        <div className="fixed inset-0 z-50 bg-gray-900 md:bg-black/60 md:backdrop-blur-md md:p-4 md:flex md:items-center md:justify-center">
            <div className="relative h-full md:h-auto w-full md:max-w-2xl md:rounded-2xl md:border md:border-purple-500/30 bg-gradient-to-b from-gray-900 via-gray-900 to-black shadow-2xl shadow-purple-500/20 overflow-hidden">
                {/* Background decoration elements */}

                {/* Header */}
                <div className="sticky top-0 z-10 p-4 border-b border-blue-700/30 bg-blue-950">
                    <div className="flex items-center justify-between">
                        <div className="flex-1"></div>
                        <div className="flex-1 flex justify-center">
                            <div className="inline-block rounded-full px-6 py-2 border-2 header-border">
                                <h2 className="text-center text-2xl font-bold rgb-header whitespace-nowrap">
                                    {dictionary.about}
                                </h2>
                            </div>
                        </div>
                        <style jsx>{`
                            @keyframes rgbHeaderEffect {
                                0% { color: rgba(252, 18, 18, 0.9); }
                                 2% { color: rgb(121, 3, 255); }
                                25% { color: rgb(11, 14, 223); }
                                 30% { color: rgb(0, 243, 32); }
                                50% { color: rgb(224, 6, 6); }
                                75% { color: rgb(10, 255, 51); }
                                100% { color: rgb(255, 123, 0); }
                            }
                            @keyframes rgbBorderEffect {
                                0% { border-color: rgb(30, 144, 255); }
                                25% { border-color: rgb(0, 191, 255); }
                                50% { border-color: rgb(65, 105, 225); }
                                75% { border-color: rgb(100, 149, 237); }
                                100% { border-color: rgb(30, 144, 255); }
                            }
                            .rgb-header {
                                animation: rgbHeaderEffect 5s linear infinite;
                                text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
                            }
                            .header-border {
                                animation: rgbBorderEffect 5s linear infinite;
                                box-shadow: 0 0 15px rgba(224, 17, 162, 0.2);
                            }
                        `}</style>
                        <div className="flex-1 flex justify-end">
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white/80 hover:text-white transition-all hover:bg-black/30 active:scale-95"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)] md:max-h-[80vh] bg-gradient-to-b from-gray-900 to-black">
                    {/* Welcome Section */}
                    <div className="text-center space-y-3 p-4 rounded-xl bg-gradient-to-b from-purple-900/10 to-indigo-900/10 border border-purple-500/10">
                        <h1 className="text-2xl font-bold rgb-welcome-flicker">
                            {dictionary.welcome}
                        </h1>
                        <style jsx>{`
                            @keyframes rgbWelcomeEffect {
                                0% { color: rgb(255, 0, 0); }
                                30% { color: rgb(255, 165, 0); }
                                40% { color: rgb(255, 255, 0); }
                            70% { color: rgb(0, 255, 0); }
                               
                                80% { color: rgb(128, 0, 128); }
                                100% { color: rgb(255, 0, 0); }
                            }
                            .rgb-welcome-flicker {
                                animation: rgbWelcomeEffect 1s linear infinite;
                                text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
                            }
                        `}</style>
                        <p className="text-gray-300">{dictionary.description}</p>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-1"></div>
                    </div>


                    {/* Support Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent inline-block">{dictionary.support}</h3>
                        <div className="p-4 rounded-xl bg-gradient-to-b from-gray-800/40 to-gray-900/40 border border-purple-500/30 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-xl">
                                    💬
                                </div>
                                <div>
                                    <p>  <p className="text-gray-300">Need help? Contact our support team through Telegram </p>
                                        Channel <a href="https://t.me/Nur6432" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
                                            @Nur islam Roman </a></p>

                                    <p> Admin/Ceo <a href="https://t.me/nurislamroman" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
                                        @Nur islam Roman </a></p>

                                    <p>Developer <a href="https://t.me/MdRijonHossainJibon" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
                                        @MdRijonHossainJibon</a></p>

                                    <p className="font-bold mt-4 rgb-flicker" style={{ animation: "rgbFlicker 1s linear infinite" }}>Contact the Admin and developer to design the Bot/website according to your preferences  </p>
                                    <style jsx>{`
                                            @keyframes rgbFlicker {
                                                0% { color: rgb(255, 0, 0); }
                                                33% { color: rgb(0, 255, 0); }
                                                66% { color: rgb(0, 0, 255); }
                                                100% { color: rgb(255, 0, 0); }
                                            }
                                            .rgb-flicker {
                                                font-weight: bold;
                                            }
                                        `}</style>
                                </div>
                            </div>
                        </div>
                    </div>




                    {/* Features Grid */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent inline-block">{dictionary.features}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-xl bg-gradient-to-b from-gray-800/40 to-gray-900/40 border border-purple-500/30 hover:border-purple-500/50 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-xl">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white">{feature.title}</h4>
                                            <p className="text-sm text-gray-400">{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent inline-block">{dictionary.howItWorks}</h3>
                        <div className="space-y-4">
                            {howItWorks.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-b from-gray-800/40 to-gray-900/40 border border-purple-500/30 hover:border-purple-500/50 shadow-md hover:shadow-purple-500/20 transition-all duration-300"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                                        {index + 1}
                                    </div>
                                    <p className="text-gray-300">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rules & Guidelines */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-green-500">{dictionary.rules}</h3>

                        {/* General Rules */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                                    📋
                                </div>
                                <h4 className="font-medium text-white">{dictionary.general}</h4>
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
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                                    💰
                                </div>
                                <h4 className="font-medium text-white">{dictionary.earnings}</h4>
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
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                                    💳
                                </div>
                                <h4 className="font-medium text-white">{dictionary.withdrawals}</h4>
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
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                                    🔒
                                </div>
                                <h4 className="font-medium text-white">{dictionary.safety}</h4>
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

                    {/* Version */}
                    <div className="flex justify-center">
                        <div className="text-center py-2 px-6 rounded-full bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 inline-block mx-auto shadow-md">
                            <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                {dictionary.version} 1.0.0
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
