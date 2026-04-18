"use client";

import { useState } from "react";
import Link from "next/link";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function GetConnectedPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !role) {
      setError("Please fill out all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await addDoc(collection(db, "emailList"), {
        name,
        email,
        role,
        joinedAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <main style={{ fontFamily: "Georgia, serif", background: "#F5F0E8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 400, marginBottom: "1rem" }}>You're on the list.</h1>
          <p style={{ color: "#555", marginBottom: "2rem" }}>We'll be in touch soon.</p>
          <Link href="/" style={{ color: "#C16B3A", textDecoration: "none", borderBottom: "1px solid #C16B3A" }}>← Back to home</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ fontFamily: "Georgia, serif", background: "#F5F0E8", minHeight: "100vh", color: "#1C1C1A" }}>

      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
        <Link href="/" style={{ fontSize: "1.3rem", fontWeight: 700, textDecoration: "none", color: "#1C1C1A" }}>boundless</Link>
        <Link href="/" style={{ fontSize: "0.9rem", color: "#555", textDecoration: "none" }}>← Back</Link>
      </nav>

      {/* FORM */}
      <section style={{ maxWidth: "480px", margin: "0 auto", padding: "5rem 2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 400, margin: "0 0 0.75rem" }}>Get Connected.</h1>
        <p style={{ color: "#555", marginBottom: "2.5rem", lineHeight: 1.7 }}>
          Join our email list and we'll keep you updated on ways to give, volunteer, and make an impact.
        </p>

        {/* NAME */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={label}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            style={input}
          />
        </div>

        {/* EMAIL */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            style={input}
          />
        </div>

        {/* ROLE */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={label}>I am a...</label>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {["Donor", "Volunteer", "Recipient"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "2rem",
                  border: "1.5px solid",
                  borderColor: role === r ? "#C16B3A" : "rgba(0,0,0,0.15)",
                  background: role === r ? "#C16B3A" : "transparent",
                  color: role === r ? "#fff" : "#555",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  fontFamily: "Georgia, serif",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* ERROR */}
        {error && <p style={{ color: "#C16B3A", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.9rem",
            background: "#1C1C1A",
            color: "#F5F0E8",
            border: "none",
            borderRadius: "2rem",
            fontSize: "1rem",
            fontFamily: "Georgia, serif",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Submitting..." : "Join the List"}
        </button>

      </section>

    </main>
  );
}

const label: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#8A7B5C",
  marginBottom: "0.5rem",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "0.85rem 1rem",
  borderRadius: "0.75rem",
  border: "1.5px solid rgba(0,0,0,0.12)",
  background: "#fff",
  fontSize: "0.95rem",
  fontFamily: "Georgia, serif",
  color: "#1C1C1A",
  outline: "none",
  boxSizing: "border-box",
};
