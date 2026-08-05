import { motion } from 'framer-motion';
import { Wallet, TrendingDown } from 'lucide-react';

const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', SGD: 'S$' };

function formatCurrency(value, currency = 'INR') {
  if (value === null || value === undefined || value === '') return '—';
  const symbol = CURRENCY_SYMBOLS[currency] || currency + ' ';
  return `${symbol}${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

const CATEGORY_CONFIG = {
  accommodation: { label: 'Accommodation', color: 'from-violet-500 to-purple-600', emoji: '🏨' },
  transport: { label: 'Transport', color: 'from-blue-500 to-cyan-600', emoji: '🚗' },
  transportation: { label: 'Transport', color: 'from-blue-500 to-cyan-600', emoji: '🚗' },
  food: { label: 'Food & Dining', color: 'from-orange-500 to-amber-500', emoji: '🍽️' },
  activities: { label: 'Activities', color: 'from-emerald-500 to-green-600', emoji: '🎯' },
  other: { label: 'Miscellaneous', color: 'from-gray-400 to-gray-500', emoji: '📦' },
};

export default function BudgetBreakdown({ budget = {}, totalBudget = 0, currency = 'INR' }) {
  const entries = Object.entries(budget)
    .map(([key, val]) => {
      const config = CATEGORY_CONFIG[key] || { label: key, color: 'from-gray-400 to-gray-500', emoji: '📌' };
      return { key, value: Number(val || 0), ...config };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = totalBudget || entries.reduce((s, e) => s + e.value, 0);
  const spent = entries.reduce((s, e) => s + e.value, 0);
  const remaining = Math.max(total - spent, 0);
  const spentPct = total > 0 ? Math.min((spent / total) * 100, 100) : 0;

  if (!entries.length && !totalBudget) {
    return (
      <div className="rounded-[1.5rem] border border-border bg-surface px-5 py-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Wallet className="h-4 w-4 text-accent-violet" />
          Expense Breakdown
        </div>
        <p className="mt-3 text-sm text-text-secondary">Expense breakdown will appear after your itinerary is generated.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-border bg-surface px-5 py-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Wallet className="h-4 w-4 text-accent-violet" />
          Expense Breakdown
        </div>
        <span className="text-xs text-text-secondary">{currency}</span>
      </div>

      {/* Total bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-text-secondary mb-1.5">
          <span>Budget used</span>
          <span className="font-semibold text-text-primary">{spentPct.toFixed(0)}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-border-subtle">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${spentPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-accent-violet to-blue-500"
          />
        </div>
      </div>

      {/* Category rows */}
      <div className="mt-5 space-y-3">
        {entries.map((item) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={item.key}>
              <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{item.emoji}</span>
                  <span className="text-text-secondary font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted">{pct.toFixed(0)}%</span>
                  <span className="font-semibold text-text-primary">{formatCurrency(item.value, currency)}</span>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-border-subtle">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                  className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-5 rounded-2xl border border-border bg-surface-elevated p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Total Budget</span>
          <span className="font-bold text-text-primary text-base">{formatCurrency(total, currency)}</span>
        </div>
        {spent > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Planned Spend</span>
            <span className="font-semibold text-text-primary">{formatCurrency(spent, currency)}</span>
          </div>
        )}
        {remaining > 0 && (
          <div className="flex items-center justify-between text-sm border-t border-border pt-2">
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <TrendingDown className="h-3.5 w-3.5" /> Remaining
            </span>
            <span className="font-bold text-emerald-600">{formatCurrency(remaining, currency)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
