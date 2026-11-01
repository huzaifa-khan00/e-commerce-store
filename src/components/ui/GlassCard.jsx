import cn from "../../utils/cn";

// Frosted-glass container used for feature, step and review cards.
export default function GlassCard({ className, children, ...props }) {
  return (
    <div
      className={cn("glass-panel rounded-2xl p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}