import React, { useState, useEffect } from 'react';
import { Satellite, Map as MapIcon, Loader2, Scan, AlertTriangle, Layers, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default leaflet marker icon
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PollutionHotspot {
  id: string;
  lat: number;
  lng: number;
  type: string;
  radius: number;
  intensity: number; // 0-1
  color: string;
  description: string;
}

const INITIAL_HOTSPOTS: PollutionHotspot[] = [
  { id: 'h1', lat: 48.8566, lng: 2.3522, type: 'NO2 Plume', radius: 4000, intensity: 0.8, color: '#ef4444', description: 'High nitrogen dioxide concentration detected over urban center.' },
  { id: 'h2', lat: 48.9, lng: 2.4, type: 'Methane Leak', radius: 1500, intensity: 0.6, color: '#eab308', description: 'Suspected industrial methane emission.' },
  { id: 'h3', lat: 48.82, lng: 2.3, type: 'Particulate Matter', radius: 3000, intensity: 0.7, color: '#f97316', description: 'PM2.5 accumulation due to atmospheric inversion.' },
];

export const SatFinderModule: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'visual' | 'infrared' | 'methane'>('visual');
  const [hotspots, setHotspots] = useState<PollutionHotspot[]>(() => {
    const saved = localStorage.getItem('satfinder_hotspots');
    return saved ? JSON.parse(saved) : INITIAL_HOTSPOTS;
  });
  const [selectedHotspot, setSelectedHotspot] = useState<PollutionHotspot | null>(null);

  useEffect(() => {
    localStorage.setItem('satfinder_hotspots', JSON.stringify(hotspots));
  }, [hotspots]);

  const handleScan = () => {
    setIsScanning(true);
    setSelectedHotspot(null);
    
    // Simulate finding new points
    setTimeout(() => {
      const newHotspots = [...INITIAL_HOTSPOTS];
      if (activeLayer === 'methane') {
         newHotspots.push({
           id: 'h4', lat: 48.75, lng: 2.25, type: 'Methane Leak (New)', radius: 1200, intensity: 0.9, color: '#eab308', description: 'Critical methane signature detected from satellite spectrometry.'
         });
      }
      setHotspots(newHotspots);
      setIsScanning(false);
    }, 3000);
  };

  const clearScan = () => {
    setHotspots(INITIAL_HOTSPOTS);
    setSelectedHotspot(null);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
        {/* Left Column: Map/Controls */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <div className="bg-brand-bg border border-brand-line p-4 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex justify-between items-center">
             <div className="flex items-center gap-2">
               <Satellite className="w-5 h-5" />
               <h2 className="text-sm font-bold uppercase tracking-widest">SatFinder Telemetry</h2>
             </div>
             
             <div className="flex gap-2">
                <button
                  onClick={() => setActiveLayer('visual')}
                  className={`px-3 py-1 text-xs font-mono uppercase border ${activeLayer === 'visual' ? 'bg-brand-ink text-brand-bg border-brand-ink' : 'border-brand-line'}`}
                >
                  True Color
                </button>
                <button
                  onClick={() => setActiveLayer('infrared')}
                  className={`px-3 py-1 text-xs font-mono uppercase border ${activeLayer === 'infrared' ? 'bg-brand-ink text-brand-bg border-brand-ink' : 'border-brand-line'}`}
                >
                  Thermal
                </button>
                <button
                  onClick={() => setActiveLayer('methane')}
                  className={`px-3 py-1 text-xs font-mono uppercase border ${activeLayer === 'methane' ? 'bg-brand-ink text-brand-bg border-brand-ink' : 'border-brand-line'}`}
                >
                  CH4/NO2 Spec
                </button>
             </div>
          </div>

          <div className="flex-1 bg-black border border-brand-line relative shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] min-h-[400px]">
             {isScanning && (
                <div className="absolute inset-0 z-[1000] bg-brand-ink/20 flex flex-col items-center justify-center pointer-events-none mix-blend-overlay">
                  <div className="w-full h-2 bg-brand-ink opacity-70 absolute top-0 animate-[scanner_2s_ease-in-out_infinite] shadow-[0_0_20px_theme(colors.brand.ink)]"></div>
                  <Scan className="w-16 h-16 text-brand-bg animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,1)] mb-4" />
                  <div className="bg-brand-ink text-brand-bg px-4 py-2 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Acquiring Satellite Data...
                  </div>
                </div>
             )}
             
             <MapContainer 
              center={[48.8566, 2.3522]} 
              zoom={11} 
              className="w-full h-full"
              zoomControl={false}
             >
                {activeLayer === 'visual' && (
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri"
                  />
                )}
                {activeLayer === 'infrared' && (
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution="&copy; OpenStreetMap &copy; CARTO"
                  />
                )}
                {activeLayer === 'methane' && (
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                    attribution="&copy; OpenStreetMap"
                  />
                )}

                {hotspots.map(h => (
                   <Circle
                     key={h.id}
                     center={[h.lat, h.lng]}
                     radius={h.radius}
                     pathOptions={{ color: h.color, fillColor: h.color, fillOpacity: h.intensity * 0.5, weight: 2 }}
                     eventHandlers={{
                       click: () => setSelectedHotspot(h)
                     }}
                   >
                     <Popup>
                       <div className="font-mono text-xs p-1">
                         <strong className="block uppercase border-b border-brand-line/20 pb-1 mb-1">{h.type}</strong>
                         <p>Intensity: {(h.intensity * 100).toFixed(0)}%</p>
                       </div>
                     </Popup>
                   </Circle>
                ))}
             </MapContainer>
          </div>

          <div className="flex gap-4">
             <button
                onClick={handleScan}
                disabled={isScanning}
                className="flex-1 border border-brand-ink bg-brand-ink text-brand-bg py-3 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
              >
                {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                {isScanning ? 'Scanning Orbit...' : 'Initiate Scan'}
              </button>
              <button
                onClick={clearScan}
                className="px-6 border border-brand-line py-3 text-xs font-bold uppercase tracking-wider hover:bg-brand-line/5 transition-all text-brand-ink shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
              >
                Reset
              </button>
          </div>
        </div>

        {/* Right Column: Analysis */}
        <div className="w-full lg:w-1/3">
           <div className="bg-brand-bg border border-brand-line p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] h-full">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-brand-line/20 pb-2 flex items-center gap-2">
                <Crosshair className="w-5 h-5" />
                Target Analysis
              </h2>

              {!selectedHotspot ? (
                <div className="h-64 flex flex-col items-center justify-center text-center opacity-30">
                  <MapIcon className="w-12 h-12 mb-4" />
                  <p className="font-mono text-xs uppercase max-w-[200px]">Select a hotspot on the map to view detailed spectral analysis.</p>
                </div>
              ) : (
                 <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-2 mb-4">
                       <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedHotspot.color }}></span>
                       <h3 className="text-lg font-display font-black leading-none uppercase">{selectedHotspot.type}</h3>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="border border-brand-line/30 p-3 bg-brand-line/5">
                        <p className="text-[10px] font-mono opacity-50 uppercase mb-1">Estimated Radius</p>
                        <p className="font-mono text-sm">{(selectedHotspot.radius / 1000).toFixed(1)} km</p>
                      </div>
                      <div className="border border-brand-line/30 p-3 bg-brand-line/5">
                        <p className="text-[10px] font-mono opacity-50 uppercase mb-1">Peak Concentration / Intensity</p>
                        <p className="font-mono text-sm text-red-600 font-bold">{(selectedHotspot.intensity * 100).toFixed(1)}% / Critical</p>
                      </div>
                      <div className="border border-brand-line/30 p-3 bg-brand-line/5">
                        <p className="text-[10px] font-mono opacity-50 uppercase mb-1">Coordinates</p>
                        <p className="font-mono text-sm">{selectedHotspot.lat.toFixed(4)}N, {selectedHotspot.lng.toFixed(4)}E</p>
                      </div>
                    </div>

                    <div className="mb-8 p-4 border border-brand-ink bg-brand-ink/10 flex items-start gap-4">
                      <AlertTriangle className="w-5 h-5 text-brand-ink shrink-0" />
                      <p className="text-xs font-mono text-brand-ink leading-relaxed">
                        {selectedHotspot.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 border-b border-brand-line/20 pb-1">Recommended Response</h4>
                      <ul className="text-xs font-mono space-y-2 opacity-80 list-disc pl-4">
                        <li>Deploy local drone sensors for ground-truth verification.</li>
                        <li>Correlate with wind patterns (SW 12kts).</li>
                        <li>Notify environmental protection agency within sector.</li>
                      </ul>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>
      <style>{`
        @keyframes scanner {
          0% { transform: translateY(0); }
          50% { transform: translateY(400px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
