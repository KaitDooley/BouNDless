"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main style={{ fontFamily: "Georgia, serif", background: "#F5F0E8", minHeight: "100vh", color: "#1C1C1A" }}>
      
      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
        <span style={{ fontSize: "1.3rem", fontWeight: 700 }}>boundless</span>
        <Link href="/register" style={{ background: "#1C1C1A", color: "#F5F0E8", padding: "0.5rem 1.25rem", borderRadius: "2rem", textDecoration: "none", fontSize: "0.9rem" }}>
          Get Started
        </Link>
      </nav>

      {/* HERO */}
      <section style={{ padding: "8rem 2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "4rem", fontWeight: 400, margin: "0 0 1.5rem" }}>
          No one goes hungry alone.
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "2.5rem" }}>
          Connecting donors, food banks, and those in need.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link href="/donate" style={{ background: "#C16B3A", color: "#fff", padding: "0.85rem 2rem", borderRadius: "2rem", textDecoration: "none" }}>
            Donate Now
          </Link>
          <Link href="/map" style={{ border: "1.5px solid #1C1C1A", color: "#1C1C1A", padding: "0.85rem 2rem", borderRadius: "2rem", textDecoration: "none" }}>
            Find a Food Bank
          </Link>
        </div>
      </section>

      {/* THREE ROLES */}
      <section style={{ padding: "4rem 2rem", display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
        {[
          { title: "Donors", desc: "Browse requests and fund specific food bank needs.", href: "/donate" },
          { title: "Food Banks", desc: "Post what you need and track incoming donations.", href: "/register" },
          { title: "Recipients", desc: "Find nearby resources and request food delivery.", href: "/resources" },
        ].map((card) => (
          <div key={card.title} style={{ background: "#fff", borderRadius: "1rem", padding: "2rem", width: "260px", border: "1px solid rgba(0,0,0,0.08)" }}>
            <h3 style={{ margin: "0 0 0.75rem", fontSize: "1.2rem" }}>{card.title}</h3>
            <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1.25rem" }}>{card.desc}</p>
            <Link href={card.href} style={{ color: "#C16B3A", textDecoration: "none", fontSize: "0.85rem" }}>
              Learn more →
            </Link>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: "center", padding: "2rem", color: "#888", fontSize: "0.8rem", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        boundless © 2026
      </footer>

    </main>
  );
}
