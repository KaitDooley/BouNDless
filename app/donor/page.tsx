"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Tab = "requests" | "volunteers" | "leaderboard";
type DonorFilter = "All" | "Individual" | "Business";

export default function DonorPage() {
  const [tab, setTab] = useState<Tab>("requests");
  const [loading, setLoading] = useState(true);
  
  const [requests, setRequests] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [fbNames, setFbNames] = useState<Record<string, string>>({});
  
  const [category, setCategory] = useState("All");
  const [leadFilter, setLeadFilter] = useState<DonorFilter>("All");

  useEffect(() => {
    // Food Bank Names
    const unsubUsers = onSnapshot(query(collection(db, "users"), where("role", "==", "foodbank")), (snap) => {
      const names: any = {};
      snap.docs.forEach(d => names[d.id] = d.data().name);
      setFbNames(names);
    });

    // Live Requests
    const unsubReq = onSnapshot(query(collection(db, "requests"), where("status", "==", "open")), (snap) => {
      setRequests(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      setLoading(false);
    });

    // Live Volunteers
    const unsubVol = onSnapshot(query(collection(db, "volunteerSlots"), orderBy("date", "asc")), (snap) => {
      setVolunteers(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });

    // Live Leaderboard
    const unsubLead = onSnapshot(collection(db, "leaderboard"), (snap) => {
      setLeaderboard(snap.docs.map(d => d.data()));
    });

    return () => {
      unsubUsers();
      unsubReq();
      unsubVol();
      unsubLead();
    };
  }, []);

  const getFilteredLeaderboard = () => {
    const filtered = leadFilter === "All" ? leaderboard : leaderboard.filter(e => e.donorType === leadFilter);
    const agg = filtered.reduce((acc: any, curr: any) => {
      if (!acc[curr.name]) acc[curr.name] = { name: curr.name, amount: 0, type: curr.donorType || "Individual" };
      acc[curr.name].amount += curr.amount;
      return acc;
    }, {});
    return Object.values(agg).sort((a: any, b: any) => b.amount - a.amount);
  };

  return (
    <main style={{ fontFamily: "Georgia, serif", background: "#F5F0E8", minHeight: "100vh", color: "#1C1C1A" }}>
      <nav style={{ padding: "1.5rem 2rem", borderBottom: "1px solid rgba(0,0,0,0.1)", display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontSize: "1.3rem", fontWeight: 700, textDecoration: "none", color: "#1C1C1A" }}>boundless</Link>
        <Link href="/login" style={{ textDecoration: 'none', color: '#555', fontSize: '0.9rem' }}>Food Bank Login</Link>
      </nav>

      <section style={{ maxWidth: "850px", margin: "0 auto", padding: "4rem 2rem" }}>
        {/* NEW TEXT ADDED HERE */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 400, marginBottom: "0.5rem" }}>Giving back to those in need.</h1>
          <p style={{ color: "#8A7B5C", fontStyle: "italic" }}>
            Help fulfill food requests, find volunteer opprotunities, view the donation leaderboard.
          </p>
        </div> 
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", background: "#E8E2D5", borderRadius: "2rem", padding: "0.25rem" }}>
          {(["requests", "volunteers", "leaderboard"] as Tab[]).map((t) => (
            <button 
              key={t} 
              onClick={() => setTab(t)} 
              style={{ 
                ...tabBtn, 
                background: tab === t ? "#1C1C1A" : "transparent", 
                color: tab === t ? "#F5F0E8" : "#888" 
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {loading ? <p style={{ textAlign: 'center' }}>Syncing with Community...</p> : (
          <>
            {/* REQUESTS VIEW */}
            {tab === "requests" && (
              <div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                  {["All", "Canned Goods", "Produce", "Dairy", "Protein", "Grains", "Other"].map(c => (
                    <button key={c} onClick={() => setCategory(c)} style={{ ...filterBtn, background: category === c ? "#1C1C1A" : "transparent", color: category === c ? "#FFF" : "#555" }}>{c}</button>
                  ))}
                </div>

                {requests.filter(r => category === "All" || r.category === category).map(req => (
                  <div key={req.id} style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={miniLabel}>{req.category}</span>
                      <span style={{ fontSize: '0.7rem', color: '#C16B3A' }}>📍 {fbNames[req.foodbankId] || "Bank"}</span>
                    </div>
                    <h3 style={{ margin: "0.5rem 0", fontWeight: 400 }}>{req.item}</h3>
                    <div style={progressContainer}><div style={{ ...progressFill, width: `${(req.quantityFulfilled/req.quantity)*100}%` }} /></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span>{req.quantityFulfilled} / {req.quantity} lbs</span>
                      <Link href="/get-connected" style={{ color: '#1C1C1A', fontWeight: 600 }}>I Can Help →</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VOLUNTEERS VIEW */}
            {tab === "volunteers" && (
              <VolunteerCalendar slots={volunteers} fbNames={fbNames} />
            )}

            {/* LEADERBOARD VIEW */}
            {tab === "leaderboard" && (
              <div style={card}>
                <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
                  {["All", "Individual", "Business"].map((f) => (
                    <button key={f} onClick={() => setLeadFilter(f as DonorFilter)} style={{ ...filterBtn, background: leadFilter === f ? "#1C1C1A" : "transparent", color: leadFilter === f ? "#FFF" : "#555" }}>{f}</button>
                  ))}
                </div>
                {getFilteredLeaderboard().map((entry: any, i) => (
                  <div key={entry.name} style={{ display: "flex", justifyContent: "space-between", padding: "1rem 0", borderBottom: "1px solid #EEE" }}>
                    <span>
                      <span style={{ color: "#AAA", marginRight: "1rem" }}>#{i+1}</span> 
                      {entry.name} 
                      <span style={{ fontSize: '0.65rem', color: '#8A7B5C', marginLeft: '8px', textTransform: 'uppercase' }}>
                        ({entry.type})
                      </span>
                    </span>
                    <span style={{ fontWeight: 600 }}>{entry.amount.toLocaleString()} lbs</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

// Calendar Component
function VolunteerCalendar({ slots, fbNames }: { slots: any[], fbNames: any }) {
  // 1. State to track which month is currently being viewed
  const [viewDate, setViewDate] = useState(new Date());

  // 2. Navigation logic
  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  
  // 3. Filter and Group slots by date (only for the month in view)
  const slotsByDate = slots.reduce((acc: any, s) => {
    const sDate = new Date(s.date + "T00:00:00"); // Parse as local time
    
    if (sDate.getMonth() === viewDate.getMonth() && sDate.getFullYear() === viewDate.getFullYear()) {
      if (!acc[s.date]) acc[s.date] = [];
      acc[s.date].push(s);
      acc[s.date].sort((a: any, b: any) => a.time.localeCompare(b.time));
    }
    return acc;
  }, {});

  return (
    <div style={{ background: "#FFF", padding: "1.5rem", borderRadius: "1.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      {/* HEADER & CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: '#1C1C1A' }}>
          {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => changeMonth(-1)} style={navBtn}>←</button>
          <button onClick={() => setViewDate(new Date())} style={{ ...navBtn, width: 'auto', padding: '0 0.8rem', fontSize: '0.7rem' }}>Today</button>
          <button onClick={() => changeMonth(1)} style={navBtn}>→</button>
        </div>
      </div>
      
      {/* CALENDAR GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "#EEE", gap: '1px', border: '1px solid #EEE', borderRadius: '8px', overflow: 'hidden' }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} style={{ background: "#F9F9F7", padding: "0.5rem", fontSize: "0.7rem", textAlign: 'center', fontWeight: 700, color: '#8A7B5C' }}>{d}</div>
        ))}
        
        {/* Fill empty start days */}
        {[...Array(start)].map((_, i) => <div key={`empty-${i}`} style={{ background: "#FFF" }} />)}
        
        {/* Render actual days */}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const dStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth()+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          return (
            <div key={i} style={{ background: "#FFF", minHeight: "100px", padding: "0.4rem", display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: "0.7rem", color: "#CCC", marginBottom: '4px' }}>{day}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {slotsByDate[dStr]?.map((s: any) => (
                  <div key={s.id} style={{ fontSize: '0.6rem', background: '#F5F0E8', padding: '4px', borderRadius: '4px', border: '1px solid #E8E2D5', lineHeight: '1.2' }}>
                    <strong>{s.time}</strong><br/>
                    <span style={{ color: '#C16B3A', fontSize: '0.55rem' }}>{fbNames[s.foodbankId] || "Bank"}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper Style for Navigation Buttons
const navBtn: React.CSSProperties = { 
  background: "#FFF", 
  border: "1px solid #DDD", 
  borderRadius: "2rem", 
  width: "32px", 
  height: "32px", 
  cursor: "pointer", 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  color: '#555',
  transition: '0.2s'
};



const card: React.CSSProperties = { background: "#FFF", padding: "1.5rem", borderRadius: "1rem", marginBottom: "1rem" };
const miniLabel: React.CSSProperties = { fontSize: "0.6rem", letterSpacing: "0.1em", color: "#8A7B5C", fontWeight: 700, textTransform: 'uppercase' };
const progressContainer = { height: "6px", background: "#EEE", borderRadius: "3px", margin: "1rem 0" };
const progressFill = { height: "100%", background: "#5A8F69", borderRadius: "3px", transition: 'width 0.3s ease' };
const tabBtn: React.CSSProperties = { flex: 1, padding: "0.6rem", borderRadius: "2rem", border: "none", cursor: "pointer", fontFamily: 'Georgia', transition: '0.2s' };
const filterBtn: React.CSSProperties = { padding: "0.4rem 0.8rem", borderRadius: "2rem", border: "1px solid #DDD", cursor: "pointer", fontSize: '0.75rem', transition: '0.2s' };
