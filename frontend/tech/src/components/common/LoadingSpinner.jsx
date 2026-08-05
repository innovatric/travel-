export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
  };

  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-accent-violet/30 border-t-accent-violet`}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
