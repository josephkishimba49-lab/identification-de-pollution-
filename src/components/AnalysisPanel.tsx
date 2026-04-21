/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChemicalMarker } from '../types';
import { MARKER_NAMES } from '../constants';
import { analyzePollutionSignature } from '../services/geminiService';
import { SignatureChart } from './SignatureChart';
import { AlertTriangle, Activity, Database, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_MARKERS: ChemicalMarker[] = [
  { name: 'Chromium', symbol: 'Cr', concentration: 0, unit: 'mg/L' },
  { name: 'Chlorides', symbol: 'Cl', concentration: 0, unit: 'mg/L' },
  { name: 'Cadmium', symbol: 'Cd', concentration: 0, unit: 'mg/L' },
  { name: 'Lead', symbol: 'Pb', concentration: 0, unit: 'mg/L' },
  { name: 'Zinc', symbol: 'Zn', concentration: 0, unit: 'mg/L' },
  { name: 'Chemical Oxygen Demand', symbol: 'COD', concentration: 0, unit: 'mg/L' },
];

export const AnalysisPanel: React.FC = () => {
  const [markers, setMarkers] = useState<ChemicalMarker[]>(INITIAL_MARKERS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ sourceType: string; confidence: number; reasoning: string } | null>(null);

  const handleUpdate = (symbol: string, value: string) => {
    const num = parseFloat(value) || 0;
    setMarkers(prev => prev.map(m => m.symbol === symbol ? { ...m, concentration: num } : m));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const analysis = await analyzePollutionSignature(markers);
    setResult(analysis);
    setIsAnalyzing(false);
  };

  const reset = () => {
    setMarkers(INITIAL_MARKERS);
    setResult(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full p-6 overflow-y-auto">
      {/* Input Section */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="bg-brand-bg border border-brand-line p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
          <div className="flex items-center gap-2 mb-6">
            <Database className="w-5 h-5" />
            <h2 className="text-lg font-bold">Sample Entry</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {markers.map((marker) => (
              <div key={marker.symbol} className="flex flex-col gap-1">
                <div className="flex justify-between items-end">
                  <label className="text-[11px] font-serif italic uppercase opacity-60">
                    {marker.name} ({marker.symbol})
                  </label>
                  <span className="text-[10px] mono-value opacity-40">{marker.unit}</span>
                </div>
                <input
                  type="number"
                  value={marker.concentration || ''}
                  onChange={(e) => handleUpdate(marker.symbol, e.target.value)}
                  className="bg-transparent border-b border-brand-line/30 py-2 focus:border-brand-line outline-none mono-value text-xl transition-colors"
                  placeholder="0.00"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full mt-8 bg-brand-ink text-brand-bg py-4 font-display font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Signature...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                Run Forensic Analysis
              </>
            )}
          </button>
          
          {result && (
            <button
              onClick={reset}
              className="w-full mt-2 border border-brand-line py-2 font-display text-xs uppercase hover:bg-brand-line/5 transition-colors"
            >
              Clear Session
            </button>
          )}
        </div>
      </div>

      {/* Analysis Visualization Area */}
      <div className="flex-1 flex flex-col gap-6">
        <AnimatePresence mode="wait">
          {!result && !isAnalyzing ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 border border-dashed border-brand-line/30 flex flex-col items-center justify-center text-center p-12"
            >
              <Activity className="w-16 h-16 opacity-10 mb-4" />
              <p className="font-serif italic opacity-40 max-w-sm">
                Enter chemical concentration levels to the left and initiate forensic attribution.
              </p>
            </motion.div>
          ) : isAnalyzing ? (
             <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 border border-brand-line p-12 flex flex-col items-center justify-center text-center"
            >
               <div className="relative">
                 <Loader2 className="w-20 h-20 animate-spin opacity-20" />
                 <Activity className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
               </div>
               <h3 className="mt-8 font-display text-xl mb-2">Analyzing Biomarkers</h3>
               <p className="font-serif italic opacity-60">Correlating chemical ratios with industrial baseline database...</p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              {/* Top Result Card */}
              <div className="bg-brand-ink text-brand-bg p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-[11px] font-sans uppercase tracking-[0.2em] opacity-60">Source Attributed</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold uppercase leading-tight">
                    {result.sourceType}
                  </h2>
                </div>
                <div className="flex flex-col items-center md:items-end">
                  <span className="text-[11px] font-display uppercase tracking-widest opacity-60 mb-2">Confidence Score</span>
                  <div className="text-5xl md:text-7xl font-mono font-bold">
                    {Math.round(result.confidence * 100)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Forensic Reasoning */}
                <div className="border border-brand-line p-6">
                  <h3 className="font-serif italic text-sm mb-4 border-b border-brand-line/20 pb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Forensic Reasoning
                  </h3>
                  <p className="font-sans leading-relaxed text-brand-ink/80 text-sm">
                    {result.reasoning}
                  </p>
                </div>

                {/* Signature Comparison */}
                <div className="border border-brand-line p-6">
                   <h3 className="font-serif italic text-sm mb-4 border-b border-brand-line/20 pb-2">
                    Signature Comparison
                  </h3>
                  <SignatureChart sampleData={markers} comparisonIndustry={result.sourceType} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
