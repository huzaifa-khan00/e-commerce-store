import cn from "../../utils/cn";

const VARIANTS = {
  primary:
    "bg-gold text-darkBg hover:bg-gold-light shadow-lg shadow-gold/20",
  ghost: "glass-panel text-white hover:bg-white/10",
};

// Renders an <a> when `href` is given, otherwise a <button>.
export default function Button({
  href,
  variant = "primary",
  className,
  children,
  ...props
}) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3",
    "text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5",
    VARIANTS[variant],
    className
  );

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}