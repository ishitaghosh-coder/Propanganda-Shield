import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Mock Fallback Response for demo
const mockResponse = {
  credibilityScore: 18,
  biasLevel: 91,
  riskLevel: "High",
  threatClassification: "Information Manipulation",
  techniques: ["Fear Appeal", "Loaded Language", "Urgency Manipulation", "Conspiracy Framing", "Card Stacking"],
  flaggedPhrases: [
    "mainstream media is LYING",
    "don't want you to know",
    "biggest cover-up in history",
    "WAKE UP before it's too late",
    "share this before it gets deleted",
  ],
  narrativeDetection: {
    narrativeName: "Anti-Establishment Conspiracy Narrative",
    narrativeType: "Conspiracy Disinformation Campaign",
    campaignGoal: "Erode public trust in media and government institutions by promoting unfounded cover-up theories.",
  },
  viralityRisk: 87,
  confidenceScore: 94,
  explanation: "⚠ DEMO MODE — This is a pre-built demonstration response. The analyzed content exhibits multiple high-severity propaganda markers: fear appeal and urgency manipulation pressure readers into sharing without verification. 'Mainstream media is lying' is a classic trust-erosion tactic. Urgency phrases exploit cognitive shortcuts and prevent critical thinking.",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    const textToAnalyze: string = (text || "").trim();

    if (!textToAnalyze) {
      return NextResponse.json({ error: "No text provided for analysis." }, { status: 400 });
    }

    // ── Gemini AI Analysis ──
    const apiKey = process.env.GEMINI_API_KEY;

    try {
      if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are an expert intelligence analyst specializing in propaganda detection, misinformation analysis, and psychological manipulation tactics.

Analyze the following text and return ONLY a valid JSON object — no explanation, no markdown, no code fences, nothing else.

TEXT TO ANALYZE:
"""
${textToAnalyze}
"""

You MUST return ONLY this JSON structure, with ALL fields filled in:
{
  "credibilityScore": <integer 0-100>,
  "biasLevel": <integer 0-100>,
  "riskLevel": <"Low" or "Medium" or "High">,
  "threatClassification": <one of: "None", "State Propaganda", "Information Manipulation", "Fear Mongering", "Psychological Influence", "Hate Speech Adjacent", "Conspiracy Theory", "Disinformation">,
  "techniques": [<strings of propaganda technique names>],
  "flaggedPhrases": [<exact verbatim substrings from the original text that are manipulative>],
  "narrativeDetection": {
    "narrativeName": <string>,
    "narrativeType": <string>,
    "campaignGoal": <string>
  },
  "viralityRisk": <integer 0-100>,
  "confidenceScore": <integer 0-100>,
  "explanation": <string, 2-4 sentences>
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      });

      const rawText = response.text;
      if (!rawText) throw new Error("Empty response from Gemini.");

      // Strip markdown code fences if model adds them despite instructions
      const cleaned = rawText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const json = JSON.parse(cleaned);

      return NextResponse.json(json);
    } catch (aiErr: any) {
      console.error("Gemini API error:", aiErr?.message);
      return NextResponse.json({
        ...mockResponse,
        explanation: `⚠ AI Error: ${aiErr?.message || "Unknown error"}. Falling back to demo response.`,
      });
    }
  } catch (err: any) {
    console.error("Route error:", err);
    return NextResponse.json({ error: err.message || "Server error." }, { status: 500 });
  }
}
