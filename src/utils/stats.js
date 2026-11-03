import { ORDER_STATUS } from "../firebase/collections";

export const RANGES = [
  { key: "all", label: "All time" },
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
];

// Start of the chosen period, or null for "all time".
function rangeStart(range) {
  const now = new Date();
  if (range === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (range === "7d") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (range === "30d") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return null;
}

// Keeps orders placed within the chosen period.
export function filterByRange(orders, range) {
  const start = rangeStart(range);
  if (!start) return orders;
  return orders.filter((o) => {
    // A just-created order can briefly have no server timestamp yet: count it as now.
    const placed = o.createdAt?.toDate ? o.createdAt.toDate() : new Date();
    return placed >= start;
  });
}

// Turns a list of orders into the dashboard numbers.
export function computeStats(orders) {
  const byStatus = {};
  Object.values(ORDER_STATUS).forEach((s) => (byStatus[s] = 0));

  let unitsSold = 0;
  let revenue = 0;
  let cashInTransit = 0;
  const colors = {};

  for (const o of orders) {
    byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
    const units = o.items.reduce((sum, i) => sum + i.quantity, 0);

    if (o.status === ORDER_STATUS.DELIVERED) {
      unitsSold += units;
      revenue += o.total;
      o.items.forEach((i) => {
        colors[i.variantName] = (colors[i.variantName] ?? 0) + i.quantity;
      });
    }
    if (o.status === ORDER_STATUS.DISPATCHED) {
      cashInTransit += o.total;
    }
  }

  const total = orders.length;
  const finished = byStatus.delivered + byStatus.returned;

  return {
    total,
    byStatus,
    unitsSold,
    revenue,
    cashInTransit,
    cancelRate: total ? byStatus.cancelled / total : 0,
    returnRate: finished ? byStatus.returned / finished : 0,
    colorSales: Object.entries(colors)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units),
  };
}