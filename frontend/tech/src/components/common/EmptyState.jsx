import { motion } from 'framer-motion';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}
    >
      {Icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl gradient-ai-subtle">
          <Icon className="h-8 w-8 text-accent-violet" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      )}
      {action}
    </motion.div>
  );
}
