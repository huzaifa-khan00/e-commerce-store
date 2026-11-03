import { LogOut } from "lucide-react";
import Button from "../../components/ui/Button";
import useAuth from "../../hooks/useAuth";
import { logoutAdmin } from "../../services/authService";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted">Signed in as {user?.email}</p>
        </div>
        <Button type="button" variant="ghost" onClick={logoutAdmin}>
          <LogOut size={16} /> Sign out
        </Button>
      </div>

      <div className="glass-panel mt-8 rounded-2xl p-8 text-center text-muted">
        Orders and sales numbers arrive in the next module.
      </div>
    </section>
  );
}