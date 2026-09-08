import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────
   LoadingSpinner — Illustration-style animated loader
   Shows animated bouncing food items while data fetches
───────────────────────────────────────────────────────── */

const DOTS = ['🍛', '🥗', '🍞'];

export default function LoadingSpinner({ message = 'Fetching your mess data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {/* Bouncing emoji dots */}
      <div className="flex gap-4 mb-6">
        {DOTS.map((emoji, i) => (
          <motion.span
            key={i}
            className="text-3xl"
            animate={{ y: [0, -16, 0] }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              delay: i * 0.18,
              ease: 'easeInOut',
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>
      <p className="font-serif italic text-brand-light text-sm">{message}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   EmptyState — Friendly illustration for empty data
───────────────────────────────────────────────────────── */
export function EmptyState({ emoji = '🍽️', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="text-6xl mb-5"
      >
        {emoji}
      </motion.div>
      {title && (
        <h3 className="font-serif font-bold text-xl text-brand-dark mb-2">{title}</h3>
      )}
      {message && (
        <p className="font-sans text-sm text-brand-light mb-6 max-w-xs">{message}</p>
      )}
      {action}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FullPageLoader — Full screen loading state on app boot
───────────────────────────────────────────────────────── */
export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-brand-bg flex flex-col items-center justify-center z-[9999]">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="text-5xl mb-4"
      >
        🍱
      </motion.div>
      <h1 className="font-serif font-bold text-2xl text-brand-dark mb-1">MessApp</h1>
      <p className="font-sans text-sm text-brand-light italic">GEC Sheikhpura</p>

      {/* Animated loading bar */}
      <div className="mt-8 w-48 h-2 bg-brand-dark/10 rounded-pill overflow-hidden">
        <motion.div
          className="h-full bg-brand-dark rounded-pill"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Toast — Lightweight notification
───────────────────────────────────────────────────────── */
export function Toast({ message, type = 'success', visible }) {
  const colors = {
    success: 'bg-brand-accent border-brand-dark',
    error:   'bg-brand-secondary border-brand-dark',
    info:    'bg-brand-purple border-brand-dark',
    warning: 'bg-brand-primary border-brand-dark',
  };
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9000]
        flex items-center gap-2 px-4 py-3 rounded-brutal border-2
        font-sans font-semibold text-sm text-brand-dark shadow-brutal
        min-w-[200px] max-w-[90vw] ${colors[type]}`}
    >
      <span>{icons[type]}</span>
      <span>{message}</span>
    </motion.div>
  );
}
