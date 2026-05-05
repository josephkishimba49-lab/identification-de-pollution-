/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChemicalMarker {
  name: string;
  symbol: string;
  concentration: number; // in mg/L or similar unit
  unit: string;
  category?: 'chemical' | 'water' | 'air' | 'soil' | 'waste';
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

export interface ForensicAlert {
  id: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'warning' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  type: 'signature_match' | 'threshold_breach' | 'system';
  isRead: boolean;
  aiSummary?: {
    issue: string;
    action: string;
    recommendations: string[];
    longTermImpacts: string;
  };
  metadata?: {
    symbol?: string;
    concentration?: number;
    threshold?: number;
    attributionSource?: string;
    keyFeatures?: { feature: string, importance: number }[];
  };
}

export interface ForensicSite {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'normal' | 'caution' | 'critical';
  lastReading: {
    timestamp: string;
    sensors: {
      pH: number;
      turbidity: number;
      conductivity: number;
      temperature: number;
      salinity: number;
      tds: number;
      cod: number;
      bod: number;
      alkalinity: number;
    };
    airSensors: {
      pm25: number;
      pm10: number;
      no2: number;
      so2: number;
      co: number;
      o3: number;
    };
    soilSensors: {
      moisture: number;
      nitrogen: number;
      phosphorus: number;
      potassium: number;
      organicMatter: number;
    };
    wasteSensors: {
      microplastics: number;
      heavyMetals: number;
    };
  };
}

export interface XAIExplanation {
  threatClassification: string;
  forensicProbability: number;
  predictiveInsight: string;
  preemptiveActions: string[];
  keyFeatures: { feature: string, importance: number }[];
}
