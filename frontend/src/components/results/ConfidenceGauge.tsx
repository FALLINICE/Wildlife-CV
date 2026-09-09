import React from 'react';
import { formatPercentage } from '../../utils/formatters';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface ConfidenceGaugeProps {
  confidence: number;
  reviewNeeded: boolean;
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ confidence }) => {
  const percentage = Math.round(confidence * 100);
  const isHighConfidence = confidence >= 0.85;

  // Circle Math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence * circumference);

  const strokeColor = isHighConfidence ? '#10B981' : '#F59E0B'; // emerald vs amber

  return (
    <div className="bg-nature-900/60 border border-nature-800 rounded-2xl p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-nature-400">
          Confidence Assessment
        </span>
        {isHighConfidence ? (
          <span className="px-2.5 py-1 text-xs font-mono font-medium bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>High Confidence</span>
          </span>
        ) : (
          <span className="px-2.5 py-1 text-xs font-mono font-medium bg-amber-950 text-amber-300 border border-amber-800 rounded-full flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Field Review Needed</span>
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        {/* SVG Circular Progress Gauge */}
        <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Track Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-nature-950 stroke-current"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={strokeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-serif font-bold text-savanna-bone">
              {formatPercentage(confidence)}
            </span>
            <span className="text-[10px] font-mono text-nature-400">Score</span>
          </div>
        </div>

        {/* Text Details & Threshold Note */}
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-nature-300">
              <span>Threshold Cutoff</span>
              <span className="text-savanna-gold font-bold">85.00%</span>
            </div>
            {/* Linear Progress Bar */}
            <div className="h-2 w-full bg-nature-950 rounded-full overflow-hidden border border-nature-800">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isHighConfidence ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          <p className="text-xs text-nature-400 leading-relaxed">
            {isHighConfidence
              ? 'Model prediction meets or exceeds the trusted accuracy threshold. Direct insertion into census logs allowed.'
              : 'Prediction score falls below the 85% confidence cutoff. Automatic review flag triggered to prevent false positives.'}
          </p>
        </div>
      </div>
    </div>
  );
};
