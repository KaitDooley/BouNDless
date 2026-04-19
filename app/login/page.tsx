"use client";

import { useState } from "react";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginRegisterPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password || (mode === "register" && !name)) {
      setError("Please fill out all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", cred.user.uid), {
          name,
          email,
          role: "foodbank",
          verified: false,
          createdAt: serverTimestamp(),
        });
        router.push("/waiting");
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const userSnap = await getDoc(doc(db, "users", cred.user.uid));
        const userData = userSnap.data();
        if (!userData?.verified) {
          router.push("/waiting");
        } else {
          router.push("/foodbanks");
        }
      }
    } catch (e: any) {
      const code = e?.code;
      if (code === "auth/user-not-found") setError("No account found with that email.");
      else if (code === "auth/wrong-password") setError("Incorrect password.");
      else if (code === "auth/email-already-in-use") setError("An account with that email already exists.");
      else if (code === "auth/weak-password") setError("Password must be at least 6 characters.");
      else if (code === "auth/invalid-email") setError("Please enter a valid email address.");
      else if (code === "auth/invalid-credential") setError("Invalid email or password.");
      else setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <main style={{ fontFamily: "Georgia, serif", background: "#F5F0E8", minHeight: "100vh", color: "#1C1C1A" }}>

      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
        <Link href="/" style={{ fontSize: "1.3rem", fontWeight: 700, textDecoration: "none", color: "#1C1C1A" }}>boundless</Link>
        <Link href="/" style={{ fontSize: "0.9rem", color: "#555", textDecoration: "none" }}>← Back</Link>
      </nav>

      <section style={{ maxWidth: "440px", margin: "0 auto", padding: "5rem 2rem" }}>

        {/* TOGGLE */}
        <div style={{ display: "flex", background: "#E8E2D5", borderRadius: "2rem", padding: "0.25rem", marginBottom: "2.5rem" }}>
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1,
                padding: "0.6rem",
                borderRadius: "2rem",
                border: "none",
                background: mode === m ? "#1C1C1A" : "transparent",
                color: mode === m ? "#F5F0E8" : "#888",
                fontSize: "0.9rem",
                fontFamily: "Georgia, serif",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {m === "login" ? "Log In" : "Register"}
            </button>
          ))}
        </div>

        <h1 style={{ fontSize: "2.2rem", fontWeight: 400, margin: "0 0 0.5rem" }}>
          {mode === "login" ? "Welcome back." : "Create an account."}
        </h1>
        <p style={{ color: "#555", fontSize: "0.95rem", marginBottom: "2rem", lineHeight: 1.6 }}>
          {mode === "login"
            ? "Log in to manage your food bank's requests and tracking donations."
            : "Register your food bank to start posting requests and tracking donations."}
        </p>

        {/* NAME (register only) */}
        {mode === "register" && (
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={label}>Food Bank Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              style={input}
            />
          </div>
        )}

        {/* EMAIL */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="foodbank@email.com"
            style={input}
          />
        </div>

        {/* PASSWORD */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={input}
          />
          {mode === "register" && (
            <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "0.4rem" }}>
              Must be at least 6 characters.
            </p>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <p style={{ color: "#C16B3A", fontSize: "0.85rem", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

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
          {loading ? "Please wait..." : mode === "login" ? "Log In" : "Register"}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#888", marginTop: "1.5rem" }}>
          {mode === "login" ? "Don't have an account? " : "Already registered? "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            style={{ background: "none", border: "none", color: "#C16B3A", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "0.85rem", textDecoration: "underline" }}
          >
            {mode === "login" ? "Register here" : "Log in here"}
          </button>
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
