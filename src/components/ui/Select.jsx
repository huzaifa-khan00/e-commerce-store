import { forwardRef } from "react";
import cn from "../../utils/cn";

// Labelled dropdown. options: array of strings.
const Select = forwardRef(function Select(
  { label, error, options, placeholder, className, id, ...props },
  ref
) {
  const fieldId = id || props.name;

  return (
    <div>
      <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <select
        ref={ref}
        id={fieldId}
        aria-invalid={!!error}
        defaultValue=""
        className={cn(
          "glass-panel w-full rounded-xl px-4 py-3 text-sm text-white",
          "outline-none transition-colors focus:border-gold/60",
          error && "border-red-400/60",
          className
        )}
        {...props}
      >
        <option value="" disabled className="bg-darkBg">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-darkBg">
            {o}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
});

export default Select;