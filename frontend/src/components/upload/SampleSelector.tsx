import React from 'react';
import { SPECIES_DATABASE } from '../../utils/speciesMetadata';
import { Sparkles } from 'lucide-react';

interface SampleSelectorProps {
  onSelectSample: (sampleUrl: string, sampleName: string) => void;
  disabled?: boolean;
}

export const SampleSelector: React.FC<SampleSelectorProps> = ({ onSelectSample, disabled = false }) => {
  const samplePresets = [
    {
      name: 'Black Rhino (High Conf)',
      speciesId: 'diceros_bicornis',
      url: SPECIES_DATABASE.diceros_bicornis.sampleImageUrl,
      badge: 'High Conf',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800'
    },
    {
      name: 'Black Rhino (Low Conf Review)',
      speciesId: 'diceros_bicornis_blur',
      url: '/assets/species/diceros_bicornis.jpg',
      badge: '< 0.85 Review',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800'
    },
    {
      name: 'African Lion',
      speciesId: 'panthera_leo',
      url: SPECIES_DATABASE.panthera_leo.sampleImageUrl,
      badge: 'Apex Predator',
      badgeColor: 'bg-nature-950 text-savanna-sand border-nature-700'
    },
    {
      name: 'Desert Elephant',
      speciesId: 'loxodanta_africana',
      url: SPECIES_DATABASE.loxodanta_africana.sampleImageUrl,
      badge: 'Vulnerable',
      badgeColor: 'bg-nature-950 text-savanna-sand border-nature-700'
    },
    {
      name: 'Hartmann Zebra',
      speciesId: 'equus_zebra_hartmannae',
      url: SPECIES_DATABASE.equus_zebra_hartmannae.sampleImageUrl,
      badge: 'Endemic',
      badgeColor: 'bg-nature-950 text-savanna-sand border-nature-700'
    }
  ];

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-nature-300 uppercase tracking-widest flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-savanna-gold" />
          <span>Or Test with Field Camera Trap Presets:</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {samplePresets.map((preset) => (
          <button
            key={preset.name}
            type="button"
            disabled={disabled}
            onClick={() => onSelectSample(preset.url, preset.name)}
            className="group relative bg-nature-900/60 rounded-xl overflow-hidden border border-nature-800 hover:border-savanna-gold/60 p-2 text-left transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative h-20 rounded-lg overflow-hidden mb-2 bg-nature-950">
              <img
                src={preset.url}
                alt={preset.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className={`absolute top-1 left-1 px-1.5 py-0.5 text-[9px] font-mono border rounded ${preset.badgeColor}`}>
                {preset.badge}
              </span>
            </div>
            <p className="text-xs font-semibold text-savanna-bone group-hover:text-savanna-gold truncate">
              {preset.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
