import React, { useState } from 'react';
import { MapPin, Navigation, Crosshair, Signal, RadioReceiver, ShieldCheck, AlertTriangle } from 'lucide-react';

interface TrackingAsset {
  id: string;
  name: string;
  type: 'IoT Sensor' | 'Drone' | 'Field Team' | 'Containment Unit';
  lat: number;
  lng: number;
  status: 'Active' | 'Offline' | 'In Transit' | 'Deployed';
  battery?: number;
  lastPing: string;
}

const MOCK_ASSETS: TrackingAsset[] = [
  { id: 'DRN-77A', name: 'AeroScout Drone C4', type: 'Drone', lat: 48.8566, lng: 2.3522, status: 'In Transit', battery: 84, lastPing: '2s ago' },
  { id: 'TEAM-B1', name: 'Hazmat Alpha', type: 'Field Team', lat: 48.8601, lng: 2.3411, status: 'Deployed', lastPing: '12s ago' },
  { id: 'SN-049', name: 'River Buoy Sensor 9', type: 'IoT Sensor', lat: 48.8410, lng: 2.3610, status: 'Active', battery: 92, lastPing: '45s ago' },
  { id: 'CU-9X', name: 'Mobile Containment Hub', type: 'Containment Unit', lat: 48.8500, lng: 2.3200, status: 'Active', battery: 100, lastPing: '5s ago' },
  { id: 'SN-050', name: 'Outflow Monitor 3', type: 'IoT Sensor', lat: 48.8710, lng: 2.3500, status: 'Offline', lastPing: '4hrs ago' }
];

export const GeolocationTrackingModule: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  // A very simple simulated map layout
  const mapCenter = { lat: 48.855, lng: 2.345 };
  const getRelativePosition = (lat: number, lng: number) => {
    // scale coordinates to percentages (mocking a local area map)
    // Map bounding box: lat 48.83 to 48.88, lng 2.31 to 2.38
    const latPercent = ((48.88 - lat) / (48.88 - 48.83)) * 100;
    const lngPercent = ((lng - 2.31) / (2.38 - 2.31)) * 100;
    return { top: `${latPercent}%`, left: `${lngPercent}%` };
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-end mb-6 border-b border-brand-line/20 pb-4 shrink-0">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-1">
            <Crosshair className="w-5 h-5" />
            Geolocation Tracking Command
          </h2>
          <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Real-time Asset & Signal Monitoring</p>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        
        {/* Left Panel: Map */}
        <div className="flex-[2] border border-brand-line bg-brand-bg shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex flex-col relative overflow-hidden">
          {/* Faux Map Background */}
          <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: `radial-gradient(var(--color-brand-ink) 1px, transparent 1px)`,
            backgroundSize: `40px 40px`
          }}/>
          <div className="absolute inset-0 border-[0.5px] border-brand-ink/10 grid grid-cols-4 grid-rows-4">
            {Array.from({length: 16}).map((_, i) => <div key={i} className="border-[0.5px] border-brand-ink/10" />)}
          </div>
          
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="px-3 py-1 bg-brand-line/10 border border-brand-line/20 backdrop-blur-sm text-[10px] font-mono uppercase font-bold flex items-center gap-2">
              <Signal className="w-3 h-3"/> GPS LOCKED
            </div>
            <div className="px-3 py-1 bg-green-500/10 text-green-600 border border-green-500/30 backdrop-blur-sm text-[10px] font-mono uppercase font-bold">
              NET: STABLE
            </div>
          </div>

          <div className="flex-1 relative z-10 w-full h-full">
            {MOCK_ASSETS.map(asset => {
              const pos = getRelativePosition(asset.lat, asset.lng);
              const isSelected = selectedAsset === asset.id;
              return (
                <div 
                  key={asset.id} 
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ top: pos.top, left: pos.left }}
                  onClick={() => setSelectedAsset(asset.id)}
                >
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 
                    ${asset.status === 'Offline' ? 'border-red-500 text-red-500 bg-red-500/10' : 
                      asset.type === 'Field Team' ? 'border-blue-500 text-blue-500 bg-blue-500/10' : 
                      asset.type === 'Drone' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 
                      'border-brand-ink text-brand-ink bg-brand-ink/10'}
                    ${isSelected ? 'scale-125 bg-brand-bg shadow-xl z-20' : 'hover:scale-110 z-10'} transition-all`}
                  >
                    {asset.type === 'Drone' && <Navigation className="w-4 h-4" />}
                    {asset.type === 'Field Team' && <ShieldCheck className="w-4 h-4" />}
                    {asset.type === 'IoT Sensor' && <RadioReceiver className="w-4 h-4" />}
                    {asset.type === 'Containment Unit' && <MapPin className="w-4 h-4" />}
                    
                    {isSelected && (
                      <div className="absolute -inset-2 border border-current rounded-full animate-ping opacity-20 pointer-events-none"></div>
                    )}
                  </div>
                  {isSelected && (
                     <div className="absolute top-10 bg-brand-bg border border-brand-line p-2 shadow-lg min-w-[120px] text-center z-30">
                       <p className="text-xs font-bold uppercase truncate">{asset.name}</p>
                       <p className="text-[9px] font-mono opacity-50">{asset.lastPing}</p>
                     </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Asset List */}
        <div className="flex-1 flex flex-col border border-brand-line bg-brand-bg shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] overflow-hidden">
          <div className="p-4 border-b border-brand-line/20 bg-brand-line/5 shrink-0 flex justify-between items-center">
             <h3 className="text-xs font-bold uppercase tracking-widest">Active Assets</h3>
             <span className="text-[10px] font-mono opacity-50 px-2 py-0.5 bg-brand-line/10 border border-brand-line/20">TOTAL: {MOCK_ASSETS.length}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {MOCK_ASSETS.map(asset => (
                <div 
                  key={asset.id} 
                  onClick={() => setSelectedAsset(asset.id)}
                  className={`border p-3 cursor-pointer transition-colors ${selectedAsset === asset.id ? 'border-brand-ink bg-brand-ink/5' : 'border-brand-line/30 hover:border-brand-line/60'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xs font-bold uppercase">{asset.name}</h4>
                    <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 border ${
                      asset.status === 'Offline' ? 'bg-red-500/10 text-red-600 border-red-500/30' : 
                      asset.status === 'Active' ? 'bg-green-500/10 text-green-600 border-green-500/30' : 
                      'bg-brand-line/10 text-brand-ink border-brand-line/30'
                    }`}>
                      {asset.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] font-mono opacity-70">
                     <span className="flex items-center gap-1"><Navigation className="w-3 h-3"/> {asset.type}</span>
                     <span>{asset.lat.toFixed(4)}, {asset.lng.toFixed(4)}</span>
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-brand-line/10 flex justify-between items-center text-[9px] font-mono">
                    <span className="flex items-center gap-1"><Signal className="w-3 h-3 opacity-50"/> {asset.lastPing}</span>
                    {asset.battery !== undefined && (
                      <span className={`flex items-center gap-1 ${asset.battery < 20 ? 'text-red-500 font-bold' : 'opacity-50'}`}>
                        Bat: {asset.battery}%
                      </span>
                    )}
                  </div>
                </div>
             ))}
          </div>
          
          {selectedAsset && (
            <div className="p-4 bg-brand-line/5 border-t border-brand-line/20 shrink-0">
               <button className="w-full py-2 bg-brand-ink text-brand-bg text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                 Polo Request / Ping Asset
               </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
