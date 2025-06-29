"use client";

import React, { useState } from 'react';
import LoadingProgressBar from '@/components/LoadingProgressBar';
import LoadingPage from '@/components/LoadingPage';
import CircularLoadingIndicator from '@/components/CircularLoadingIndicator';
import LoadingOverlay from '@/components/LoadingOverlay';
import DataLoadingExample from '@/components/DataLoadingExample';
import { useTranslation } from 'react-i18next';

export default function LoadingDemoPage() {
  const [showFullPage, setShowFullPage] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showFullScreenProgressBar, setShowFullScreenProgressBar] = useState(false);
  const [showBlurProgressBar, setShowBlurProgressBar] = useState(false);
  const [showHeavyBlurProgressBar, setShowHeavyBlurProgressBar] = useState(false);
  const [showExtremeBlurProgressBar, setShowExtremeBlurProgressBar] = useState(false);
  const [showDarkOverlayProgressBar, setShowDarkOverlayProgressBar] = useState(false);
  const [showCircular, setShowCircular] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showHeavyBlurExample, setShowHeavyBlurExample] = useState(false);
  const [showExtremeBlurExample, setShowExtremeBlurExample] = useState(false);
  const [showDarkOverlayExample, setShowDarkOverlayExample] = useState(false);
  const { t } = useTranslation();

  const handleShowFullPage = () => {
    setShowFullPage(true);
    // Hide the full page loader after 5 seconds
    setTimeout(() => {
      setShowFullPage(false);
    }, 5000);
  };

  const handleShowProgressBar = () => {
    setShowProgressBar(true);
    // Hide the progress bar after 3 seconds
    setTimeout(() => {
      setShowProgressBar(false);
    }, 3000);
  };

  const handleShowFullScreenProgressBar = () => {
    setShowFullScreenProgressBar(true);
    // Hide the full screen progress bar after 3 seconds
    setTimeout(() => {
      setShowFullScreenProgressBar(false);
    }, 3000);
  };

  const handleShowBlurProgressBar = () => {
    setShowBlurProgressBar(true);
    // Hide the blur progress bar after 3 seconds
    setTimeout(() => {
      setShowBlurProgressBar(false);
    }, 3000);
  };

  const handleShowHeavyBlurProgressBar = () => {
    setShowHeavyBlurProgressBar(true);
    // Hide the heavy blur progress bar after 3 seconds
    setTimeout(() => {
      setShowHeavyBlurProgressBar(false);
    }, 3000);
  };

  const handleShowExtremeBlurProgressBar = () => {
    setShowExtremeBlurProgressBar(true);
    // Hide the extreme blur progress bar after 3 seconds
    setTimeout(() => {
      setShowExtremeBlurProgressBar(false);
    }, 3000);
  };

  const handleShowDarkOverlayProgressBar = () => {
    setShowDarkOverlayProgressBar(true);
    // Hide the dark overlay progress bar after 3 seconds
    setTimeout(() => {
      setShowDarkOverlayProgressBar(false);
    }, 3000);
  };

  const handleShowCircular = () => {
    setShowCircular(true);
    // Hide the circular indicator after 3 seconds
    setTimeout(() => {
      setShowCircular(false);
    }, 3000);
  };

  const handleShowOverlay = () => {
    setShowOverlay(true);
    // Hide the overlay after 3 seconds
    setTimeout(() => {
      setShowOverlay(false);
    }, 3000);
  };

  const handleShowHeavyBlurExample = () => {
    setShowHeavyBlurExample(true);
    setTimeout(() => setShowHeavyBlurExample(false), 3000);
  };

  const handleShowExtremeBlurExample = () => {
    setShowExtremeBlurExample(true);
    setTimeout(() => setShowExtremeBlurExample(false), 3000);
  };

  const handleShowDarkOverlayExample = () => {
    setShowDarkOverlayExample(true);
    setTimeout(() => setShowDarkOverlayExample(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0E11] via-[#1E2026] to-[#0B0E11] p-8">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Loading Components Demo</h1>
      
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Demo section for LoadingProgressBar */}
        <div className="bg-[#1E2026] rounded-xl p-6 shadow-xl border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Loading Progress Bar</h2>
          <p className="text-gray-400 mb-4">
            A simple progress bar component that can be used to show loading progress.
          </p>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleShowProgressBar}
                className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Show Progress Bar
              </button>
              
              <button
                onClick={handleShowFullScreenProgressBar}
                className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Show Full Screen
              </button>
              
              <button
                onClick={handleShowBlurProgressBar}
                className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Show with Blur
              </button>
              
              <button
                onClick={handleShowHeavyBlurProgressBar}
                className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Show with Heavy Blur
              </button>
              
              <button
                onClick={handleShowExtremeBlurProgressBar}
                className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Show with Extreme Blur
              </button>
              
              <button
                onClick={handleShowDarkOverlayProgressBar}
                className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Show with Dark Overlay
              </button>
            </div>
            
            {showProgressBar && (
              <div className="mt-4">
                <LoadingProgressBar 
                  message="Loading data..." 
                  color="#F0B90B"
                  duration={3000}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Demo section for CircularLoadingIndicator */}
        <div className="bg-[#1E2026] rounded-xl p-6 shadow-xl border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Circular Loading Indicator</h2>
          <p className="text-gray-400 mb-4">
            A circular loading indicator with animation.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleShowCircular}
              className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Show Circular Indicator
            </button>
            
            {showCircular && (
              <div className="mt-4 flex justify-center">
                <CircularLoadingIndicator 
                  size={60}
                  thickness={6}
                  message="Processing..."
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Demo section for LoadingOverlay */}
        <div className="bg-[#1E2026] rounded-xl p-6 shadow-xl border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Loading Overlay</h2>
          <p className="text-gray-400 mb-4">
            A loading overlay that can be used to show a loading state over any content.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleShowOverlay}
              className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Show Loading Overlay
            </button>
            
            <div className="mt-4 p-4 bg-[#2B3139] rounded-lg relative">
              <p className="text-white">This is some content that will be covered by the loading overlay.</p>
              <p className="text-gray-400 mt-2">The overlay will appear on top of this content when you click the button above.</p>
              
              <LoadingOverlay 
                isVisible={showOverlay}
                message="Loading content..."
              />
            </div>
          </div>
        </div>
        
        {/* Demo section for DataLoadingExample */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">Data Loading Example</h2>
          <p className="text-gray-400 mb-6">
            This example demonstrates the full-screen loading progress bar with various blur effects during data loading.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={handleShowHeavyBlurExample}
              className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Show Heavy Blur Example
            </button>
            <button
              onClick={handleShowExtremeBlurExample}
              className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Show Extreme Blur Example
            </button>
            <button
              onClick={handleShowDarkOverlayExample}
              className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Show Dark Overlay Example
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Default Example */}
            <DataLoadingExample
              loadingMessage="Loading data from server..."
              loadingDuration={2000}
              useBlur={true}
            />
            
            {/* Heavy Blur Example */}
            {showHeavyBlurExample && (
              <DataLoadingExample
                loadingMessage="Loading with heavy blur effect..."
                loadingDuration={2000}
                useBlur={true}
                blurIntensity="heavy"
              />
            )}
            
            {/* Extreme Blur Example */}
            {showExtremeBlurExample && (
              <DataLoadingExample
                loadingMessage="Loading with extreme blur effect..."
                loadingDuration={2000}
                useBlur={true}
                blurIntensity="extreme"
              />
            )}
            
            {/* Dark Overlay Example */}
            {showDarkOverlayExample && (
              <DataLoadingExample
                loadingMessage="Loading with dark overlay..."
                loadingDuration={2000}
                useBlur={true}
                blurIntensity="medium"
                darkOverlay={true}
                darkOverlayOpacity={0.7}
              />
            )}
          </div>
        </div>
        
        {/* Demo section for LoadingPage */}
        <div className="bg-[#1E2026] rounded-xl p-6 shadow-xl border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Full Page Loading</h2>
          <p className="text-gray-400 mb-4">
            A full-page loading component with logo, progress bar, and animations.
          </p>
          
          <button
            onClick={handleShowFullPage}
            className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Show Full Page Loader
          </button>
        </div>
      </div>
      
      {/* Full screen progress bar */}
      {showFullScreenProgressBar && (
        <LoadingProgressBar 
          message="Loading in full screen mode..." 
          color="#F0B90B"
          duration={3000}
          fullScreen={true}
        />
      )}
      
      {/* Blur progress bar */}
      {showBlurProgressBar && (
        <LoadingProgressBar 
          message="Loading with blur effect..." 
          color="#F0B90B"
          duration={3000}
          fullScreen={true}
          blur={true}
          blurIntensity="medium"
        />
      )}
      
      {/* Heavy blur progress bar */}
      {showHeavyBlurProgressBar && (
        <LoadingProgressBar 
          message="Loading with heavy blur effect..." 
          color="#F0B90B"
          duration={3000}
          fullScreen={true}
          blur={true}
          blurIntensity="heavy"
        />
      )}
      
      {/* Extreme blur progress bar */}
      {showExtremeBlurProgressBar && (
        <LoadingProgressBar 
          message="Loading with extreme blur effect..." 
          color="#F0B90B"
          duration={3000}
          fullScreen={true}
          blur={true}
          blurIntensity="extreme"
        />
      )}
      
      {/* Dark overlay progress bar */}
      {showDarkOverlayProgressBar && (
        <LoadingProgressBar 
          message="Loading with dark overlay..." 
          color="#F0B90B"
          duration={3000}
          fullScreen={true}
          blur={true}
          blurIntensity="medium"
          darkOverlay={true}
          darkOverlayOpacity={0.7}
        />
      )}
      
      {/* Full page loader overlay */}
      {showFullPage && (
        <div className="fixed inset-0 z-50">
          <LoadingPage 
            message={t('loading.message', 'Loading your dashboard...')}
            duration={5000}
          />
        </div>
      )}
    </div>
  );
} 