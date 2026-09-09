import React from 'react';
import { AlternativeCandidate } from '../../types/api';
import { getSpeciesMeta } from '../../utils/speciesMetadata';
import { formatPercentage } from '../../utils/formatters';
import { ListFilter } from 'lucide-react';

interface AlternativeCandidatesCardProps {
  candidates?: AlternativeCandidate[];
}

export const AlternativeCandidatesCard: React.FC<AlternativeCandidatesCardProps> = ({ candidates }) => {
  if (!candidates || candidates.length === 0) return null;

  // Sort descending by confidence score
  const sortedCandidates = [...candidates].sort((a, b) => b.confidence - a.confidence);

  return (
    <div className="bg-nature-900/60 border border-nature-800 rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-nature-800 pb-3">
        <div className="flex items-center space-x-2">
          <ListFilter className="w-5 h-5 text-amber-400" />
          <h3 className="font-serif font-bold text-lg text-savanna-bone">
            Alternative Species Candidates
          </h3>
        </div>
        <span className="text-xs font-mono text-nature-400">
          Ranked Probabilities
        </span>
      </div>

      <div className="space-y-4">
        {sortedCandidates.map((candidate, idx) => {
          const meta = getSpeciesMeta(candidate.species);
          const percentage = Math.round(candidate.confidence * 100);

          return (
            <div
              key={candidate.species + idx}
              className="bg-nature-950/80 p-4 rounded-xl border border-nature-800 space-y-2 group hover:border-nature-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-savanna-sand">
                      #{idx + 1}
                    </span>
                    <h4 className="font-serif font-semibold text-savanna-bone group-hover:text-savanna-gold transition-colors">
                      {meta.commonName}
                    </h4>
                  </div>
                  <p className="text-xs font-mono italic text-nature-400">
                    {meta.scientificName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-savanna-bone">
                    {formatPercentage(candidate.confidence)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-nature-900 rounded-full overflow-hidden border border-nature-850">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
