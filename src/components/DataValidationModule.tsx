import React, { useState } from 'react';
import { ShieldCheck, Database, Filter, AlertTriangle, CheckCircle, FileX, Zap } from 'lucide-react';

interface DatasetLog {
  id: string;
  source: string;
  timestamp: string;
  recordsProcessed: number;
  anomaliesDetected: number;
  integrityScore: number;
  status: 'verified' | 'quarantined' | 'pending';
}

const LOGS: DatasetLog[] = [
  { id: 'DS-9921', source: 'Estuary Main Stream', timestamp: '10 mins ago', recordsProcessed: 14500, anomaliesDetected: 12, integrityScore: 98.4, status: 'verified' },
  { id: 'DS-9920', source: 'Industrial Outflow 3', timestamp: '1 hr ago', recordsProcessed: 3200, anomaliesDetected: 405, integrityScore: 61.2, status: 'quarantined' },
  { id: 'DS-9919', source: 'Urban Runoff C', timestamp: '3 hrs ago', recordsProcessed: 8900, anomaliesDetected: 0, integrityScore: 99.9, status: 'verified' },
  { id: 'DS-9918', source: 'Upstream Control', timestamp: '5 hrs ago', recordsProcessed: 1200, anomaliesDetected: 5, integrityScore: 88.0, status: 'pending' },
];

export const DataValidationModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logs' | 'rules'>('logs');

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden">
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('logs')}
          className={`flex-1 max-w-[200px] border p-4 flex flex-col gap-2 transition-all ${activeTab === 'logs' ? 'bg-brand-ink text-brand-bg border-brand-ink shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]' : 'border-brand-line/30 hover:border-brand-line'}`}
        >
          <Database className={`w-5 h-5 ${activeTab === 'logs' ? 'opacity-100' : 'opacity-40'}`} />
          <span className="font-bold text-xs uppercase tracking-widest text-left">Ingestion Logs</span>
        </button>
        <button 
          onClick={() => setActiveTab('rules')}
          className={`flex-1 max-w-[200px] border p-4 flex flex-col gap-2 transition-all ${activeTab === 'rules' ? 'bg-brand-ink text-brand-bg border-brand-ink shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]' : 'border-brand-line/30 hover:border-brand-line'}`}
        >
          <Filter className={`w-5 h-5 ${activeTab === 'rules' ? 'opacity-100' : 'opacity-40'}`} />
          <span className="font-bold text-xs uppercase tracking-widest text-left">QC Rules Engine</span>
        </button>
      </div>

      <div className="flex-1 bg-brand-bg border border-brand-line shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] overflow-hidden flex flex-col">
        {activeTab === 'logs' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-brand-line/20 bg-brand-line/5 flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Data Integrity Stream
              </h2>
              <div className="text-[10px] font-mono opacity-50 uppercase flex gap-4">
                <span>Avg Score: <strong className="opacity-100 text-brand-ink">86.8%</strong></span>
                <span>Quarantined: <strong className="opacity-100 text-red-500">1</strong></span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {LOGS.map(log => (
                <div key={log.id} className="border border-brand-line/30 p-4 flex items-center gap-6 hover:bg-brand-line/5 transition-colors">
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center border border-brand-line/20 rounded bg-brand-bg">
                    {log.status === 'verified' && <CheckCircle className="w-6 h-6 text-green-500" />}
                    {log.status === 'quarantined' && <FileX className="w-6 h-6 text-red-500" />}
                    {log.status === 'pending' && <Zap className="w-6 h-6 text-yellow-500" />}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold font-mono text-sm uppercase">{log.id} <span className="opacity-40 font-sans tracking-wide ml-2">| {log.source}</span></h3>
                    <p className="text-[10px] uppercase font-mono opacity-60 mt-1">{log.timestamp}</p>
                  </div>

                  <div className="flex gap-8 px-8 border-x border-brand-line/10">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono opacity-50 uppercase mb-1">Records</span>
                      <span className="font-mono text-xs">{log.recordsProcessed.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono opacity-50 uppercase mb-1">Anomalies</span>
                      <span className={`font-mono text-xs ${log.anomaliesDetected > 100 ? 'text-red-500 font-bold' : ''}`}>{log.anomaliesDetected}</span>
                    </div>
                  </div>

                  <div className="w-32 flex flex-col items-end">
                    <span className="text-[10px] font-mono opacity-50 uppercase mb-1">Integrity Score</span>
                    <span className={`font-bold font-mono ${log.integrityScore > 90 ? 'text-green-600' : log.integrityScore > 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {log.integrityScore.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-brand-line/20 pb-2">Active Validation Rules</h2>
            <div className="space-y-4 max-w-2xl">
              <div className="p-4 border-l-2 border-brand-ink bg-brand-ink/5">
                <h3 className="text-xs font-bold uppercase mb-1">Z-Score Outlier Rejection</h3>
                <p className="text-[10px] font-mono opacity-70">Automatically quarantine chemical signatures that deviate &gt;3 standard deviations from a 30-day rolling baseline.</p>
              </div>
              <div className="p-4 border-l-2 border-brand-ink bg-brand-ink/5">
                <h3 className="text-xs font-bold uppercase mb-1">Negative Value Clamping</h3>
                <p className="text-[10px] font-mono opacity-70">Force calibration drift anomalies (negative concentration values) to 0 and flag record.</p>
              </div>
              <div className="p-4 border-l-2 border-brand-ink bg-brand-ink/5">
                <h3 className="text-xs font-bold uppercase mb-1">Incomplete Signature Drop</h3>
                <p className="text-[10px] font-mono opacity-70">Reject samples missing critical baseline markers (TSS, pH, DO) from unmixing simulation.</p>
              </div>

              <button className="mt-8 border border-brand-ink bg-transparent text-brand-ink py-2 px-6 text-xs font-bold uppercase hover:bg-brand-ink hover:text-brand-bg transition-colors">
                + Author New Rule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
