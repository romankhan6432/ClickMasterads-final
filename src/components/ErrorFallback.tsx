interface ErrorFallbackProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
      <div className="text-center p-6 bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-red-500/20">
        <div className="text-red-400 text-lg mb-4">
          {error}
        </div>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
} 