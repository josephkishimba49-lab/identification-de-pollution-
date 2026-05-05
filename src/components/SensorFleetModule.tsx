import React, { useState, useEffect } from 'react';
import { Network, Activity, RefreshCcw, Wifi, WifiOff, Battery, BatteryCharging, AlertTriangle, Cpu, MapPin } from 'lucide-react';

interface SensorNode {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'degraded';
  battery: number;
  lastPing: string;
  calibrationDrift: number; // 0 to 1
}

const INITIAL_NODES: SensorNode[] = [
  { id: 'SN-01A', name: 'Alpha Flow Monitor', location: 'Estuary Main', status: 'online', battery: 84, lastPing: '2s ago', calibrationDrift: 0.02 },
  { id: 'SN-02B', name: 'Beta Deep Scanner', location: 'Industrial Outflow 3', status: 'degraded', battery: 12, lastPing: '4m ago', calibrationDrift: 0.18 },
  { id: 'SN-03C', name: 'Gamma Trace Detector', location: 'Upstream Control', status: 'offline', battery: 0, lastPing: '2d ago', calibrationDrift: 0.05 },
  { id: 'SN-04D', name: 'Delta Surface Array', location: 'Urban Runoff', status: 'online', battery: 98, lastPing: '1s ago', calibrationDrift: 0.01 },
];

export const SensorFleetModule: React.FC = () => {
  const [nodes, setNodes] = useState<SensorNode[]>(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState<SensorNode | null>(null);

  return (
    <div className="p-6 h-full flex gap-6 overflow-hidden">
      {/* List */}
      <div className="w-1/3 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-brand-line/20 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Network className="w-5 h-5" />
            Sensor Fleet Status
          </h2>
          <div className="px-2 py-1 bg-brand-line/10 text-[9px] font-mono uppercase">
            {nodes.filter(n => n.status === 'online').length}/{nodes.length} Online
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {nodes.map(node => (
            <div 
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={`p-4 border cursor-pointer transition-colors ${selectedNode?.id === node.id ? 'border-brand-ink bg-brand-ink/5' : 'border-brand-line/30 hover:border-brand-line'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">{node.name}</h3>
                  <p className="text-[10px] font-mono opacity-50 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {node.location}
                  </p>
                </div>
                {node.status === 'online' ? <Wifi className="w-4 h-4 text-green-500" /> : 
                 node.status === 'degraded' ? <Activity className="w-4 h-4 text-yellow-500" /> : 
                 <WifiOff className="w-4 h-4 text-red-500" />}
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  {node.battery < 20 ? <Battery className="w-3 h-3 text-red-500" /> : <BatteryCharging className="w-3 h-3 text-brand-ink" />}
                  <span className={node.battery < 20 ? 'text-red-500' : ''}>{node.battery}%</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  <RefreshCcw className="w-3 h-3 opacity-50" />
                  <span className="opacity-70">{node.lastPing}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 border border-brand-line bg-brand-bg shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] p-6 flex flex-col">
        {!selectedNode ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
            <Cpu className="w-16 h-16 mb-4" />
            <p className="font-mono text-xs uppercase tracking-widest max-w-[200px]">Select a sensor node to view telemetry & diagnostics.</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
            <div className="flex justify-between items-start border-b border-brand-line/20 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-display font-black uppercase tracking-tight">{selectedNode.name}</h2>
                  <span className={`px-2 py-0.5 text-[10px] font-mono uppercase border ${selectedNode.status === 'online' ? 'bg-green-500/10 text-green-700 border-green-500/30' : selectedNode.status === 'degraded' ? 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30' : 'bg-red-500/10 text-red-700 border-red-500/30'}`}>
                    {selectedNode.status}
                  </span>
                </div>
                <p className="font-mono text-xs opacity-50">ID: {selectedNode.id} | LOC: {selectedNode.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
               <div className="p-4 border border-brand-line/30 bg-brand-line/5 flex flex-col gap-2">
                 <p className="text-[10px] font-mono uppercase opacity-50">Power Array</p>
                 <div className="flex items-end gap-2">
                   <h3 className="text-2xl font-bold font-mono">{selectedNode.battery}%</h3>
                   <p className="text-xs font-mono opacity-50 pb-1">Remaining</p>
                 </div>
                 <div className="w-full h-1 bg-brand-line/20 mt-2">
                   <div className={`h-full ${selectedNode.battery < 20 ? 'bg-red-500' : 'bg-brand-ink'}`} style={{ width: `${selectedNode.battery}%` }}></div>
                 </div>
               </div>

               <div className="p-4 border border-brand-line/30 bg-brand-line/5 flex flex-col gap-2">
                 <p className="text-[10px] font-mono uppercase opacity-50">Calibration Drift</p>
                 <div className="flex items-end gap-2">
                   <h3 className={`text-2xl font-bold font-mono ${selectedNode.calibrationDrift > 0.1 ? 'text-red-500' : ''}`}>{(selectedNode.calibrationDrift * 100).toFixed(1)}%</h3>
                   <p className="text-xs font-mono opacity-50 pb-1">Margin of Error</p>
                 </div>
                 <div className="w-full h-1 bg-brand-line/20 mt-2 relative">
                    <div className="absolute top-0 bottom-0 left-[10%] w-0.5 bg-brand-ink/50 z-10"></div>
                   <div className={`h-full ${selectedNode.calibrationDrift > 0.1 ? 'bg-red-500' : 'bg-brand-ink'}`} style={{ width: `${selectedNode.calibrationDrift * 100}%` }}></div>
                 </div>
               </div>
            </div>

            {selectedNode.calibrationDrift > 0.1 && (
              <div className="mb-6 border border-yellow-500/30 bg-yellow-500/5 p-4 flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-yellow-700 mb-1">Calibration Warning</h4>
                  <p className="text-[10px] font-mono text-yellow-700/70">Sensor membrane degradation detected. Chemical signatures may have a higher false-positive rate. Physical maintenance required within 48 hours.</p>
                </div>
              </div>
            )}

            <div className="mt-auto pt-6 flex gap-4">
              <button 
                disabled={selectedNode.status === 'offline'}
                className="flex-1 border border-brand-ink py-3 text-xs font-bold uppercase tracking-wider bg-brand-ink text-brand-bg hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" /> Remote Recalibrate
              </button>
              <button className="px-6 border border-brand-line py-3 text-xs font-bold uppercase tracking-wider hover:bg-brand-line/5 text-brand-ink shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
                Dispatch Tech
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
