import React, { useState, useEffect, useCallback } from 'react';
import LoadingProgressBar from './LoadingProgressBar';

interface DataLoadingExampleProps {
  /**
   * Optional custom message to display during loading
   */
  loadingMessage?: string;
  /**
   * Optional custom duration for the loading animation in milliseconds
   */
  loadingDuration?: number;
  /**
   * Optional custom color for the progress bar
   */
  color?: string;
  /**
   * Whether to use blur effect during loading
   */
  useBlur?: boolean;
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
}

const DataLoadingExample: React.FC<DataLoadingExampleProps> = ({
  loadingMessage = 'Loading data...',
  loadingDuration = 3000,
  color = '#F0B90B',
  useBlur = false,
  blurIntensity = 'medium',
  darkOverlay = false,
  darkOverlayOpacity = 0.5,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Array<{ id: number; name: string; value: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, loadingDuration));

      // Mock data
      const mockData = [
        { id: 1, name: 'Item 1', value: 'Value 1' },
        { id: 2, name: 'Item 2', value: 'Value 2' },
        { id: 3, name: 'Item 3', value: 'Value 3' },
      ];

      setData(mockData);
    } catch (err) {
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [loadingDuration]);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="relative">
      {/* Loading overlay */}
      {isLoading && (
        <LoadingProgressBar 
          message={loadingMessage}
          color={color}
          duration={loadingDuration}
          fullScreen={true}
          blur={useBlur}
          blurIntensity={blurIntensity}
          darkOverlay={darkOverlay}
          darkOverlayOpacity={darkOverlayOpacity}
        />
      )}
      
      {/* Content */}
      <div className="p-6 bg-[#1E2026] rounded-xl shadow-xl border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Data Example</h2>
          <button
            onClick={loadData}
            disabled={isLoading}
            className="px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400">
            {error}
          </div>
        )}
        
        {/* Data table */}
        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#2B3139] text-left">
                  <th className="p-3 text-gray-300 font-medium">ID</th>
                  <th className="p-3 text-gray-300 font-medium">Name</th>
                  <th className="p-3 text-gray-300 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id} className="border-t border-gray-800 hover:bg-[#2B3139]/50">
                    <td className="p-3 text-gray-300">{item.id}</td>
                    <td className="p-3 text-gray-300">{item.name}</td>
                    <td className="p-3 text-gray-300">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default DataLoadingExample; 