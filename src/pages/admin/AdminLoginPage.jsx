import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import AdminLoginForm from "../../components/admin/AdminLoginForm";
import useAuth from "../../hooks/useAuth";
import {
  authErrorMessage,
  loginAdmin,
  logoutAdmin,
} from "../../services/authService";

export default function AdminLoginPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Once signed in: admins go to the dashboard, anyone else is signed out again.
  useEffect(() => {
    if (loading || !user) return;
    if (isAdmin) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      logoutAdmin();
      setError("This account doesn't have admin access.");
    }
  }, [user, isAdmin, loading, navigate]);

  const handleLogin = async ({ email, password }) => {
    setError("");
    try {
      await loginAdmin(email, password);
    } catch (err) {
      setError(authErrorMessage(err.code));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-md items-center px-5">
      <div className="glass-panel w-full rounded-2xl p-8">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold/15">
          <Lock size={22} className="text-gold" />
        </div>
        <h1 className="text-center font-heading text-2xl font-bold">Admin Login</h1>
        <p className="mb-6 mt-1 text-center text-sm text-muted">
          Sign in to manage orders.
        </p>
        <AdminLoginForm onSubmit={handleLogin} serverError={error} />
      </div>
    </section>
  );
}