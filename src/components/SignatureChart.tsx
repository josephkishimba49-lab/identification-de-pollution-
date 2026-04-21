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
  comparisonIndustry?: string;
  type?: 'radar' | 'bar';
}

export const SignatureChart: React.FC<SignatureChartProps> = ({ 
  sampleData, 
  comparisonIndustry,
  type = 'radar'
}) => {
  const comparison = INDUSTRY_SIGNATURES.find(s => s.industry === comparisonIndustry);
  
  // Combine data for radar chart
  const radarData = sampleData.map(m => {
    const symbol = m.symbol;
    const baseline = comparison?.markers[symbol] || 0;
    
    // Normalize values roughly for radar scaling
    const normalizedSample = Math.min(100, (m.concentration / 10) * 100); 
    
    return {
      subject: symbol,
      sample: normalizedSample,
      baseline: baseline,
      fullMark: 100,
    };
  });

  if (type === 'bar') {
    return (
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sampleData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="symbol" tick={{ fill: '#141414', fontSize: 10 }} />
            <YAxis tick={{ fill: '#141414', fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#141414', border: 'none', color: '#E4E3E0' }} 
              itemStyle={{ color: '#E4E3E0' }}
            />
            <Bar dataKey="concentration" fill="#141414">
              {sampleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.concentration > 50 ? '#ef4444' : '#141414'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid stroke="#141414" opacity={0.2} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#141414', fontSize: 12, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Current Sample"
            dataKey="sample"
            stroke="#141414"
            fill="#141414"
            fillOpacity={0.6}
          />
          {comparison && (
            <Radar
              name={`${comparison.industry} Signature`}
              dataKey="baseline"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.3}
            />
          )}
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid #141414', backgroundColor: '#E4E3E0' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
