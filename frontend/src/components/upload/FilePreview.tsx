import React from 'react';
import { Camera, Trash2, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { formatBytes } from '../../utils/formatters';

interface FilePreviewProps {
  imagePreviewUrl: string;
  file: File | null;
  isLoading: boolean;
  onRunPrediction: () => void;
  onClearFile: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  imagePreviewUrl,
  file,
  isLoading,
  onRunPrediction,
  onClearFile,
}) => {
  return (
    <div className="w-full bg-nature-900/80 border border-nature-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md animate-fade-in">
      <div className="flex items-center justify-between border-b border-nature-800 pb-4">
        <div className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-savanna-gold" />
          <h3 className="font-serif font-semibold text-lg text-savanna-bone">
            Camera Trap Inspection Preview
          </h3>
        </div>
        <button
          onClick={onClearFile}
          disabled={isLoading}
          className="text-xs text-nature-400 hover:text-red-400 transition-colors flex items-center space-x-1 disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Change Image</span>
        </button>
      </div>

      {/* Large Immersive Image Preview Box */}
      <div className="relative rounded-xl overflow-hidden bg-nature-950 border border-nature-800 max-h-[460px] flex items-center justify-center group">
        <img
          src={imagePreviewUrl}
          alt="Camera Trap Preview"
          className="w-full h-full object-contain max-h-[440px] rounded-lg"
        />

        {/* Topographic Camera Overlay watermark */}
        <div className="absolute top-4 left-4 bg-nature-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-nature-700/80 text-[11px] font-mono text-savanna-sand flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>SENSOR ACTIVE</span>
        </div>

        {file && (
          <div className="absolute bottom-4 left-4 right-4 bg-nature-950/90 backdrop-blur-md p-3 rounded-xl border border-nature-800 flex items-center justify-between text-xs text-nature-300">
            <div className="flex items-center space-x-2 truncate">
              <ImageIcon className="w-4 h-4 text-savanna-gold flex-shrink-0" />
              <span className="truncate font-mono">{file.name}</span>
            </div>
            <span className="font-mono text-nature-400 flex-shrink-0 ml-2">
              {formatBytes(file.size)}
            </span>
          </div>
        )}
      </div>

      {/* Upload & Inspect Action Button */}
      <div className="pt-2">
        <button
          onClick={onRunPrediction}
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl font-medium text-sm sm:text-base flex items-center justify-center space-x-3 shadow-2xl transition-all duration-300 ${
            isLoading
              ? 'bg-nature-800 text-nature-500 border border-nature-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-nature-700 via-nature-600 to-nature-700 hover:from-nature-600 hover:to-nature-500 text-savanna-bone border border-nature-500/60 shadow-nature-950 hover:-translate-y-0.5'
          }`}
        >
          <Sparkles className="w-5 h-5 text-savanna-gold animate-pulse" />
          <span className="font-semibold tracking-wide">
            {isLoading ? 'Running Pipeline Inference...' : 'Run Wildlife Classifier & RAG Pipeline'}
          </span>
          <ArrowRight className="w-4 h-4 text-savanna-sand" />
        </button>
      </div>
    </div>
  );
};
