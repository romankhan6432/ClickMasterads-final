import React from 'react';
import CircularLoadingIndicator from './CircularLoadingIndicator';

interface LoadingOverlayProps {
  /**
   * Whether the overlay is visible
   */
  isVisible: boolean;
  /**
   * Optional custom message to display below the loading indicator
   */
  message?: string;
  /**
   * Optional custom background color for the overlay
   */
  backgroundColor?: string;
  /**
   * Optional custom opacity for the overlay
   */
  opacity?: number;
  /**
   * Optional custom z-index for the overlay
   */
  zIndex?: number;
  /**
   * Optional custom className for the container
   */
  className?: string;
  /**
   * Optional children to render inside the overlay
   */
  children?: React.ReactNode;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  backgroundColor = 'rgba(11, 14, 17, 0.8)', // Dark background with opacity
  opacity = 0.8,
  zIndex = 50,
  className = '',
  children,
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center ${className}`}
      style={{ 
        backgroundColor,
        opacity,
        zIndex,
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <CircularLoadingIndicator 
          size={50}
          thickness={4}
          message={message}
        />
        
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay; 