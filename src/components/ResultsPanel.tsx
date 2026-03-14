"use client";

import { useMemo } from "react";
import { AlertTriangle, Hash, Info, Network, Flame, CheckCircle2, BookOpen } from "lucide-react";
import { AnalysisResult } from "@/app/scanner/page";
import ThreatLandscape from "./ThreatLandscape";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getRisk(riskLevel: string) {
  if (riskLevel === "High") return { cls: "risk-high", hex: "var(--neon-red)", bgHex: "rgba(255,62,108,0.1)", borderHex: "rgba(255,62,108,0.3)" };
  if (riskLevel === "Medium") return { cls: "risk-medium", hex: "var(--neon-yellow)", bgHex: "rgba(255,214,10,0.1)", borderHex: "rgba(255,214,10,0.3)" };
  return { cls: "risk-low", hex: "var(--neon-green)", bgHex: "rgba(0,255,163,0.08)", borderHex: "rgba(0,255,163,0.3)" };
}

export default function ResultsPanel({ result, originalText }: { result: AnalysisResult; originalText: string }) {
  const risk = getRisk(result.riskLevel);

  const circleR = 54;
  const circleC = 64;
  const circumference = 2 * Math.PI * circleR;
  const credOffset = circumference - (circumference * result.credibilityScore) / 100;
  const credColor = result.credibilityScore > 60 ? "var(--neon-green)" : result.credibilityScore > 35 ? "var(--neon-yellow)" : "var(--neon-red)";

  const highlighted = useMemo(() => {
    if (!result.flaggedPhrases?.length || !originalText) {
      return <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{originalText}</span>;
    }
    try {
      const sorted = [...result.flaggedPhrases].sort((a, b) => b.length - a.length);
      const pattern = sorted.map(escapeRegExp).join("|");
      const regex = new RegExp(`(${pattern})`, "gi");
      const parts = originalText.split(regex);
      return (
        <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.9 }}>
          {parts.map((part, i) => {
            const isFlag = sorted.some(p => p.toLowerCase() === part.toLowerCase());
            return isFlag
              ? <span key={i} className="flagged" title="Flagged manipulation phrase">{part}</span>
              : <span key={i}>{part}</span>;
          })}
        </span>
      );
    } catch {
      return <span style={{ whiteSpace: "pre-wrap" }}>{originalText}</span>;
    }
  }, [result.flaggedPhrases, originalText]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadein 0.4s ease" }}>

      {/* ── 1. RISK METER BANNER ── */}
      <div className="card" style={{
        padding: "24px 28px",
        background: risk.bgHex,
        border: `1px solid ${risk.borderHex}`,
        borderLeft: `4px solid ${risk.hex}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <div>
          <p className="label" style={{ marginBottom: 6 }}>Threat Classification</p>
          <p style={{ fontWeight: 700, fontSize: "1.05rem", color: risk.hex }}>{result.threatClassification}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p className="label" style={{ marginBottom: 4 }}>Propaganda Risk Level</p>
          <p style={{ fontWeight: 900, fontSize: "2.2rem", color: risk.hex, fontFamily: "var(--font-mono)", lineHeight: 1, letterSpacing: "-0.02em" }}>
            {result.riskLevel.toUpperCase()}
          </p>
        </div>
      </div>
      {/* ── 2. THREAT LANDSCAPE & CAMPAIGN MATRIX ── */}
      <ThreatLandscape indicators={result.threatIndicators} campaign={result.campaignDetection} />

      {/* ── FACT CHECKING RAG PANEL ── */}
      {result.factCheck && result.factCheck.length > 0 && (
        <div className="card" style={{ padding: "20px 24px" }}>
          <p className="label" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <BookOpen size={14} style={{ color: "var(--neon-blue)" }} /> Verified Claims & Evidence
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {result.factCheck.map((fc, idx) => {
              let badgeColor = "var(--text-muted)";
              let bgBadgeColor = "rgba(255,255,255,0.1)";
              if (fc.verdict === "True") { badgeColor = "var(--neon-green)"; bgBadgeColor = "rgba(0,255,163,0.1)"; }
              else if (fc.verdict === "False") { badgeColor = "var(--neon-red)"; bgBadgeColor = "rgba(255,62,108,0.1)"; }
              else if (fc.verdict === "Misleading") { badgeColor = "var(--neon-yellow)"; bgBadgeColor = "rgba(255,214,10,0.1)"; }

              return (
                <div key={idx} style={{ 
                  background: "rgba(0,0,0,0.2)", 
                  border: "1px solid var(--border)", 
                  borderRadius: 8, 
                  padding: "16px",
                  display: "flex", flexDirection: "column", gap: 8 
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1.5, flex: 1 }}>
                      &ldquo;{fc.claim}&rdquo;
                    </p>
                    <span style={{ 
                      padding: "4px 10px", borderRadius: 4, fontSize: "0.75rem", fontWeight: 700,
                      color: badgeColor, background: bgBadgeColor, border: "1px solid " + badgeColor + "40",
                      fontFamily: "var(--font-mono)", textTransform: "uppercase", whiteSpace: "nowrap"
                    }}>
                      {fc.verdict}
                    </span>
                  </div>
                  
                  {fc.evidenceSummary && (
                    <div style={{ marginTop: 4 }}>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        <strong style={{ color: "var(--text-primary)" }}>Evidence:</strong> {fc.evidenceSummary}
                      </p>
                    </div>
                  )}

                  {fc.sources && fc.sources.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                      {fc.sources.map((src, sIdx) => {
                        let domain = src;
                        try { domain = new URL(src).hostname.replace('www.', ''); } catch {}
                        return (
                          <a key={sIdx} href={src} target="_blank" rel="noreferrer" style={{ 
                            fontSize: "0.75rem", color: "var(--neon-blue)", textDecoration: "none", 
                            background: "rgba(0,180,245,0.1)", padding: "2px 8px", borderRadius: 4,
                            border: "1px solid rgba(0,180,245,0.2)"
                          }}>
                            {domain} ↗
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 2. SCORE GAUGES ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Credibility Gauge */}
        <div className="card" style={{ padding: "24px", textAlign: "center" }}>
          <p className="label" style={{ marginBottom: 16 }}>Credibility Score</p>
          <div style={{ position: "relative", width: 128, height: 128, margin: "0 auto" }}>
            <svg width="128" height="128" className="score-ring">
              <circle cx={circleC} cy={circleC} r={circleR} stroke="var(--border)" strokeWidth="10" fill="none" />
              <circle
                cx={circleC} cy={circleC} r={circleR}
                stroke={credColor} strokeWidth="10" fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={credOffset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1.2s ease" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "1.8rem", fontWeight: 800, color: credColor, fontFamily: "var(--font-mono)" }}>
                {result.credibilityScore}
              </span>
              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>/100</span>
            </div>
          </div>
        </div>

        {/* Bias Level */}
        <div className="card" style={{ padding: "24px" }}>
          <p className="label" style={{ marginBottom: 16 }}>Bias Level</p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100% - 30px)", gap: 12 }}>
            <span style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
              {result.biasLevel}<span style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>%</span>
            </span>
            <div style={{ width: "100%", height: 10, background: "var(--border)", borderRadius: 5, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${result.biasLevel}%`,
                background: `linear-gradient(90deg, var(--neon-green), var(--neon-yellow) 50%, var(--neon-red))`,
                borderRadius: 5,
                transition: "width 1.2s ease",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              <span>NEUTRAL</span>
              <span>EXTREME</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. VIRALITY & CONFIDENCE ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Virality Risk */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <p className="label" style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 12 }}>
            <Flame size={12} style={{ color: "var(--neon-red)" }} /> Virality Risk
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-mono)",
              color: result.viralityRisk > 70 ? "var(--neon-red)" : result.viralityRisk > 40 ? "var(--neon-yellow)" : "var(--neon-green)" }}>
              {result.viralityRisk ?? "—"}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ width: "100%", height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
                <div style={{
                  height: "100%",
                  width: `${result.viralityRisk ?? 0}%`,
                  background: "linear-gradient(90deg, var(--neon-yellow), var(--neon-red))",
                  borderRadius: 3, transition: "width 1.2s ease",
                }} />
              </div>
              <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {(result.viralityRisk ?? 0) > 70 ? "HIGH SPREAD POTENTIAL" : (result.viralityRisk ?? 0) > 40 ? "MODERATE RISK" : "LOW RISK"}
              </p>
            </div>
          </div>
        </div>
        {/* AI Confidence */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <p className="label" style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 12 }}>
            <CheckCircle2 size={12} style={{ color: "var(--neon-green)" }} /> AI Confidence
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-mono)",
              color: "var(--neon-green)" }}>
              {result.confidenceScore ?? "—"}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ width: "100%", height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
                <div style={{
                  height: "100%",
                  width: `${result.confidenceScore ?? 0}%`,
                  background: "var(--neon-green)",
                  borderRadius: 3, transition: "width 1.2s ease",
                  boxShadow: "0 0 8px rgba(0,255,163,0.4)",
                }} />
              </div>
              <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>ASSESSMENT RELIABILITY</p>
            </div>
          </div>
        </div>
      </div>


      <div className="card" style={{ padding: "20px 24px" }}>
        <p className="label" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <Hash size={13} style={{ color: "var(--neon-blue)" }} /> Detected Propaganda Techniques
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {result.techniques.length > 0
            ? result.techniques.map((t, i) => (
                <span key={i} className="badge badge-blue" style={{ fontSize: "0.8rem", padding: "6px 12px" }}>{t}</span>
              ))
            : <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No specific techniques detected.</span>
          }
        </div>
      </div>

      {/* ── 4. FLAGGED TEXT ── */}
      {originalText && (
        <div className="card" style={{ padding: "20px 24px" }}>
          <p className="label" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <AlertTriangle size={13} style={{ color: "var(--neon-red)" }} /> Analyzed Text · Flagged Phrases Highlighted
          </p>
          <div style={{
            background: "rgba(0,0,0,0.3)",
            borderRadius: 10,
            padding: "16px 20px",
            fontFamily: "var(--font-sans)",
            fontSize: "0.9rem",
            color: "#c9d6e0",
            maxHeight: 220,
            overflowY: "auto",
            border: "1px solid var(--border)",
          }}>
            {highlighted}
          </div>
          {result.flaggedPhrases?.length > 0 && (
            <p style={{ marginTop: 10, fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ display: "inline-block", width: 10, height: 10, background: "rgba(255,62,108,0.3)", borderRadius: 2, borderBottom: "2px solid var(--neon-red)" }}></span>
              {result.flaggedPhrases.length} suspicious phrase{result.flaggedPhrases.length > 1 ? "s" : ""} flagged
            </p>
          )}
        </div>
      )}

    </div>
  );
}
