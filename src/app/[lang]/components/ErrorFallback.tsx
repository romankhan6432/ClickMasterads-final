'use client';

import { FallbackProps } from 'react-error-boundary';

// Make resetErrorBoundary optional by extending a modified version of FallbackProps
interface ErrorFallbackProps {
  error: Error | string;
  resetErrorBoundary?: () => void;
  onRetry?: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary, onRetry }: ErrorFallbackProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (resetErrorBoundary) {
      resetErrorBoundary();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1B1E] p-4">
      <div className="bg-[#2C2D30] rounded-lg p-6 max-w-md w-full space-y-4 text-center">
        <div className="flex justify-center">
          <svg 
            className="w-12 h-12 text-red-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
        <p className="text-gray-400 text-sm">{error instanceof Error ? error.message : error}</p>
        <button
          onClick={handleRetry}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 