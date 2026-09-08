import React from 'react';
import { ProcessingStage } from '../../types/api';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface LoadingOverlayProps {
  imagePreviewUrl: string | null;
  stage: ProcessingStage;
  progress: number;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  imagePreviewUrl,
  stage,
  progress,
}) => {
  const steps = [
    { key: 'uploading', label: 'Preparing camera trap image tensor...' },
    { key: 'classifying', label: 'Running YOLOv11 wildlife classifier...' },
    { key: 'retrieving', label: 'Retrieving species knowledge from ChromaDB...' },
    { key: 'generating', label: 'Generating grounded AI explanation via Gemini...' },
  ];

  const getStageIndex = (currentStage: ProcessingStage) => {
    switch (currentStage) {
      case 'uploading': return 0;
      case 'classifying': return 1;
      case 'retrieving': return 2;
      case 'generating': return 3;
      case 'complete': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(stage);

  return (
    <div className="bg-nature-900/90 border border-nature-700/80 rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl backdrop-blur-xl animate-fade-in max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <span className="px-3 py-1 bg-nature-800 text-savanna-sand font-mono text-xs rounded-full border border-nature-700 uppercase tracking-widest inline-flex items-center space-x-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-savanna-gold" />
          <span>Pipeline Processing Active</span>
        </span>
        <h3 className="text-2xl font-serif font-bold text-savanna-bone">
          Analyzing Field Camera Trap Data
        </h3>
      </div>

      {/* Image Scanner Box */}
      {imagePreviewUrl && (
        <div className="relative h-64 rounded-xl overflow-hidden bg-nature-950 border border-nature-800 flex items-center justify-center">
          <img
            src={imagePreviewUrl}
            alt="Analyzing target"
            className="w-full h-full object-contain opacity-70"
          />

          {/* Animated Laser Scanning Line */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-savanna-gold to-transparent shadow-[0_0_15px_#D4AF37] animate-scan"></div>
          
          <div className="absolute inset-0 bg-nature-grid opacity-30"></div>

          <div className="absolute bottom-4 left-4 right-4 bg-nature-950/90 backdrop-blur-md px-4 py-2 rounded-lg border border-nature-800 flex items-center justify-between text-xs font-mono text-savanna-sand">
            <span>VISION BACKBONE: YOLOv11</span>
            <span>PROGRESS: {progress}%</span>
          </div>
        </div>
      )}

      {/* Animated Progress Bar */}
      <div className="space-y-2">
        <div className="h-2.5 w-full bg-nature-950 rounded-full overflow-hidden border border-nature-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-savanna-gold to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Step Status List */}
      <div className="space-y-3 pt-2">
        {steps.map((stepItem, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={stepItem.key}
              className={`flex items-center space-x-3 p-3 rounded-xl border text-xs sm:text-sm font-sans transition-all ${
                isCurrent
                  ? 'bg-nature-850 text-savanna-bone border-savanna-gold/50 shadow-md scale-[1.01]'
                  : isDone
                  ? 'bg-nature-900/40 text-nature-300 border-nature-800/60'
                  : 'bg-nature-950/40 text-nature-500 border-nature-900'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-savanna-gold animate-spin flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-nature-700 flex-shrink-0"></div>
              )}
              <span className={isCurrent ? 'font-semibold text-savanna-gold' : ''}>
                {stepItem.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
