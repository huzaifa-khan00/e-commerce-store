import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import useAuth from "../hooks/useAuth";

// Wraps pages only the admin may see. Everyone else is sent to the login page.
export default function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-gold" />
      </div>
    );
  }

  return isAdmin ? children : <Navigate to="/admin" replace />;
}