import React from 'react';
import { Camera, ToggleLeft, ToggleRight, Sparkles, BookOpen, Layers } from 'lucide-react';

interface NavbarProps {
  isMockMode: boolean;
  onToggleMockMode: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isMockMode, onToggleMockMode, onReset }) => {
  return (
    <header className="sticky top-0 z-50 bg-nature-950/80 backdrop-blur-md border-b border-nature-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand logo */}
        <div 
          onClick={onReset} 
          className="flex items-center space-x-3 cursor-pointer group transition-transform duration-200 hover:scale-[1.01]"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-nature-700 to-nature-900 border border-nature-500/30 flex items-center justify-center shadow-lg shadow-nature-950/50 group-hover:border-savanna-sand/50 transition-colors">
            <Camera className="w-6 h-6 text-savanna-gold group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-savanna-bone">
                FAUNA<span className="text-savanna-gold font-sans font-light text-xl">ID</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-widest bg-nature-800/80 text-savanna-sand border border-nature-700 rounded-full">
                CV + RAG
              </span>
            </div>
            <p className="text-[11px] text-nature-300 font-sans tracking-wide">
              Wildlife Intelligence System
            </p>
          </div>
        </div>

        {/* Center / Right Links */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Tech Stack Pills */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-nature-900/60 rounded-lg border border-nature-800 text-xs text-nature-300">
            <span className="flex items-center space-x-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>YOLOv11</span>
            </span>
            <span className="text-nature-600">•</span>
            <span className="text-amber-400 flex items-center space-x-1">
              <Layers className="w-3 h-3" />
              <span>ChromaDB</span>
            </span>
            <span className="text-nature-600">•</span>
            <span className="text-savanna-gold flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Gemini 1.5</span>
            </span>
          </div>

          {/* Mode Switcher Toggle */}
          <button
            onClick={onToggleMockMode}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isMockMode
                ? 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/40'
                : 'bg-nature-900/80 text-nature-200 border-nature-700/60 hover:bg-nature-800'
            }`}
            title={isMockMode ? "Currently in Demo Mode (Simulated AI responses)" : "Connected to Live FastAPI Backend"}
          >
            {isMockMode ? (
              <>
                <ToggleRight className="w-4 h-4 text-amber-400" />
                <span>Demo Mode</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Backend API:</span> Live
              </>
            )}
          </button>

          {/* Documentation / Project Badge */}
          <a
            href="#pipeline"
            className="hidden sm:flex items-center space-x-1.5 text-xs text-nature-300 hover:text-savanna-gold transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Architecture</span>
          </a>
        </div>
      </div>
    </header>
  );
};
