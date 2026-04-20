import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface HashtagResult {
  hashtags: string[];
  trendingScore: number;
  niche: string;
  category: "Viral" | "Niche" | "Reach";
  prediction: string;
}

export interface AnalysisResponse {
  results: HashtagResult[];
  summary: string;
}

export async function generateHashtags(content: string, imageBase64?: string): Promise<AnalysisResponse> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are an elite social media growth expert. 
Analyze the provided content (text and/or image) and generate top-trending, relevant hashtags and tags.
Organize results into three categories: 
1. Viral (high volume, high competition)
2. Niche (medium volume, highly relevant)
3. Reach (high growth potential).
Provide a brief prediction of reach for these tags.
Return exactly three categories in a JSON format.`;

  const contents: any[] = [{ text: `Content to analyze: ${content}` }];
  
  if (imageBase64) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64.split(",")[1] || imageBase64
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          results: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                trendingScore: { type: Type.NUMBER, description: "Score from 0-100" },
                niche: { type: Type.STRING },
                category: { type: Type.STRING, enum: ["Viral", "Niche", "Reach"] },
                prediction: { type: Type.STRING, description: "Engagement prediction summary" }
              },
              required: ["hashtags", "trendingScore", "niche", "category", "prediction"]
            }
          },
          summary: { type: Type.STRING }
        },
        required: ["results", "summary"]
      }
    }
  });

  const text = response.text || "{}";
  return JSON.parse(text) as AnalysisResponse;
}
