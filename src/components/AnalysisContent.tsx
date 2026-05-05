
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Sparkles, AlertTriangle, Database, ShieldAlert, ArrowLeft, Download, X, Loader2, ArrowUpDown } from 'lucide-react';
import * as Recharts from 'recharts';
import { XAIExplanationComponent } from './XAIExplanationComponent';

export const AnalysisContent = (props: any) => {
  const { selectedAlert, result, isAnalyzing, markers, MARKER_THRESHOLDS, onMarkerClick, handleExportCSV, handleExportPDF, handleExportJSON, handleExportExcel, MARKER_PERSISTENCE } = props;
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const exportButtons = result && (
    <div className="flex gap-2 mb-4">
      <button onClick={handleExportCSV} className="text-[10px] font-mono border p-2 hover:bg-brand-ink hover:text-brand-bg transition-colors uppercase">Export CSV</button>
      <button onClick={handleExportJSON} className="text-[10px] font-mono border p-2 hover:bg-brand-ink hover:text-brand-bg transition-colors uppercase">Export JSON</button>
      <button onClick={handleExportPDF} className="text-[10px] font-mono border p-2 hover:bg-brand-ink hover:text-brand-bg transition-colors uppercase">Export PDF</button>
      <button onClick={handleExportExcel} className="text-[10px] font-mono border p-2 hover:bg-brand-ink hover:text-brand-bg transition-colors uppercase">Export Excel</button>
    </div>
  );

  if (!selectedAlert) {
     return <div className="flex-1 border border-brand-line flex items-center justify-center p-8 opacity-40"><p className="font-mono text-xs uppercase">No alert selected.</p></div>;
  }

  if (isAnalyzing) {
      return (
        <div className="flex-1 border border-brand-line p-12 flex flex-col items-center justify-center text-center">
            <h3>Analyzing Biomarkers</h3>
        </div>
      );
  }

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedMarkers = React.useMemo(() => {
    if (!markers) return [];
    const sortableMarkers = [...markers];
    if (sortConfig !== null) {
      sortableMarkers.sort((a: any, b: any) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        if (sortConfig.key === 'marker') {
            aVal = a.name;
            bVal = b.name;
        } else if (sortConfig.key === 'threshold') {
          aVal = MARKER_THRESHOLDS?.[a.symbol] || 80;
          bVal = MARKER_THRESHOLDS?.[b.symbol] || 80;
        } else if (sortConfig.key === 'exceeded') {
          const aThresh = MARKER_THRESHOLDS?.[a.symbol] || 80;
          const bThresh = MARKER_THRESHOLDS?.[b.symbol] || 80;
          aVal = a.concentration > aThresh ? 1 : 0;
          bVal = b.concentration > bThresh ? 1 : 0;
        }

        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableMarkers;
  }, [markers, sortConfig, MARKER_THRESHOLDS]);

  return (
    <div className="flex flex-col gap-6">
        {exportButtons}
        {markers && markers.length > 0 && (
          <div className="border border-brand-line p-6 bg-brand-bg relative overflow-x-auto shadow-sm">
              <h3 className="font-serif italic text-sm mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 opacity-70" />
                Forensic Result: Marker Diagnostics
              </h3>
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-brand-line/5 text-[10px] uppercase tracking-wider text-brand-ink/60 border-b border-brand-line">
                  <tr>
                    {['Marker', 'Symbol', 'Concentration', 'Unit', 'Threshold', 'Persistence', 'Exceeded'].map((key) => {
                      const sortKey = key.toLowerCase();
                      return (
                        <th key={key} className="p-3 font-medium cursor-pointer hover:bg-brand-line/10 transition-colors select-none" onClick={() => handleSort(sortKey)}>
                          <div className="flex items-center gap-1">
                            {key}
                            <ArrowUpDown className={`w-3 h-3 ${sortConfig?.key === sortKey ? 'opacity-100' : 'opacity-30'}`} />
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sortedMarkers.map((marker: any) => {
                    const threshold = MARKER_THRESHOLDS?.[marker.symbol] || 80;
                    const exceeded = marker.concentration > threshold;
                    return (
                      <tr key={marker.symbol} className={`border-b border-brand-line/10 hover:bg-brand-line/5 transition-colors ${exceeded ? 'bg-red-500/5' : ''}`}>
                        <td 
                          className="p-3 font-display font-medium uppercase cursor-pointer hover:text-brand-ink/80 hover:underline"
                          onClick={() => onMarkerClick && onMarkerClick(marker.symbol)}
                        >
                          {marker.name}
                        </td>
                        <td 
                          className="p-3 font-bold opacity-80 cursor-pointer hover:opacity-100 hover:text-brand-ink hover:underline"
                          onClick={() => onMarkerClick && onMarkerClick(marker.symbol)}
                        >
                          {marker.symbol}
                        </td>
                        <td className={`p-3 font-bold ${exceeded ? 'text-red-500' : 'text-brand-ink'}`}>{marker.concentration.toFixed(2)}</td>
                        <td className="p-3 opacity-50">{marker.unit}</td>
                        <td className="p-3 opacity-50">{threshold}</td>
                        <td className="p-3 opacity-50 text-[10px]">{MARKER_PERSISTENCE?.[marker.symbol] || 'N/A'}</td>
                        <td className="p-3">
                          {exceeded ? (
                            <span className="bg-red-500 text-white px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3" />
                              Yes
                            </span>
                          ) : (
                            <span className="opacity-30">No</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
          </div>
        )}
        
        {selectedAlert.type === 'predictive_anomaly' && selectedAlert.metadata && (
          <div className="mt-4">
             <XAIExplanationComponent explanation={{
                threatClassification: selectedAlert.metadata.classification || 'Unknown',
                forensicProbability: selectedAlert.metadata.confidence || 0,
                predictiveInsight: selectedAlert.metadata.insight || 'No insight available.',
                preemptiveActions: selectedAlert.metadata.recommendations || (selectedAlert.metadata.recommendation ? [selectedAlert.metadata.recommendation] : []),
                keyFeatures: selectedAlert.metadata.keyFeatures || []
            }} />
          </div>
        )}
    </div>
  );
};
