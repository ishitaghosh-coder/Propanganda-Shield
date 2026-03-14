"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Scan, BookOpen, BarChart2, Zap } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Zap },
  { href: "/scanner", label: "Scanner", icon: Scan },
  { href: "/about", label: "How It Works", icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      background: "rgba(5,5,8,0.85)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      height: 64,
      display: "flex",
      alignItems: "center",
      padding: "0 32px",
      gap: 32,
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{
          width: 36, height: 36,
          background: "linear-gradient(135deg, #00b4f5, #a855f7)",
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Shield size={20} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: "1rem", color: "#f0f4f8", letterSpacing: "-0.02em" }}>
          Propaganda<span style={{ color: "var(--neon-blue)" }}>Shield</span>
        </span>
      </Link>

      <div style={{ display: "flex", gap: 4, marginLeft: 16, flex: 1 }}>
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`nav-link${pathname === href ? " active" : ""}`}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="badge badge-blue">
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--neon-blue)", display: "inline-block", animation: "glow-pulse 2s infinite" }}></span>
          LIVE
        </span>
        <Link href="/scanner" className="btn-primary" style={{ padding: "8px 18px", fontSize: "0.8rem" }}>
          <Scan size={14} /> Analyze
        </Link>
      </div>
    </nav>
  );
}
