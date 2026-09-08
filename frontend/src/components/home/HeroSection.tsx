import React from 'react';
import { Camera, ArrowDown, Sparkles, Binary } from 'lucide-react';

interface HeroSectionProps {
  onScrollToUpload: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToUpload }) => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-nature-900">
      {/* Background Photography with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2000&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-nature-950/85 via-nature-950/90 to-nature-950"></div>
        <div className="absolute inset-0 bg-nature-grid opacity-60"></div>
      </div>

      {/* Hero Content Box */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8 animate-fade-in">
        {/* System Tag */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-nature-900/80 border border-nature-700/80 text-savanna-sand text-xs font-mono tracking-widest uppercase shadow-xl backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-savanna-gold animate-spin-slow" />
          <span>Conservation AI • Computer Vision + RAG + LLM</span>
        </div>

        {/* Cinematic Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-savanna-bone tracking-tight leading-[1.1]">
          AI-Powered Wildlife Species Classification
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-nature-200 max-w-3xl mx-auto font-sans font-light leading-relaxed">
          Combining <strong className="text-savanna-bone font-medium">YOLOv11 Computer Vision</strong>, <strong className="text-savanna-bone font-medium">ChromaDB Retrieval-Augmented Generation</strong>, and <strong className="text-savanna-bone font-medium">Google Gemini LLM reasoning</strong> to accelerate biodiversity monitoring in arid African ecosystems.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onScrollToUpload}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-nature-700 via-nature-600 to-nature-700 hover:from-nature-600 hover:to-nature-500 text-savanna-bone font-medium rounded-xl border border-nature-500/50 shadow-2xl shadow-nature-950 flex items-center justify-center space-x-3 group transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Camera className="w-5 h-5 text-savanna-gold group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">Deploy Camera Trap Inspection</span>
            <ArrowDown className="w-4 h-4 text-savanna-sand animate-bounce" />
          </button>

          <a
            href="#species-gallery"
            className="w-full sm:w-auto px-6 py-4 bg-nature-900/80 hover:bg-nature-800 text-nature-200 text-sm font-medium rounded-xl border border-nature-800 transition-colors flex items-center justify-center space-x-2"
          >
            <Binary className="w-4 h-4 text-nature-400" />
            <span>Explore 10 Target Species</span>
          </a>
        </div>

        {/* Stat Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
          <div className="bg-nature-900/60 backdrop-blur-md p-4 rounded-xl border border-nature-800/80 text-center">
            <span className="block text-2xl font-serif font-bold text-savanna-gold">15,639</span>
            <span className="text-xs text-nature-300 font-mono">Field Images Trained</span>
          </div>
          <div className="bg-nature-900/60 backdrop-blur-md p-4 rounded-xl border border-nature-800/80 text-center">
            <span className="block text-2xl font-serif font-bold text-emerald-400">98.36%</span>
            <span className="text-xs text-nature-300 font-mono">Trusted Accuracy</span>
          </div>
          <div className="bg-nature-900/60 backdrop-blur-md p-4 rounded-xl border border-nature-800/80 text-center">
            <span className="block text-2xl font-serif font-bold text-amber-300">0.85</span>
            <span className="text-xs text-nature-300 font-mono">Human Review Cutoff</span>
          </div>
          <div className="bg-nature-900/60 backdrop-blur-md p-4 rounded-xl border border-nature-800/80 text-center">
            <span className="block text-2xl font-serif font-bold text-savanna-sand">10</span>
            <span className="text-xs text-nature-300 font-mono">Endemic Species</span>
          </div>
        </div>
      </div>
    </section>
  );
};
