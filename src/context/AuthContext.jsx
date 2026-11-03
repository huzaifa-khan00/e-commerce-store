import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { checkIsAdmin } from "../services/authService";

export const AuthContext = createContext(null);

// Tracks who is signed in and whether they are the admin.
// `loading` stays true until both checks finish, so pages never flash the wrong screen.
export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    isAdmin: false,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ user: null, isAdmin: false, loading: false });
        return;
      }
      setState((s) => ({ ...s, user, loading: true }));
      let isAdmin = false;
      try {
        isAdmin = await checkIsAdmin(user.uid);
      } catch (err) {
        console.error("Admin check failed:", err);
      }
      setState({ user, isAdmin, loading: false });
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}