/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { ChemicalMarker, IndustrySignature } from '../types';

interface CorrelationChartProps {
  sampleData: ChemicalMarker[];
  industrySignatures: IndustrySignature[];
}

const COMPARISON_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export const CorrelationChart: React.FC<CorrelationChartProps> = ({ 
  sampleData, 
  industrySignatures 
}) => {
  const chartData = industrySignatures.map(sig => {
    return {
      industry: sig.industry,
      data: sampleData.map(m => {
        const industryVal = sig.markers[m.symbol] || 0;
        let status = 'within'; // within 10%
        if (m.concentration > industryVal * 1.1) status = 'above';
        else if (m.concentration < industryVal * 0.9) status = 'below';
        
        return {
          name: m.name,
          industryValue: industryVal,
          sampleValue: m.concentration,
          status
        };
      })
    };
  });

  const getPointColor = (status: string) => {
    if (status === 'above') return '#ef4444'; // Red
    if (status === 'below') return '#3b82f6'; // Blue
    return '#10b981'; // Green
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis type="number" dataKey="industryValue" name="Industry Baseline" unit="mg/L" />
          <YAxis type="number" dataKey="sampleValue" name="Sample Concentration" unit="mg/L" />
          <ZAxis type="number" range={[60, 60]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <ReferenceLine stroke="red" strokeDasharray="3 3" />
          {chartData.map((series) => (
            <Scatter
              key={series.industry}
              name={series.industry}
              data={series.data}
              shape={(props: any) => {
                const { cx, cy, payload } = props;
                return (
                  <circle cx={cx} cy={cy} r={6} fill={getPointColor(payload.status)} />
                );
              }}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
