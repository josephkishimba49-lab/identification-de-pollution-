import React, { useState, useEffect, useMemo } from 'react';
import { BrainCircuit, Globe, Wind, Droplets, Mountain, Activity, Thermometer, Radio, Volume2, Sun, Loader2, AlertTriangle, TrendingUp, MapPin, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

type PollutionType = 'air' | 'water' | 'soil' | 'thermal' | 'acoustic' | 'radiation';

const POLLUTION_DOMAINS: Record<PollutionType, { name: string, icon: any, description: string, baseRisk: number, markers: string[] }> = {
  air: { name: 'Atmospheric', icon: Wind, description: 'PM2.5, VOCs, NOx, SOx mass forecasting.', baseRisk: 65, markers: ['PM2.5', 'O3', 'NO2'] },
  water: { name: 'Hydrological', icon: Droplets, description: 'Groundwater leaching, heavy metals, biological oxygen demand.', baseRisk: 42, markers: ['Pb', 'COD', 'pH'] },
  soil: { name: 'Terrestrial', icon: Mountain, description: 'PFAS, PCB, heavy metal accumulation in loam.', baseRisk: 81, markers: ['Cd', 'Zn', 'Cr'] },
  thermal: { name: 'Thermal', icon: Thermometer, description: 'Industrial outflow heating, urban heat islands.', baseRisk: 30, markers: ['ΔT', 'IR-Signature'] },
  acoustic: { name: 'Acoustic', icon: Volume2, description: 'Industrial vibration and ambient decibel escalation.', baseRisk: 25, markers: ['dB(A)', 'Hz-Shift'] },
  radiation: { name: 'Radiation (EM/Nuclear)', icon: Radio, description: 'Ionizing baseline and RF spectrum saturation.', baseRisk: 15, markers: ['mSv', 'GHz-Interference'] },
};

export const PredictiveModelingModule: React.FC = () => {
  const [activeDomain, setActiveDomain] = useState<PollutionType>('water');
  const [timeScale, setTimeScale] = useState<'1M' | '6M' | '1Y' | '5Y'>('1Y');
  const [isComputing, setIsComputing] = useState(false);
  const [timelineData, setTimelineData] = useState<any[]>([]);

  const generateNodes = (base: number) => {
    return Array.from({ length: 5 }).map((_, i) => ({
      id: `Node-${Math.floor(Math.random() * 1000)}`,
      risk: Math.min(100, Math.max(0, base + (Math.random() * 40 - 20))),
      lat: (Math.random() * 180 - 90).toFixed(4),
      lng: (Math.random() * 360 - 180).toFixed(4)
    })).sort((a, b) => b.risk - a.risk);
  };

  const [hotspots, setHotspots] = useState(generateNodes(POLLUTION_DOMAINS[activeDomain].baseRisk));

  useEffect(() => {
    runSimulation();
  }, [activeDomain, timeScale]);

  const runSimulation = () => {
    setIsComputing(true);
    setTimelineData([]);
    
    // Simulate AI computing time
    setTimeout(() => {
      const data = [];
      const steps = timeScale === '1M' ? 30 : timeScale === '6M' ? 24 : timeScale === '1Y' ? 52 : 60;
      const stepLabel = timeScale === '1M' ? 'Day ' : timeScale === '6M' ? 'Week ' : timeScale === '1Y' ? 'Week ' : 'Month ';
      
      let currentRisk = POLLUTION_DOMAINS[activeDomain].baseRisk;
      for (let i = 0; i <= steps; i++) {
        // Add some volatility and a general upward trend
        const volatility = (Math.random() * 10) - 4; // slight upward bias
        currentRisk = Math.max(5, Math.min(100, currentRisk + volatility));
        
        data.push({
          time: `${stepLabel}${i}`,
          riskIndex: parseFloat(currentRisk.toFixed(1)),
          criticalThreshold: 85
        });
      }
      setTimelineData(data);
      setHotspots(generateNodes(currentRisk));
      setIsComputing(false);
    }, 1500);
  };

  const domain = POLLUTION_DOMAINS[activeDomain];
  const DomainIcon = domain.icon;

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-end mb-6 border-b border-brand-line/20 pb-4 shrink-0">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-1">
            <BrainCircuit className="w-5 h-5" />
            Omni-Modal Predictive Engine
          </h2>
          <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Global Forecasting & Anomaly Projection</p>
        </div>
        
        <div className="flex gap-2">
          {['1M', '6M', '1Y', '5Y'].map(ts => (
            <button 
              key={ts}
              onClick={() => setTimeScale(ts as any)}
              className={`px-3 py-1 text-[10px] font-mono uppercase font-bold tracking-wider border ${timeScale === ts ? 'bg-brand-ink text-brand-bg border-brand-ink' : 'border-brand-line/50 hover:border-brand-ink text-brand-ink'}`}
            >
              {ts}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Sidebar - Domains */}
        <div className="w-64 flex flex-col gap-3 shrink-0 overflow-y-auto pr-2 pb-8">
          {(Object.entries(POLLUTION_DOMAINS) as [PollutionType, any][]).map(([key, info]) => {
            const Icon = info.icon;
            const isActive = activeDomain === key;
            return (
              <button
                key={key}
                onClick={() => setActiveDomain(key)}
                className={`p-4 border text-left transition-all ${isActive ? 'border-brand-ink bg-brand-ink text-brand-bg shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]' : 'border-brand-line/30 hover:border-brand-line/80 bg-brand-bg text-brand-ink'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-bg' : 'text-brand-ink'}`} />
                  <h3 className="font-bold text-xs uppercase tracking-widest">{info.name}</h3>
                </div>
                <p className={`text-[9px] font-mono leading-relaxed opacity-70`}>{info.description}</p>
              </button>
            )
          })}
        </div>

        {/* Main Dashboard */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pb-8 pr-2">
          {/* Status Banner */}
          <div className="border border-brand-line bg-brand-bg p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-line/10 border border-brand-line/20">
                <DomainIcon className="w-8 h-8 text-brand-ink" />
              </div>
              <div>
                <h3 className="text-xl font-display font-black uppercase">{domain.name} Propagation Model</h3>
                <p className="text-[10px] font-mono opacity-60 flex items-center gap-2 mt-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Primary Markers: {domain.markers.join(', ')}
                </p>
              </div>
            </div>
            <button 
              onClick={runSimulation}
              disabled={isComputing}
              className="px-6 py-3 border border-brand-ink bg-brand-ink text-brand-bg text-xs font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isComputing ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
              {isComputing ? 'Simulating...' : 'Re-Run Model'}
            </button>
          </div>

          {/* Chart Area */}
          <div className="border border-brand-line bg-brand-bg p-6 h-80 flex flex-col">
             <div className="flex justify-between items-end mb-4">
               <h3 className="text-xs font-bold uppercase tracking-widest">Risk Escalation Index (REI)</h3>
               {timelineData.length > 0 && !isComputing && (
                 <div className="text-right">
                   <p className="text-[10px] font-mono opacity-50 uppercase">Peak Projection</p>
                   <p className="text-lg font-mono font-bold text-brand-ink tracking-tighter">
                     {Math.max(...timelineData.map(d => d.riskIndex)).toFixed(1)} / 100
                   </p>
                 </div>
               )}
             </div>
             
             <div className="flex-1 relative">
               {isComputing ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-bg/80 z-10 backdrop-blur-sm">
                   <Globe className="w-12 h-12 animate-spin-slow opacity-20 mb-4" />
                   <p className="text-xs font-mono uppercase tracking-widest animate-pulse">Computing Markov Chain Monte Carlo...</p>
                 </div>
               ) : (
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#141414" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#141414" opacity={0.1} />
                      <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#141414', opacity: 0.5 }} axisLine={false} tickLine={false} minTickGap={30} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#141414', opacity: 0.5 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #141414', borderRadius: 0, padding: '12px' }}
                        itemStyle={{ color: '#141414', fontSize: '12px', fontWeight: 'bold' }}
                        labelStyle={{ color: '#666', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase' }}
                      />
                      <ReferenceLine y={85} stroke="red" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: 'CRITICAL THRESHOLD', fill: 'red', fontSize: 9 }} opacity={0.5} />
                      <Area type="monotone" dataKey="riskIndex" stroke="#141414" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" activeDot={{ r: 6, fill: '#141414' }} />
                    </AreaChart>
                 </ResponsiveContainer>
               )}
             </div>
          </div>

          {/* Hotspots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {hotspots.map((node, i) => (
                <div key={node.id} className="border border-brand-line/30 p-4 bg-brand-line/5 hover:border-brand-line/80 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <MapPin className="w-4 h-4 text-brand-ink/50" />
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${node.risk > 85 ? 'bg-red-500/10 text-red-600 border-red-500/20' : node.risk > 60 ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : 'bg-brand-line/10 text-brand-ink/50 border-brand-line/20'}`}>
                      {node.risk > 85 ? 'Severe' : node.risk > 60 ? 'Elevated' : 'Stable'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-mono text-sm font-bold">{node.id}</h4>
                    <p className="text-[9px] font-mono opacity-50 uppercase mt-1">LAT: {node.lat} | LNG: {node.lng}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-brand-line/10 flex justify-between items-end">
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Risk Extrapol.</span>
                    <span className="font-mono text-xl font-bold tracking-tighter">{node.risk.toFixed(1)}%</span>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
