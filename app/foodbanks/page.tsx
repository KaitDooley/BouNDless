"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

type Tab = "requests" | "donations" | "volunteers";

export default function FoodbankDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("requests");
  const [user, setUser] = useState<any>(null);

  // Form States
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [donor, setDonor] = useState("");
  const [amount, setAmount] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorType, setDonorType] = useState("Individual"); 
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [spots, setSpots] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const resetMessages = () => { setSuccess(""); setError(""); };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const submitRequest = async () => {
    if (!item || !quantity || !category) { setError("Please fill out all fields."); return; }
    if (!user) return;
    setLoading(true); resetMessages();
    try {
      await addDoc(collection(db, "requests"), {
        item,
        quantity: Number(quantity),
        quantityFulfilled: 0,
        category,
        foodbankId: user.uid,
        status: "open",
        createdAt: serverTimestamp(),
      });
      setSuccess("Request posted successfully.");
      setItem(""); setQuantity(""); setCategory("");
    } catch (e) { setError("Failed to post request."); }
    setLoading(false);
  };

  const submitDonation = async () => {
    if (!donor || !amount) { setError("Please fill out all fields."); return; }
    if (!user) return;
    setLoading(true); resetMessages();
    try {
      await addDoc(collection(db, "donations"), {
        donor,
        donorEmail,
        amount: Number(amount),
        donorType,
        foodbankId: user.uid,
        loggedAt: serverTimestamp(),
      });
      await addDoc(collection(db, "leaderboard"), {
        name: donor,
        amount: Number(amount),
        donorType,
        foodbankId: user.uid,
        timestamp: serverTimestamp(),
      });
      setSuccess(`Donation logged for ${donor}!`);
      setDonor(""); setAmount(""); setDonorEmail("");
    } catch (e) { setError("Failed to log donation."); }
    setLoading(false);
  };

  const submitVolunteer = async () => {
    if (!date || !time || !spots) { setError("Please fill out all fields."); return; }
    if (!user) return;
    setLoading(true); resetMessages();
    try {
      await addDoc(collection(db, "volunteerSlots"), {
        date,
        time,
        spots: Number(spots),
        description,
        foodbankId: user.uid,
        createdAt: serverTimestamp(),
      });
      setSuccess("Volunteer slot added successfully.");
      setDate(""); setTime(""); setSpots(""); setDescription("");
    } catch (e) { setError("Failed to add slot."); }
    setLoading(false);
  };

  if (!user) return <div style={{ padding: "2rem", textAlign: "center", fontFamily: "Georgia" }}>Loading...</div>;

  return (
    <main style={{ fontFamily: "Georgia, serif", background: "#F5F0E8", minHeight: "100vh", color: "#1C1C1A" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
        <Link href="/" style={{ fontSize: "1.3rem", fontWeight: 700, textDecoration: "none", color: "#1C1C1A" }}>boundless</Link>
        <button onClick={handleLogout} style={secondaryBtn}>Log Out</button>
      </nav>

      <section style={{ maxWidth: "560px", margin: "0 auto", padding: "4rem 2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 400, margin: "0 0 0.5rem" }}>Dashboard</h1>
        <p style={{ color: "#555", marginBottom: "2.5rem" }}>Manage your needs and donor impacts.</p>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", background: "#E8E2D5", borderRadius: "2rem", padding: "0.25rem" }}>
          {(["requests", "donations", "volunteers"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); resetMessages(); }}
              style={{
                ...tabBtn,
                background: tab === t ? "#1C1C1A" : "transparent",
                color: tab === t ? "#F5F0E8" : "#888",
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ background: "#FFF", padding: "2rem", borderRadius: "1.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          {tab === "requests" && (
            <>
              <div style={fieldGroup}><label style={label}>Item Name</label><input value={item} onChange={(e) => setItem(e.target.value)} placeholder="e.g. Canned Tomatoes" style={input} /></div>
              <div style={fieldGroup}>
                <label style={label}>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={input}>
                  <option value="">Select category</option>
                  <option>Canned Goods</option><option>Produce</option><option>Dairy</option><option>Grains</option><option>Protein</option><option>Other</option>
                </select>
              </div>
              <div style={fieldGroup}><label style={label}>Quantity Needed</label><input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" style={input} /></div>
              <button onClick={submitRequest} disabled={loading} style={btn}>{loading ? "Posting..." : "Post Request"}</button>
            </>
          )}

          {tab === "donations" && (
            <>
              <div style={fieldGroup}>
                <label style={label}>Donor Type</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["Individual", "Business"].map(type => (
                    <button key={type} onClick={() => setDonorType(type)} style={{ ...filterBtn, flex: 1, background: donorType === type ? "#1C1C1A" : "transparent", color: donorType === type ? "#FFF" : "#555" }}>{type}</button>
                  ))}
                </div>
              </div>
              <div style={fieldGroup}><label style={label}>Donor Name</label><input value={donor} onChange={(e) => setDonor(e.target.value)} placeholder="" style={input} /></div>
              <div style={fieldGroup}><label style={label}>Amount (lbs)</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" style={input} /></div>
              <button onClick={submitDonation} disabled={loading} style={btn}>{loading ? "Logging..." : "Log Donation"}</button>
            </>
          )}

          {tab === "volunteers" && (
            <>
              <div style={fieldGroup}>
                <label style={label}>Date & Time</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={input} />
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={input} />
                </div>
              </div>
              <div style={fieldGroup}><label style={label}>Spots Available</label><input type="number" value={spots} onChange={(e) => setSpots(e.target.value)} placeholder="10" style={input} /></div>
              <div style={fieldGroup}><label style={label}>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ ...input, resize: "none" }} /></div>
              <button onClick={submitVolunteer} disabled={loading} style={btn}>{loading ? "Saving..." : "Add Slot"}</button>
            </>
          )}

          {error && <p style={errorStyle}>{error}</p>}
          {success && <p style={successStyle}>{success}</p>}
        </div>
      </section>
    </main>
  );
}

const fieldGroup = { marginBottom: "1.25rem" };
const label: React.CSSProperties = { display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "#8A7B5C", marginBottom: "0.4rem" };
const input: React.CSSProperties = { width: "100%", padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid #DDD", outline: "none" };
const btn: React.CSSProperties = { width: "100%", padding: "1rem", background: "#1C1C1A", color: "#FFF", border: "none", borderRadius: "2rem", cursor: "pointer", marginTop: "1rem" };
const tabBtn: React.CSSProperties = { flex: 1, padding: "0.6rem", borderRadius: "2rem", border: "none", fontSize: "0.85rem", cursor: "pointer" };
const filterBtn: React.CSSProperties = { padding: "0.5rem", borderRadius: "2rem", border: "1px solid #DDD", cursor: "pointer", fontSize: "0.8rem" };
const secondaryBtn: React.CSSProperties = { background: "none", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "2rem", padding: "0.4rem 1rem", cursor: "pointer" };
const errorStyle: React.CSSProperties = { color: "#C16B3A", marginTop: "1rem", textAlign: "center" };
const successStyle: React.CSSProperties = { color: "#5A8F69", marginTop: "1rem", textAlign: "center" };
