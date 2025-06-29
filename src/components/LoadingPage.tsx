import React from 'react';
import Image from 'next/image';
import LoadingProgressBar from './LoadingProgressBar';

interface LoadingPageProps {
  /**
   * Optional custom message to display below the progress bar
   */
  message?: string;
  /**
   * Optional custom logo URL
   */
  logoUrl?: string;
  /**
   * Optional custom color for the progress bar
   */
  color?: string;
  /**
   * Optional custom background color for the page
   */
  backgroundColor?: string;
  /**
   * Optional custom duration for the loading animation in milliseconds
   */
  duration?: number;
  /**
   * Optional custom className for the container
   */
  className?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  message = 'Loading your dashboard...',
  logoUrl = '/logo.png', // Replace with your actual logo path
  color = '#F0B90B', // Binance yellow
  backgroundColor = '#0B0E11', // Dark background
  duration = 3000,
  className = '',
}) => {
  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center ${className}`}
      style={{ backgroundColor }}
    >
      {/* Logo */}
      <div className="mb-8 relative">
        <div className="relative">
          <Image 
            src={logoUrl} 
            alt="Logo" 
            width={96}
            height={96}
            className="object-contain"
          />
        </div>
      </div>
      
      {/* Title */}
      <h1 className="text-2xl font-bold text-white mb-6">ClickMasterAds</h1>
      
      {/* Progress bar */}
      <div className="w-full max-w-md px-4">
        <LoadingProgressBar 
          message={message}
          color={color}
          backgroundColor="#1E2026"
          height={4}
          duration={duration}
        />
      </div>
      
      {/* Loading dots animation */}
      <div className="mt-4 flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingPage; 