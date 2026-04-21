/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IndustrySignature } from './types';

export const INDUSTRY_SIGNATURES: IndustrySignature[] = [
  {
    industry: 'Tannery',
    description: 'Leather tanning processes release high levels of Chromium and Chlorides.',
    markers: {
      'Cr': 50,
      'Cl': 80,
      'COD': 60,
      'S2-': 40
    }
  },
  {
    industry: 'Metallurgy',
    description: 'Metal processing involves heavy metals like Cadmium, Lead, and Zinc.',
    markers: {
      'Cd': 70,
      'Pb': 90,
      'Zn': 85,
      'Fe': 60
    }
  },
  {
    industry: 'Chemical Manufacturing',
    description: 'Organic synthesis results in high VOCs and specific organic markers.',
    markers: {
      'VOC': 90,
      'Phenol': 75,
      'NH3': 50,
      'P': 40
    }
  },
  {
    industry: 'Textile Dyeing',
    description: 'Dyeing plants contribute color, surfactants, and Copper.',
    markers: {
      'Cu': 65,
      'Color': 90,
      'COD': 50,
      'N': 55
    }
  }
];

export const MARKER_NAMES: Record<string, string> = {
  'Cr': 'Chromium',
  'Cl': 'Chlorides',
  'COD': 'Chemical Oxygen Demand',
  'S2-': 'Sulfides',
  'Cd': 'Cadmium',
  'Pb': 'Lead',
  'Zn': 'Zinc',
  'Fe': 'Iron',
  'VOC': 'Volatile Organic Compounds',
  'Phenol': 'Phenols',
  'NH3': 'Ammonia',
  'P': 'Phosphorus',
  'Cu': 'Copper',
  'Color': 'Color Intensity',
  'N': 'Nitrogen'
};
