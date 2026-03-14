"use client";

import { useState, useRef, useCallback } from "react";
import { Scan, FileText, Image, Zap, AlertTriangle, ChevronRight } from "lucide-react";
import ResultsPanel from "@/components/ResultsPanel";

export interface AnalysisResult {
  credibilityScore: number;
  biasLevel: number;
  riskLevel: "Low" | "Medium" | "High";
  threatClassification: string;
  techniques: string[];
  flaggedPhrases: string[];
  narrativeDetection: {
    narrativeName: string;
    narrativeType: string;
    campaignGoal: string;
  };
  viralityRisk: number;
  confidenceScore: number;
  explanation: string;
  extractedText?: string;
}

const SAMPLE_TEXTS = [
  {
    label: "Fear Propaganda",
    text: `BREAKING: The mainstream media is LYING to you about the new vaccine. Government officials don't want you to know the hidden truth they've been burying for years. Millions of people are waking up to the REAL agenda. Share this before it gets deleted! This is the most dangerous cover-up in history and our time is running out!`,
  },
  {
    label: "Political Bias",
    text: `The radical left-wing politicians are destroying our nation with their dangerous socialist agenda. Real patriots know that only our leader can save us from the corrupt elites who hate our values. Anyone who disagrees is either a traitor or a fool. We must stand together and fight back NOW!`,
  },
  {
    label: "Neutral News",
    text: `The city council voted 7-2 to approve the new infrastructure bill on Tuesday. The bill allocates $4.2 million for road repairs and $1.8 million for public transit improvements over the next fiscal year. Council member Smith cited traffic data showing a 15% increase in commute times. The bill will be signed by the mayor next week.`,
  },
];

export default function ScannerPage() {
  const [tab, setTab] = useState<"text" | "image">("text");
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzedText, setAnalyzedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const runAnalysis = useCallback(async (payload: object, textForHighlight: string) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setAnalyzedText(textForHighlight);
    setLoadingStage("Connecting to AI systems...");

    const stages = [
      "Parsing linguistic patterns...",
      "Detecting emotional triggers...",
      "Scanning propaganda techniques...",
      "Computing bias vectors...",
      "Finalizing threat assessment...",
    ];
    let si = 0;
    const interval = setInterval(() => {
      if (si < stages.length) { setLoadingStage(stages[si++]); }
    }, 900);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");
      setResult(data as AnalysisResult);
      if (data.extractedText) setAnalyzedText(data.extractedText);
    } catch (e: any) {
      setError(e.message);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }, []);

  const handleTextSubmit = () => {
    if (!text.trim()) return;
    runAnalysis({ type: "text", text }, text);
  };

  const handleImageFile = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleImageSubmit = async () => {
    if (!imageFile) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setLoadingStage("Extracting text from image (OCR)...");
    try {
      // Run Tesseract in the browser — fast, no server roundtrip for OCR
      const Tesseract = (await import("tesseract.js")).default;
      const { data } = await Tesseract.recognize(imageFile, "eng", { logger: () => {} });
      const extracted = data.text?.trim();
      if (!extracted) throw new Error("No readable text found in the image. Try a clearer screenshot.");
      setAnalyzedText(extracted);
      setLoadingStage("Connecting to AI systems...");

      const stages = [
        "Parsing linguistic patterns...",
        "Detecting emotional triggers...",
        "Scanning propaganda techniques...",
        "Computing bias vectors...",
        "Finalizing threat assessment...",
      ];
      let si = 0;
      const interval = setInterval(() => {
        if (si < stages.length) { setLoadingStage(stages[si++]); }
      }, 900);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "text", text: extracted }),
        });
        const data2 = await res.json();
        clearInterval(interval);
        if (!res.ok) throw new Error(data2.error || "Analysis failed.");
        setResult(data2 as AnalysisResult);
      } catch (aiErr: any) {
        clearInterval(interval);
        throw aiErr;
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImageFile(file);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>

      {/* Page Header */}
      <div style={{ marginBottom: 40 }}>
        <div className="badge badge-blue" style={{ marginBottom: 12 }}>
          <Scan size={12} /> Scanner
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>
          Propaganda Detection Engine
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Paste text or upload a screenshot — our AI will assess propaganda risk, bias, and manipulation in real time.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24, alignItems: "start" }}>

        {/* ── LEFT: INPUT PANEL ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
              {[
                { key: "text", label: "Text / Paste", icon: FileText },
                { key: "image", label: "Upload Image", icon: Image },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key as "text" | "image")}
                  style={{
                    flex: 1,
                    padding: "16px",
                    background: tab === key ? "rgba(0,180,245,0.06)" : "transparent",
                    border: "none",
                    borderBottom: tab === key ? "2px solid var(--neon-blue)" : "2px solid transparent",
                    color: tab === key ? "var(--neon-blue)" : "var(--text-secondary)",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s",
                  }}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>

            <div style={{ padding: 24 }}>
              {tab === "text" ? (
                <>
                  <textarea
                    className="input-area"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste a tweet, news headline, social media post, WhatsApp message..."
                    rows={10}
                    disabled={loading}
                    style={{ minHeight: 220 }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
                      {text.length} chars
                    </span>
                    <button
                      onClick={() => setText("")}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.8rem" }}
                    >
                      Clear
                    </button>
                  </div>
                </>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileRef.current?.click()}
                  style={{
                    minHeight: imagePreview ? "auto" : 220,
                    border: `2px dashed ${dragOver ? "var(--neon-blue)" : imagePreview ? "var(--neon-green)" : "var(--border)"}`,
                    borderRadius: 12,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: imagePreview ? "flex-start" : "center",
                    cursor: "pointer",
                    background: dragOver ? "rgba(0,180,245,0.05)" : "rgba(0,0,0,0.2)",
                    transition: "all 0.2s",
                    gap: 12,
                    color: "var(--text-secondary)",
                    overflow: "hidden",
                  }}
                >
                  {imagePreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" style={{ width: "100%", borderRadius: 10, maxHeight: 200, objectFit: "contain" }} />
                      <p style={{ fontSize: "0.78rem", color: "var(--neon-green)", padding: "0 12px 12px", textAlign: "center" }}>
                        ✓ {imageFile?.name} — click to change
                      </p>
                    </>
                  ) : (
                    <>
                      <Image size={40} style={{ opacity: 0.4, color: "var(--neon-blue)" }} />
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontWeight: 600, marginBottom: 4 }}>Drop image or click to upload</p>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Supports JPG, PNG, WEBP · OCR will extract text</p>
                      </div>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" style={{ display: "none" }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
                </div>
              )}

              <button
                className="btn-primary"
                onClick={tab === "image" ? handleImageSubmit : handleTextSubmit}
                disabled={loading || (tab === "text" && !text.trim()) || (tab === "image" && !imageFile)}
                style={{ width: "100%", marginTop: 18, justifyContent: "center", fontSize: "0.95rem", padding: "14px" }}
              >
                <Zap size={16} />
                {loading ? "Scanning..." : tab === "image" ? "Extract & Analyze" : "Run Analysis"}
              </button>
            </div>
          </div>

          {/* Sample Texts */}
          <div className="card" style={{ padding: 20 }}>
            <p className="label" style={{ marginBottom: 14 }}>Try a sample</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SAMPLE_TEXTS.map(({ label, text: sampleText }) => (
                <button
                  key={label}
                  onClick={() => { setTab("text"); setText(sampleText); }}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "10px 14px",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-bright)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                  }}
                >
                  <span>{label}</span>
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: RESULTS / LOADING / STANDBY ── */}
        <div>
          {!result && !loading && !error && (
            <div className="card" style={{
              padding: "80px 40px",
              textAlign: "center",
              color: "var(--text-muted)",
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              background: "rgba(0,0,0,0.2)",
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                border: "2px dashed var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Scan size={32} style={{ opacity: 0.3 }} />
              </div>
              <div>
                <p style={{ fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>System Standby</p>
                <p style={{ fontSize: "0.85rem" }}>Submit content to begin threat analysis.</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="card card-glow-blue" style={{
              padding: "80px 40px",
              textAlign: "center",
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Scanner sweep */}
              <div style={{
                position: "absolute",
                left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg, transparent, var(--neon-blue), transparent)",
                animation: "scan 2s linear infinite",
              }} />
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  border: "3px solid transparent",
                  borderTopColor: "var(--neon-blue)",
                  borderRightColor: "var(--neon-blue)",
                  animation: "spin 1s linear infinite",
                }} />
                <div style={{
                  position: "absolute",
                  inset: 10,
                  borderRadius: "50%",
                  border: "2px solid transparent",
                  borderBottomColor: "var(--neon-purple)",
                  animation: "spin 1.5s linear infinite reverse",
                }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "var(--neon-blue)", fontSize: "1rem", marginBottom: 8 }}>
                  ANALYZING PAYLOAD
                </p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)", animation: "glow-pulse 1.5s infinite" }}>
                  {loadingStage}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="card card-glow-red" style={{ padding: 28 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <AlertTriangle size={20} style={{ color: "var(--neon-red)" }} />
                <span style={{ fontWeight: 700, color: "var(--neon-red)" }}>Analysis Error</span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{error}</p>
            </div>
          )}

          {result && !loading && (
            <ResultsPanel result={result} originalText={analyzedText} />
          )}
        </div>
      </div>
    </div>
  );
}
