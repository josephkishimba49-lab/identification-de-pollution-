/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface SidebarAlertSparklineProps {
  symbol?: string;
  color: string;
}

const GENERATE_SPARKLINE_DATA = (symbol: string) => {
  const data = [];
  const seed = symbol.charCodeAt(0) + symbol.charCodeAt(symbol.length - 1);
  for (let i = 0; i < 10; i++) {
    data.push({
      value: Math.floor(Math.sin((i + seed) * 0.8) * 20 + 50 + Math.random() * 10)
    });
  }
  return data;
};

export const SidebarAlertSparkline: React.FC<SidebarAlertSparklineProps> = ({ symbol, color }) => {
  const data = useMemo(() => {
    if (!symbol) return [];
    return GENERATE_SPARKLINE_DATA(symbol);
  }, [symbol]);

  if (!symbol || data.length === 0) return <div className="w-10" />;

  return (
    <div className="w-12 h-6 opacity-60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
