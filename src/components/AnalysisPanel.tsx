/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as Recharts from 'recharts';
import * as XLSX from 'xlsx';
import { ChemicalMarker } from '../types';
import { MARKER_NAMES, MARKER_THRESHOLDS, MARKER_DESCRIPTIONS, INDUSTRY_SIGNATURES, MARKER_SOURCES, MARKER_PERSISTENCE, MARKER_HEALTH_IMPACTS, MARKER_ENVIRONMENTAL_IMPACTS, MarkerSource } from '../constants';
import { analyzePollutionSignature, detectPredictiveAnomalies } from '../services/geminiService';
import { generateForecast } from '../services/forecastingService';
import { generateBlockchainHash } from '../services/blockchainService';
import { SignatureChart } from './SignatureChart';
import { CorrelationChart } from './CorrelationChart';
import { TrendChart } from './TrendChart';
import { generateHistoricalData } from '../lib/dataUtils';
import { AlertTriangle, Activity, Database, CheckCircle, Loader2, LineChart as TrendIcon, ArrowLeft, ShieldAlert, Sparkles, Download, History, BrainCircuit, Zap, Info, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useAlerts } from '../contexts/AlertContext';
import { XAIExplanationComponent } from './XAIExplanationComponent';
import { AnalysisContent } from './AnalysisContent';
import { MapComponent } from './MapComponent';

const INITIAL_MARKERS: ChemicalMarker[] = [
  // Chemical
  { name: 'Chromium', symbol: 'Cr', concentration: 0, unit: 'mg/L', category: 'chemical' },
  { name: 'Chlorides', symbol: 'Cl', concentration: 0, unit: 'mg/L', category: 'chemical' },
  { name: 'Cadmium', symbol: 'Cd', concentration: 0, unit: 'mg/L', category: 'chemical' },
  { name: 'Lead', symbol: 'Pb', concentration: 0, unit: 'mg/L', category: 'chemical' },
  { name: 'Zinc', symbol: 'Zn', concentration: 0, unit: 'mg/L', category: 'chemical' },
  // Water
  { name: 'Chemical Oxygen Demand', symbol: 'COD', concentration: 0, unit: 'mg/L', category: 'water' },
  { name: 'Biochemical Oxygen Demand', symbol: 'BOD', concentration: 0, unit: 'mg/L', category: 'water' },
  { name: 'Salinity', symbol: 'Salinity', concentration: 0, unit: 'ppt', category: 'water' },
  { name: 'Conductivity', symbol: 'Conductivity', concentration: 0, unit: 'µS/cm', category: 'water' },
  { name: 'Turbidity', symbol: 'Turbidity', concentration: 0, unit: 'NTU', category: 'water' },
  { name: 'pH', symbol: 'pH', concentration: 0, unit: '-', category: 'water' },
  { name: 'Total Dissolved Solids', symbol: 'TDS', concentration: 0, unit: 'mg/L', category: 'water' },
  { name: 'Total Alkalinity', symbol: 'Alkalinity', concentration: 0, unit: 'mg/L', category: 'water' },
  // Air
  { name: 'PM2.5', symbol: 'PM2.5', concentration: 0, unit: 'µg/m³', category: 'air' },
  { name: 'PM10', symbol: 'PM10', concentration: 0, unit: 'µg/m³', category: 'air' },
  { name: 'Nitrogen Dioxide', symbol: 'NO2', concentration: 0, unit: 'ppb', category: 'air' },
  { name: 'Sulfur Dioxide', symbol: 'SO2', concentration: 0, unit: 'ppb', category: 'air' },
  { name: 'Carbon Monoxide', symbol: 'CO', concentration: 0, unit: 'ppm', category: 'air' },
  { name: 'Ozone', symbol: 'O3', concentration: 0, unit: 'ppb', category: 'air' },
  // Soil
  { name: 'Moisture', symbol: 'Moisture', concentration: 0, unit: '%', category: 'soil' },
  { name: 'Nitrogen', symbol: 'Nitrogen', concentration: 0, unit: 'mg/kg', category: 'soil' },
  { name: 'Phosphorus', symbol: 'Phosphorus', concentration: 0, unit: 'mg/kg', category: 'soil' },
  { name: 'Potassium', symbol: 'Potassium', concentration: 0, unit: 'mg/kg', category: 'soil' },
  { name: 'Organic Matter', symbol: 'OrgMatter', concentration: 0, unit: '%', category: 'soil' },
  // Waste
  { name: 'Microplastics', symbol: 'Microplastics', concentration: 0, unit: 'mg/kg', category: 'waste' },
  { name: 'Heavy Metals', symbol: 'WasteHeavyMetals', concentration: 0, unit: 'mg/kg', category: 'waste' },
];

export const AnalysisPanel: React.FC = () => {
  const [markers, setMarkers] = useState<ChemicalMarker[]>(() => {
    const saved = localStorage.getItem('analysis_markers');
    return saved ? JSON.parse(saved) : INITIAL_MARKERS;
  });
  const [sampleMetadata, setSampleMetadata] = useState(() => {
    const saved = localStorage.getItem('analysis_metadata');
    return saved ? JSON.parse(saved) : {
      sampleId: '',
      collectionDate: new Date().toISOString().split('T')[0],
      collectorName: '',
      lat: '',
      lng: ''
    };
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ sourceType: string; confidence: number; reasoning: string } | null>(() => {
    const saved = localStorage.getItem('analysis_result');
    return saved ? JSON.parse(saved) : null;
  });

  React.useEffect(() => {
    localStorage.setItem('analysis_markers', JSON.stringify(markers));
  }, [markers]);

  React.useEffect(() => {
    localStorage.setItem('analysis_metadata', JSON.stringify(sampleMetadata));
  }, [sampleMetadata]);

  React.useEffect(() => {
    if (result) {
      localStorage.setItem('analysis_result', JSON.stringify(result));
    }
  }, [result]);
  const [selectedComparisons, setSelectedComparisons] = useState<string[]>([]);
  const [usedSampleIds, setUsedSampleIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('forensic_used_ids');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPredictiveScanning, setIsPredictiveScanning] = useState(false);
  const [predictiveAlerts, setPredictiveAlerts] = useState<any[]>([]);
  const [selectedMarkerForInfo, setSelectedMarkerForInfo] = useState<string | null>(null);
  const [selectedHistoricalMarker, setSelectedHistoricalMarker] = useState<string>('Chromium');
  const [dateRange, setDateRange] = useState<7 | 30 | 90>(30);
  const [filterCategories, setFilterCategories] = useState<string[]>(['chemical', 'water', 'air', 'soil', 'waste']);
  const [activeInfoTab, setActiveInfoTab] = useState('description');

  const { alerts, addAlert, selectedAlertId, setSelectedAlertId } = useAlerts();
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());

  // Polling for real-time updates
  React.useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/markers/live');
        const data = await response.json();
        
        // Update chemical markers if they exist in the incoming data
        if (data.markers && data.markers.length > 0) {
          setMarkers(prev => prev.map(m => {
            const updatedMarker = data.markers.find((nm: any) => nm.symbol === m.symbol);
            return updatedMarker ? { ...m, concentration: updatedMarker.concentration } : m;
          }));
        }
      } catch (error) {
        console.error('Error fetching real-time marker data:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const selectedAlert = alerts.find(a => a.id === selectedAlertId);

  const handleUpdate = (symbol: string, value: string) => {
    const num = parseFloat(value) || 0;
    setMarkers(prev => prev.map(m => m.symbol === symbol ? { ...m, concentration: num } : m));
  };

  const handleIdChange = (id: string) => {
    setSampleMetadata(prev => ({ ...prev, sampleId: id }));
    
    if (!id) {
       setValidationError(null);
       return;
    }

    // Format: TR-YYYY-XXXX
    const formatRegex = /^TR-\d{4}-[A-Z0-9]{4}$/;
    
    if (!formatRegex.test(id)) {
      setValidationError(`Invalid ID format. Please use TR-YYYY-XXXX (e.g., TR-2026-A1B2).`);
    } else if (usedSampleIds.has(id)) {
      setValidationError(`Warning: The ID "${id}" already exists in the system's history.`);
    } else {
      setValidationError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!sampleMetadata.sampleId) {
      setValidationError('Sample Trace ID is required for forensic documentation.');
      return;
    }

    const formatRegex = /^TR-\d{4}-[A-Z0-9]{4}$/;
    if (!formatRegex.test(sampleMetadata.sampleId)) {
      setValidationError(`Invalid Format: ID must follow the TR-YYYY-XXXX format.`);
      return;
    }

    if (usedSampleIds.has(sampleMetadata.sampleId)) {
      setValidationError(`Collision Error: Sample ID "${sampleMetadata.sampleId}" has already been processed.`);
      return;
    }

    setValidationError(null);
    setIsAnalyzing(true);
    const analysis = await analyzePollutionSignature(markers, sampleMetadata);
    setResult(analysis);
    setSelectedComparisons([analysis.sourceType]); // Default to the top match
    setIsAnalyzing(false);

    // Commit ID to registry
    const newUsedIds = new Set(usedSampleIds).add(sampleMetadata.sampleId);
    setUsedSampleIds(newUsedIds);
    localStorage.setItem('forensic_used_ids', JSON.stringify(Array.from(newUsedIds)));

    // Generate Blockchain Hash
    const blockData = {
      sampleId: sampleMetadata.sampleId,
      timestamp: new Date().toISOString(),
      markers,
      result: analysis
    };
    
    generateBlockchainHash(blockData).then(hash => {
      const rawLedger = localStorage.getItem('blockchain_ledger');
      const ledger = rawLedger ? JSON.parse(rawLedger) : [];
      ledger.unshift({
        hash,
        timestamp: blockData.timestamp,
        sampleId: blockData.sampleId,
        sourceType: analysis.sourceType,
        confidence: analysis.confidence
      });
      localStorage.setItem('blockchain_ledger', JSON.stringify(ledger));
      
      addAlert({
        severity: 'info',
        title: 'Blockchain Ledger Updated',
        description: `Immutable hash generated and stored to registry.`,
        type: 'user_action'
      });
    });

    // Alert triggering logic
    if (analysis.confidence > 0.85) {
      addAlert({
        severity: 'critical',
        title: `High Confidence Signature: ${analysis.sourceType}`,
        description: `Source match verified with ${Math.round(analysis.confidence * 100)}% accuracy. Critical intervention may be required.`,
        type: 'signature_match'
      });
    } else if (analysis.confidence > 0.6) {
      addAlert({
        severity: 'warning',
        title: `Probable Signature: ${analysis.sourceType}`,
        description: `Potential industrial match detected. Monitoring frequency increased for this sector.`,
        type: 'signature_match'
      });
    }

    // Check for raw threshold breaches
    markers.forEach(m => {
      const threshold = MARKER_THRESHOLDS[m.symbol] || 80;
      if (m.concentration > threshold) {
        addAlert({
          severity: 'critical',
          title: `Toxic Level Detected: ${m.symbol}`,
          description: `Concentration of ${m.concentration}mg/L exceeded maximum legal threshold (${threshold}mg/L). Source: ${analysis.sourceType || 'Unknown'}.`,
          type: 'threshold_breach',
          metadata: {
            symbol: m.symbol,
            concentration: m.concentration,
            threshold: threshold,
            attributionSource: analysis.sourceType
          }
        });
      }
    });
  };

  const reset = () => {
    setMarkers(INITIAL_MARKERS);
    setSampleMetadata({
      sampleId: '',
      collectionDate: new Date().toISOString().split('T')[0],
      collectorName: '',
      lat: '',
      lng: ''
    });
    setResult(null);
    setSelectedAlertId(null);
    setSelectedComparisons([]);
  };

  const clearRegistry = () => {
    if (confirm('Are you sure you want to purge the forensic ID registry? This cannot be undone.')) {
      setUsedSampleIds(new Set());
      localStorage.removeItem('forensic_used_ids');
    }
  };

  const handleCompareToggle = (id: string) => {
    setSelectedComparisons(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const runPredictiveScan = async () => {
    setIsPredictiveScanning(true);
    // Use markers as current trend data
    const currentData = markers.map(m => m.concentration);
    const selectedSymbol = markers[0]?.symbol || 'Cr';
    
    const forecast = await generateForecast(selectedSymbol, currentData);
    
    // Maintain existing anomaly detection for broader context
    const historicalData = generateHistoricalData(30);
    const result = await detectPredictiveAnomalies(historicalData);
    
    setPredictiveAlerts(result.alerts || []);
    setIsPredictiveScanning(false);

    if (result.alerts?.length > 0) {
      result.alerts.forEach((alert: any) => {
        addAlert({
          severity: 'warning',
          title: `Predictive Anomaly: ${alert.marker}`,
          description: `${alert.classification}: ${alert.insight}`,
          type: 'predictive_anomaly',
          metadata: {
            marker: alert.marker,
            classification: alert.classification,
            insight: alert.insight,
            recommendations: alert.recommendations,
            confidence: alert.confidence,
            keyFeatures: alert.keyFeatures
          }
        });
      });
    }
  };

  const handleExportCSV = () => {
    if (!result) return;

    const headers = ['Marker', 'Symbol', 'Concentration', 'Unit', 'Threshold', 'Exceeded'];
    const markerRows = markers.map(m => {
      const threshold = MARKER_THRESHOLDS[m.symbol] || 80;
      return [
        m.name,
        m.symbol,
        m.concentration,
        m.unit,
        threshold,
        m.concentration > threshold ? 'YES' : 'NO'
      ].join(',');
    });

    const metadataRows = [
      '',
      'Forensic Metadata',
      `Sample ID,${sampleMetadata.sampleId}`,
      `Collection Date,${sampleMetadata.collectionDate}`,
      `Collector,${sampleMetadata.collectorName}`,
      '',
      'Analysis Results',
      `Attributed Source,${result.sourceType}`,
      `Confidence Score,${Math.round(result.confidence * 100)}%`,
      `Reasoning,"${result.reasoning.replace(/"/g, '""')}"`
    ];

    const csvContent = [headers.join(','), ...markerRows, ...metadataRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Forensic_Report_${sampleMetadata.sampleId || 'unnamed'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (!result) return;
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Forensic Analysis Report', 14, 20);
        doc.setFontSize(12);
        doc.text(`Sample ID: ${sampleMetadata.sampleId}`, 14, 30);
        doc.text(`Date: ${sampleMetadata.collectionDate}`, 14, 37);
        
        // Marker Table
        (doc as any).autoTable({
          startY: 45,
          head: [['Marker', 'Symbol', 'Concentration', 'Unit', 'Threshold']],
          body: markers.map(m => [m.name, m.symbol, m.concentration, m.unit, MARKER_THRESHOLDS[m.symbol] || 80]),
        });

        // Results
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text(`Source: ${result.sourceType}`, 14, finalY);
        doc.text(`Confidence: ${Math.round(result.confidence * 100)}%`, 14, finalY + 7);
        doc.text(`Reasoning: ${result.reasoning}`, 14, finalY + 14, { maxWidth: 180 });

        doc.save(`Forensic_Report_${sampleMetadata.sampleId || 'unnamed'}.pdf`);
      });
    });
  };

  const handleExportJSON = () => {
    if (!result) return;
    
    const reportData = {
      sampleMetadata,
      markers,
      analysis: result
    };
    
    const jsonContent = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Forensic_Report_${sampleMetadata.sampleId || 'unnamed'}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    if (!result) return;
    
    const wb = XLSX.utils.book_new();

    const wsMarkers = XLSX.utils.json_to_sheet(markers.map(m => ({
      Marker: m.name,
      Symbol: m.symbol,
      Concentration: m.concentration,
      Unit: m.unit,
      Threshold: MARKER_THRESHOLDS[m.symbol] || 80,
      Exceeded: m.concentration > (MARKER_THRESHOLDS[m.symbol] || 80) ? 'YES' : 'NO'
    })));
    XLSX.utils.book_append_sheet(wb, wsMarkers, 'Markers');

    const wsMetadata = XLSX.utils.json_to_sheet([{
      SampleID: sampleMetadata.sampleId,
      CollectionDate: sampleMetadata.collectionDate,
      Collector: sampleMetadata.collectorName
    }]);
    XLSX.utils.book_append_sheet(wb, wsMetadata, 'Metadata');

    const wsResults = XLSX.utils.json_to_sheet([{
      Source: result.sourceType,
      Confidence: `${Math.round(result.confidence * 100)}%`,
      Reasoning: result.reasoning
    }]);
    XLSX.utils.book_append_sheet(wb, wsResults, 'Results');
    
    XLSX.writeFile(wb, `Forensic_Report_${sampleMetadata.sampleId || 'unnamed'}.xlsx`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full p-6 overflow-y-auto">
      {/* Input Section */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="bg-brand-bg border border-brand-line p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
          <div className="flex items-center gap-2 mb-6">
            <Database className="w-5 h-5" />
            <h2 className="text-lg font-bold">Sample Entry</h2>
            <div className="flex items-center gap-1 ml-auto">
              {(['chemical', 'water', 'air', 'soil', 'waste'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterCategories(prev => 
                      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                    );
                  }}
                  className={`px-1.5 py-0.5 text-[9px] uppercase font-mono border transition-all ${
                    filterCategories.includes(cat) 
                      ? 'bg-brand-ink text-brand-bg border-brand-ink' 
                      : 'border-brand-line opacity-30 hover:opacity-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Forensic Metadata */}
          <div className="grid grid-cols-1 gap-4 mb-8 pb-6 border-b border-brand-line/10">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono uppercase opacity-40">Sample Trace ID</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const year = new Date().getFullYear();
                      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                      let randomPart = '';
                      for (let i = 0; i < 4; i++) randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
                      handleIdChange(`TR-${year}-${randomPart}`);
                    }}
                    className="text-[8px] font-mono uppercase bg-brand-line/10 hover:bg-brand-line/20 px-1.5 py-0.5"
                  >
                    Generate
                  </button>
                  <button 
                    onClick={() => setIsHistoryOpen(true)}
                    className={`text-[8px] font-mono uppercase transition-all ${isHistoryOpen ? 'text-brand-ink opacity-100' : 'opacity-30 hover:opacity-100'}`}
                  >
                    View History ({usedSampleIds.size})
                  </button>
                  {usedSampleIds.size > 0 && (
                    <button 
                      onClick={clearRegistry}
                      className="text-[8px] font-mono uppercase opacity-30 hover:opacity-100 hover:text-red-600 transition-all border-l border-brand-line/10 pl-2"
                    >
                      Purge Registry
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                value={sampleMetadata.sampleId}
                onChange={(e) => handleIdChange(e.target.value)}
                className={`bg-transparent border-b py-1 outline-none text-xs font-mono transition-colors ${
                  validationError ? 'border-red-600 focus:border-red-600' : 'border-brand-line/30 focus:border-brand-line'
                }`}
                placeholder="TR-2026-X"
              />
              {validationError && (
                <span className="text-[9px] text-red-600 font-bold uppercase mt-1 leading-tight">
                  {validationError}
                </span>
              )}

            {/* Espace pour l'historique retiré */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase opacity-40">Collection Date</label>
                <input
                  type="date"
                  value={sampleMetadata.collectionDate}
                  onChange={(e) => setSampleMetadata(prev => ({ ...prev, collectionDate: e.target.value }))}
                  className="bg-transparent border-b border-brand-line/30 py-1 focus:border-brand-line outline-none text-xs font-mono transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase opacity-40">Collector (Rank)</label>
                <input
                  type="text"
                  value={sampleMetadata.collectorName}
                  onChange={(e) => setSampleMetadata(prev => ({ ...prev, collectorName: e.target.value }))}
                  className="bg-transparent border-b border-brand-line/30 py-1 focus:border-brand-line outline-none text-xs font-mono transition-colors"
                  placeholder="Officer name..."
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase opacity-40">Latitude</label>
                <input
                  type="number"
                  value={sampleMetadata.lat}
                  onChange={(e) => setSampleMetadata(prev => ({ ...prev, lat: e.target.value }))}
                  className="bg-transparent border-b border-brand-line/30 py-1 focus:border-brand-line outline-none text-xs font-mono transition-colors"
                  placeholder="0.0000"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase opacity-40">Longitude</label>
                <input
                  type="number"
                  value={sampleMetadata.lng}
                  onChange={(e) => setSampleMetadata(prev => ({ ...prev, lng: e.target.value }))}
                  className="bg-transparent border-b border-brand-line/30 py-1 focus:border-brand-line outline-none text-xs font-mono transition-colors"
                  placeholder="0.0000"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <MapComponent 
              sites={[]} 
              userLocation={sampleMetadata.lat && sampleMetadata.lng ? { lat: parseFloat(sampleMetadata.lat), lng: parseFloat(sampleMetadata.lng) } : null} 
              onLocationSelect={(lat, lng) => setSampleMetadata(prev => ({ ...prev, lat: lat.toFixed(4), lng: lng.toFixed(4) }))}
            />
            {(['chemical', 'water', 'air', 'soil', 'waste'] as const)
              .filter(cat => filterCategories.includes(cat))
              .map(category => (
                <div key={category} className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40 border-b border-brand-line/20 pb-2">{category} parameters</h3>
                  {markers.filter(m => m.category === category).map((marker) => (
                  <div key={marker.symbol} className="flex flex-col gap-1 relative group">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => { setSelectedMarkerForInfo(marker.symbol); setActiveInfoTab('description'); }}
                          className="text-[11px] font-serif italic uppercase opacity-60 hover:opacity-100 hover:text-brand-ink transition-colors text-left"
                        >
                          {marker.name} ({marker.symbol})
                        </button>
                      </div>
                      <span className="text-[10px] mono-value opacity-40">{marker.unit}</span>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute left-0 bottom-full mb-2 w-72 p-3 bg-brand-ink text-brand-bg text-[10px] shadow-xl border border-brand-line rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-[100] italic pointer-events-none">
                      <p className="font-bold border-b border-brand-bg/30 block mb-1">{marker.name} ({marker.symbol})</p>
                      <p className="mb-1">Concentration: {marker.concentration} {marker.unit}</p>
                      <p className="mb-2">Threshold: {MARKER_THRESHOLDS[marker.symbol] || 80} {marker.unit}</p>
                      <span className="font-bold border-b border-brand-bg/30 block mb-1">Health Impact:</span>
                      <p className="mb-2">{MARKER_HEALTH_IMPACTS[marker.symbol]}</p>
                      <span className="font-bold border-b border-brand-bg/30 block mb-1">Environmental Impact:</span>
                      {typeof MARKER_ENVIRONMENTAL_IMPACTS[marker.symbol] === 'string' || !MARKER_ENVIRONMENTAL_IMPACTS[marker.symbol] ? (
                        <p className="mb-2">{MARKER_ENVIRONMENTAL_IMPACTS[marker.symbol] as string || 'No known environmental impacts.'}</p>
                      ) : (
                        <div className="mb-2 space-y-1">
                          <p><span className="font-bold">Aquatic: </span>{(MARKER_ENVIRONMENTAL_IMPACTS[marker.symbol] as any).aquaticLife}</p>
                          <p><span className="font-bold">Soil: </span>{(MARKER_ENVIRONMENTAL_IMPACTS[marker.symbol] as any).soil}</p>
                          <p><span className="font-bold">Air: </span>{(MARKER_ENVIRONMENTAL_IMPACTS[marker.symbol] as any).airQuality}</p>
                        </div>
                      )}
                      <span className="font-bold border-b border-brand-bg/30 block mb-1">Environmental Persistence:</span>
                      <p>
                        {(() => {
                          if (!marker.symbol || !MARKER_PERSISTENCE || typeof MARKER_PERSISTENCE !== 'object') {
                            return 'Persistence information unavailable.';
                          }
                          const persistenceData = (MARKER_PERSISTENCE as any)[marker.symbol];
                          if (typeof persistenceData !== 'string' || persistenceData.trim() === '') {
                            return 'Persistence information invalid or empty.';
                          }
                          return persistenceData;
                        })()}
                      </p>
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
            ))}
          </div>

          <div className="mt-8 border-t border-brand-line/20 pt-8">
            <h4 className="text-[10px] uppercase font-mono opacity-60 mb-4">Sample Concentration Overview</h4>
            <SignatureChart sampleData={markers} type="bar" onMarkerClick={setSelectedMarkerForInfo} thresholds={MARKER_THRESHOLDS} />
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

          <button
            onClick={runPredictiveScan}
            disabled={isPredictiveScanning}
            className="w-full mt-2 border border-brand-ink text-brand-ink py-4 font-display font-bold uppercase tracking-widest hover:bg-brand-ink hover:text-brand-bg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Run Predictive Scan
          </button>
          
          {result && (
            <div className="flex gap-2 w-full mt-2">
              <button
                onClick={handleExportCSV}
                className="flex-1 border border-brand-ink text-brand-ink py-2 font-display text-xs uppercase hover:bg-brand-ink hover:text-brand-bg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-3 h-3" />
                CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="flex-1 border border-brand-ink text-brand-ink py-2 font-display text-xs uppercase hover:bg-brand-ink hover:text-brand-bg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-3 h-3" />
                PDF
              </button>
              <button
                onClick={handleExportJSON}
                className="flex-1 border border-brand-ink text-brand-ink py-2 font-display text-xs uppercase hover:bg-brand-ink hover:text-brand-bg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-3 h-3" />
                JSON
              </button>
              <button
                onClick={handleExportExcel}
                className="flex-1 border border-brand-ink text-brand-ink py-2 font-display text-xs uppercase hover:bg-brand-ink hover:text-brand-bg transition-colors flex items-center justify-center gap-2"
              >
                <Database className="w-3 h-3" />
                Excel
              </button>
              <button
                onClick={reset}
                className="flex-1 border border-brand-line py-2 font-display text-xs uppercase hover:bg-brand-line/5 transition-colors"
              >
                Clear Session
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Visualization Area */}
      <div className="flex-1 flex flex-col gap-6">
        <AnimatePresence mode="wait">
          <AnalysisContent 
            selectedAlert={selectedAlert}
            result={result}
            isAnalyzing={isAnalyzing}
            markers={markers}
            handleExportCSV={handleExportCSV}
            handleExportPDF={handleExportPDF}
            handleExportJSON={handleExportJSON}
            handleExportExcel={handleExportExcel}
            MARKER_NAMES={MARKER_NAMES}
            MARKER_ENVIRONMENTAL_IMPACTS={MARKER_ENVIRONMENTAL_IMPACTS}
            MARKER_PERSISTENCE={MARKER_PERSISTENCE}
            MARKER_THRESHOLDS={MARKER_THRESHOLDS}
            MARKER_DESCRIPTIONS={MARKER_DESCRIPTIONS}
            MARKER_SOURCES={MARKER_SOURCES}
            MARKER_HEALTH_IMPACTS={MARKER_HEALTH_IMPACTS}
            setSelectedAlertId={setSelectedAlertId}
            onMarkerClick={setSelectedMarkerForInfo}
          />
          {/* Industry Signature Comparison */}
          <div className="border border-brand-line p-6 bg-brand-bg">
              <h3 className="font-serif italic text-sm mb-4 border-b border-brand-line/20 pb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Signature Comparison
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                  {INDUSTRY_SIGNATURES.map((sig) => {
                      const isSelected = selectedComparisons.includes(sig.industry);
                      const isAtLimit = selectedComparisons.length >= 3 && !isSelected;

                      return (
                        <button
                            key={sig.industry}
                            onClick={() => {
                                if (isAtLimit) return;
                                setSelectedComparisons(prev => 
                                    prev.includes(sig.industry) 
                                        ? prev.filter(i => i !== sig.industry)
                                        : [...prev, sig.industry]
                                );
                            }}
                            disabled={isAtLimit}
                            className={`px-3 py-1 text-xs font-mono border transition-all ${
                                isSelected 
                                    ? 'bg-brand-ink text-brand-bg border-brand-ink' 
                                    : isAtLimit 
                                        ? 'border-brand-line opacity-30 cursor-not-allowed'
                                        : 'border-brand-line hover:border-brand-ink'
                            }`}
                        >
                            {sig.industry}
                        </button>
                      );
                  })}
              </div>
              <SignatureChart sampleData={markers} comparisonIndustries={selectedComparisons} onMarkerClick={setSelectedMarkerForInfo} thresholds={MARKER_THRESHOLDS} />
              
              <div className="border border-brand-line p-6 bg-brand-bg mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif italic text-sm flex items-center gap-2">
                    <TrendIcon className="w-4 h-4" />
                    Historical Trends
                  </h3>
                  <div className="flex gap-2">
                    {[7, 30, 90].map(range => (
                      <button
                        key={range}
                        onClick={() => setDateRange(range as 7 | 30 | 90)}
                        className={`text-[10px] uppercase font-mono px-2 py-1 border ${dateRange === range ? 'bg-brand-ink text-brand-bg' : 'border-brand-line'}`}
                      >
                        {range}d
                      </button>
                    ))}
                  </div>
                </div>
                <TrendChart markerData={markers} dateRange={dateRange} thresholds={MARKER_THRESHOLDS} />
              </div>

              {result && (
                <div className="border border-brand-line p-6 bg-brand-bg mt-6">
                    <h3 className="font-serif italic text-sm mb-4 border-b border-brand-line/20 pb-2 flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4" />
                        AI-Generated Forensic Insights
                    </h3>
                    <p className="text-sm text-brand-ink/90 leading-relaxed font-mono">
                        {result.reasoning}
                    </p>
                </div>
              )}
          </div>
        </AnimatePresence>
      </div>

      {/* Marker Info Modal */}
      <AnimatePresence>
        {selectedMarkerForInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-ink/40 z-[200] flex items-center justify-center p-4"
            onClick={() => setSelectedMarkerForInfo(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-brand-bg border border-brand-line p-6 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-line shrink-0">
                <h2 className="text-2xl font-bold font-display uppercase tracking-widest">
                  {MARKER_NAMES[selectedMarkerForInfo]} ({selectedMarkerForInfo})
                </h2>
                <button 
                  onClick={() => setSelectedMarkerForInfo(null)}
                  className="text-brand-ink/40 hover:text-brand-ink transition-colors p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="overflow-y-auto pr-4 flex-1 space-y-6 stylish-scrollbar">
                <section>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-2">Description</h3>
                  <p className="text-sm border-l-2 border-brand-ink pl-3">{MARKER_DESCRIPTIONS[selectedMarkerForInfo] || 'No description available for this marker.'}</p>
                </section>

                <section>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-2">Health Impacts</h3>
                  <p className="text-sm font-medium border-l-2 border-brand-line pl-3">{MARKER_HEALTH_IMPACTS[selectedMarkerForInfo] || 'No known health impacts.'}</p>
                </section>

                <section>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-2">Environmental Impacts</h3>
                  {typeof MARKER_ENVIRONMENTAL_IMPACTS[selectedMarkerForInfo] === 'string' || !MARKER_ENVIRONMENTAL_IMPACTS[selectedMarkerForInfo] ? (
                     <p className="text-sm border-l-2 border-brand-line pl-3">{MARKER_ENVIRONMENTAL_IMPACTS[selectedMarkerForInfo] as string || 'No known environmental impacts.'}</p>
                  ) : (
                    <div className="text-sm border-l-2 border-brand-line pl-3 space-y-2">
                        <p><span className="font-bold">Aquatic: </span>{(MARKER_ENVIRONMENTAL_IMPACTS[selectedMarkerForInfo] as any).aquaticLife}</p>
                        <p><span className="font-bold">Soil: </span>{(MARKER_ENVIRONMENTAL_IMPACTS[selectedMarkerForInfo] as any).soil}</p>
                        <p><span className="font-bold">Air: </span>{(MARKER_ENVIRONMENTAL_IMPACTS[selectedMarkerForInfo] as any).airQuality}</p>
                    </div>
                  )}
                </section>

                <section>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-2">Environmental Persistence</h3>
                  <p className="text-[10px] text-brand-ink/60 mb-2 italic">Duration the marker remains active in the ecosystem.</p>
                  <div className="text-sm border-l-2 border-brand-line pl-3">
                    {(() => {
                      if (!selectedMarkerForInfo || !MARKER_PERSISTENCE || typeof MARKER_PERSISTENCE !== 'object') {
                        return <p>Persistence information unavailable.</p>;
                      }
                      const persistenceData = (MARKER_PERSISTENCE as any)[selectedMarkerForInfo];
                      if (typeof persistenceData !== 'string' || persistenceData.trim() === '') {
                        return <p className="opacity-50">Data not specified for this marker.</p>;
                      }
                      
                      const parts = persistenceData.split(':');
                      if (parts.length > 1) {
                         return (
                           <p>
                             <span className="font-bold font-mono tracking-wide">{parts[0]}:</span>
                             {parts.slice(1).join(':')}
                           </p>
                         );
                      }
                      return <p>{persistenceData}</p>;
                    })()}
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-2">Sources</h3>
                  <div className="space-y-3">
                    {(MARKER_SOURCES[selectedMarkerForInfo] || []).map((source: any, idx: number) => {
                      const name = typeof source === 'string' ? source : source.name;
                      const isObject = typeof source !== 'string';
                      const isExpanded = expandedSources.has(name);
                      
                      return (
                        <div key={idx} className="border-l-2 border-brand-line pl-3">
                          <div 
                            className={`flex items-center justify-between ${isObject ? 'cursor-pointer hover:text-brand-ink transition-colors' : ''}`}
                            onClick={() => {
                              if (isObject) {
                                setExpandedSources(prev => {
                                  const next = new Set(prev);
                                  if (next.has(name)) next.delete(name);
                                  else next.add(name);
                                  return next;
                                });
                              }
                            }}
                          >
                            <span className="text-sm font-medium">{name}</span>
                            {isObject && (
                              <span className="text-[9px] uppercase font-mono opacity-50">{isExpanded ? 'Hide Details' : 'View Details'}</span>
                            )}
                          </div>
                          {isObject && isExpanded && (
                            <div className="mt-2 text-[11px] text-brand-ink/80 bg-brand-line/10 p-2 rounded font-mono">
                              {source.typicalConcentrationRange && <p className="mb-1"><span className="opacity-60">Range: </span>{source.typicalConcentrationRange}</p>}
                              {source.associatedIndustries && (
                                <p><span className="opacity-60">Industries: </span>{source.associatedIndustries.join(', ')}</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sample History Modal */}
      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-ink/40 z-[200] flex items-center justify-center p-4"
            onClick={() => setIsHistoryOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-brand-bg border border-brand-line p-6 max-w-sm w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="absolute top-4 right-4 text-brand-ink/40 hover:text-brand-ink"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold font-display uppercase tracking-widest mb-6">Trace Registry</h2>
              <div className="grid grid-cols-2 gap-2">
                {Array.from(usedSampleIds).reverse().map((id: string) => (
                  <button 
                    key={id} 
                    onClick={() => { handleIdChange(id); setIsHistoryOpen(false); }} 
                    className="text-[10px] font-mono border border-brand-line/20 p-2 hover:bg-brand-ink/10 transition-colors"
                  >
                    {id}
                  </button>
                ))}
                {usedSampleIds.size === 0 && <p className="text-[10px] opacity-40 col-span-2">No history.</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};
