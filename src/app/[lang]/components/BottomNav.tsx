'use client';

export default function BottomNav() {
    const showPaymentInfo = () => {
        // Implement payment info logic
    };

    const showRules = () => {
        // Implement rules display logic
    };

    const showSupport = () => {
        // Implement support display logic
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50 shadow-2xl">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex justify-around items-center py-2">
                    <button
                        className="group flex flex-col items-center justify-center min-w-[80px] min-h-[64px] px-4 py-2 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 hover:from-violet-700 hover:to-purple-900 active:scale-95 active:from-violet-800 active:to-purple-900 transition-all duration-200 ease-out shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        onClick={showPaymentInfo}
                    >
                        <span className="text-2xl mb-1 group-active:scale-90 transition-transform duration-200">💰</span>
                        <span className="text-xs font-semibold tracking-wide group-active:scale-95 transition-transform duration-200">Withdraw</span>
                    </button>
                    <button
                        className="group flex flex-col items-center justify-center min-w-[80px] min-h-[64px] px-4 py-2 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 hover:from-violet-700 hover:to-purple-900 active:scale-95 active:from-violet-800 active:to-purple-900 transition-all duration-200 ease-out shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        onClick={showRules}
                    >
                        <span className="text-2xl mb-1 group-active:scale-90 transition-transform duration-200">📜</span>
                        <span className="text-xs font-semibold tracking-wide group-active:scale-95 transition-transform duration-200">Rules</span>
                    </button>
                    <button
                        className="group flex flex-col items-center justify-center min-w-[80px] min-h-[64px] px-4 py-2 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 hover:from-violet-700 hover:to-purple-900 active:scale-95 active:from-violet-800 active:to-purple-900 transition-all duration-200 ease-out shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        onClick={showSupport}
                    >
                        <span className="text-2xl mb-1 group-active:scale-90 transition-transform duration-200">💬</span>
                        <span className="text-xs font-semibold tracking-wide group-active:scale-95 transition-transform duration-200">Support</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}