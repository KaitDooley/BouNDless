"use client";

import Link from "next/link";

export default function WaitingPage() {
  return (
    <main style={{ fontFamily: "Georgia, serif", background: "#F5F0E8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 400, marginBottom: "1rem" }}>You're on the list.</h1>
        <p style={{ color: "#555", lineHeight: 1.7, marginBottom: "2rem" }}>
          Your food bank account is pending approval. We'll review your registration and be in touch shortly. Once approved you'll be able to log in and post requests.
        </p>
        <Link href="/" style={{ color: "#C16B3A", textDecoration: "none", borderBottom: "1px solid #C16B3A", fontSize: "0.9rem" }}>
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
