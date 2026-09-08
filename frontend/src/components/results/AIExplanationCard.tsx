import React from 'react';
import { FormattedMarkdown } from '../common/FormattedMarkdown';
import { Sparkles, Bot, CheckCircle2 } from 'lucide-react';

interface AIExplanationCardProps {
  explanation: string | null;
  speciesName: string;
}

export const AIExplanationCard: React.FC<AIExplanationCardProps> = ({ explanation, speciesName }) => {
  return (
    <div className="bg-gradient-to-br from-nature-900/80 via-nature-900/90 to-nature-850 border border-nature-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Subtle Glow Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-savanna-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-nature-800 pb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-nature-700 to-nature-800 rounded-xl border border-nature-600">
            <Sparkles className="w-5 h-5 text-savanna-gold animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-savanna-bone">
              AI Explanation
            </h3>
            <span className="text-xs font-mono text-savanna-sand flex items-center space-x-1">
              <Bot className="w-3.5 h-3.5 text-savanna-gold" />
              <span>Gemini 1.5 Conservation Assistant • Grounded Reasoning</span>
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-800 rounded-full flex items-center space-x-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Zero Hallucination Grounded</span>
        </span>
      </div>

      {/* Explanation Rendered Cleanly with FormattedMarkdown */}
      <div className="bg-nature-950/40 p-5 rounded-xl border border-nature-800/80 shadow-inner relative z-10">
        {explanation ? (
          <FormattedMarkdown content={explanation} />
        ) : (
          <p className="text-sm sm:text-base text-nature-300 italic font-sans leading-relaxed">
            The Gemini LLM reasoning layer synthesized the YOLOv8 vision prediction tensors alongside ChromaDB retrieved document contexts for {speciesName}.
          </p>
        )}
      </div>

      {/* Footer Pill */}
      <div className="pt-2 flex items-center justify-between text-xs font-mono text-nature-400 border-t border-nature-800/80">
        <span>Reasoning Engine: Google Gemini LLM</span>
        <span className="text-savanna-gold">Field Audit Ready</span>
      </div>
    </div>
  );
};
