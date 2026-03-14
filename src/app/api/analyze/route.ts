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
  campaignDetection: {
    campaignName: "Anti-Vax Institutional Cover-Up",
    campaignType: "Harm-Inducing Disinformation",
    campaignGoal: "Decrease vaccination rates and erode public trust in global health agencies.",
    confidence: 96
  },
  threatIndicators: {
    healthMisinformation: 98,
    politicalDisinformation: 75,
    financialScam: 10,
    conspiracyNarrative: 95
  },
  viralityRisk: 87,
  confidenceScore: 94,
  explanation: "⚠ DEMO MODE — This is a pre-built demonstration response. The analyzed content exhibits multiple high-severity propaganda markers: fear appeal and urgency manipulation pressure readers into sharing without verification. 'Mainstream media is lying' is a classic trust-erosion tactic. Urgency phrases exploit cognitive shortcuts and prevent critical thinking.",
  claims: [
    "The mainstream media is lying about the new vaccine.",
    "Government officials are burying the hidden truth about the vaccine.",
  ],
  factCheck: [
    {
      claim: "The mainstream media is lying about the new vaccine.",
      verdict: "Unverified",
      evidenceSummary: "This is a broad, subjective claim often used in conspiracy theories to erode trust in institutions. Specific, verifiable claims about the vaccine are required for thorough fact-checking.",
      sources: [],
    },
    {
      claim: "Government officials are burying the hidden truth about the vaccine.",
      verdict: "False",
      evidenceSummary: "Extensive public health data and independent scientific studies globally track vaccine efficacy and safety, contradicting claims of a coordinated government cover-up.",
      sources: ["https://en.wikipedia.org/wiki/COVID-19_vaccine_misinformation_and_hesitancy"],
    }
  ]
};

// Helper: Fetch summaries from Wikipedia API
async function searchWikipedia(query: string) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.query?.search?.length > 0) {
      // Return the top 5 snippets for broader consensus verified checking
      return data.query.search.slice(0, 5).map((item: any) => ({
        title: item.title,
        snippet: item.snippet.replace(/<[^>]*>?/gm, ''), // strip html tags
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`
      }));
    }
  } catch (error) {
    console.error("Wikipedia search failed:", error);
  }
  return [];
}

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
  "claims": [<strings extracting specific, verifiable factual claims made in the text. Maximum 3 claims. Return empty array if no factual claims are made.>],
  "narrativeDetection": {
    "narrativeName": <string>,
    "narrativeType": <string>,
    "campaignGoal": <string>
  },
  "campaignDetection": {
    "campaignName": <string, inferred name of the broader misinformation campaign>,
    "campaignType": <string, e.g., 'Targeted Disinformation', 'Astro-turfing', 'Financial Scam'>,
    "campaignGoal": <string, what the real-world objective of the campaign is>,
    "confidence": <integer 0-100, how confident you are this is part of a coordinated campaign>
  },
  "threatIndicators": {
    "healthMisinformation": <integer 0-100 risk score>,
    "politicalDisinformation": <integer 0-100 risk score>,
    "financialScam": <integer 0-100 risk score>,
    "conspiracyNarrative": <integer 0-100 risk score>
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

      // ── Step 2 & 3: RAG Fact-Checking Pipeline ──
      let factCheckResults = [];
      const extractedClaims = json.claims || [];

      if (extractedClaims.length > 0) {
        // 2a. Retrieval: Fetch evidence for each claim from Wikipedia
        const claimsWithEvidence = await Promise.all(
          extractedClaims.slice(0, 3).map(async (claim: string) => { // limit to top 3 claims for speed
            const evidence = await searchWikipedia(claim);
            return { claim, evidence };
          })
        );

        // 2b. Evidence Comparison: Second prompt to Gemini
        const factCheckPrompt = `You are a strict, objective fact-checker performing Cross-Source Fact Verification.
Evaluate the following claims against the provided multiple pieces of evidence retrieved from Wikipedia.

For each claim, synthesize the evidence to form a consensus verdict ('True', 'False', 'Misleading', or 'Unverified'). 
Provide a short 1-2 sentence summary of the consensus evidence, and list ALL the URLs of the sources used to reach that verdict.

Claims and Evidence:
${JSON.stringify(claimsWithEvidence, null, 2)}

Return ONLY a JSON array of objects matching this exact structure:
[
  {
    "claim": "string",
    "verdict": "True | False | Misleading | Unverified",
    "evidenceSummary": "string",
    "sources": ["string url"]
  }
]`;

        const factCheckResponse = await ai.models.generateContent({
          model: "gemini-2.0-flash", // Fast model for evaluation
          contents: factCheckPrompt,
          config: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        });

        const fcRawText = factCheckResponse.text;
        if (fcRawText) {
          const fcCleaned = fcRawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
          try {
            factCheckResults = JSON.parse(fcCleaned);
          } catch (e) {
             console.error("Failed to parse fact-check JSON", e);
          }
        }
      }

      // Merge results
      json.factCheck = factCheckResults;

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
