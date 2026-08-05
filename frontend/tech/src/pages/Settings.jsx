import { Bell, Lock, Moon, Sun, User } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-[var(--radius-card-lg)] border border-border bg-surface-elevated p-6 shadow-[var(--shadow-soft)]">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl gradient-ai-subtle">
          <Icon className="h-5 w-5 text-accent-violet" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">{title}</h3>
          <p className="mt-0.5 text-sm text-text-secondary">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your account and preferences
        </p>
      </div>

      <SettingsSection
        icon={theme === 'dark' ? Moon : Sun}
        title="Appearance & Theme"
        description="Choose between Light and Dark visual modes"
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`flex items-center justify-center gap-2 rounded-2xl border p-4 font-semibold text-sm transition-all ${
              theme === 'light'
                ? 'border-accent-violet bg-accent-violet/10 text-accent-violet shadow-sm'
                : 'border-border bg-surface text-text-secondary hover:border-border-subtle'
            }`}
          >
            <Sun className="h-4 w-4 text-amber-500" />
            Light Mode
          </button>
          <button
            onClick={() => theme === 'light' && toggleTheme()}
            className={`flex items-center justify-center gap-2 rounded-2xl border p-4 font-semibold text-sm transition-all ${
              theme === 'dark'
                ? 'border-accent-violet bg-accent-violet/10 text-accent-violet shadow-sm'
                : 'border-border bg-surface text-text-secondary hover:border-border-subtle'
            }`}
          >
            <Moon className="h-4 w-4 text-indigo-400" />
            Dark Mode
          </button>
        </div>
      </SettingsSection>

      <SettingsSection
        icon={User}
        title="Profile"
        description="Your personal information"
      >
        <div className="space-y-4">
          <Input
            label="Full name"
            defaultValue={user?.name || ''}
            placeholder="Your name"
            disabled
          />
          <Input
            label="Email"
            type="email"
            defaultValue={user?.email || ''}
            placeholder="you@example.com"
            disabled
          />
          <Button variant="secondary" disabled>
            Save changes
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection
        icon={Lock}
        title="Security"
        description="Password and authentication"
      >
        <Button variant="secondary" disabled>
          Change password
        </Button>
      </SettingsSection>

      <SettingsSection
        icon={Bell}
        title="Notifications"
        description="Email and push notification preferences"
      >
        <div className="space-y-3 opacity-60">
          {['Trip reminders', 'Itinerary updates', 'AI suggestions'].map((item) => (
            <label key={item} className="flex items-center justify-between text-sm">
              <span className="text-text-primary">{item}</span>
              <input
                type="checkbox"
                disabled
                className="h-4 w-4 rounded border-border text-accent-violet"
              />
            </label>
          ))}
        </div>
      </SettingsSection>
    </div>
  );
}
