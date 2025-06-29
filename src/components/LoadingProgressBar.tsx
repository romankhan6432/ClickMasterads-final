import React, { useEffect, useState, useRef, useMemo } from 'react';

interface LoadingProgressBarProps {
  /**
   * Optional custom message to display below the progress bar
   */
  message?: string;
  /**
   * Optional custom color for the progress bar
   */
  color?: string;
  /**
   * Optional custom background color for the progress bar
   */
  backgroundColor?: string;
  /**
   * Optional custom height for the progress bar
   */
  height?: number;
  /**
   * Optional custom width for the progress bar
   */
  width?: string;
  /**
   * Optional custom duration for the loading animation in milliseconds
   */
  duration?: number;
  /**
   * Optional custom className for the container
   */
  className?: string;
  /**
   * Whether to display the progress bar in full screen mode
   */
  fullScreen?: boolean;
  /**
   * Whether to apply a blur effect to the background
   */
  blur?: boolean;
  /**
   * Optional custom background color for the full screen mode
   */
  fullScreenBackgroundColor?: string;
  /**
   * Optional custom opacity for the full screen background
   */
  fullScreenOpacity?: number;
  /**
   * Optional custom blur amount in pixels
   */
  blurAmount?: number;
  /**
   * Optional custom z-index for the full screen mode
   */
  zIndex?: number;
  /**
   * Optional blur intensity level (light, medium, heavy, extreme)
   */
  blurIntensity?: 'light' | 'medium' | 'heavy' | 'extreme';
  /**
   * Whether to add a dark overlay to the blur effect
   */
  darkOverlay?: boolean;
  /**
   * Optional custom dark overlay opacity
   */
  darkOverlayOpacity?: number;
  /**
   * Whether to show a pulsing effect on the progress bar
   */
  pulse?: boolean;
  /**
   * Whether to show a glowing effect on the progress bar
   */
  glow?: boolean;
  /**
   * Whether to show a shimmer effect on the progress bar
   */
  shimmer?: boolean;
  /**
   * Whether to show a border around the progress bar
   */
  border?: boolean;
  /**
   * Whether to show a gradient effect on the progress bar
   */
  gradient?: boolean;
  /**
   * Whether to show a particle effect in the background
   */
  particles?: boolean;
  /**
   * Whether to show a progress percentage
   */
  showPercentage?: boolean;
  /**
   * Whether to show a circular progress indicator
   */
  circular?: boolean;
  /**
   * Whether to show a wave effect on the progress bar
   */
  wave?: boolean;
  /**
   * Whether to show a ripple effect on completion
   */
  ripple?: boolean;
  /**
   * Whether to show a progress line animation
   */
  progressLine?: boolean;
  /**
   * Whether to show a progress dots animation
   */
  progressDots?: boolean;
  /**
   * Whether to show a progress steps indicator
   */
  progressSteps?: boolean;
  /**
   * Optional custom steps for the progress steps indicator
   */
  steps?: string[];
  /**
   * Whether to show a 3D effect on the progress bar
   */
  threeDEffect?: boolean;
  /**
   * Whether to show a rainbow gradient effect
   */
  rainbow?: boolean;
  /**
   * Whether to show loading spinner
   */
  showSpinner?: boolean;
  /**
   * Whether to show progress path
   */
  showPath?: boolean;
  /**
   * Custom spinner type ('classic', 'dots', 'bars', 'circles')
   */
  spinnerType?: 'classic' | 'dots' | 'bars' | 'circles';
  /**
   * Whether to show mini progress indicators
   */
  miniIndicators?: boolean;
  /**
   * Whether to show progress segments
   */
  segments?: boolean;
  /**
   * Number of segments (default: 5)
   */
  segmentCount?: number;
  /**
   * Whether to show completion celebration
   */
  celebration?: boolean;
  /**
   * Whether to show error state
   */
  error?: boolean;
  /**
   * Error message to display
   */
  errorMessage?: string;
  /**
   * Whether to show success state
   */
  success?: boolean;
  /**
   * Success message to display
   */
  successMessage?: string;
  /**
   * Whether to show indeterminate state
   */
  indeterminate?: boolean;
}

const LoadingProgressBar: React.FC<LoadingProgressBarProps> = ({
  message = 'Loading...',
  color = '#F0B90B', // Binance yellow
  backgroundColor = '#0A0C0F', // Darker background
  height = 4,
  width = '100%',
  duration = 2000,
  className = '',
  fullScreen = false,
  blur = false,
  fullScreenBackgroundColor = 'rgba(5, 7, 10, 0.95)', // Darker background with opacity
  fullScreenOpacity = 0.95,
  blurAmount = 5,
  zIndex = 50,
  blurIntensity = 'medium',
  darkOverlay = false,
  darkOverlayOpacity = 0.7,
  pulse = true,
  glow = true,
  shimmer = true,
  border = true,
  gradient = true,
  particles = true,
  showPercentage = true,
  circular = false,
  wave = true,
  ripple = true,
  progressLine = true,
  progressDots = true,
  progressSteps = true,
  steps = ['Initializing', 'Processing', 'Finalizing'],
  threeDEffect = false,
  rainbow = false,
  showSpinner = true,
  showPath = true,
  spinnerType = 'classic',
  miniIndicators = true,
  segments = true,
  segmentCount = 5,
  celebration = true,
  error = false,
  errorMessage = 'An error occurred',
  success = false,
  successMessage = 'Operation completed successfully',
  indeterminate = false,
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showRipple, setShowRipple] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeSegment, setActiveSegment] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  
  const segmentPositions = useMemo(() => 
    Array.from({ length: segmentCount }, (_, i) => ({
      position: (i + 1) * (100 / segmentCount),
      completed: false
    })), [segmentCount]);

  useEffect(() => {
    // Reset state when component mounts
    setProgress(0);
    setIsComplete(false);
    setCurrentStep(0);
    setShowRipple(false);
    setShowCelebration(false);
    setActiveSegment(0);

    // Simulate progress
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / duration) * 100, 100);
      
      setProgress(newProgress);
      
      // Update current step based on progress
      if (newProgress >= 100) {
        clearInterval(interval);
        setIsComplete(true);
        setShowRipple(true);
        setTimeout(() => setShowRipple(false), 1000);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      } else if (newProgress >= 66 && currentStep === 1) {
        setCurrentStep(2);
      } else if (newProgress >= 100 && currentStep === 0) {
        setCurrentStep(1);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [duration, currentStep]);

  // Get blur amount based on intensity
  const getBlurAmount = () => {
    switch (blurIntensity) {
      case 'light':
        return 3;
      case 'medium':
        return blurAmount || 8;
      case 'heavy':
        return 15;
      case 'extreme':
        return 25;
      default:
        return blurAmount || 8;
    }
  };

  // Circular progress component
  const CircularProgress = () => {
    const size = 120;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-gray-700"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-yellow-500 transition-all duration-300 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              filter: glow ? `drop-shadow(0 0 8px ${color})` : 'none',
            }}
          />
        </svg>
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-300">
            {Math.round(progress)}%
          </div>
        )}
      </div>
    );
  };

  // Custom spinner component
  const Spinner = () => {
    switch (spinnerType) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        );
      case 'bars':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1 h-4 bg-yellow-500 animate-scale"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        );
      case 'circles':
        return (
          <div className="relative w-8 h-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute inset-0 border-2 border-yellow-500 rounded-full animate-ping"
                style={{ 
                  animationDelay: `${i * 0.3}s`,
                  opacity: 0.3 - (i * 0.1)
                }}
              />
            ))}
          </div>
        );
      default:
        return (
          <div 
            className="w-6 h-6 border-2 border-yellow-500 rounded-full animate-spin"
            style={{ 
              borderTopColor: 'transparent',
              borderRightColor: 'transparent'
            }}
          />
        );
    }
  };

  // Progress bar with enhanced effects
  const EnhancedProgressBar = () => (
    <div 
      className={`relative overflow-hidden rounded-full ${
        threeDEffect ? 'transform-gpu perspective-1000' : ''
      }`}
      style={{ 
        height: `${height}px`, 
        backgroundColor,
        width: '100%',
        boxShadow: threeDEffect 
          ? 'inset 0 4px 8px rgba(0,0,0,0.6), 0 4px 8px rgba(255,255,255,0.2)'
          : 'inset 0 2px 4px rgba(0,0,0,0.6)',
        border: border ? `2px solid ${color}40` : 'none',
        transform: threeDEffect ? 'rotateX(10deg)' : 'none',
        position: 'relative',
      }}
    >
      {/* Background glow effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
      />

      <div
        ref={progressRef}
        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out
          ${pulse ? 'animate-pulse' : ''} 
          ${shimmer ? 'animate-shimmer' : ''}
          ${wave ? 'animate-wave' : ''}
          ${indeterminate ? 'animate-indeterminate' : ''}`}
        style={{
          width: `${progress}%`,
          backgroundColor: rainbow 
            ? 'transparent'
            : gradient ? 'transparent' : color,
          backgroundImage: rainbow
            ? 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)'
            : gradient 
              ? `linear-gradient(90deg, ${color} 0%, ${color}80 50%, ${color} 100%)`
              : shimmer 
                ? `linear-gradient(90deg, ${color} 0%, ${color} 50%, ${color}80 100%)`
                : 'none',
          backgroundSize: (rainbow || shimmer || gradient) ? '200% 100%' : '100% 100%',
          boxShadow: glow 
            ? `0 0 15px ${color}, 0 0 30px ${color}, 0 0 45px ${color}60`
            : 'none',
          animation: rainbow 
            ? 'shimmer 2s linear infinite, rainbow 5s linear infinite'
            : undefined,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Inner glow effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
            filter: 'blur(4px)',
          }}
        />
      </div>

      {/* Segments with enhanced visibility */}
      {segments && (
        <div className="absolute inset-0 flex z-10">
          {segmentPositions.map((segment, index) => (
            <div
              key={index}
              className="h-full border-r border-gray-600 last:border-0"
              style={{ 
                width: `${100 / segmentCount}%`,
                boxShadow: 'inset 0 0 4px rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>
      )}

      {/* Mini Indicators with enhanced visibility */}
      {miniIndicators && (
        <div className="absolute inset-0 flex items-center z-20">
          {segmentPositions.map((segment, index) => (
            <div
              key={index}
              className={`w-2 h-3 transition-all duration-300 ${
                progress >= segment.position ? 'bg-yellow-500' : 'bg-gray-600'
              }`}
              style={{ 
                left: `${segment.position}%`,
                transform: 'translateX(-50%)',
                boxShadow: progress >= segment.position 
                  ? `0 0 8px ${color}, 0 0 16px ${color}40`
                  : 'none',
                borderRadius: '2px',
              }}
            />
          ))}
        </div>
      )}

      {/* Progress Path with enhanced visibility */}
      {showPath && (
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: `repeating-linear-gradient(
              45deg,
              ${color}20,
              ${color}20 10px,
              transparent 10px,
              transparent 20px
            )`,
            opacity: 0.5,
          }}
        />
      )}

      {/* Top highlight effect */}
      <div 
        className="absolute top-0 left-0 right-0 h-1/2 bg-white opacity-10 rounded-t-full"
        style={{ zIndex: 3 }}
      />
    </div>
  );

  // Celebration effect component
  const CelebrationEffect = () => (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: [
              '#FFD700', // Gold
              '#FF69B4', // Pink
              '#00FF00', // Green
              '#4169E1', // Blue
              '#FF4500', // Orange
            ][Math.floor(Math.random() * 5)],
            transform: `rotate(${Math.random() * 360}deg)`,
            animationDuration: `${Math.random() * 2 + 1}s`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
    </div>
  );

  // Success/Error Icon component
  const StatusIcon = () => {
    if (error) {
      return (
        <div className="relative w-6 h-6 animate-shake">
          <div className="absolute inset-0 rotate-45 transform">
            <div className="w-6 h-1 bg-red-500 rounded-full absolute top-1/2 left-0 -translate-y-1/2" />
            <div className="w-1 h-6 bg-red-500 rounded-full absolute left-1/2 top-0 -translate-x-1/2" />
          </div>
        </div>
      );
    }
    if (success) {
      return (
        <div className="relative w-6 h-6 animate-success">
          <div className="absolute w-3 h-6 rotate-45 transform origin-bottom-left">
            <div className="w-1 h-3 bg-green-500 rounded-full absolute bottom-0" />
            <div className="w-5 h-1 bg-green-500 rounded-full absolute bottom-0 origin-bottom-left rotate-[-45deg]" />
          </div>
        </div>
      );
    }
    return null;
  };

  // Progress bar component
  const ProgressBar = () => (
    <div className="relative">
      {celebration && showCelebration && <CelebrationEffect />}
      <div className={`flex flex-col items-center justify-center ${className}`}>
        {showSpinner && !isComplete && <Spinner />}
        <div className="w-full mt-2">
          {circular ? <CircularProgress /> : <EnhancedProgressBar />}
        </div>
        
        <div className="flex items-center justify-between w-full mt-2">
          <div className="flex items-center space-x-2">
            <StatusIcon />
            {message && (
              <div className="text-sm font-medium text-gray-300 transition-all duration-300">
                {message}
              </div>
            )}
          </div>
          
          {showPercentage && !circular && (
            <div className="text-sm font-medium text-gray-400">
              {Math.round(progress)}%
            </div>
          )}
        </div>
        
        {progressDots && (
          <div className="flex space-x-2 mt-2">
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentStep >= dot 
                    ? error 
                      ? 'bg-red-500' 
                      : success 
                        ? 'bg-green-500' 
                        : 'bg-yellow-500'
                    : 'bg-gray-600'
                }`}
                style={{
                  animation: currentStep === dot ? 'pulse 1s infinite' : 'none',
                  boxShadow: currentStep >= dot ? `0 0 10px ${error ? '#EF4444' : success ? '#10B981' : color}40` : 'none',
                }}
              />
            ))}
          </div>
        )}
        
        {progressSteps && (
          <div className="flex justify-between w-full mt-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`text-xs font-medium transition-all duration-300 ${
                  currentStep >= index 
                    ? error 
                      ? 'text-red-500' 
                      : success 
                        ? 'text-green-500' 
                        : 'text-yellow-500'
                    : 'text-gray-500'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        )}
        
        {(error || success) && (
          <div className={`mt-2 text-sm font-medium animate-fadeIn ${
            error ? 'text-red-500' : 'text-green-500'
          }`}>
            {error ? errorMessage : successMessage}
          </div>
        )}
      </div>
    </div>
  );

  // If full screen mode is enabled
  if (fullScreen) {
    const blurValue = getBlurAmount();
    
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center"
        style={{ 
          zIndex,
        }}
      >
        {/* Background with blur */}
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={{ 
            backgroundColor: fullScreenBackgroundColor,
            opacity: fullScreenOpacity,
            backdropFilter: blur ? `blur(${blurValue}px)` : 'none',
            WebkitBackdropFilter: blur ? `blur(${blurValue}px)` : 'none',
          }}
        />
        
        {/* Dark overlay */}
        {darkOverlay && (
          <div 
            className="absolute inset-0 transition-all duration-500"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              opacity: darkOverlayOpacity,
            }}
          />
        )}
        
        {/* Particles background */}
        {particles && (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  backgroundColor: color,
                  opacity: Math.random() * 0.3 + 0.1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 10 + 10}s`,
                }}
              />
            ))}
          </div>
        )}
        
        <div className="w-full max-w-md px-4 relative z-10 animate-fadeIn">
          <ProgressBar />
        </div>
      </div>
    );
  }

  // Default mode
  return <ProgressBar />;
};

export default LoadingProgressBar; 