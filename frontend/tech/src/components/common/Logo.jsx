import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: { icon: 'h-7 w-7', text: 'text-base' },
    md: { icon: 'h-9 w-9', text: 'text-xl' },
    lg: { icon: 'h-11 w-11', text: 'text-2xl' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`${s.icon} gradient-ai flex items-center justify-center rounded-xl shadow-sm`}
      >
        <MapPin className="h-1/2 w-1/2 text-white" strokeWidth={2.5} />
      </div>
      {showText && (
        <span className={`${s.text} font-bold tracking-tight text-text-primary`}>
          TripFlow <span className="gradient-ai-text">AI</span>
        </span>
      )}
    </Link>
  );
}
