import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function QuickActionCard({ icon: Icon, title, description, to }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="rounded-[1.75rem] border border-border bg-surface-elevated p-5 shadow-soft"
    >
      <Link to={to} className="flex h-full flex-col gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-ai-subtle">
          <Icon className="h-5 w-5 text-accent-violet" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
}
