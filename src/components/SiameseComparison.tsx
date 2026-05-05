import React, { useState, useEffect } from 'react';
import { GitCompare, Loader2, Play } from 'lucide-react';
import { ChemicalMarker } from '../types';
import { siameseCompare } from '../services/geminiService';

const INITIAL_A: ChemicalMarker[] = [
  { name: 'Chromium', symbol: 'Cr', concentration: 0, unit: 'mg/L', category: 'chemical' },
  { name: 'Chlorides', symbol: 'Cl', concentration: 0, unit: 'mg/L', category: 'chemical' },
  { name: 'Lead', symbol: 'Pb', concentration: 0, unit: 'mg/L', category: 'chemical' }
];

const INITIAL_B: ChemicalMarker[] = [
  { name: 'Chromium', symbol: 'Cr', concentration: 0, unit: 'mg/L', category: 'chemical' },
  { name: 'Chlorides', symbol: 'Cl', concentration: 0, unit: 'mg/L', category: 'chemical' },
  { name: 'Lead', symbol: 'Pb', concentration: 0, unit: 'mg/L', category: 'chemical' }
];

export const SiameseComparison: React.FC = () => {
  const [sampleA, setSampleA] = useState<ChemicalMarker[]>(() => {
    const saved = localStorage.getItem('siamese_sampleA');
    return saved ? JSON.parse(saved) : INITIAL_A;
  });
  const [sampleB, setSampleB] = useState<ChemicalMarker[]>(() => {
    const saved = localStorage.getItem('siamese_sampleB');
    return saved ? JSON.parse(saved) : INITIAL_B;
  });
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<{ similarityScore: number; matchingElements: string[]; divergingElements: string[]; conclusion: string } | null>(() => {
    const saved = localStorage.getItem('siamese_result');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('siamese_sampleA', JSON.stringify(sampleA));
  }, [sampleA]);

  useEffect(() => {
    localStorage.setItem('siamese_sampleB', JSON.stringify(sampleB));
  }, [sampleB]);

  useEffect(() => {
    if (result) {
      localStorage.setItem('siamese_result', JSON.stringify(result));
    }
  }, [result]);

  const handleRun = async () => {
    setIsSimulating(true);
    setResult(null);
    try {
      const res = await siameseCompare(sampleA, sampleB);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-brand-bg border border-brand-line p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-brand-line/20 pb-2">Sample A</h2>
          <div className="space-y-4 mb-6">
            {sampleA.map((marker, i) => (
              <div key={marker.symbol} className="flex flex-col gap-1">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-serif uppercase">{marker.name}</span>
                  </div>
                  <input
                    type="number"
                    value={marker.concentration || ''}
                    onChange={(e) => {
                      const num = parseFloat(e.target.value) || 0;
                      setSampleA(prev => prev.map((m, idx) => idx === i ? { ...m, concentration: num } : m));
                    }}
                    className="bg-transparent border-b border-brand-line/30 py-2 focus:border-brand-line outline-none mono-value text-xl"
                    placeholder="0.00"
                  />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
            <GitCompare className="w-8 h-8 opacity-20" />
        </div>

        <div className="flex-1 bg-brand-bg border border-brand-line p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-brand-line/20 pb-2">Sample B</h2>
          <div className="space-y-4 mb-6">
            {sampleB.map((marker, i) => (
              <div key={marker.symbol} className="flex flex-col gap-1">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-serif uppercase">{marker.name}</span>
                  </div>
                  <input
                    type="number"
                    value={marker.concentration || ''}
                    onChange={(e) => {
                      const num = parseFloat(e.target.value) || 0;
                      setSampleB(prev => prev.map((m, idx) => idx === i ? { ...m, concentration: num } : m));
                    }}
                    className="bg-transparent border-b border-brand-line/30 py-2 focus:border-brand-line outline-none mono-value text-xl"
                    placeholder="0.00"
                  />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleRun}
        disabled={isSimulating}
        className="w-full bg-brand-ink text-brand-bg py-4 font-display font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 max-w-xl mx-auto"
      >
        {isSimulating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
        Execute Siamese Comparison
      </button>

      {result && (
         <div className="bg-brand-bg border border-brand-line p-8 max-w-2xl mx-auto w-full mt-4">
            <div className="text-center mb-8">
              <span className="text-[10px] font-mono uppercase opacity-50 block mb-2">Direct Source Similarity</span>
              <div className={`text-6xl font-black font-display ${result.similarityScore > 80 ? 'text-red-600' : 'text-brand-ink'}`}>
                 {result.similarityScore}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                   <h4 className="text-[10px] font-mono uppercase font-bold text-green-600 mb-2">Matching Elements</h4>
                   <ul className="text-xs list-disc pl-4 space-y-1">
                     {result.matchingElements.map((m, i) => <li key={i}>{m}</li>)}
                   </ul>
                </div>
                <div>
                   <h4 className="text-[10px] font-mono uppercase font-bold text-red-600 mb-2">Diverging Elements</h4>
                   <ul className="text-xs list-disc pl-4 space-y-1">
                     {result.divergingElements.map((m, i) => <li key={i}>{m}</li>)}
                   </ul>
                </div>
            </div>

            <div className="border-t border-brand-line/20 pt-6">
               <h4 className="text-[10px] uppercase font-mono opacity-60 mb-2">Forensic Conclusion</h4>
               <p className="text-sm font-mono leading-relaxed">{result.conclusion}</p>
            </div>
         </div>
      )}
    </div>
  );
};
