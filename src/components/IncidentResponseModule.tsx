import React, { useState } from 'react';
import { AlertTriangle, MapPin, Truck, ShieldAlert, CheckCircle, Clock, Radio, User, ChevronRight } from 'lucide-react';

interface Incident {
  id: string;
  location: string;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Unassigned' | 'Dispatching' | 'On-site' | 'Contained' | 'Resolved';
  time: string;
  team: string;
  description: string;
}

const MOCK_INCIDENTS: Incident[] = [
  { id: 'INC-2026-04A', location: 'Estuary Main Stream', type: 'Unidentified Chemical Spill', severity: 'Critical', status: 'Dispatching', time: '12 mins ago', team: 'Response Team Delta-4', description: 'Sensor SN-01A detected massive heavy metal spike. Autonomous containment booms deployed. Human verification required.' },
  { id: 'INC-2026-03F', location: 'Industrial Outflow 3', type: 'Thermal Anomaly', severity: 'High', status: 'On-site', time: '1 hr ago', team: 'Hazmat Bravo-1', description: 'Cooling fluid overflow suspected from adjacent manufacturing sector.' },
  { id: 'INC-2026-03B', location: 'Urban Runoff Sector C', type: 'High pH Variation', severity: 'Medium', status: 'Contained', time: '4 hrs ago', team: 'Survey Unit Echo-2', description: 'Illegal dumping identified and isolated to local drainage grid.' },
  { id: 'INC-2026-02X', location: 'Upstream Control', type: 'Sensor Interference', severity: 'Low', status: 'Resolved', time: '1 day ago', team: 'Tech Ops Alpha', description: 'Debris blocked primary sensor membrane. Cleared and recalibrated.' },
];

export const IncidentResponseModule: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(MOCK_INCIDENTS[0].id);
  const selectedIncident = MOCK_INCIDENTS.find(i => i.id === selectedId) || MOCK_INCIDENTS[0];

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden">
      <div className="flex gap-6 flex-1 min-h-0">
        
        {/* Incident List */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-brand-line/20 pb-4 shrink-0">
            <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Active Dispatch
            </h2>
            <div className="px-2 py-1 bg-red-500/10 text-red-600 text-[9px] font-mono uppercase font-bold">
              {MOCK_INCIDENTS.filter(i => i.status !== 'Resolved').length} Active
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {MOCK_INCIDENTS.map(incident => (
              <div 
                key={incident.id}
                onClick={() => setSelectedId(incident.id)}
                className={`p-4 border cursor-pointer transition-colors ${selectedId === incident.id ? 'border-brand-ink bg-brand-ink/5 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]' : 'border-brand-line/30 hover:border-brand-line'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${incident.severity === 'Critical' ? 'bg-red-500 animate-pulse' : incident.severity === 'High' ? 'bg-yellow-500' : incident.severity === 'Medium' ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                    <h3 className="font-bold text-xs font-mono uppercase tracking-wider">{incident.id}</h3>
                  </div>
                  <span className="text-[9px] font-mono opacity-50">{incident.time}</span>
                </div>
                
                <h4 className="text-sm font-bold uppercase tracking-wide mb-1">{incident.type}</h4>
                <p className="text-[10px] font-mono opacity-60 flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> {incident.location}
                </p>

                <div className="flex justify-between items-center text-[10px] font-mono border-t border-brand-line/10 pt-2">
                  <span className="opacity-70 flex items-center gap-1"><Truck className="w-3 h-3"/> {incident.team}</span>
                  <span className={`uppercase font-bold ${incident.status === 'Resolved' ? 'text-green-600' : 'text-brand-ink'}`}>{incident.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Details */}
        <div className="flex-1 border border-brand-line bg-brand-bg shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex flex-col overflow-hidden">
          <div className="p-6 border-b border-brand-line/20 bg-brand-line/5 shrink-0">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <div className="flex items-center gap-3 mb-2">
                   <h2 className="text-2xl font-display font-black uppercase tracking-tight">{selectedIncident.id}</h2>
                   <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold border ${selectedIncident.severity === 'Critical' ? 'bg-red-500/10 text-red-700 border-red-500/30' : selectedIncident.severity === 'High' ? 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30' : 'bg-brand-line/10 border-brand-line/30'}`}>
                     Severity: {selectedIncident.severity}
                   </span>
                 </div>
                 <p className="font-mono text-xs opacity-70 flex items-center gap-2"><MapPin className="w-3 h-3"/> {selectedIncident.location}</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-mono uppercase opacity-50 mb-1">Current Status</p>
                 <div className="px-3 py-1 bg-brand-ink text-brand-bg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
                    {selectedIncident.status === 'Dispatching' ? <Radio className="w-3 h-3 animate-pulse" /> : <ShieldAlert className="w-3 h-3" />}
                    {selectedIncident.status}
                 </div>
               </div>
             </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
             <div className="mb-8">
               <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 border-b border-brand-line/20 pb-2 mb-4">Situation Overview</h3>
               <h4 className="text-lg font-bold mb-2">{selectedIncident.type}</h4>
               <p className="font-mono text-sm leading-relaxed opacity-80 bg-brand-line/5 p-4 border-l-2 border-brand-ink">
                 {selectedIncident.description}
               </p>
             </div>

             <div className="grid grid-cols-2 gap-6 mb-8">
               <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 border-b border-brand-line/20 pb-2 mb-4">Response Assets</h3>
                  <div className="p-4 border border-brand-line/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-line/10 flex items-center justify-center border border-brand-line/20">
                        <Truck className="w-5 h-5 opacity-60" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase">{selectedIncident.team}</p>
                        <p className="text-[10px] font-mono opacity-50">ETA: {selectedIncident.status === 'On-site' ? 'Arrived' : '14 mins'}</p>
                      </div>
                    </div>
                    <button className="text-[10px] font-bold uppercase underline opacity-60 hover:opacity-100">Hail</button>
                  </div>
               </div>
               
               <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 border-b border-brand-line/20 pb-2 mb-4">Command Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <CheckCircle className="w-4 h-4 text-brand-ink shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-mono opacity-50">{selectedIncident.time}</p>
                        <p className="text-xs font-bold uppercase">Automated Detection</p>
                      </div>
                    </div>
                    {(selectedIncident.status === 'Dispatching' || selectedIncident.status === 'On-site' || selectedIncident.status === 'Contained') && (
                      <div className="flex gap-3 items-start">
                        <CheckCircle className="w-4 h-4 text-brand-ink shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-mono opacity-50">T+2 mins</p>
                          <p className="text-xs font-bold uppercase">Incident Escalation & Dispatch</p>
                        </div>
                      </div>
                    )}
                    {selectedIncident.status === 'On-site' && (
                      <div className="flex gap-3 items-start">
                        <Radio className="w-4 h-4 text-brand-ink shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <p className="text-[10px] font-mono opacity-50">Active</p>
                          <p className="text-xs font-bold uppercase">Containment Operations</p>
                        </div>
                      </div>
                    )}
                  </div>
               </div>
             </div>
          </div>

          <div className="bg-brand-line/5 p-4 border-t border-brand-line/20 shrink-0 flex gap-4">
            <button className="flex-1 py-3 bg-brand-ink text-brand-bg text-xs font-bold uppercase tracking-widest border border-brand-ink hover:opacity-90 flex items-center justify-center gap-2">
               Escalate to Tier 2 <ChevronRight className="w-4 h-4" />
            </button>
            <button className="px-6 py-3 border border-brand-line/50 text-xs font-bold uppercase tracking-widest hover:bg-brand-line/10">
               Generate Flash Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
