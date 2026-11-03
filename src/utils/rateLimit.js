// Client-side spam brake: a cooldown between orders and a daily cap per device.
// This only slows down casual spam (it can be bypassed). Stronger protection,
// App Check, comes in the final pass.
const KEY = "order_attempts";
const COOLDOWN_MS = 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_PER_DAY = 5;

function readTimes() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    const now = Date.now();
    return Array.isArray(raw)
      ? raw.filter((t) => typeof t === "number" && now - t < DAY_MS)
      : [];
  } catch {
    return [];
  }
}

export function checkOrderLimit() {
  const times = readTimes();
  const last = times[times.length - 1];

  if (last && Date.now() - last < COOLDOWN_MS) {
    const secs = Math.ceil((COOLDOWN_MS - (Date.now() - last)) / 1000);
    return {
      allowed: false,
      message: `Please wait ${secs} seconds before placing another order.`,
    };
  }
  if (times.length >= MAX_PER_DAY) {
    return {
      allowed: false,
      message:
        "You've reached today's order limit. Please contact us on WhatsApp to place more orders.",
    };
  }
  return { allowed: true };
}

// Call after an order is saved successfully.
export function recordOrder() {
  const times = readTimes();
  times.push(Date.now());
  try {
    localStorage.setItem(KEY, JSON.stringify(times));
  } catch {
    // Storage blocked (private mode): ignore, the rules still protect the data.
  }
}