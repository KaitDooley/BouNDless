"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Entry = {
  name: string;
  amount: number;
  donorType: string;
};

type Filter = "All" | "Individual" | "Business";

export default function LeaderboardPage() {
  const [rawEntries, setRawEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("All");

  useEffect(() => {
    // Real-time listener for the leaderboard collection
    const q = collection(db, "leaderboard");
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => d.data() as Entry);
      setRawEntries(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Aggregation Logic
  const getSortedLeaderboard = () => {
    // 1. Filter by type
    const filtered = filter === "All" 
      ? rawEntries 
      : rawEntries.filter(e => e.donorType === filter);

    // 2. Group by Name
    const totals: Record<string, { name: string, amount: number, type: string }> = {};
    filtered.forEach((entry) => {
      const name = entry.name.trim();
      if (!totals[name]) {
        totals[name] = { name, amount: 0, type: entry.donorType || "Individual" };
      }
      totals[name].amount += Number(entry.amount || 0);
    });

    // 3. Convert to array and sort
    return Object.values(totals).sort((a, b) => b.amount - a.amount);
  };

  const entries = getSortedLeaderboard();
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <main style={{ fontFamily: "Georgia, serif", background: "#F5F0E8", minHeight: "100vh", color: "#1C1C1A" }}>
      
      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
        <Link href="/" style={{ fontSize: "1.3rem", fontWeight: 700, textDecoration: "none", color: "#1C1C1A" }}>boundless</Link>
        <Link href="/connect" style={{ fontSize: "0.9rem", color: "#8A7B5C", textDecoration: "none", fontWeight: 600 }}>← Get Connected</Link>
      </nav>

      <section style={{ maxWidth: "700px", margin: "0 auto", padding: "4rem 2rem" }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 400, margin: "0 0 1rem" }}>The Leaderboard</h1>
          <p style={{ color: "#8A7B5C", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
            Recognizing the individuals and businesses fueling our local food banks.
          </p>
        </div>

        {/* TABS FOR SPLITTING BUSINESS VS INDIVIDUAL */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", background: "#E8E2D5", borderRadius: "2rem", padding: "0.25rem" }}>
          {(["All", "Individual", "Business"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                flex: 1,
                padding: "0.7rem",
                borderRadius: "2rem",
                border: "none",
                cursor: "pointer",
                transition: "0.2s",
                fontFamily: "Georgia",
                background: filter === f ? "#1C1C1A" : "transparent",
                color: filter === f ? "#F5F0E8" : "#8A7B5C"
              }}
            >{f}</button>
          ))}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: "#8A7B5C" }}>Syncing rankings...</p>
        ) : entries.length === 0 ? (
          <p style={{ textAlign: 'center', color: "#8A7B5C", padding: '3rem', background: '#FFF', borderRadius: '1rem' }}>No donations logged in this category yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {entries.map((entry, i) => (
              <div
                key={entry.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  padding: "1.2rem 1.5rem",
                  background: "#FFF",
                  borderRadius: "1rem",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  border: i < 3 ? "1px solid #E8E2D5" : "1px solid transparent"
                }}
              >
                <span style={{ fontSize: "1.2rem", minWidth: "2rem" }}>
                  {i < 3 ? medals[i] : <span style={{ color: '#AAA', fontSize: '0.9rem' }}>{i + 1}</span>}
                </span>
                
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 500 }}>{entry.name}</span>
                  <span style={{ fontSize: '0.65rem', color: '#8A7B5C', marginLeft: '10px', textTransform: 'uppercase', background: '#F5F0E8', padding: '2px 6px', borderRadius: '4px' }}>
                    {entry.type}
                  </span>
                </div>

                <span style={{ fontSize: "1.1rem", color: "#C16B3A", fontWeight: 700 }}>
                  {entry.amount.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>lbs</span>
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <Link
            href="/donor"
            style={{ background: "#C16B3A", color: "#fff", padding: "1rem 2.5rem", borderRadius: "3rem", textDecoration: "none", fontSize: "1rem", fontWeight: 600, boxShadow: '0 4px 15px rgba(193, 107, 58, 0.3)' }}
          >
            Join the impact →
          </Link>
        </div>
      </section>
    </main>
  );
}
