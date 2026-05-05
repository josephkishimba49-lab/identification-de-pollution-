import React, { useState } from 'react';
import { Database, ShieldCheck, Download, Upload } from 'lucide-react';
import { useAlerts } from '../contexts/AlertContext';

export const DisasterRecovery: React.FC = () => {
  const { addAlert } = useAlerts();

  const handleBackup = () => {
    const data = {
      usedSampleIds: localStorage.getItem('forensic_used_ids'),
      traceabilityLog: localStorage.getItem('blockchain_ledger')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TraceSource_DR_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    addAlert({
      severity: 'info',
      title: 'Disaster Recovery',
      description: 'System state archived successfully.',
      type: 'user_action'
    });
  };

  return (
    <div className="p-6">
      <div className="bg-brand-bg border border-brand-line p-8 max-w-2xl mx-auto shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-8 h-8 text-brand-ink" />
          <div>
            <h2 className="text-xl font-display font-black uppercase tracking-widest">Disaster Recovery (DR)</h2>
            <p className="text-[10px] font-mono opacity-50 uppercase">System state & backup modules</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-brand-line/30 p-6 bg-brand-ink/5">
            <h3 className="font-bold text-sm mb-2 uppercase tracking-widest">Cold Storage Export</h3>
            <p className="text-[10px] font-mono opacity-70 mb-4 max-w-md">
              Generates a full snapshot of local ledger state, sample manifests, and blockchain hashes. Store this securely.
            </p>
            <button 
              onClick={handleBackup}
              className="flex items-center gap-2 border border-brand-ink bg-brand-ink text-brand-bg px-4 py-2 text-xs font-bold uppercase transition-opacity hover:opacity-90"
            >
              <Download className="w-4 h-4" />
              Download Snapshot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
