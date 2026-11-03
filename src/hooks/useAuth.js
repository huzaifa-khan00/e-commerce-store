import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Returns { user, isAdmin, loading }.
export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}