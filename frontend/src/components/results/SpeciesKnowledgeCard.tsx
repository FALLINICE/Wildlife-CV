import React from 'react';
import { getSpeciesMeta } from '../../utils/speciesMetadata';
import { FormattedMarkdown } from '../common/FormattedMarkdown';
import { BookOpen, Database, MapPin, Tag } from 'lucide-react';

interface SpeciesKnowledgeCardProps {
  speciesId: string;
  description: string | null;
}

export const SpeciesKnowledgeCard: React.FC<SpeciesKnowledgeCardProps> = ({ speciesId, description }) => {
  const meta = getSpeciesMeta(speciesId);

  return (
    <div className="bg-nature-900/60 border border-nature-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-nature-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-nature-950 rounded-xl border border-nature-800">
            <BookOpen className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-savanna-bone">
              Species Knowledge
            </h3>
            <span className="text-xs font-mono text-nature-400 flex items-center space-x-1">
              <Database className="w-3 h-3 text-sky-400" />
              <span>ChromaDB Vector Retrieval • Factually Grounded</span>
            </span>
          </div>
        </div>
        <span className={`px-2.5 py-1 text-xs font-mono rounded-full border ${meta.statusColor}`}>
          {meta.conservationStatus}
        </span>
      </div>

      {/* Field Guide Quick Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-nature-950/80 p-4 rounded-xl border border-nature-850">
        <div className="flex items-center space-x-2 text-xs">
          <Tag className="w-4 h-4 text-savanna-sand flex-shrink-0" />
          <span className="text-nature-400">Taxonomy:</span>
          <span className="font-mono text-savanna-bone font-medium truncate">{meta.category}</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <MapPin className="w-4 h-4 text-savanna-gold flex-shrink-0" />
          <span className="text-nature-400">Habitat:</span>
          <span className="font-mono text-savanna-bone font-medium truncate">{meta.habitat}</span>
        </div>
      </div>

      {/* Retrieved Text Content - Rendered with Rich Markdown Styling */}
      <div className="bg-nature-950/40 p-5 rounded-xl border border-nature-800/60 shadow-inner">
        {description ? (
          <FormattedMarkdown content={description} />
        ) : (
          <p className="text-sm text-nature-400 italic font-sans">
            {meta.description}
          </p>
        )}
      </div>
    </div>
  );
};
