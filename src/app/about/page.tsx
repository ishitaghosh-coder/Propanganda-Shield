import { Shield, Brain, Eye, Search, ChevronRight, Code2, Zap, AlertTriangle } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: Search,
    color: "var(--neon-blue)",
    title: "Input",
    desc: "Paste any text (tweet, headline, post) or upload a screenshot. If an image is uploaded, Tesseract.js OCR extracts the text before any AI processing begins.",
  },
  {
    num: "02",
    icon: Brain,
    color: "var(--neon-purple)",
    title: "AI Analysis",
    desc: "The extracted text is sent to Google Gemini 2.5 Pro, which is prompted with a strict structured JSON schema. The model analyzes linguistic patterns, emotional triggers, rhetorical devices, and factual inconsistencies.",
  },
  {
    num: "03",
    icon: Eye,
    color: "var(--neon-green)",
    title: "Explanation",
    desc: "The AI identifies specific flagged phrases from the original text. These are mapped back and highlighted in the UI, making the AI reasoning fully transparent and explainable.",
  },
  {
    num: "04",
    icon: AlertTriangle,
    color: "var(--neon-red)",
    title: "Threat Report",
    desc: "A complete intelligence report is generated: Credibility Score, Bias Level, Risk Level, Threat Classification, detected propaganda techniques, and a detailed explanation.",
  },
];

const FIELDS = [
  { field: "credibilityScore", type: "integer (0–100)", desc: "How credible and objective the content is" },
  { field: "biasLevel", type: "integer (0–100)", desc: "Degree of political or ideological bias detected" },
  { field: "riskLevel", type: '"Low" | "Medium" | "High"', desc: "Overall propaganda risk tier" },
  { field: "threatClassification", type: "string", desc: "e.g. 'Information Manipulation', 'Fear Mongering'" },
  { field: "techniques", type: "string[]", desc: "Named propaganda tactics found in the text" },
  { field: "flaggedPhrases", type: "string[]", desc: "Exact substrings exhibiting manipulation" },
  { field: "explanation", type: "string", desc: "Detailed intelligence-style narrative report" },
];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: 48 }}>
        <div className="badge badge-purple" style={{ marginBottom: 12 }}>
          <Brain size={12} /> How It Works
        </div>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>
          The Technology Behind <span style={{ color: "var(--neon-blue)" }}>PropagandaShield</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.8, maxWidth: 680 }}>
          PropagandaShield combines state-of-the-art large language model reasoning with optical character recognition to deliver real-time information integrity analysis.
        </p>
      </div>

      {/* ─── PROCESS STEPS ─── */}
      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: 28, letterSpacing: "-0.02em" }}>Analysis Pipeline</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {STEPS.map(({ num, icon: Icon, color, title, desc }, i) => (
            <div key={title} style={{ display: "flex", gap: 0, position: "relative" }}>
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div style={{
                  position: "absolute",
                  left: 28,
                  top: 56,
                  width: 2,
                  height: "calc(100% - 20px)",
                  background: "var(--border)",
                }} />
              )}
              <div style={{ width: 56, flexShrink: 0, display: "flex", alignItems: "flex-start", paddingTop: 20 }}>
                <div style={{
                  width: 44, height: 44,
                  borderRadius: "50%",
                  background: `rgba(0,0,0,0.5)`,
                  border: `2px solid ${color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 0 16px ${color}33`,
                  flexShrink: 0,
                }}>
                  <Icon size={18} style={{ color }} />
                </div>
              </div>
              <div className="card" style={{ flex: 1, padding: "20px 24px", marginBottom: 12, marginLeft: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>{num}</span>
                  <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{title}</h3>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── JSON SCHEMA ─── */}
      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: 8, letterSpacing: "-0.02em" }}>
          <Code2 size={18} style={{ display: "inline", marginRight: 8, verticalAlign: "middle", color: "var(--neon-blue)" }} />
          Structured AI Response Schema
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 20 }}>
          The Gemini API is instructed to return strictly-typed JSON. No free-form text — every field is enforced via a response schema.
        </p>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.3)" }}>
                  {["Field", "Type", "Description"].map(h => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FIELDS.map(({ field, type, desc }, i) => (
                  <tr key={field} style={{ borderBottom: i < FIELDS.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--neon-blue)" }}>{field}</td>
                    <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--neon-purple)" }}>{type}</td>
                    <td style={{ padding: "14px 20px", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── FALLBACK ─── */}
      <section style={{ marginBottom: 64 }}>
        <div className="card card-glow-blue" style={{ padding: "28px 32px" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <Zap size={18} style={{ color: "var(--neon-yellow)" }} />
            Demo Fallback Mode
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
            If no Gemini API key is configured (or the API is unavailable), the system falls back to a pre-built mock response. This ensures the dashboard always displays a complete analysis — perfect for demos, hackathon presentations, or offline environments. Set your key via the <code style={{ fontFamily: "var(--font-mono)", color: "var(--neon-blue)", background: "rgba(0,180,245,0.1)", padding: "2px 6px", borderRadius: 4 }}>GEMINI_API_KEY</code> environment variable in <code style={{ fontFamily: "var(--font-mono)", color: "var(--neon-blue)", background: "rgba(0,180,245,0.1)", padding: "2px 6px", borderRadius: 4 }}>.env.local</code>.
          </p>
        </div>
      </section>

      {/* ─── TECH STACK ─── */}
      <section>
        <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: 20, letterSpacing: "-0.02em" }}>Tech Stack</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { name: "Next.js 16 (App Router)", role: "Framework", color: "badge-blue" },
            { name: "Google Gemini 2.5 Pro", role: "AI / LLM", color: "badge-purple" },
            { name: "Tesseract.js", role: "OCR", color: "badge-green" },
            { name: "Vanilla CSS", role: "Styling", color: "badge-yellow" },
            { name: "TypeScript", role: "Language", color: "badge-blue" },
            { name: "Lucide Icons", role: "UI Icons", color: "badge-red" },
          ].map(({ name, role, color }) => (
            <div key={name} className="card" style={{ padding: "18px 20px" }}>
              <span className={`badge ${color}`} style={{ marginBottom: 10, display: "inline-flex" }}>{role}</span>
              <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
