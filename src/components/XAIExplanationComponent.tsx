import React from 'react';
import { XAIExplanation } from '../types';
import { BrainCircuit, ShieldAlert, Target } from 'lucide-react';

interface XAIExplanationProps {
  explanation: XAIExplanation;
}

export const XAIExplanationComponent: React.FC<XAIExplanationProps> = ({ explanation }) => {
  return (
    <div className="bg-brand-bg border border-brand-line p-6 font-mono text-[11px]">
      <h4 className="flex items-center gap-2 mb-4 font-bold uppercase text-brand-ink/70">
        <BrainCircuit className="w-4 h-4" />
        AI Reasoning Insight
      </h4>
      
      <div className="space-y-4">
        <div>
           <p className="text-brand-ink/50 uppercase">Classification</p>
           <p className="font-bold">{explanation.threatClassification}</p>
        </div>
        
        <div>
           <p className="text-brand-ink/50 uppercase">Confidence Score</p>
           <div className="w-full bg-brand-line/20 h-1 mt-1">
             <div className="bg-brand-ink h-1" style={{ width: `${explanation.forensicProbability * 100}%` }} />
           </div>
           <p>{(explanation.forensicProbability * 100).toFixed(0)}%</p>
        </div>

        <div>
           <p className="text-brand-ink/50 uppercase italic">Insight</p>
           <p className="text-brand-ink/80">{explanation.predictiveInsight}</p>
        </div>
        
        <div>
          <p className="text-brand-ink/50 uppercase">Key Drivers (Feature Importance)</p>
          <ul className="space-y-1 mt-1">
            {explanation.keyFeatures.map(f => (
              <li key={f.feature} className="flex justify-between">
                <span>{f.feature}</span>
                <span className="font-bold">{(f.importance * 100).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
