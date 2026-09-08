import React from 'react';
import { ShieldAlert, UserCheck } from 'lucide-react';

interface FieldReviewWarningProps {
  confidence: number;
}

export const FieldReviewWarning: React.FC<FieldReviewWarningProps> = ({ confidence }) => {
  return (
    <div className="bg-gradient-to-r from-amber-950/80 via-nature-900 to-amber-950/80 border border-amber-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md animate-fade-in space-y-4">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-amber-900/60 border border-amber-600/60 rounded-xl flex-shrink-0">
          <ShieldAlert className="w-7 h-7 text-amber-400" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg font-serif font-bold text-amber-200">
              Human Review Required (Confidence &lt; 0.85)
            </h3>
            <span className="px-2.5 py-0.5 text-xs font-mono font-semibold bg-amber-900/80 text-amber-300 border border-amber-600 rounded-md">
              FLAGGED FOR INSPECTION
            </span>
          </div>

          <p className="text-sm text-nature-200 leading-relaxed">
            The YOLOv11 classifier returned a confidence score of <strong className="text-amber-300 font-mono">{(confidence * 100).toFixed(2)}%</strong>, which is below the system’s <strong className="text-savanna-bone font-mono">0.85</strong> threshold.
          </p>

          <div className="bg-nature-950/80 p-3.5 rounded-xl border border-amber-900/50 space-y-2 text-xs text-nature-300">
            <div className="flex items-center space-x-2 font-semibold text-amber-300">
              <UserCheck className="w-4 h-4" />
              <span>Recommended Action Protocol:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-nature-300 font-sans">
              <li>Inspect candidate species ranking below to verify alternative visual cues.</li>
              <li>Manually review infrared lighting contrast and foliage occlusion on the original frame.</li>
              <li>Confirm species identification before logging this specimen to the official database.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
