import React, { useState, useEffect } from 'react';
import { Link, Hash, Clock, ShieldCheck } from 'lucide-react';

interface BlockchainEntry {
  hash: string;
  timestamp: string;
  sampleId: string;
  sourceType: string;
  confidence: number;
}

export const TraceabilityLog: React.FC = () => {
  const [ledger, setLedger] = useState<BlockchainEntry[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('blockchain_ledger');
    if (raw) {
      setLedger(JSON.parse(raw));
    }
  }, []);

  return (
    <div className="p-6">
      <div className="bg-brand-bg border border-brand-line p-8 max-w-4xl mx-auto shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
        <div className="flex items-center gap-3 mb-8 border-b border-brand-line/20 pb-4">
          <Link className="w-8 h-8 text-brand-ink" />
          <div>
            <h2 className="text-xl font-display font-black uppercase tracking-widest">Blockchain Traceability</h2>
            <p className="text-[10px] font-mono opacity-50 uppercase">Immutable Hash Ledger</p>
          </div>
        </div>

        {ledger.length === 0 ? (
          <div className="text-center py-12 opacity-50 font-mono text-xs uppercase">
            No entries in the blockchain ledger.
          </div>
        ) : (
          <div className="space-y-4">
            {ledger.map((entry, i) => (
              <div key={i} className="border border-brand-line/20 p-4 relative group hover:bg-brand-line/5 transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-ink/20 group-hover:bg-brand-ink"></div>
                
                <div className="flex flex-col gap-2 relative pl-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-sm tracking-wider uppercase">{entry.sampleId}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50 font-mono text-[10px]">
                      <Clock className="w-3 h-3" />
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="text-[10px] font-mono opacity-50 uppercase block">Attributed Source</span>
                      <span className="font-bold text-xs">{entry.sourceType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono opacity-50 uppercase block">Confidence</span>
                      <span className="font-bold text-xs">{Math.round(entry.confidence * 100)}%</span>
                    </div>
                  </div>

                  <div className="mt-4 bg-brand-bg border border-brand-line/30 p-2 flex items-center gap-2">
                    <Hash className="w-3 h-3 opacity-30" />
                    <span className="font-mono text-[8px] text-brand-ink/70 break-all select-all">
                      {entry.hash}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
