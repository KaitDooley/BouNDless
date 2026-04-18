"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        setRole(snap.data()?.role ?? null);
      } else {
        setRole(null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
