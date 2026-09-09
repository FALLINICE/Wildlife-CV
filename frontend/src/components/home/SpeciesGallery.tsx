import React from 'react';
import { SPECIES_DATABASE } from '../../utils/speciesMetadata';
import { Camera } from 'lucide-react';

interface SpeciesGalleryProps {
  onSelectSpecies: (sampleUrl: string, speciesName: string) => void;
}

export const SpeciesGallery: React.FC<SpeciesGalleryProps> = ({ onSelectSpecies }) => {
  const speciesList = Object.values(SPECIES_DATABASE);

  return (
    <section id="species-gallery" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-savanna-sand">
            Dataset Target Taxonomy
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-savanna-bone mt-1">
            Supported African Species
          </h2>
          <p className="text-sm text-nature-300 mt-2 max-w-2xl">
            Trained on LILA BC Desert Lion Conservation Camera Trap data from Northern Namibia. Click any species card to test the classification pipeline with a field sample!
          </p>
        </div>
        <div className="text-xs font-mono text-nature-300 bg-nature-900/80 px-3.5 py-2 rounded-xl border border-nature-800 self-start">
          10 Endemic Taxa Classifiers
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {speciesList.map((species) => (
          <div
            key={species.id}
            onClick={() => onSelectSpecies(species.sampleImageUrl, species.commonName)}
            className="group relative bg-nature-900/60 rounded-2xl overflow-hidden border border-nature-800 hover:border-savanna-sand/60 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 shadow-lg"
          >
            {/* Species Image */}
            <div className="relative h-44 overflow-hidden bg-nature-950">
              <img
                src={species.sampleImageUrl}
                alt={species.commonName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-nature-950 via-nature-950/20 to-transparent"></div>
              
              {/* Conservation Status Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-0.5 text-[10px] font-mono rounded-md border ${species.statusColor}`}>
                  {species.conservationStatus}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-serif font-bold text-base text-savanna-bone group-hover:text-savanna-gold transition-colors">
                  {species.commonName}
                </h3>
                <p className="text-xs font-mono italic text-savanna-sand">
                  {species.scientificName}
                </p>
              </div>

              <div className="pt-2 border-t border-nature-850 flex items-center justify-between text-xs text-nature-300 group-hover:text-savanna-bone">
                <span className="text-[11px] font-mono">Test Sample</span>
                <Camera className="w-3.5 h-3.5 text-savanna-gold group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
