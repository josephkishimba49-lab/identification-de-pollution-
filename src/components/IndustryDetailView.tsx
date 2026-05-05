import React from 'react';
import { IndustrySignature } from '../types';
import { MARKER_NAMES, MARKER_HEALTH_IMPACTS, MARKER_ENVIRONMENTAL_IMPACTS, MARKER_PERSISTENCE } from '../constants';
import { X, Activity, ShieldAlert, BookOpen } from 'lucide-react';

interface IndustryDetailProps {
  signature: IndustrySignature;
  onClose: () => void;
}

export const IndustryDetailView: React.FC<IndustryDetailProps> = ({ signature, onClose }) => {
  return (
    <div className="fixed inset-0 bg-brand-ink/20 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-brand-bg border border-brand-line shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-brand-line flex justify-between items-center bg-brand-ink/5">
          <h2 className="text-xl font-display font-bold uppercase tracking-widest">{signature.industry} Signature</h2>
          <button onClick={onClose} className="p-1 hover:bg-brand-ink/10 rounded-full transition-colors">
            <X className="w-5 h-5 opacity-60" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <span className="text-[10px] font-mono uppercase opacity-40 block mb-2">Overview</span>
            <p className="text-sm font-serif leading-relaxed text-brand-ink/80">{signature.description}</p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase opacity-40 block mb-4">Core Effluent Markers</span>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(signature.markers).map(([symbol, value]) => (
                <div key={symbol} className="border border-brand-line/20 p-4 bg-brand-ink/[0.02]">
                  <div className="text-lg font-mono font-bold text-brand-ink">{symbol}</div>
                  <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-ink/60">{MARKER_NAMES[symbol] || 'Unknown'}</div>
                  <div className="mt-2 text-xs font-mono opacity-60">{value} pts interaction index</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-serif italic text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-brand-ink" />
              Impact Profiles
            </h3>
            
            {Object.keys(signature.markers).map(symbol => (
              <div key={symbol} className="border-l-2 border-brand-line pl-4 py-1">
                <h4 className="text-xs font-bold font-mono uppercase mb-2">{MARKER_NAMES[symbol]}</h4>
                <div className="text-[11px] leading-relaxed text-brand-ink/70 space-y-2">
                  <p><span className="font-bold">Health:</span> {MARKER_HEALTH_IMPACTS[symbol] || 'No specific data'}</p>
                  <p><span className="font-bold">Environment:</span> 
                    {MARKER_ENVIRONMENTAL_IMPACTS[symbol] !== undefined ? (
                      typeof MARKER_ENVIRONMENTAL_IMPACTS[symbol] === 'string' ? (
                        MARKER_ENVIRONMENTAL_IMPACTS[symbol]
                      ) : (
                        <span>
                          {(MARKER_ENVIRONMENTAL_IMPACTS[symbol] as any).aquaticLife} 
                          {(MARKER_ENVIRONMENTAL_IMPACTS[symbol] as any).soil} 
                          {(MARKER_ENVIRONMENTAL_IMPACTS[symbol] as any).airQuality}
                        </span>
                      )
                    ) : 'No specific data'}
                  </p>
                  <p><span className="font-bold">Environmental Persistence:</span> {MARKER_PERSISTENCE[symbol] || 'No specific data'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
