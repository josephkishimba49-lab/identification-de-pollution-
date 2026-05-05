/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { ChemicalMarker } from '../types';
import { INDUSTRY_SIGNATURES } from '../constants';

interface SignatureChartProps {
  sampleData: ChemicalMarker[];
  comparisonIndustries?: string[]; // Supports multiple overlays
  type?: 'radar' | 'bar';
  onMarkerClick?: (symbol: string) => void;
  thresholds?: { [symbol: string]: number };
}

const COMPARISON_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export const SignatureChart: React.FC<SignatureChartProps> = ({ 
  sampleData, 
  comparisonIndustries = [],
  type = 'radar',
  onMarkerClick,
  thresholds = {}
}) => {
  const selectedSignatures = INDUSTRY_SIGNATURES.filter(s => comparisonIndustries.includes(s.industry));
  
  // Combine data for radar chart
  const radarData = sampleData.map(m => {
    const symbol = m.symbol;
    const dataPoint: any = {
      subject: symbol,
      sample: Math.min(100, (m.concentration / 10) * 100), // Normalized roughly for radar
      fullMark: 100,
    };

    // Add baseline data for each selected industry
    selectedSignatures.forEach(sig => {
      dataPoint[sig.industry] = sig.markers[symbol] || 0;
    });
    
    return dataPoint;
  });

  const CustomBarTick = (props: any) => {
    const { x, y, payload } = props;
    const marker = sampleData.find(m => m.symbol === payload.value);
    const threshold = thresholds[payload.value] || 80;
    const exceeded = marker && marker.concentration > threshold;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={12}
          textAnchor="middle"
          fill={exceeded ? "#ef4444" : "#141414"}
          fontWeight={exceeded ? "bold" : "normal"}
          fontSize={10}
          style={{ cursor: 'pointer' }}
          onClick={() => onMarkerClick?.(payload.value)}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  const CustomPolarTick = (props: any) => {
    const { payload, x, y, textAnchor } = props;
    const marker = sampleData.find(m => m.symbol === payload.value);
    const threshold = thresholds[payload.value] || 80;
    const exceeded = marker && marker.concentration > threshold;
    return (
      <g>
        <text 
          x={x} 
          y={y} 
          textAnchor={textAnchor}
          fill={exceeded ? "#ef4444" : "#141414"}
          fontSize={12}
          fontWeight={exceeded ? "bold" : 600}
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
             e.stopPropagation();
             onMarkerClick?.(payload.value);
          }}
        >
          <tspan x={x} dy="0em">{payload.value}</tspan>
        </text>
      </g>
    );
  };

  if (type === 'bar') {
    return (
      <div className="w-full flex flex-col">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sampleData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="symbol" tick={<CustomBarTick />} />
              <YAxis tick={{ fill: '#141414', fontSize: 10 }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const marker = payload[0].payload as ChemicalMarker;
                    const threshold = thresholds[marker.symbol] || 80;
                    return (
                      <div className="bg-brand-bg p-3 text-brand-ink text-xs border border-brand-line shadow-xl">
                        <p className="font-bold border-b border-brand-line mb-1">{marker.name} ({marker.symbol})</p>
                        <p>Concentration: {marker.concentration} {marker.unit}</p>
                        <p>Threshold: {threshold} {marker.unit}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="concentration" fill="#141414" onClick={(data) => onMarkerClick && onMarkerClick(data.symbol)} style={{ cursor: 'pointer' }}>
                {sampleData.map((entry, index) => {
                  const threshold = thresholds[entry.symbol] || 80;
                  const exceeded = entry.concentration > threshold;
                  return (
                    <Cell key={`cell-${index}`} fill={exceeded ? '#ef4444' : '#141414'} cursor="pointer" />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 px-4 text-xs font-mono opacity-80">
          {sampleData.map(marker => (
            <div 
              key={`legend-${marker.symbol}`} 
              className="flex items-center gap-2 cursor-pointer hover:text-brand-ink/90 hover:underline"
              onClick={() => onMarkerClick?.(marker.symbol)}
            >
              <span className="font-bold">{marker.symbol}:</span>
              <span className="truncate" title={marker.name}>{marker.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <PolarGrid stroke="#141414" opacity={0.2} />
            <PolarAngleAxis dataKey="subject" tick={<CustomPolarTick />} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Current Sample"
              dataKey="sample"
              stroke="#141414"
              fill="#141414"
              fillOpacity={0.4}
              activeDot={{
                onClick: (e: any, payload: any) => {
                   if (onMarkerClick && payload && payload.payload) {
                     onMarkerClick(payload.payload.subject);
                   }
                },
                cursor: 'pointer'
              }}
            />
            {selectedSignatures.map((sig, index) => (
              <Radar
                key={sig.industry}
                name={`${sig.industry} Signature`}
                dataKey={sig.industry}
                stroke={COMPARISON_COLORS[index % COMPARISON_COLORS.length]}
                fill={COMPARISON_COLORS[index % COMPARISON_COLORS.length]}
                fillOpacity={0.2}
              />
            ))}
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const marker = sampleData.find(m => m.symbol === data.subject);
                    if (!marker) return null;
                    const threshold = thresholds[marker.symbol] || 80;
                    return (
                      <div className="bg-brand-bg p-3 text-brand-ink text-xs border border-brand-line shadow-xl">
                        <p className="font-bold border-b border-brand-line mb-1">{marker.name} ({marker.symbol})</p>
                        <p>Concentration: {marker.concentration} {marker.unit}</p>
                        <p>Threshold: {threshold} {marker.unit}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 px-4 text-[10px] font-mono opacity-70">
        {sampleData.map(marker => (
          <div 
            key={`legend-${marker.symbol}`} 
            className="flex items-center gap-1.5 overflow-hidden cursor-pointer hover:text-brand-ink/90 hover:underline"
            onClick={() => onMarkerClick?.(marker.symbol)}
          >
            <span className="font-bold w-10 shrink-0">{marker.symbol}</span>
            <span className="truncate" title={marker.name}>{marker.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
