import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Moon, Search, Settings, Sparkles, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar({ onMenuClick, title, onToggleSidebar }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface-elevated/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={onToggleSidebar}
            className="hidden rounded-xl p-2 text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary lg:inline-flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet"
            aria-label="Toggle sidebar"
          >
            <Sparkles className="h-5 w-5" />
          </button>
          {title && <h1 className="text-lg font-bold text-text-primary sm:text-xl">{title}</h1>}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <label className="hidden items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2 sm:flex">
            <Search className="h-4 w-4 text-text-muted" />
            <input
              type="search"
              placeholder="Search trips, destinations or plans..."
              className="w-40 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none lg:w-56"
              aria-label="Search trips"
            />
          </label>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-border-subtle hover:text-accent-violet focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-500" />}
          </button>

          <div className="relative">
            <button
              className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet"
              aria-label="Notifications"
              onClick={() => setNotificationsOpen((value) => !value)}
            >
              <Bell className="h-5 w-5" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-border bg-surface-elevated p-4 shadow-[0_12px_35px_rgba(15,23,42,0.12)]">
                <p className="text-sm font-semibold text-text-primary">Notifications</p>
                <div className="mt-3 rounded-2xl border border-dashed border-border bg-surface px-4 py-8 text-center">
                  <p className="text-sm font-medium text-text-primary">You’re all caught up</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Updates will appear here once your planner starts syncing with live services.
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet"
            aria-label="Open settings"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
