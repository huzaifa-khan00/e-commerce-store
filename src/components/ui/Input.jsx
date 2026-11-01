import { forwardRef } from "react";
import cn from "../../utils/cn";

// Labelled text field with an error message. Pass as="textarea" for multi-line.
// forwardRef lets react-hook-form attach to the real <input>.
const Input = forwardRef(function Input(
  { label, error, hint, as = "input", className, id, ...props },
  ref
) {
  const Tag = as;
  const fieldId = id || props.name;

  return (
    <div>
      <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <Tag
        ref={ref}
        id={fieldId}
        aria-invalid={!!error}
        className={cn(
          "glass-panel w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30",
          "outline-none transition-colors focus:border-gold/60",
          error && "border-red-400/60",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
});

export default Input;