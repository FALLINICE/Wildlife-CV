import React from 'react';
import { ApiError } from '../../types/api';
import { AlertTriangle, RefreshCw, ToggleRight, FileX, WifiOff, Clock } from 'lucide-react';

interface ErrorCardProps {
  error: ApiError;
  onRetry: () => void;
  onEnableMockMode: () => void;
  onClear: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  error,
  onRetry,
  onEnableMockMode,
  onClear,
}) => {
  const getIcon = () => {
    switch (error.type) {
      case 'NETWORK_ERROR':
        return <WifiOff className="w-8 h-8 text-amber-400" />;
      case 'FILE_TOO_LARGE':
      case 'INVALID_TYPE':
        return <FileX className="w-8 h-8 text-red-400" />;
      case 'TIMEOUT':
        return <Clock className="w-8 h-8 text-amber-400" />;
      case 'CORRUPTED_FILE':
        return <AlertTriangle className="w-8 h-8 text-red-400" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-amber-400" />;
    }
  };

  return (
    <div className="bg-nature-900/90 border border-red-900/50 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl backdrop-blur-xl animate-fade-in">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-red-950/80 border border-red-800/60 rounded-xl flex-shrink-0">
          {getIcon()}
        </div>

        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-savanna-bone font-serif">
              {error.message}
            </h3>
            {error.statusCode && (
              <span className="px-2 py-0.5 text-xs font-mono bg-red-950 text-red-300 border border-red-800/60 rounded">
                HTTP {error.statusCode}
              </span>
            )}
          </div>

          {error.detail && (
            <p className="text-sm text-nature-300 bg-nature-950/80 p-3 rounded-lg border border-nature-800 font-mono text-xs leading-relaxed">
              {error.detail}
            </p>
          )}

          {error.type === 'NETWORK_ERROR' && (
            <div className="bg-amber-950/30 border border-amber-900/40 p-3.5 rounded-xl text-xs text-amber-200/90 leading-relaxed">
              <span className="font-semibold text-amber-300 block mb-1">
                💡 Backend Connection Note:
              </span>
              The local Python FastAPI server could not be reached at <code className="bg-nature-950 px-1 py-0.5 rounded text-amber-400 font-mono">http://localhost:8000</code>. You can switch to <strong className="text-savanna-gold font-semibold">Demo Mode</strong> to simulate predictions for all 10 African wildlife species with full RAG knowledge base & Gemini explanations.
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onRetry}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-nature-800 hover:bg-nature-700 text-savanna-bone text-xs font-medium rounded-xl border border-nature-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>

            {error.type === 'NETWORK_ERROR' && (
              <button
                onClick={onEnableMockMode}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-700 to-nature-700 hover:from-amber-600 hover:to-nature-600 text-savanna-bone text-xs font-medium rounded-xl border border-amber-500/40 shadow-lg transition-all"
              >
                <ToggleRight className="w-4 h-4 text-savanna-gold" />
                <span>Switch to Demo Mode</span>
              </button>
            )}

            <button
              onClick={onClear}
              className="px-4 py-2 text-xs text-nature-400 hover:text-savanna-bone transition-colors"
            >
              Choose Different Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
