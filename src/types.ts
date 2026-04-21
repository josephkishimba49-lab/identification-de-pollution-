/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChemicalMarker {
  name: string;
  symbol: string;
  concentration: number; // in mg/L or similar unit
  unit: string;
}

export interface IndustrySignature {
  industry: string;
  description: string;
  markers: Record<string, number>; // proportions or average concentrations
}

export interface PollutionReport {
  id: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  sampleData: ChemicalMarker[];
  attribution: {
    sourceType: string;
    confidence: number;
    reasoning: string;
  } | null;
  status: 'pending' | 'analyzed' | 'verified';
}
