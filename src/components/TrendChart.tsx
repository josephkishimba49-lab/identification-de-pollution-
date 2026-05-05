/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { generateHistoricalData, TrendData } from '../lib/dataUtils';
import { generateForecast } from '../services/forecastingService';
import { Loader2, Filter } from 'lucide-react';
import { ChemicalMarker } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface TrendChartProps {
  focusedMarker?: string;
  threshold?: number;
  markerData?: ChemicalMarker[];
  dateRange?: 7 | 30 | 90;
  thresholds?: Record<string, number>;
}

export const TrendChart: React.FC<TrendChartProps> = ({ focusedMarker, threshold, markerData, dateRange, thresholds }) => {
  const [range, setRange] = useState<7 | 30 | 90>(dateRange || 30);
  const [isForecasting, setIsForecasting] = useState(false);
  const [forecastProj, setForecastProj] = useState<number[] | null>(null);
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
  
  useEffect(() => {
    if (dateRange) setRange(dateRange);
  }, [dateRange]);

  const data = useMemo(() => generateHistoricalData(range), [range]);
  
  const chartData = useMemo(() => {
    let baseData = [...data];
    
    // Append current measurements to historical data
    if (markerData && markerData.length > 0) {
      const todayDate = new Date();
      // Ensure the "today" matches the last date plus one, or just today's literal date
      const todayRecord: any = { timestamp: 'Current' };
      markerData.forEach(m => {
        todayRecord[m.symbol] = m.concentration;
      });
      baseData.push(todayRecord);
    }

    if (forecastProj && focusedMarker) {
      const lastItemIndex = baseData.length - 1;
      const lastItem = { ...baseData[lastItemIndex] } as any;
      lastItem[`${focusedMarker}_forecast`] = lastItem[focusedMarker as keyof TrendData] || lastItem[focusedMarker];
      baseData[lastItemIndex] = lastItem;

      const lastDate = new Date();
      const forecastItems = forecastProj.map((val, idx) => {
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + idx + 1);
        return {
          timestamp: `+${idx + 1}d`,
          [`${focusedMarker}_forecast`]: val,
        };
      }) as any[];
      baseData = [...baseData, ...forecastItems];
    }
    return baseData;
  }, [data, forecastProj, focusedMarker, markerData]);

  const handleForecast = async () => {
    if (!focusedMarker) return;
    setIsForecasting(true);
    const historicalSeries = data.map(d => d[focusedMarker as keyof TrendData] as number);
    const result = await generateForecast(focusedMarker, historicalSeries);
    setForecastProj(result.projection);
    setIsForecasting(false);
  };
  
  const allAvailableKeys = ['Cr', 'Pb', 'Cl', 'Zn', 'Cd', 'COD', 'BOD', 'Salinity', 'Conductivity', 'Turbidity', 'pH', 'TDS', 'Alkalinity'];
  
  const markerKeys = useMemo(() => {
    if (focusedMarker) return [focusedMarker];
    if (selectedMarkers.length > 0) return selectedMarkers;
    return allAvailableKeys;
  }, [focusedMarker, selectedMarkers]);

  const toggleMarker = (key: string) => {
    setSelectedMarkers(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const colors: Record<string, string> = {
    Cr: '#141414',
    Pb: '#ef4444',
    Cl: '#3b82f6',
    Zn: '#10b981',
    Cd: '#a855f7',
    COD: '#f59e0b',
    BOD: '#84cc16',
    Salinity: '#06b6d4',
    Conductivity: '#6366f1',
    Turbidity: '#ec4899',
    pH: '#f43f5e',
    TDS: '#eab308',
    Alkalinity: '#14b8a6',
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        {/* Only show these buttons if dateRange prop wasn't provided, meaning the parent isn't controlling it */}
        {!dateRange && (
          <div className="flex gap-2 items-center">
            <div className="flex gap-1 h-fit">
              {[7, 30, 90].map((r) => (
                <button
                  key={r}
                  onClick={() => { setRange(r as any); setForecastProj(null); }}
                  className={`px-3 py-1.5 text-[10px] font-mono border uppercase uppercase tracking-wider transition-all ${range === r ? 'bg-brand-ink text-brand-bg border-brand-ink shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]' : 'border-brand-line hover:bg-brand-line/5 text-brand-ink'}`}
                >
                  {r} days
                </button>
              ))}
            </div>
            {focusedMarker && (
              <button
                onClick={handleForecast}
                disabled={isForecasting}
                className="px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-mono border border-brand-ink bg-brand-ink/5 text-brand-ink font-bold uppercase tracking-wider hover:bg-brand-ink/10 transition-colors ml-2"
              >
                {isForecasting && <Loader2 className="w-3 h-3 animate-spin"/>}
                FORECAST (7D)
              </button>
            )}
          </div>
        )}

        {/* Marker Selection Filter */}
        {!focusedMarker && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2 text-[10px] font-mono opacity-50 uppercase tracking-widest">
              <Filter className="w-3 h-3" />
              Filter:
            </div>
            {allAvailableKeys.map(key => {
              const matchesThreshold = thresholds && markerData ? markerData.find(m => m.symbol === key && m.concentration >= (thresholds[key] || Infinity)) : false;
              
              return (
                <button
                  key={key}
                  onClick={() => toggleMarker(key)}
                  className={`px-2 py-1 text-[9px] font-mono uppercase border transition-all ${selectedMarkers.includes(key) ? 'bg-brand-ink text-brand-bg border-brand-ink' : selectedMarkers.length === 0 ? 'bg-brand-line/10 text-brand-ink border-brand-line/20' : 'bg-transparent text-brand-ink/50 border-brand-line/20 hover:border-brand-line/50'} ${matchesThreshold ? 'ring-1 ring-red-500/50' : ''}`}
                  style={selectedMarkers.includes(key) || selectedMarkers.length === 0 ? { borderBottomColor: colors[key], borderBottomWidth: '2px' } : {}}
                >
                  {key}
                </button>
              );
            })}
            {selectedMarkers.length > 0 && (
              <button 
                onClick={() => setSelectedMarkers([])}
                className="px-2 py-1 text-[9px] font-mono uppercase bg-red-500/10 text-red-700 border border-red-500/20 hover:bg-red-500/20 transition-all ml-1"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="h-80 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#141414" opacity={0.05} vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              tick={{ fill: '#141414', fontSize: 9, fontFamily: 'monospace' }}
              stroke="#141414"
              strokeOpacity={0.1}
              axisLine={false}
              tickLine={false}
              minTickGap={30}
            />
            <YAxis 
              tick={{ fill: '#141414', fontSize: 9, fontFamily: 'monospace' }}
              stroke="#141414"
              strokeOpacity={0.1}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#141414', 
                border: 'none', 
                color: '#E4E3E0',
                fontSize: '10px',
                fontFamily: 'monospace',
                borderRadius: '0px'
              }} 
              itemStyle={{ padding: '2px 0' }}
              cursor={{ stroke: '#141414', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Legend 
              verticalAlign="top" 
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '9px', fontFamily: 'monospace', textTransform: 'uppercase', paddingBottom: '20px', opacity: 0.6 }} 
            />
            {threshold && focusedMarker && (
              <ReferenceLine 
                y={threshold} 
                stroke="#ef4444" 
                strokeDasharray="3 3" 
                label={{ 
                  value: `LIMIT: ${threshold}`, 
                  position: 'insideBottomRight', 
                  fill: '#ef4444', 
                  fontSize: 8, 
                  fontFamily: 'monospace' 
                }} 
              />
            )}
            
            {/* If we have multiple selected markers, we wouldn't show a generic single threshold line easily,
                so we only show it when focusedMarker is active. */}

            {markerKeys.map((key) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={colors[key] || '#000'}
                strokeWidth={focusedMarker === key || selectedMarkers.includes(key) ? 2 : 1}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }} 
                opacity={selectedMarkers.length > 0 && !selectedMarkers.includes(key) ? 0.2 : 1}
              />
            ))}
            {focusedMarker && forecastProj && (
              <Line 
                type="monotone" 
                dataKey={`${focusedMarker}_forecast`} 
                stroke={colors[focusedMarker] || '#000'}
                strokeWidth={3}
                strokeDasharray="4 4"
                dot={{ r: 2, fill: colors[focusedMarker] }}
                activeDot={{ r: 4 }} 
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
