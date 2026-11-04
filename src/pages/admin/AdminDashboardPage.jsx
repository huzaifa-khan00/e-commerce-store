import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader2, LogOut, Search } from "lucide-react";
import Button from "../../components/ui/Button";
import OrdersTable from "../../components/admin/OrdersTable";
import OrderDetailsDrawer from "../../components/admin/OrderDetailsDrawer";
import StatsCards from "../../components/admin/StatsCards";
import StockManager from "../../components/admin/StockManager";
import useAuth from "../../hooks/useAuth";
import useOrders from "../../hooks/useOrders";
import { logoutAdmin } from "../../services/authService";
import { saveAdminNotes, updateOrderStatus } from "../../services/orderService";
import { ORDER_STATUS, STATUS_LABELS } from "../../firebase/collections";
import { RANGES, computeStats, filterByRange } from "../../utils/stats";
import cn from "../../utils/cn";

const FILTERS = ["all", ...Object.values(ORDER_STATUS)];
const TABS = [
  { key: "orders", label: "Orders & Sales" },
  { key: "products", label: "Price & Stock" },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { orders, loading, error } = useOrders();
  const [tab, setTab] = useState("orders");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("all");
  const [selectedNumber, setSelectedNumber] = useState(null);

  // Sales numbers for the chosen period.
  const stats = useMemo(
    () => computeStats(filterByRange(orders, range)),
    [orders, range]
  );

  // How many orders are in each status (shown on the filter chips).
  const counts = useMemo(() => {
    const c = { all: orders.length };
    Object.values(ORDER_STATUS).forEach((s) => (c[s] = 0));
    orders.forEach((o) => (c[o.status] = (c[o.status] ?? 0) + 1));
    return c;
  }, [orders]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!term) return true;
      return (
        o.orderNumber.toLowerCase().includes(term) ||
        o.customer.name.toLowerCase().includes(term) ||
        o.customer.phone.includes(term)
      );
    });
  }, [orders, filter, search]);

  // Always read the selected order from the live list, so the drawer
  // updates by itself right after a status change.
  const selected = orders.find((o) => o.orderNumber === selectedNumber) ?? null;

  const admin = { uid: user?.uid, email: user?.email };

  const handleStatusUpdate = (orderNumber, newStatus, extras) =>
    updateOrderStatus({ orderNumber, newStatus, ...extras, admin });

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

      {/* Tabs */}
      <div className="mt-8 flex gap-2 border-b border-white/10">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t.key
                ? "border-gold text-white"
                : "border-transparent text-muted hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "products" ? (
        <div className="mt-8">
          <StockManager admin={admin} />
        </div>
      ) : loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-gold" />
        </div>
      ) : error ? (
        <div className="glass-panel mt-8 rounded-2xl p-8 text-center text-sm text-red-300">
          {error}
        </div>
      ) : (
        <>
          {/* Sales numbers */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-semibold">Sales</h2>
            <div className="flex flex-wrap gap-2">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRange(r.key)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                    range === r.key
                      ? "bg-gold text-darkBg"
                      : "glass-panel text-muted hover:text-white"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <p className="mb-4 mt-1 text-xs text-muted">
            Based on orders placed in this period. Covers your 200 newest orders.
          </p>
          <StatsCards stats={stats} />

          {/* Orders */}
          <h2 className="mt-12 font-heading text-lg font-semibold">Orders</h2>

          <div className="glass-panel mt-4 flex items-center gap-3 rounded-xl px-4 py-3">
            <Search size={18} className="text-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order number, name or phone"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                  filter === f
                    ? "bg-gold text-darkBg"
                    : "glass-panel text-muted hover:text-white"
                )}
              >
                {f === "all" ? "All" : STATUS_LABELS[f]}{" "}
                <span className="opacity-70">{counts[f]}</span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <OrdersTable orders={visible} onSelect={setSelectedNumber} />
          </div>
        </>
      )}

      <AnimatePresence>
        {selected && (
          <OrderDetailsDrawer
            key="drawer"
            order={selected}
            onClose={() => setSelectedNumber(null)}
            onUpdateStatus={handleStatusUpdate}
            onSaveNotes={saveAdminNotes}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
