import Link from "next/link";
import { Shield, Scan, Zap, Eye, Brain, AlertTriangle, ChevronRight, TrendingUp, Globe, Lock } from "lucide-react";

const STATS = [
  { value: "98.4%", label: "Detection Accuracy", icon: TrendingUp },
  { value: "6", label: "Threat Vectors Covered", icon: Shield },
  { value: "<2s", label: "Analysis Speed", icon: Zap },
  { value: "12+", label: "Languages Supported", icon: Globe },
];

const FEATURES = [
  {
    icon: Brain,
    color: "var(--neon-blue)",
    title: "AI-Powered Detection",
    desc: "Gemini 2.5 Pro analyzes language patterns, emotional triggers, and rhetorical devices to identify propaganda with high precision.",
  },
  {
    icon: Eye,
    color: "var(--neon-purple)",
    title: "Phrase-Level Highlighting",
    desc: "Suspicious phrases are highlighted directly in your text, giving you an explainable, transparent view of the AI's reasoning.",
  },
  {
    icon: AlertTriangle,
    color: "var(--neon-red)",
    title: "Threat Classification",
    desc: "Classifies content into threat categories: Information Manipulation, Psychological Influence, State Propaganda, Fear Mongering, and more.",
  },
  {
    icon: Scan,
    color: "var(--neon-green)",
    title: "OCR Screenshot Scan",
    desc: "Upload a screenshot of any tweet, headline, or post. Tesseract OCR extracts the text, then our AI analyzes it instantly.",
  },
  {
    icon: Lock,
    color: "var(--neon-yellow)",
    title: "Bias & Credibility Scoring",
    desc: "Every analysis includes a Credibility Score (0–100) and a Bias Level indicator, giving quantitative insight at a glance.",
  },
  {
    icon: Globe,
    color: "var(--neon-blue)",
    title: "Multi-Source Ready",
    desc: "Works on tweets, Facebook posts, WhatsApp forwards, news headlines, and any text-based content you paste.",
  },
];

const TECHNIQUES = [
  "Fear Appeal", "Bandwagon", "Loaded Language", "Ad Hominem",
  "False Dichotomy", "Scapegoating", "Glittering Generalities", "Card Stacking",
  "Emotional Appeal", "Urgency Manipulation", "Name Calling", "Plain Folks",
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", overflow: "hidden" }}>

      {/* ─── HERO ─────────────────────────────────────── */}
      <section style={{ position: "relative", padding: "100px 32px 80px", textAlign: "center", maxWidth: 1100, margin: "0 auto" }}>
        {/* Glow orbs */}
        <div style={{ position: "absolute", top: -100, left: "10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(0,180,245,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 50, right: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="badge badge-blue" style={{ marginBottom: 24, fontSize: "0.7rem" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--neon-blue)", display: "inline-block" }}></span>
          AI-Powered Misinformation Detection • Powered by Gemini 2.5 Pro
        </div>

        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          marginBottom: 24,
          background: "linear-gradient(135deg, #f0f4f8 30%, var(--neon-blue) 70%, var(--neon-purple) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Unmask Propaganda.<br />Defend the Truth.
        </h1>

        <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Paste any social media post or upload a screenshot.
          Our AI detects <strong style={{ color: "var(--text-primary)" }}>misinformation</strong>, {" "}
          <strong style={{ color: "var(--text-primary)" }}>propaganda techniques</strong>, and {" "}
          <strong style={{ color: "var(--text-primary)" }}>emotional manipulation</strong> in seconds.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/scanner" className="btn-primary" style={{ fontSize: "1rem", padding: "16px 36px" }}>
            <Scan size={18} /> Start Scanning
          </Link>
          <Link href="/about" className="btn-ghost" style={{ padding: "16px 28px" }}>
            How It Works <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────── */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="card card-glow-blue" style={{ padding: "28px 24px", textAlign: "center" }}>
              <Icon size={20} style={{ color: "var(--neon-blue)", marginBottom: 12 }} />
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--neon-blue)", fontFamily: "var(--font-mono)", marginBottom: 6 }}>{value}</div>
              <div className="label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LIVE DEMO PREVIEW ────────────────────────── */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div className="card card-glow-red" style={{ padding: "32px", background: "rgba(255,62,108,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <AlertTriangle size={18} style={{ color: "var(--neon-red)" }} />
            <span className="label" style={{ color: "var(--neon-red)" }}>Live Detection Example — High Risk</span>
          </div>
          <div style={{
            background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 20, fontFamily: "var(--font-sans)",
            fontSize: "0.95rem", lineHeight: 2, color: "#cdd6e0", border: "1px solid rgba(255,255,255,0.06)"
          }}>
            <span>The </span>
            <span className="flagged">mainstream media is LYING to you</span>
            <span> and the government </span>
            <span className="flagged">doesn&apos;t want you to know</span>
            <span> the truth! This is </span>
            <span className="flagged">the biggest cover-up in history</span>
            <span>. </span>
            <span className="flagged">WAKE UP before it&apos;s too late!</span>
            <span> Share this before it gets deleted!!!</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <span className="badge badge-red">Fear Appeal</span>
            <span className="badge badge-red">Urgency Manipulation</span>
            <span className="badge badge-red">Conspiracy Framing</span>
            <span className="badge badge-yellow">Credibility: 12/100</span>
            <span className="badge badge-red">Risk: HIGH</span>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────── */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>
            What We Detect
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>Six dimensions of information warfare, analyzed in real time.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {FEATURES.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="card" style={{ padding: "28px" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `rgba(${color === "var(--neon-blue)" ? "0,180,245" : color === "var(--neon-purple)" ? "168,85,247" : color === "var(--neon-red)" ? "255,62,108" : color === "var(--neon-green)" ? "0,255,163" : "255,214,10"},0.12)`,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16
              }}>
                <Icon size={20} style={{ color }} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 10 }}>{title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TECHNIQUES TAG CLOUD ─────────────────────── */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8 }}>12+ Propaganda Techniques Identified</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: 32, fontSize: "0.9rem" }}>Our AI recognizes the full scope of manipulation tactics.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {TECHNIQUES.map((t, i) => (
            <span key={t} className={`badge ${["badge-blue","badge-purple","badge-red","badge-yellow","badge-green"][i % 5]}`} style={{ padding: "8px 14px", fontSize: "0.8rem" }}>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────── */}
      <section style={{ padding: "0 32px 100px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <div className="card card-glow-blue" style={{ padding: "60px 40px", background: "linear-gradient(135deg, rgba(0,180,245,0.06), rgba(168,85,247,0.06))" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Don&apos;t Let Propaganda <span style={{ color: "var(--neon-blue)" }}>Win.</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 32, fontSize: "1rem", lineHeight: 1.7 }}>
            Analyze any post, headline, or message in under 2 seconds with the power of Gemini AI.
          </p>
          <Link href="/scanner" className="btn-primary" style={{ fontSize: "1rem", padding: "16px 40px" }}>
            <Scan size={18} /> Open the Scanner
          </Link>
        </div>
      </section>
    </div>
  );
}
