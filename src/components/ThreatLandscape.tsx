"use client";

import { Activity, ShieldAlert, Crosshair, PieChart } from "lucide-react";

interface ThreatIndicators {
  healthMisinformation: number;
  politicalDisinformation: number;
  financialScam: number;
  conspiracyNarrative: number;
}

interface CampaignDetection {
  campaignName: string;
  campaignType: string;
  campaignGoal: string;
  confidence: number;
}

export default function ThreatLandscape({
  indicators,
  campaign,
}: {
  indicators?: ThreatIndicators;
  campaign?: CampaignDetection;
}) {
  if (!indicators && !campaign) return null;

  const renderBar = (label: string, value: number, colorStart: string, colorEnd: string) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{label}</span>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: colorEnd }}>
          {value}%
        </span>
      </div>
      <div style={{ width: "100%", height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: `linear-gradient(90deg, ${colorStart}, ${colorEnd})`,
            borderRadius: 3,
            transition: "width 1s ease",
          }}
        />
      </div>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* ── CAMPAIGN DETECTION CARD ── */}
      {campaign && (
        <div
          className="card"
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 62, 108, 0.3)",
            background: "rgba(255, 62, 108, 0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Crosshair size={18} style={{ color: "var(--neon-red)" }} />
            <h3 style={{ fontSize: "0.9rem", margin: 0, color: "var(--text-primary)" }}>
              Campaign Detection
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <p className="label" style={{ fontSize: "0.7rem", marginBottom: 2 }}>Inferred Campaign</p>
              <p style={{ fontWeight: 600, color: "var(--neon-red)", fontSize: "0.95rem" }}>
                {campaign.campaignName}
              </p>
            </div>
            <div>
              <p className="label" style={{ fontSize: "0.7rem", marginBottom: 2 }}>Vector Type</p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{campaign.campaignType}</p>
            </div>
            <div>
              <p className="label" style={{ fontSize: "0.7rem", marginBottom: 2 }}>Strategic Goal</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {campaign.campaignGoal}
              </p>
            </div>
            <div style={{ marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.3)", padding: "8px 12px", borderRadius: 6, border: "1px solid rgba(255,62,108,0.2)" }}>
              <span className="label" style={{ fontSize: "0.7rem" }}>AI Confidence</span>
              <span style={{ fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--neon-red)" }}>{campaign.confidence}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ── THREAT LANDSCAPE HEATMAP ── */}
      {indicators && (
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Activity size={18} style={{ color: "var(--neon-blue)" }} />
            <h3 style={{ fontSize: "0.9rem", margin: 0, color: "var(--text-primary)" }}>
              Threat Topology
            </h3>
          </div>
          <div style={{ marginTop: 12 }}>
            {renderBar(
              "Health Misinformation",
              indicators.healthMisinformation,
              "rgba(0,255,163,0.3)",
              "var(--neon-green)"
            )}
            {renderBar(
              "Political Disinformation",
              indicators.politicalDisinformation,
              "rgba(0,180,245,0.3)",
              "var(--neon-blue)"
            )}
            {renderBar(
              "Conspiracy Narrative",
              indicators.conspiracyNarrative,
              "rgba(168,85,247,0.3)",
              "var(--neon-purple)"
            )}
            {renderBar(
              "Financial Scam / Phishing",
              indicators.financialScam,
              "rgba(255,214,10,0.3)",
              "var(--neon-yellow)"
            )}
          </div>
        </div>
      )}
    </div>
  );
}
