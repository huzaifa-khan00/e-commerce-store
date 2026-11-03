import GlassCard from "../ui/GlassCard";
import { formatPrice } from "../../utils/formatters";

const percent = (value) => `${Math.round(value * 100)}%`;

function Stat({ label, value, hint, accent }) {
  return (
    <GlassCard className="p-5">
      <p className="text-xs text-muted">{label}</p>
      <p
        className={`mt-1 font-heading text-2xl font-bold ${
          accent ? "text-gold-light" : ""
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </GlassCard>
  );
}

export default function StatsCards({ stats }) {
  const topUnits = stats.colorSales[0]?.units ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Revenue collected"
          value={formatPrice(stats.revenue)}
          hint="Delivered orders only"
          accent
        />
        <Stat
          label="Units sold"
          value={stats.unitsSold}
          hint="Delivered orders only"
        />
        <Stat
          label="Cash on the road"
          value={formatPrice(stats.cashInTransit)}
          hint="Dispatched, not yet delivered"
        />
        <Stat
          label="Needs action"
          value={stats.byStatus.pending}
          hint="Pending orders to confirm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total orders" value={stats.total} />
        <Stat label="Delivered" value={stats.byStatus.delivered} />
        <Stat
          label="Cancel rate"
          value={percent(stats.cancelRate)}
          hint={`${stats.byStatus.cancelled} cancelled`}
        />
        <Stat
          label="Return rate"
          value={percent(stats.returnRate)}
          hint={`${stats.byStatus.returned} returned`}
        />
      </div>

      <GlassCard>
        <p className="text-sm font-semibold">Sales by color</p>
        {stats.colorSales.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No delivered orders in this period.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {stats.colorSales.map(({ name, units }) => (
              <li key={name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{name}</span>
                  <span className="text-muted">{units} sold</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${topUnits ? (units / topUnits) * 100 : 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}