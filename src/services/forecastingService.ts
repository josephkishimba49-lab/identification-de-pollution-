
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export interface ForecastData {
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  projection: number[];
}

export async function generateForecast(symbol: string, currentData: number[]): Promise<ForecastData> {
  // Use Gemini to analyze the trend of the data
  const prompt = `Analyze the following concentration trend for marker ${symbol}: ${currentData.join(', ')}. Provide a trend, confidence score, and a 7-point projection for the next 7 days. Return JSON.`;
  
  try {
    const ai = getAiClient();
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    
    // Parse the response
    const text = result.text;
    // Assuming JSON response
    const json = JSON.parse(text?.replace(/```json\n?|\n?```/g, '') || '{}');
    return json;
  } catch (error) {
    console.error("Forecasting failed:", error);
    return {
      trend: "stable",
      confidence: 0.5,
      projection: Array.from({ length: 7 }, () => currentData[currentData.length - 1])
    };
  }
}

