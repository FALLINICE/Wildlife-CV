import React from 'react';
import { Shield, Sparkles, Database, Cpu, Leaf, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-nature-950 border-t border-nature-900 text-nature-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: System Info */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-2">
            <Leaf className="w-5 h-5 text-savanna-gold" />
            <span className="font-serif text-xl font-bold text-savanna-bone tracking-wide">
              FAUNA<span className="text-savanna-gold font-sans font-normal text-base">ID</span>
            </span>
          </div>
          <p className="text-sm text-nature-300 max-w-md leading-relaxed">
            An end-to-end Computer Vision + RAG + LLM intelligence system for automated camera trap image classification, confidence-gated human review, and grounded ecological knowledge retrieval.
          </p>
          <div className="flex items-center space-x-4 text-xs text-nature-400 pt-2">
            <span className="flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-savanna-sand" />
              <span>Namibian Desert Lion Field Dataset</span>
            </span>
            <span>•</span>
            <span>10 Target Species</span>
          </div>
        </div>

        {/* Col 2: Pipeline Architecture */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest font-mono text-savanna-sand font-semibold">
            System Stack
          </h4>
          <ul className="space-y-2 text-sm text-nature-300">
            <li className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>YOLOv11 Vision Classifier</span>
            </li>
            <li className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-amber-400" />
              <span>ChromaDB Vector KB</span>
            </li>
            <li className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-savanna-gold" />
              <span>Gemini Grounded LLM</span>
            </li>
            <li className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-300" />
              <span>FastAPI + Python Core</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Conservation & Metrics */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest font-mono text-savanna-sand font-semibold">
            Field Standards
          </h4>
          <div className="bg-nature-900/60 p-4 rounded-xl border border-nature-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-nature-400">Confidence Cutoff:</span>
              <span className="font-mono text-amber-300">0.85 (85%)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-nature-400">Trusted Accuracy:</span>
              <span className="font-mono text-emerald-400">98.36%</span>
            </div>
            <p className="text-[11px] text-nature-400 pt-1 leading-snug">
              Ensures field researchers never rely on unverified low-confidence model predictions.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-nature-900/80 flex flex-col sm:flex-row justify-between items-center text-xs text-nature-300">
        <p>© {new Date().getFullYear()} Wildlife AI Intelligence System. Built for field research & conservation monitoring.</p>
        <p className="mt-2 sm:mt-0 font-mono text-nature-400">Portfolio AI / ML Engineering System</p>
      </div>
    </footer>
  );
};
