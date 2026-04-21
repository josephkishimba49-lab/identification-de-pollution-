/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Activity, 
  Database, 
  FileText, 
  Gavel, 
  Settings, 
  Wind,
  Droplets,
  AlertCircle
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active }) => (
  <div className={`
    flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-r-2
    ${active 
      ? 'border-brand-ink bg-brand-ink/5 text-brand-ink opacity-100' 
      : 'border-transparent text-brand-ink/40 hover:text-brand-ink/70'}
  `}>
    <Icon className="w-5 h-5" />
    <span className="font-display text-[11px] uppercase tracking-widest font-bold">
      {label}
    </span>
  </div>
);

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 border-r border-brand-line flex flex-col h-full bg-brand-bg/50 backdrop-blur-sm">
      <div className="p-6 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Wind className="w-6 h-6 stroke-[3]" />
          <h1 className="text-2xl font-display font-black leading-none">TraceSource</h1>
        </div>
        <p className="text-[10px] font-mono opacity-40 uppercase tracking-tighter">Forensic Fingerprinting v1.0.4</p>
      </div>

      <div className="flex-1 space-y-1">
        <SidebarItem icon={Activity} label="Forensic Analyzer" active />
        <SidebarItem icon={Database} label="Baseline Database" />
        <SidebarItem icon={FileText} label="Historical Reports" />
        <SidebarItem icon={Gavel} label="Legal Case Builder" />
      </div>

      <div className="p-6 border-t border-brand-line/10">
        <div className="flex items-center gap-3 text-red-600 bg-red-50 p-3 mb-6 border border-red-200">
           <AlertCircle className="w-4 h-4 shrink-0" />
           <div className="text-[10px] leading-tight font-serif italic uppercase">
             Direct monitoring alert: Sector 7 discharge anomaly detected.
           </div>
        </div>
        
        <SidebarItem icon={Settings} label="System Config" />
        <div className="mt-8 flex items-center gap-2 px-4 opacity-30">
          <Droplets className="w-4 h-4" />
          <span className="text-[9px] font-mono">WATER_PURITY_IDX: 72.4</span>
        </div>
      </div>
    </div>
  );
};
