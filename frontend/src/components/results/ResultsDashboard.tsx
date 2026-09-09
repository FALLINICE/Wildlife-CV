import React, { useState } from 'react';
import { PredictionResponse } from '../../types/api';
import { getSpeciesMeta } from '../../utils/speciesMetadata';
import { generateCameraTrapMetadata, formatPercentage } from '../../utils/formatters';
import { ConfidenceGauge } from './ConfidenceGauge';
import { FieldReviewWarning } from './FieldReviewWarning';
import { AlternativeCandidatesCard } from './AlternativeCandidatesCard';
import { SpeciesKnowledgeCard } from './SpeciesKnowledgeCard';
import { AIExplanationCard } from './AIExplanationCard';
import { ArrowLeft, Camera, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';

interface ResultsDashboardProps {
  response: PredictionResponse;
  imagePreviewUrl: string | null;
  onReset: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  response,
  imagePreviewUrl,
  onReset,
}) => {
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const speciesMeta = getSpeciesMeta(response.species);
  const trapMeta = generateCameraTrapMetadata();

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-nature-900/80 p-4 sm:p-5 rounded-2xl border border-nature-700/80 shadow-xl backdrop-blur-md">
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-nature-800 hover:bg-nature-700 text-savanna-bone text-xs sm:text-sm font-medium rounded-xl border border-nature-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-savanna-gold" />
          <span>Back to Camera Station</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1 bg-nature-950 text-nature-300 border border-nature-800 rounded-lg">
            STATION: <span className="text-savanna-gold">{trapMeta.stationId}</span>
          </span>

          {response.review_needed ? (
            <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-lg flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>REVIEW NEEDED</span>
            </span>
          ) : (
            <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>VERIFIED VERDICT</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Sticky Image Viewer & Field Station Metadata) - 5 cols */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-nature-900/80 border border-nature-700/80 rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-nature-800 pb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-savanna-sand flex items-center space-x-1.5">
                <Camera className="w-4 h-4 text-savanna-gold" />
                <span>Field Image Capture</span>
              </span>
              <button
                onClick={() => setShowBoundingBox(!showBoundingBox)}
                className="text-[11px] font-mono px-2.5 py-1 bg-nature-950 text-nature-300 hover:text-savanna-bone rounded-md border border-nature-800 transition-colors"
              >
                {showBoundingBox ? 'Hide Bounding Box' : 'Show Bounding Box'}
              </button>
            </div>

            {/* Image Box */}
            <div className="relative rounded-xl overflow-hidden bg-nature-950 border border-nature-800 group min-h-[320px] flex items-center justify-center">
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt={speciesMeta.commonName}
                  className="w-full h-full object-contain max-h-[440px] rounded-lg"
                />
              ) : (
                <div className="p-8 text-center text-xs text-nature-400 font-mono">
                  No preview available
                </div>
              )}

              {/* Simulated YOLO Bounding Box Overlay */}
              {showBoundingBox && (
                <div className="absolute inset-6 sm:inset-10 border-2 border-emerald-400/90 rounded-lg pointer-events-none shadow-[0_0_15px_rgba(16,185,129,0.3)] flex flex-col justify-between p-2">
                  <div className="bg-emerald-950/90 border border-emerald-600 text-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded self-start flex items-center space-x-1 shadow-md">
                    <span className="font-semibold">{speciesMeta.scientificName}</span>
                    <span>({formatPercentage(response.confidence)})</span>
                  </div>
                  <div className="text-[9px] font-mono text-emerald-400/80 self-end bg-nature-950/80 px-1.5 py-0.5 rounded">
                    YOLOv11 DETECTED
                  </div>
                </div>
              )}

              {/* Timestamp Overlay */}
              <div className="absolute bottom-3 left-3 bg-nature-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-nature-800 text-[11px] font-mono text-nature-300 flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-savanna-gold" />
                <span>{trapMeta.timestamp}</span>
              </div>
            </div>

            {/* Telemetry metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono text-nature-300 pt-2">
              <div className="bg-nature-950/80 p-2.5 rounded-lg border border-nature-850 space-y-1">
                <span className="text-[10px] text-nature-400 block">LOCATION</span>
                <span className="text-savanna-bone font-medium truncate block">{trapMeta.location}</span>
              </div>
              <div className="bg-nature-950/80 p-2.5 rounded-lg border border-nature-850 space-y-1">
                <span className="text-[10px] text-nature-400 block">AMBIENT TEMP</span>
                <span className="text-savanna-gold font-medium block">{trapMeta.temperature}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Identification, Confidence, Knowledge, AI Explanation) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Species Identification Header Card */}
          <div className="bg-nature-900/80 border border-nature-700/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-nature-800 pb-4">
              <div>
                <span className="text-xs font-mono text-savanna-sand uppercase tracking-widest block mb-1">
                  CLASSIFICATION VERDICT
                </span>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-savanna-bone tracking-tight">
                  {speciesMeta.commonName}
                </h1>
                <p className="text-sm font-mono italic text-savanna-gold mt-0.5">
                  {speciesMeta.scientificName}
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end space-y-1.5">
                <span className={`px-3 py-1 text-xs font-mono rounded-full border ${speciesMeta.statusColor}`}>
                  {speciesMeta.conservationStatus}
                </span>
                <span className="text-[11px] font-mono text-nature-400">
                  Taxonomic ID: <code className="text-savanna-bone">{response.species}</code>
                </span>
              </div>
            </div>
          </div>

          {/* Confidence Gauge */}
          <ConfidenceGauge confidence={response.confidence} reviewNeeded={response.review_needed} />

          {/* Review Warning if needed */}
          {response.review_needed && (
            <FieldReviewWarning confidence={response.confidence} />
          )}

          {/* Alternative Candidates */}
          {response.alternative_candidates && response.alternative_candidates.length > 0 && (
            <AlternativeCandidatesCard candidates={response.alternative_candidates} />
          )}

          {/* Species Knowledge Card (ChromaDB) */}
          <SpeciesKnowledgeCard speciesId={response.species} description={response.description} />

          {/* AI Explanation Card (Gemini) */}
          <AIExplanationCard explanation={response.explanation} speciesName={speciesMeta.commonName} />
        </div>
      </div>
    </div>
  );
};
