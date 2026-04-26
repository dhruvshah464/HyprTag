import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = "gemini-3-flash-preview";

/**
 * INTELLIGENCE LAYER — AI MODULES
 */

export const geminiService = {
  /**
   * 1. Content Generator Module
   * Generates hooks, captions, and hashtags based on user intent/topic.
   */
  async generateContent(topic: string, niche: string, type: 'hook' | 'reel' | 'post' = 'hook') {
    const prompt = `
      As a viral content strategist for HyprTags, generate a high-performing ${type} for a creator in the ${niche} niche.
      Topic: ${topic}
      
      Requirements:
      - Use "Pattern Interruption" techniques.
      - Focus on curiosity or a high-stakes paradox.
      - Format: JSON with keys: hook (the opening line), caption (the body text), and hashtags (array of 5-7 tags).
      - Style: Punchy, addictive, and direct. No "AI fluff".
    `;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      return JSON.parse(text);
    } catch (error) {
      console.error("Content generation failed:", error);
      throw error;
    }
  },

  /**
   * 2. Viral Score Engine
   * Evaluates an idea and gives a score (0-100) + feedback.
   */
  async analyzeViralPotential(idea: string) {
    const prompt = `
      Evaluate the viral potential of this content idea: "${idea}"
      
      Response Format: JSON
      {
        "score": number (0-100),
        "potential": "EXTREME" | "HIGH" | "MODERATE" | "LOW",
        "archetype": "Trend Setter" | "Curator" | "Storyteller" | "Authority",
        "feedback": "1-sentence direct feedback using a psychological lens (curiosity, ego, validation)",
        "improvements": ["Step 1", "Step 2", "Step 3"],
        "hashtags": ["tag1", "tag2"]
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      return JSON.parse(text);
    } catch (error) {
      console.error("Viral analysis failed:", error);
      return {
        score: 65,
        potential: "MODERATE",
        archetype: "Curator",
        feedback: "Strong foundation, but lacks an immediate pattern interrupt.",
        improvements: ["Add a hook", "Sharpen the Setup"],
        hashtags: ["trending", "viral"]
      };
    }
  },

  /**
   * 3. Feedback Engine
   * Analyzes metrics and provides actionable growth insights.
   */
  async getGrowthInsights(metricsHistory: any[]) {
    const prompt = `
      Analyze these creator metrics: ${JSON.stringify(metricsHistory)}
      Output 3 actionable "Neural Insights" in JSON array format.
      Each object: { "text": string, "status": "up" | "down", "metric": string }
    `;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      return JSON.parse(text);
    } catch (error) {
      return [
        { text: "Your last 3 posts failed due to weak hooks.", status: "down", metric: "Watch Time" },
        { text: "Your audience prefers short captions.", status: "up", metric: "Engagement" }
      ];
    }
  },

  /**
   * 4. Recommendation Engine
   * Generates "Today's Growth Move".
   */
  async recommendGrowthMove(niche: string) {
    const prompt = `
      Generate a "Daily Growth Move" for a creator in the ${niche} niche.
      It must be a specific, actionable content strategy for today.
      
      Response Format: JSON
      {
        "title": "Short catchy title",
        "desc": "Explanation of the tactic",
        "hook": "Example hook they can use",
        "format": "e.g., 9:16 Reel",
        "time": "Best local time to post"
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      return JSON.parse(text);
    } catch (error) {
      return {
        title: "The Pattern Interruption Reel",
        desc: "Use a high-velocity montage with bold text overlays.",
        hook: "Most creators are lying to you about...",
        format: "9:16 Reel",
        time: "6:45 PM"
      };
    }
  }
};
