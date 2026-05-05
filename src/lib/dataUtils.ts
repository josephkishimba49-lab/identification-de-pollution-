/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TrendData {
  timestamp: string;
  Cr: number;
  Pb: number;
  Cl: number;
  Zn: number;
  Cd: number;
  COD: number;
  BOD: number;
  Salinity: number;
  Conductivity: number;
  Turbidity: number;
  pH: number;
  TDS: number;
  Alkalinity: number;
}

export const generateHistoricalData = (days: number): TrendData[] => {
  const data: TrendData[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const timestamp = d.toISOString().split('T')[0];
    
    data.push({
      timestamp,
      Cr: Math.floor(40 + Math.random() * 8),
      Pb: Math.floor(20 + Math.random() * 5),
      Cl: Math.floor(60 + Math.random() * 10),
      Zn: Math.floor(35 + Math.random() * 10),
      Cd: Math.floor(2 + Math.random() * 2),
      COD: Math.floor(80 + Math.random() * 20),
      BOD: Math.floor(15 + Math.random() * 10),
      Salinity: Math.floor(30 + Math.random() * 5),
      Conductivity: Math.floor(800 + Math.random() * 200),
      Turbidity: Math.floor(2 + Math.random() * 3),
      pH: parseFloat((7 + Math.random() * 1).toFixed(1)),
      TDS: Math.floor(300 + Math.random() * 200),
      Alkalinity: Math.floor(150 + Math.random() * 50),
    });
  }
  return data;
};
