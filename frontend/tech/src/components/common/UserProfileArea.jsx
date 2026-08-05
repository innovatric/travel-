import { useAuth } from '../../context/AuthContext';

export default function UserProfileArea({ className = '' }) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const displayName = user.name || user.fullName || user.email?.split('@')[0] || 'Traveler';
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-border/80 bg-surface px-3 py-2 shadow-sm ${className}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-ai text-sm font-semibold text-white">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-text-primary">{displayName}</p>
        <p className="truncate text-xs text-text-secondary">{user.email || 'Authenticated traveler'}</p>
      </div>
    </div>
  );
}
