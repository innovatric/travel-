import { NavLink, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  LayoutDashboard,
  LogOut,
  Map,
  Moon,
  Settings,
  Sparkles,
  Sun,
} from 'lucide-react';
import Logo from '../common/Logo';
import UserProfileArea from '../common/UserProfileArea';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/planner', label: 'AI Trip Planner', icon: Sparkles },
  { to: '/explore', label: 'Explore Map', icon: Map },
];

const secondaryNavItems = [
  { to: '/trips', label: 'My Trips', icon: Map },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <aside
      className={`hidden h-full shrink-0 flex-col border-r border-border bg-surface-elevated transition-all duration-300 lg:flex ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-4">
        <div className="min-w-0">
          <Logo size="sm" />
        </div>
        <button
          onClick={onToggle}
          className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-4 px-3 py-4" aria-label="Main navigation">
        {!collapsed && (
          <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-text-muted">
            Main
          </div>
        )}
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
          return (
            <NavLink
              key={to}
              to={to}
              className={[
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'gradient-ai-subtle text-accent-violet shadow-sm'
                  : 'text-text-secondary hover:bg-border-subtle hover:text-text-primary',
                collapsed ? 'justify-center px-2' : '',
              ].join(' ')}
              title={collapsed ? label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2 : 1.75} />
              {!collapsed && <span>{label}</span>}
              {!collapsed && to === '/planner' && (
                <span className="ml-auto rounded-md bg-accent-violet/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-violet">
                  AI
                </span>
              )}
            </NavLink>
          );
        })}

        {!collapsed && (
          <div className="px-2 pt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-text-muted">
            My Travel
          </div>
        )}
        {secondaryNavItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
          return (
            <NavLink
              key={to}
              to={to}
              className={[
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'gradient-ai-subtle text-accent-violet shadow-sm'
                  : 'text-text-secondary hover:bg-border-subtle hover:text-text-primary',
                collapsed ? 'justify-center px-2' : '',
              ].join(' ')}
              title={collapsed ? label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2 : 1.75} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border-subtle p-4 space-y-3">
        {!collapsed && <UserProfileArea />}
        <button
          onClick={toggleTheme}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary ${collapsed ? 'justify-center px-2' : ''}`}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400 shrink-0" /> : <Moon className="h-5 w-5 text-indigo-500 shrink-0" />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <button
          onClick={logout}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-border-subtle hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet ${collapsed ? 'justify-center px-2' : ''}`}
        >
          <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.75} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}

export { navItems };
