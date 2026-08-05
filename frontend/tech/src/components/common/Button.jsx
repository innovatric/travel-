import { forwardRef } from 'react';

const variants = {
  primary:
    'gradient-ai text-white shadow-md hover:shadow-lg hover:brightness-105 active:brightness-95',
  secondary:
    'bg-surface-elevated text-text-primary border border-border hover:bg-border-subtle hover:border-border',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-border-subtle',
  danger: 'bg-danger text-white hover:brightness-105 active:brightness-95',
  outline:
    'border-2 border-accent-violet text-accent-violet hover:bg-accent-violet/5',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    type = 'button',
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
});

export default Button;
