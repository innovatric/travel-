import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, className = '', id, ...props },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={[
          'w-full rounded-xl border bg-surface-elevated px-4 py-3 text-sm text-text-primary',
          'placeholder:text-text-muted transition-colors duration-200',
          'focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20 focus:outline-none',
          error ? 'border-danger' : 'border-border hover:border-border/80',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-text-muted">{hint}</p>}
    </div>
  );
});

export default Input;
