/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { ChemicalMarker } from "../types";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export async function analyzePollutionSignature(
  sampleData: ChemicalMarker[], 
  metadata: { collectionDate: string; collectorName: string; lat: string; lng: string }
) {
  const prompt = `
    Analyze the following chemical sample data from an environmental water source.
    
    Sample Metadata:
    - Collection Date: ${metadata.collectionDate}
    - Collected By: ${metadata.collectorName}
    - Location: ${metadata.lat}, ${metadata.lng}

    Data:
    ${sampleData.map(m => `- ${m.name} (${m.symbol}): ${m.concentration} ${m.unit}`).join('\n')}

    Based on these concentrations and known chemical markers for industrial pollution, 
    identify the most likely industrial source (e.g., Tannery, Metallurgy, Chemical, Textile, etc.)
    Provide a confidence score (0.0 to 1.0) and a detailed forensic explanation of why this 
    signature matches that industry. Consider ratios between markers and the context provided by location and date if relevant.
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sourceType: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["sourceType", "confidence", "reasoning"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      sourceType: "Analysis Error",
      confidence: 0,
      reasoning: "The AI was unable to process the chemical signature at this time."
    };
  }
}

export async function generateAlertSummary(
  alertTitle: string, 
  alertDescription: string, 
  attributionSource?: string, 
  markerName?: string, 
  persistenceData?: string
) {
  const prompt = `
    You are an environmental forensic AI. Generate a concise summary for a critical pollution alert.
    Alert Title: ${alertTitle}
    Alert Description: ${alertDescription}
    ${attributionSource ? `Potential Source Identified: ${attributionSource}` : ''}
    ${markerName ? `Chemical Marker: ${markerName}` : ''}
    ${persistenceData ? `Environmental Persistence/Stability Profile: ${persistenceData}` : ''}

    Highlight the key issue and provide:
    1. A one-sentence summary of the core threat.
    2. One immediate, actionable recommendation for responders.
    3. 3-4 specific technical recommendations for mitigating this specific chemical/source combination.
    4. A more detailed summary of potential long-term environmental and health impacts, incorporating knowledge of the marker's persistence profile.

    Keep the tone professional, urgent, and technical.
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issue: { type: Type.STRING, description: "A one-sentence summary of the core threat." },
            action: { type: Type.STRING, description: "One immediate corrective action for field teams." },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Technical recommendations for mitigation."
            },
            longTermImpacts: { type: Type.STRING, description: "Environmental and health impacts over time." }
          },
          required: ["issue", "action", "recommendations", "longTermImpacts"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Summary generation failed:", error);
    return {
      issue: "Automated threat assessment unavailable.",
      action: "Initiate standard emergency monitoring protocols immediately.",
      recommendations: ["Evacuate immediate proximity", "Monitor downstream sensors", "Contact regional environmental authority"],
      longTermImpacts: "Failure to contain could lead to persistent heavy metal contamination in the local water table and bioaccumulation in local fauna."
    };
  }
}

export async function analyzePollutionImage(base64Image: string, mimeType: string) {
  const prompt = `
    Analyze this image of a potential environmental pollution site (e.g., river spill, soil discoloration, smoke plume).
    Based on visual indicators like color, texture, location context, and visible industry near the site, output the most likely chemical markers present and their estimated concentration levels (as a starting point for forensic investigation).

    Also provide what industrial source this likely originates from.
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sourceType: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            suggestedMarkers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  symbol: { type: Type.STRING },
                  estimatedConcentration: { type: Type.NUMBER }
                },
                required: ["symbol", "estimatedConcentration"]
              }
            }
          },
          required: ["sourceType", "confidence", "reasoning", "suggestedMarkers"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Image analysis failed:", error);
    throw error;
  }
}

export async function simulateUnmixing(sampleData: ChemicalMarker[]) {
  const prompt = `
    You are an environmental forensics expert. I have a mixed pollution sample containing the following chemical markers and concentrations:
    ${JSON.stringify(sampleData, null, 2)}

    Based on these markers, predict the proportional mix of industrial sources that contributed to this sample (Simulation du demixage).
    Return a confident estimate as an array of source objects, each with a sourceName (e.g. 'Textile Dyeing Plant', 'Battery Manufacturer'), a percentage (number 0-100), and a brief reasoning.
    Make sure percentages add up to roughly 100.
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sourceName: { type: Type.STRING },
              percentage: { type: Type.NUMBER },
              reasoning: { type: Type.STRING }
            },
            required: ["sourceName", "percentage", "reasoning"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Unmixing simulation failed:", error);
    throw error;
  }
}
export async function siameseCompare(sampleA: ChemicalMarker[], sampleB: ChemicalMarker[]) {
  const prompt = `
    You are an AI acting as a Siamese Neural Network for direct environmental comparison.
    Compare these two chemical samples:
    Sample A: ${JSON.stringify(sampleA)}
    Sample B: ${JSON.stringify(sampleB)}

    Analyze if these two samples likely originate from the EXACT same industrial source event.
    Calculate a similarity score (0-100), identify the key matching elements, the key diverging elements, and give a final conclusion.
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            similarityScore: { type: Type.NUMBER },
            matchingElements: { type: Type.ARRAY, items: { type: Type.STRING } },
            divergingElements: { type: Type.ARRAY, items: { type: Type.STRING } },
            conclusion: { type: Type.STRING }
          },
          required: ["similarityScore", "matchingElements", "divergingElements", "conclusion"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Siamese comparison failed:", error);
    throw error;
  }
}

export async function detectPredictiveAnomalies(historicalData: any[]) {
  const prompt = `
    You are an environmental predictive intelligence AI. Analyze the following historical chemical trend data 
    and identify subtle anomalies or creeping trends that deviate from established baselines, 
    even if they haven't breached regulatory thresholds yet.

    Historical Data Summary:
    ${JSON.stringify(historicalData.slice(-10))}

    For each significant finding, provide:
    1. A clear "Threat Classification" (e.g., Subtle Creep, Periodic Spike, Baseline Drift).
    2. A "Forensic Probability" score (0.0 to 1.0).
    3. A "Predictive Insight" describing what this trend might lead to in the future if left unaddressed.
    4. A "Preemptive Actions" list (array of strings) for investigators.
    5. "Key Features" contributing to this insight (array of objects {feature: string, importance: number} totaling 1.0).

    Focus on patterns that a regular threshold-based system would miss.
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            alerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  marker: { type: Type.STRING },
                  classification: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  insight: { type: Type.STRING },
                  recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                  keyFeatures: { 
                    type: Type.ARRAY, 
                    items: { 
                      type: Type.OBJECT, 
                      properties: { 
                        feature: { type: Type.STRING }, 
                        importance: { type: Type.NUMBER } 
                      }, 
                      required: ["feature", "importance"]
                    } 
                  }
                },
                required: ["marker", "classification", "confidence", "insight", "recommendations", "keyFeatures"]
              }
            }
          },
          required: ["alerts"]
        }
      }
    });

    return JSON.parse(response.text || '{"alerts": []}');
  } catch (error) {
    console.error("Predictive analysis failed:", error);
    return { alerts: [] };
  }
}
