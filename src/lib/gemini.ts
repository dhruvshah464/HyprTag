import { GoogleGenAI, Type } from "@google/genai";

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY || "dummy-key";
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is missing. AI features will be limited.");
  }
  return new (GoogleGenAI as any)({ apiKey });
}

const ai = getAI();

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
  const model = (ai as any).getGenerativeModel({ 
    model: "gemini-3-flash-preview",
    systemInstruction: `You are an elite, high-velocity social media growth architect for a Billion-Dollar SaaS platform. 
Analyze content across neural data nodes. Predict hashtag velocity using proprietary social signal methodology.
Organize into three tactical clusters: 
1. Viral (Peak Velocity, High Competition)
2. Niche (Strategic Depth, Highly Relevant)
3. Reach (High Signal/Noise Ratio, Growth Trajectory).
Provide a "Neural Velocity" score (0-100) based on current platform algorithmic volatility.
Return exactly three categories in the specified JSON format.`
  });

  const contents: any[] = [{ text: `Content to analyze: ${content}` }];
  
  if (imageBase64) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64.split(",")[1] || imageBase64
      }
    });
  }

  const response = await model.generateContent({
    contents,
    generationConfig: {
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

  const text = response.response.text() || "{}";
  return JSON.parse(text) as AnalysisResponse;
}
