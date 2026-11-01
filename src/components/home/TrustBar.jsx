import { BadgeCheck, Banknote, RefreshCcw, Truck } from "lucide-react";
import Reveal from "../ui/Reveal";

const ITEMS = [
  { icon: Truck, label: "Free Shipping" },
  { icon: Banknote, label: "Cash on Delivery" },
  { icon: RefreshCcw, label: "7-Day Replacement" },
  { icon: BadgeCheck, label: "Quality Inspected" },
];

export default function TrustBar() {
  return (
    <Reveal className="mx-auto max-w-6xl px-5">
      <div className="glass-panel grid grid-cols-2 gap-6 rounded-2xl px-6 py-6 md:grid-cols-4">
        {ITEMS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon size={22} className="shrink-0 text-gold" />
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}