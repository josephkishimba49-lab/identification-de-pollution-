/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { ChemicalMarker } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzePollutionSignature(sampleData: ChemicalMarker[]) {
  const prompt = `
    Analyze the following chemical sample data from an environmental water source.
    Data:
    ${sampleData.map(m => `- ${m.name} (${m.symbol}): ${m.concentration} ${m.unit}`).join('\n')}

    Based on these concentrations and known chemical markers for industrial pollution, 
    identify the most likely industrial source (e.g., Tannery, Metallurgy, Chemical, Textile, etc.)
    Provide a confidence score (0.0 to 1.0) and a detailed forensic explanation of why this 
    signature matches that industry. Consider ratios between markers.
  `;

  try {
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
