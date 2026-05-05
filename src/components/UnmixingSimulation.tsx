import React, { useState, useEffect } from 'react';
import { Database, Loader2, Play } from 'lucide-react';
import { ChemicalMarker } from '../types';
import { simulateUnmixing } from '../services/geminiService';
import { MARKER_NAMES } from '../constants';

const INITIAL_DEMIX: ChemicalMarker[] = [
  { name: 'Chromium', symbol: 'Cr', concentration: 0, unit: 'mg/L', category: 'chemical' },
  { name: 'Chlorides', symbol: 'Cl', concentration: 0, unit: 'mg/L', category: 'chemical' },
  { name: 'Lead', symbol: 'Pb', concentration: 0, unit: 'mg/L', category: 'chemical' },
  { name: 'pH', symbol: 'pH', concentration: 7, unit: '-', category: 'water' },
  { name: 'Turbidity', symbol: 'Turbidity', concentration: 0, unit: 'NTU', category: 'water' }
];

export const UnmixingSimulation: React.FC = () => {
  const [markers, setMarkers] = useState<ChemicalMarker[]>(() => {
    const saved = localStorage.getItem('unmixing_markers');
    return saved ? JSON.parse(saved) : INITIAL_DEMIX;
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<{ sourceName: string; percentage: number; reasoning: string }[] | null>(() => {
    const saved = localStorage.getItem('unmixing_results');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('unmixing_markers', JSON.stringify(markers));
  }, [markers]);

  useEffect(() => {
    if (results) {
      localStorage.setItem('unmixing_results', JSON.stringify(results));
    }
  }, [results]);

  const handleRun = async () => {
    setIsSimulating(true);
    setResults(null);
    try {
      const res = await simulateUnmixing(markers);
      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/3 bg-brand-bg border border-brand-line p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-brand-line/20 pb-2">Mixed Sample Parameters</h2>
        <div className="space-y-4 mb-6">
          {markers.map((marker, i) => (
             <div key={marker.symbol} className="flex flex-col gap-1">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-serif uppercase">{marker.name}</span>
                  <span className="text-[10px] mono-value opacity-40">{marker.unit}</span>
                </div>
                <input
                  type="number"
                  value={marker.concentration || ''}
                  onChange={(e) => {
                    const num = parseFloat(e.target.value) || 0;
                    setMarkers(prev => prev.map((m, idx) => idx === i ? { ...m, concentration: num } : m));
                  }}
                  className="bg-transparent border-b border-brand-line/30 py-2 focus:border-brand-line outline-none mono-value text-xl"
                  placeholder="0.00"
                />
             </div>
          ))}
        </div>

        <button
          onClick={handleRun}
          disabled={isSimulating}
          className="w-full bg-brand-ink text-brand-bg py-3 font-display font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Run Demixing Simulation
        </button>
      </div>

      <div className="flex-1 bg-brand-bg border border-brand-line p-6">
         <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-brand-line/20 pb-2">Source Apportionment Results</h2>
         
         {!results ? (
           <div className="h-48 flex items-center justify-center opacity-30 font-mono text-xs uppercase text-center max-w-sm mx-auto">
             Enter a mixed sample and simulate to predict contributing sources.
           </div>
         ) : (
           <div className="space-y-6">
             {results.map((r, i) => (
               <div key={i} className="border border-brand-line/20 p-4 relative group hover:bg-brand-line/5 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">{r.sourceName}</h3>
                    <span className="text-2xl font-black font-display">{r.percentage}%</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-brand-line/10 mb-4 rounded-full overflow-hidden">
                     <div className="h-full bg-brand-ink" style={{ width: `${r.percentage}%` }}></div>
                  </div>
                  
                  <p className="text-xs font-mono opacity-80 leading-relaxed">
                    {r.reasoning}
                  </p>
               </div>
             ))}
           </div>
         )}
      </div>
    </div>
  );
};
