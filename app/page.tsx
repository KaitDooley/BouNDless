"use client";

import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main style={{ fontFamily: "Georgia, serif", background: "#F5F0E8", minHeight: "100vh", color: "#1C1C1A" }}>

      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem", borderBottom: "1px solid rgba(0,0,0,0.1)", position: "relative" }}>
        <span style={{ fontSize: "1.3rem", fontWeight: 700 }}>boundless</span>

        {/* MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem", color: "#1C1C1A" }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* DROPDOWN MENU */}
        {menuOpen && (
          <div style={{
            position: "absolute",
            top: "100%",
            right: "2rem",
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "0.75rem",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            zIndex: 100,
            minWidth: "180px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}>
            <Link href="/donor" style={menuLink} onClick={() => setMenuOpen(false)}>For Donors</Link>
            <Link href="/recipient" style={menuLink} onClick={() => setMenuOpen(false)}>For Recipients</Link>
            <Link href="/leaderboard" style={menuLink} onClick={() => setMenuOpen(false)}>Leaderboard</Link>
            <Link href="/contact" style={menuLink} onClick={() => setMenuOpen(false)}>Contact Us</Link>
            <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.08)", margin: "0.25rem 0" }} />
            <Link href="/login" style={{ ...menuLink, color: "#C16B3A" }} onClick={() => setMenuOpen(false)}>Food Bank Login</Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ padding: "4rem 2rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
  
        <img
          src="/logo.jpg" 
          alt="Logo" 
          style={{ 
            maxWidth: "300px", // Don't let it take the whole screen width
            height: "auto",     // Keep aspect ratio
            margin: "0 auto 2rem",
            display: "block" 
          }}
        />
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 400, margin: "0 0 1.5rem", lineHeight: 1.1 }}>
          Our Mission.
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "3rem", maxWidth: "1000px", margin: "0 auto 3rem" }}>
          Our mission is to bridge the gap between South Bend’s generous supporters and those in need by force-multiplying the impact of every donation. We provide a streamlined network that makes giving more effective for donors and ensures fresh, nutritious food is accessible in convenient locations across our community.
        </p>

        {/* THREE ENTRY POINTS */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/recipient" style={{ border: "1.5px solid #1C1C1A", color: "#1C1C1A", padding: "0.85rem 2rem", borderRadius: "2rem", textDecoration: "none", fontSize: "0.95rem" }}>
            Learn More
          </Link>
          <Link href="/connect" style={{ background: "#C16B3A", color: "#fff", padding: "0.85rem 2rem", borderRadius: "2rem", textDecoration: "none", fontSize: "0.95rem" }}>
            Get Connected
          </Link>
        </div>
      </section>

      {/* ROLE CARDS */}
      <section style={{ padding: "4rem 2rem", display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
        {[
          { title: "Donors", desc: "Browse food bank requests and fund specific needs. Watch your impact grow on the leaderboard.", href: "/donor", color: "#C16B3A" },
          { title: "Recipients", desc: "Find nearby food banks, browse available resources, and request a food delivery.", href: "/recipient", color: "#5A8F69" },
        ].map((card) => (
          <div key={card.title} style={{ background: "#fff", borderRadius: "1rem", padding: "2rem", width: "260px", border: "1px solid rgba(0,0,0,0.08)" }}>
            <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: card.color, marginBottom: "1rem", opacity: 0.85 }} />
            <h3 style={{ margin: "0 0 0.75rem", fontSize: "1.2rem" }}>{card.title}</h3>
            <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1.25rem", lineHeight: 1.6 }}>{card.desc}</p>
            <Link href={card.href} style={{ color: card.color, textDecoration: "none", fontSize: "0.85rem", borderBottom: `1px solid ${card.color}`, paddingBottom: "0.1rem" }}>
              Learn more →
            </Link>
          </div>
        ))}
      </section>

      {/* CONTACT US FOOTER */}
      <footer style={{ background: "#1C1C1A", color: "#F5F0E8", padding: "4rem 2rem", marginTop: "4rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem" }}>
          <div>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", fontWeight: 400, margin: "0 0 0.5rem" }}>boundless</h3>
            <p style={{ color: "#8A7B5C", fontSize: "0.85rem", margin: 0 }}>Feeding communities, together.</p>
          </div>
          <div>
            <p style={{ fontSize: "0.8rem", color: "#8A7B5C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Contact Us</p>
            <p style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "0.5rem" }}>ifrancis@nd.edu</p>
            <p style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "0.5rem" }}>(858) 880-8477</p>
            <Link href="/contact" style={{ fontSize: "0.85rem", color: "#D4A853", textDecoration: "none", borderBottom: "1px solid #D4A853", paddingBottom: "0.1rem" }}>
              Send us a message →
            </Link>
          </div>
          <div>
            <p style={{ fontSize: "0.8rem", color: "#8A7B5C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Links</p>
            {[
              { label: "Leaderboard", href: "/leaderboard" },
              { label: "For Donors", href: "/donor" },
              { label: "For Recipients", href: "/recipient" },
              { label: "Food Bank Login", href: "/login" },
            ].map((link) => (
              <div key={link.label} style={{ marginBottom: "0.5rem" }}>
                <Link href={link.href} style={{ fontSize: "0.9rem", color: "#ccc", textDecoration: "none" }}>
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.08)", color: "#555", fontSize: "0.8rem" }}>
          boundless © 2026
        </div>
      </footer>

    </main>
  );
}

const menuLink: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#1C1C1A",
  textDecoration: "none",
  padding: "0.25rem 0.5rem",
  borderRadius: "0.375rem",
};
