"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole: string }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.push("/register");          // not logged in
    if (role === "foodbank" && !verified) router.push("/pending-approval");     // registed, awaiting verification
    if (role !== requiredRole) router.push("/");  // wrong role
  }, [user, role, loading]);

  if (loading) return <p>Loading...</p>;
  return <>{children}</>;
}
