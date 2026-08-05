import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Logo from '../common/Logo';
import { navItems } from './Sidebar';

export default function MobileNavigation({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-text-primary/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface-elevated shadow-2xl lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
              <Logo size="sm" />
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-text-secondary hover:bg-border-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {navItems.map(({ to, label, icon: Icon }) => {
                const isActive =
                  location.pathname === to || location.pathname.startsWith(`${to}/`);
                return (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={[
                      'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all',
                      isActive
                        ? 'gradient-ai-subtle text-accent-violet'
                        : 'text-text-secondary hover:bg-border-subtle hover:text-text-primary',
                    ].join(' ')}
                  >
                    <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.75} />
                    {label}
                  </NavLink>
                );
              })}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
