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
  AlertCircle,
  Scan,
  Satellite,
  Wifi,
  ShieldCheck,
  BrainCircuit,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

import { SidebarAlertList } from './Alerts';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`
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

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="w-64 border-r border-brand-line flex flex-col h-full bg-brand-bg/50 backdrop-blur-sm overflow-y-auto">
      <div className="p-6 mb-4 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Wind className="w-6 h-6 stroke-[3]" />
          <h1 className="text-2xl font-display font-black leading-none">TraceSource</h1>
        </div>
        <p className="text-[10px] font-mono opacity-40 uppercase tracking-tighter">Forensic Fingerprinting v1.0.4</p>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto pb-4">
        <div className="px-4 py-2 mt-2 mb-1">
           <p className="text-[9px] font-mono opacity-30 uppercase tracking-[0.2em] font-bold">Diagnostic Intelligence</p>
        </div>
        <SidebarItem icon={Activity} label="Forensic Analyzer" active={activeView === 'analyzer'} onClick={() => onViewChange('analyzer')} />
        <SidebarItem icon={Scan} label="Multi-Modal Shazam" active={activeView === 'shazam'} onClick={() => onViewChange('shazam')} />
        <SidebarItem icon={BrainCircuit} label="Predictive Modeler" active={activeView === 'predictive'} onClick={() => onViewChange('predictive')} />
        <SidebarItem icon={Satellite} label="SatFinder" active={activeView === 'satfinder'} onClick={() => onViewChange('satfinder')} />
        <SidebarItem icon={Database} label="Unmixing Sim" active={activeView === 'unmixing'} onClick={() => onViewChange('unmixing')} />
        <SidebarItem icon={Gavel} label="Siamese Network" active={activeView === 'siamese'} onClick={() => onViewChange('siamese')} />
        
        <div className="px-4 py-2 mt-4 mb-1 border-t border-brand-line/10 pt-4">
           <p className="text-[9px] font-mono opacity-30 uppercase tracking-[0.2em] font-bold">System Infrastructure</p>
        </div>
        <SidebarItem icon={Wifi} label="IoT Sensor Fleet" active={activeView === 'sensors'} onClick={() => onViewChange('sensors')} />
        <SidebarItem icon={Satellite} label="Live Geolocation" active={activeView === 'geolocation'} onClick={() => onViewChange('geolocation')} />
        <SidebarItem icon={ShieldCheck} label="Data Validation QA/QC" active={activeView === 'validation'} onClick={() => onViewChange('validation')} />
        
        <div className="px-4 py-2 mt-4 mb-1 border-t border-brand-line/10 pt-4">
           <p className="text-[9px] font-mono opacity-30 uppercase tracking-[0.2em] font-bold">Operations & Legal</p>
        </div>
        <SidebarItem icon={AlertTriangle} label="Incident Response" active={activeView === 'incidents'} onClick={() => onViewChange('incidents')} />
        <SidebarItem icon={FileCheck} label="Compliance Hub" active={activeView === 'compliance'} onClick={() => onViewChange('compliance')} />
        <SidebarItem icon={FileText} label="Traceability Log" active={activeView === 'reports'} onClick={() => onViewChange('reports')} />
      </div>

      <div className="p-6 border-t border-brand-line/10 shrink-0">
        <SidebarAlertList />
        
        <SidebarItem icon={Settings} label="System Config & DR" active={activeView === 'settings'} onClick={() => onViewChange('settings')} />
        <div className="mt-8 flex items-center gap-2 px-4 opacity-30">
          <Droplets className="w-4 h-4" />
          <span className="text-[9px] font-mono">WATER_PURITY_IDX: 72.4</span>
        </div>
      </div>
    </div>
  );
};
