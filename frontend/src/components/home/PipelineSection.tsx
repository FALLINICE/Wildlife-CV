import React from 'react';
import { Camera, Cpu, ShieldAlert, Database, Sparkles, ArrowRight } from 'lucide-react';

export const PipelineSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Camera Trap Capture',
      subtitle: 'Field Image Upload',
      icon: Camera,
      iconColor: 'text-savanna-sand',
      description: 'Motion-triggered sensor captures high-resolution imagery in remote conservation grids.',
    },
    {
      number: '02',
      title: 'YOLOv11 Classifier',
      subtitle: 'Computer Vision Inference',
      icon: Cpu,
      iconColor: 'text-emerald-400',
      description: 'Fine-tuned deep neural net predicts species probabilities across 10 endemic African wildlife classes.',
    },
    {
      number: '03',
      title: 'Confidence Guardrail',
      subtitle: 'Thresholding (<0.85)',
      icon: ShieldAlert,
      iconColor: 'text-amber-400',
      description: 'Low-confidence detections trigger a mandatory field review flag and rank alternative species candidates.',
    },
    {
      number: '04',
      title: 'ChromaDB Knowledge RAG',
      subtitle: 'Ecological Vector Search',
      icon: Database,
      iconColor: 'text-sky-400',
      description: 'Retrieves factual habitat, taxonomy, and conservation data from dense vector embeddings.',
    },
    {
      number: '05',
      title: 'Gemini AI Explanation',
      subtitle: 'Grounded LLM Reasoning',
      icon: Sparkles,
      iconColor: 'text-savanna-gold',
      description: 'Generates plain-language, field-tested explanations synthesizing vision tensors and retrieved ecology notes.',
    },
  ];

  return (
    <section id="pipeline" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-nature-900">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <span className="text-xs uppercase tracking-widest font-mono text-savanna-sand">
          End-to-End System Pipeline
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-savanna-bone">
          How the Wildlife AI System Works
        </h2>
        <p className="text-sm text-nature-300">
          A multi-stage architecture engineered to prevent hallucinated predictions and ensure field researchers receive verifiable, grounded intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="bg-nature-900/60 border border-nature-800 rounded-2xl p-5 relative flex flex-col justify-between group hover:border-nature-600 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-semibold text-nature-300">
                    STAGE {step.number}
                  </span>
                  <div className="p-2 bg-nature-950 rounded-lg border border-nature-800">
                    <Icon className={`w-5 h-5 ${step.iconColor}`} />
                  </div>
                </div>

                <h3 className="font-serif font-bold text-lg text-savanna-bone mb-1">
                  {step.title}
                </h3>
                <span className="inline-block text-[11px] font-mono text-savanna-sand mb-3">
                  {step.subtitle}
                </span>

                <p className="text-xs text-nature-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow Connector for Desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                  <div className="w-6 h-6 rounded-full bg-nature-850 border border-nature-700 flex items-center justify-center text-nature-300">
                    <ArrowRight className="w-3 h-3 text-nature-400" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
