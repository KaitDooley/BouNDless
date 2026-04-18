"use client";

import { useState } from "react";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");


const handleSubmit = async () => {
  if (!name || !email || !message) {
    setError("Please fill out all fields.");
    return;
  }
  setError("");
  setLoading(true);

  // debug — remove once working
  console.log("SERVICE_ID:", SERVICE_ID);
  console.log("TEMPLATE_ID:", TEMPLATE_ID);
  console.log("PUBLIC_KEY:", PUBLIC_KEY);

  try {
    emailjs.init(PUBLIC_KEY);

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        name: name,
        email: email,
        message: message,
      }
    );

    console.log("EmailJS result:", result);

    await addDoc(collection(db, "contactMessages"), {
      name,
      email,
      message,
      sentAt: serverTimestamp(),
    });

    setSubmitted(true);
  } catch (e: any) {
    console.error("EmailJS error status:", e?.status);
    console.error("EmailJS error text:", e?.text);
    console.error("Full error:", JSON.stringify(e));
    setError("Something went wrong. Please try again.");
  }

  setLoading(false);
};


  if (submitted) {
    return (
      <main style={{ fontFamily: "Georgia, serif", background: "#F5F0E8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 400, marginBottom: "1rem" }}>Message sent.</h1>
          <p style={{ color: "#555", marginBottom: "2rem" }}>We'll get back to you as soon as we can.</p>
          <Link href="/" style={{ color: "#C16B3A", textDecoration: "none", borderBottom: "1px solid #C16B3A" }}>← Back to home</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ fontFamily: "Georgia, serif", background: "#F5F0E8", minHeight: "100vh", color: "#1C1C1A" }}>

      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
        <Link href="/" style={{ fontSize: "1.3rem", fontWeight: 700, textDecoration: "none", color: "#1C1C1A" }}>bouNDless</Link>
        <Link href="/" style={{ fontSize: "0.9rem", color: "#555", textDecoration: "none" }}>← Back</Link>
      </nav>

      {/* FORM */}
      <section style={{ maxWidth: "480px", margin: "0 auto", padding: "5rem 2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 400, margin: "0 0 0.75rem" }}>Contact Us.</h1>
        <p style={{ color: "#555", marginBottom: "2.5rem", lineHeight: 1.7 }}>
          Have a question or want to get involved? Send us a message and we'll get back to you shortly.
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

        {/* MESSAGE */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={label}>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder=""
            rows={5}
            style={{ ...input, resize: "vertical" }}
          />
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
          {loading ? "Sending..." : "Send Message"}
        </button>

        <p style={{ fontSize: "0.75rem", color: "#999", textAlign: "center", marginTop: "1rem" }}>
          We typically respond within 24 hours.
        </p>
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
