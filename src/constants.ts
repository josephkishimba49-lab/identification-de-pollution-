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
  'N': 'Nitrogen',
  'Hg': 'Mercury',
  'As': 'Arsenic',
  'NO3': 'Nitrates',
  'Salinity': 'Salinity',
  'Conductivity': 'Conductivity',
  'Turbidity': 'Turbidity',
  'pH': 'pH',
  'TDS': 'Total Dissolved Solids',
  'BOD': 'Biochemical Oxygen Demand',
  'Alkalinity': 'Total Alkalinity',
  'PM2.5': 'Fine Particulate Matter (PM2.5)',
  'PM10': 'Inhalable Particulate Matter (PM10)',
  'NO2': 'Nitrogen Dioxide',
  'SO2': 'Sulfur Dioxide',
  'CO': 'Carbon Monoxide',
  'O3': 'Ozone',
  'Moisture': 'Soil Moisture',
  'Nitrogen': 'Soil Nitrogen',
  'Phosphorus': 'Soil Phosphorus',
  'Potassium': 'Soil Potassium',
  'OrgMatter': 'Soil Organic Matter',
  'Microplastics': 'Microplastics',
  'WasteHeavyMetals': 'Waste Heavy Metals'
};

export const MARKER_THRESHOLDS: Record<string, number> = {
  'Cr': 80,
  'Cl': 250,
  'Cd': 10,
  'Pb': 50,
  'Zn': 100,
  'COD': 150,
  'BOD': 30,
  'S2-': 10,
  'NH3': 30,
  'P': 5,
  'Cu': 30,
  'Hg': 0.5,
  'As': 5,
  'NO3': 50,
  'Salinity': 35,
  'Conductivity': 1000,
  'Turbidity': 5,
  'pH': 8.5, // 6.5 - 8.5
  'TDS': 500,
  'Alkalinity': 200,
  'PM2.5': 35,
  'PM10': 150,
  'NO2': 100,
  'SO2': 125,
  'CO': 10000,
  'O3': 120,
  'Moisture': 50,
  'Nitrogen': 100,
  'Phosphorus': 50,
  'Potassium': 200,
  'OrgMatter': 10,
  'Microplastics': 1000,
  'WasteHeavyMetals': 50
};

export const MARKER_DESCRIPTIONS: Record<string, string> = {
  'Cr': 'A heavy metal primarily utilized in industrial electroplating, leather tanning, and the production of stainless steel alloys.',
  'Cl': 'Inorganic ions indicative of high saline industrial effluent, cooling tower blowdown, or residential brine leakage.',
  'Cd': 'Extremely toxic metal used for battery stabilization, plastic pigmentation, and protective electro-coatings on steel.',
  'Pb': 'Persistent environmental pollutant originating from smelting operations, legacy fuel additives, and lead-acid battery manufacturing.',
  'Zn': 'Industrial agent used in galvanizing processes, rubber additives, and the manufacturing of paints and protective cosmetics.',
  'COD': 'Indirect measurement of organic pollutant concentration, representing the chemical oxygen demand for decomposition in waterways.',
  'S2-': 'Result of anaerobic biochemical decomposition of organic sulfur compounds, commonly found in stale industrial drainage systems.',
  'Hg': 'A potent neurotoxic heavy metal emitted during coal combustion, gold mining, and waste incineration.',
  'As': 'Semimetallic element naturally occurring in soil, but highly concentrated by mining runoff, wood processing, and pesticides.',
  'NO3': 'Fertilizer byproduct leading to waterway enrichment, commonly sourced from agricultural runoff and intensive farming practices.',
  'Salinity': 'Measure of all salts dissolved in water.',
  'Conductivity': 'Measure of the ability of water to pass an electrical current.',
  'Turbidity': 'Measure of the cloudiness of water.',
  'pH': 'Measure of the acidity or alkalinity of water.',
  'TDS': 'Measure of the dissolved combined content of all inorganic and organic substances.',
  'BOD': 'Measure of the amount of oxygen that bacteria will consume while decomposing organic matter',
  'Alkalinity': 'Measure of the ability of water to neutralize acids.',
  'PM2.5': 'Fine particulate matter (<2.5 µm); can penetrate deep into lungs.',
  'PM10': 'Inhalable particulate matter (<10 µm).',
  'NO2': 'Primary pollutant from vehicle emissions and industrial processes.',
  'SO2': 'Pollutant primarily from burning fossil fuels.',
  'CO': 'Carbon monoxide from incomplete combustion.',
  'O3': 'Ground-level ozone, a major component of smog.',
  'Moisture': 'Water content in soil.',
  'Nitrogen': 'Essential nutrient, excess causes eutrophication.',
  'Phosphorus': 'Essential nutrient, excess causes eutrophication.',
  'Potassium': 'Essential plant nutrient.',
  'OrgMatter': 'Decaying plant/animal material in soil.',
  'Microplastics': 'Small plastic fragments (<5mm).',
  'WasteHeavyMetals': 'Heavy metal content in solid waste.'
};

export type MarkerSource = string | { 
  name: string, 
  typicalConcentrationRange?: string, 
  associatedIndustries?: string[] 
};

export const MARKER_SOURCES: Record<string, MarkerSource[]> = {
  'Cr': [
    { name: 'Leather Tanning', typicalConcentrationRange: '100-500 mg/L', associatedIndustries: ['Tannery', 'Chemical Processing'] },
    'Electroplating', 
    'Alloy Manufacturing', 
    'Pigments'
  ],
  'Cl': ['Industrial Brine', 'Domestic Sewage', 'Road Salt Runoff', 'Chlorination Processes'],
  'Cd': ['Ni-Cd Batteries', 'Plastic Stabilizers', 'Pigments', 'Phosphatic Fertilizers'],
  'Pb': ['Lead-Acid Batteries', 'Metal Smelting', 'Aviation Fuel', 'Ceramic Glazes'],
  'Zn': ['Galvanizing Plants', 'Rubber Additives', 'Brass/Bronze Manufacturing', 'Cosmetic Residue'],
  'COD': ['Food Processing', 'Pulp & Paper Mills', 'Textile Finishing', 'Unrefined Sewage'],
  'BOD': ['Sewage Treatment Plants', 'Food Processing', 'Runoff from Agricultural Land'],
  'S2-': ['Landfill Leachate', 'Petroleum Refining', 'Mining Runoff', 'Anaerobic Digestion'],
  'Hg': ['Coal-fired Power Plants', 'Gold Mining', 'Cement Production', 'Medical Waste'],
  'As': ['Mining Runoff', 'Wood Treated with CCA', 'Pesticides', 'Semiconductor Manufacturing'],
  'NO3': ['Agricultural Fertilizers', 'Manure Lagoon Overflow', 'Wastewater Treatment Plants', 'Livestock Operations'],
  'Salinity': ['Natural runoffs', 'Seawater intrusion'],
  'Conductivity': ['Dissolved salts', 'Industrial runoff'],
  'Turbidity': ['Erosion', 'Runoff', 'Aquatic plant die-off'],
  'pH': ['Acid rain', 'Industrial runoff', 'Natural rock weathering'],
  'TDS': ['Industrial wastewater', 'Urban runoff'],
  'Alkalinity': ['Limestone weathering', 'Agricultural practices'],
  'PM2.5': ['Traffic', 'Industry', 'Burning'],
  'PM10': ['Dust', 'Construction', 'Vehicle emissions'],
  'NO2': ['Traffic', 'Power plants'],
  'SO2': ['Coal burning', 'Industrial processes'],
  'CO': ['Vehicle exhaust', 'Industrial activity'],
  'O3': ['Photochemical reactions', 'Vehicle emissions'],
  'Moisture': ['Irrigation', 'Precipitation', 'Groundwater'],
  'Nitrogen': ['Fertilizers', 'Organic waste'],
  'Phosphorus': ['Fertilizers', 'Manure'],
  'Potassium': ['Fertilizers'],
  'OrgMatter': ['Decomposition', 'Runoff'],
  'Microplastics': ['Consumer waste', 'Industrial waste'],
  'WasteHeavyMetals': ['Electronics', 'Chemical manufacturing']
};

export const MARKER_PERSISTENCE: Record<string, string> = {
  'Cr': 'Very High: Persistent in soil and sediment for decades; bioaccumulative in aquatic plants.',
  'Cl': 'High: Non-biodegradable; persistent in water bodies unless diluted by significant freshwater inflow.',
  'Cd': 'Extremely High: Highly persistent; accumulates in the food chain with a half-life of 10-30 years in biological tissue.',
  'Pb': 'Indefinite: Does not degrade; binds strongly to soil particles and stays in the top layers for centuries.',
  'Zn': 'High: Adsorbs to sediments; toxicity remains high in low-oxygen environments or acidic water.',
  'COD': 'Variable: Depends on the organic complexity; simple sugars degrade in days, while synthetic organics persist for years.',
  'BOD': 'Variable: Depends on the load of decomposable organic matter and microbial activity.',
  'S2-': 'Medium: Readily oxidizes to sulfates in aerobic water, but highly persistent in stagnant, anaerobic zones.',
  'Hg': 'Extreme: Deposits in sediment where it methylates into methylmercury, a highly bioaccumulative toxic compound.',
  'As': 'Indefinite: Elementally persistent; converts between oxidation states depending on water chemistry, but remains toxic.',
  'NO3': 'Medium: Highly mobile in groundwater; can persist for months in aerobic environments until taken up by vegetation.',
  'Salinity': 'Persistent in closed water basins.',
  'Conductivity': 'Persistent depending on dissolved ions.',
  'Turbidity': 'Settles over time.',
  'pH': 'Depends on buffer capacity.',
  'TDS': 'Persistent in water bodies.',
  'Alkalinity': 'Stable depending on carbonate buffer system.',
  'PM2.5': 'Transient in the atmosphere.',
  'PM10': 'Settles from atmosphere.',
  'NO2': 'Dissipates.',
  'SO2': 'Dissipates.',
  'CO': 'Dissipates.',
  'O3': 'Persistent in smog.',
  'Moisture': 'Varies.',
  'Nitrogen': 'Varies.',
  'Phosphorus': 'Stable.',
  'Potassium': 'Stable.',
  'OrgMatter': 'Variable.',
  'Microplastics': 'Indefinite.',
  'WasteHeavyMetals': 'Indefinite.'
};

export const MARKER_HEALTH_IMPACTS: Record<string, string> = {
  'Cr': 'Carcinogenic via inhalation; causes severe skin ulcers, respiratory irritation, and kidney damage upon chronic exposure.',
  'Cl': 'High intake can lead to hypertension and fluid retention; excessive levels in water cause dehydration in aquatic life.',
  'Cd': 'Known human carcinogen; causes severe kidney dysfunction, bone fragility (itai-itai disease), and lung inflammation.',
  'Pb': 'Potent neurotoxin; causes developmental delays in children, kidney damage, anemia, and cardiovascular issues in adults.',
  'Zn': 'In high doses, causes nausea, vomiting, and stomach cramps; chronically interferes with copper absorption and immune function.',
  'COD': 'Not directly toxic to humans, but high levels indicate fecal or industrial contamination which may harbor pathogens or toxins.',
  'BOD': 'Indirect health risk due to potential pathogen presence in contaminated water.',
  'S2-': 'Highly toxic gas; irritates eyes and respiratory tract; at high concentrations, causes instant paralysis of the olfactory system and death.',
  'Hg': 'Powerful neurological damage (Minamata disease); severe developmental impairment in fetuses/children; tremors, memory loss.',
  'As': 'Cancerous; skin thickening, hyperpigmentation, cardiovascular disease, and severe neurological damage through chronic ingestion.',
  'NO3': 'Methemoglobinemia (Blue Baby Syndrome) inhibiting oxygen uptake in infants; suspected carcinogen with long-term exposure.',
  'Salinity': 'Can contribute to hypertension.',
  'Conductivity': 'No direct health impact, but can indicate presence of contaminants.',
  'Turbidity': 'Can interfere with disinfection processes.',
  'pH': 'Extreme pH can irritate skin and eyes.',
  'TDS': 'High TDS can lead to unpleasant taste and potentially adverse health effects.',
  'Alkalinity': 'Generally not harmful directly.',
  'PM2.5': 'Respiratory and cardiovascular issues.',
  'PM10': 'Iritation of respiratory system.',
  'NO2': 'Respiratory inflammation.',
  'SO2': 'Respiratory issues.',
  'CO': 'Oxygen deprivation.',
  'O3': 'Respiratory irritation.',
  'Moisture': 'Not directly toxic.',
  'Nitrogen': 'Not directly toxic.',
  'Phosphorus': 'Not directly toxic.',
  'Potassium': 'Not directly toxic.',
  'OrgMatter': 'Not directly toxic.',
  'Microplastics': 'Potential ingestion/bioaccumulation.',
  'WasteHeavyMetals': 'Highly toxic.'
};

export type EnvironmentalImpact = string | { aquaticLife: string; soil: string; airQuality: string; };

export const MARKER_ENVIRONMENTAL_IMPACTS: Record<string, EnvironmentalImpact> = {
  'Cr': {
    aquaticLife: 'Toxic to fish and aquatic invertebrates.',
    soil: 'Disrupts nutrient cycling in soil microbiology.',
    airQuality: 'Can be inhaled as particulate matter, causing respiratory issues.'
  },
  'Cl': 'Increases water density/stratification; toxic to freshwater species; stunts growth of non-salt-tolerant vegetation.',
  'Cd': {
    aquaticLife: 'Highly bioaccumulative; causes reproductive failure in birds and mammals.',
    soil: 'Persistent soil contaminant; accumulates in plants.',
    airQuality: 'Hazardous if inhaled as dust or fumes from smelting.'
  },
  'Pb': 'Accumulates in sediments; causes lead poisoning in waterfowl; reduces biodiversity in rural soil ecosystems.',
  'Zn': 'Extremely toxic to many aquatic organisms even at low levels; inhibits primary production (algae growth).',
  'COD': 'Causes rapid oxygen depletion (hypoxia); leads to massive "fish kills" and destruction of aerobic benthic communities.',
  'BOD': 'Depletes dissolved oxygen.',
  'S2-': 'Creates "dead zones" in sediments; corrosive to aquatic infrastructure; lethal to most aerobic aquatic organisms.',
  'Hg': 'Severe bioaccumulation in predatory fish; high contamination in aquatic food webs; reproductive failure in wildlife.',
  'As': 'Inhibits plant growth; toxic to aquatic invertebrates; bioaccumulates in benthic sediment biofilms.',
  'NO3': 'Eutrophication of water bodies; massive algal blooms; oxygen deficiency leading to "dead zones" in coastal areas.',
  'Salinity': 'Changes osmotic balance.',
  'Conductivity': 'Affects aquatic life physiology.',
  'Turbidity': 'Reduces light penetration.',
  'pH': 'Affects aquatic organisms and solubility of metals.',
  'TDS': 'Affects aquatic quality and balance.',
  'Alkalinity': 'Buffering capacity for aquatic ecosystems.',
  'PM2.5': 'Reduces visibility and alters atmosphere chemistry.',
  'PM10': 'Increased particle deposits.',
  'NO2': 'Acid rain contributor.',
  'SO2': 'Acid rain contributor.',
  'CO': 'Global warming gas contribution.',
  'O3': 'Damages crops and ecosystems.',
  'Moisture': 'Essential for life.',
  'Nitrogen': 'Eutrophication.',
  'Phosphorus': 'Eutrophication.',
  'Potassium': 'Nutrient.',
  'OrgMatter': 'Soil health.',
  'Microplastics': 'Marine/terrestrial ecosystem damage.',
  'WasteHeavyMetals': 'Highly toxic in environment.'
};
