'use client';

export default function NavBar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 gradient-flow shadow-lg border-b border-gray-700">
            <div className="relative py-1.5 sm:py-2 px-3 sm:px-4 overflow-hidden bg-black/30 backdrop-blur-sm">
                <div className="relative flex overflow-x-hidden">
                    <div className="animate-marquee whitespace-nowrap py-2">
                        <span className="text-white font-bold text-xs sm:text-base mx-4 sm:mx-8 flex items-center hover:text-yellow-400 transition-colors duration-300">
                            <span className="inline-block mr-1.5 sm:mr-2 text-sm sm:text-base">🎉</span>
                            Welcome to my bot! Watch ads and earn rewards!
                        </span>
                        <span className="text-white font-bold text-xs sm:text-base mx-4 sm:mx-8 flex items-center hover:text-yellow-400 transition-colors duration-300">
                            <span className="inline-block mr-1.5 sm:mr-2 text-sm sm:text-base">💰</span>
                            Start earning today with our amazing rewards!
                        </span>
                        <span className="text-white font-bold text-xs sm:text-base mx-4 sm:mx-8 flex items-center hover:text-yellow-400 transition-colors duration-300">
                            <span className="inline-block mr-1.5 sm:mr-2 text-sm sm:text-base">⭐</span>
                            Join thousands of satisfied users!
                        </span>
                    </div>
                    <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-2">
                        <span className="text-white font-bold text-xs sm:text-base mx-4 sm:mx-8 flex items-center hover:text-yellow-400 transition-colors duration-300">
                            <span className="inline-block mr-1.5 sm:mr-2 text-sm sm:text-base">🎉</span>
                            Welcome to my bot! Watch ads and earn rewards!
                        </span>
                        <span className="text-white font-bold text-xs sm:text-base mx-4 sm:mx-8 flex items-center hover:text-yellow-400 transition-colors duration-300">
                            <span className="inline-block mr-1.5 sm:mr-2 text-sm sm:text-base">💰</span>
                            Start earning today with our amazing rewards!
                        </span>
                        <span className="text-white font-bold text-xs sm:text-base mx-4 sm:mx-8 flex items-center hover:text-yellow-400 transition-colors duration-300">
                            <span className="inline-block mr-1.5 sm:mr-2 text-sm sm:text-base">⭐</span>
                            Join thousands of satisfied users!
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
}