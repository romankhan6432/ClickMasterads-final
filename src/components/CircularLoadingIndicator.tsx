import React from 'react';

interface CircularLoadingIndicatorProps {
  /**
   * Size of the circular indicator in pixels
   */
  size?: number;
  /**
   * Thickness of the circular indicator in pixels
   */
  thickness?: number;
  /**
   * Color of the circular indicator
   */
  color?: string;
  /**
   * Background color of the circular indicator
   */
  backgroundColor?: string;
  /**
   * Optional custom message to display below the indicator
   */
  message?: string;
  /**
   * Optional custom className for the container
   */
  className?: string;
}

const CircularLoadingIndicator: React.FC<CircularLoadingIndicatorProps> = ({
  size = 40,
  thickness = 4,
  color = '#F0B90B', // Binance yellow
  backgroundColor = '#1E2026', // Dark background
  message,
  className = '',
}) => {
  // Calculate the radius and circumference
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the stroke-dasharray and stroke-dashoffset for the animation
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference * 0.25; // Start at 25% progress

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          className="absolute inset-0"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={thickness}
          />
        </svg>
        
        {/* Animated circle */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="animate-spin"
            style={{ 
              animationDuration: '1.5s',
              animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              animationIterationCount: 'infinite'
            }}
          />
        </svg>
      </div>
      
      {message && (
        <div className="mt-2 text-sm text-gray-400">
          {message}
        </div>
      )}
    </div>
  );
};

export default CircularLoadingIndicator; 