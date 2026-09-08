import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────
   Shared UI Primitives
   BrutalCard, BrutalButton, BrutalBadge, Divider, Tag
───────────────────────────────────────────────────────── */

// ── BrutalCard ──────────────────────────────────────────
export function BrutalCard({
  children,
  className = '',
  color = 'bg-brand-surface',
  shadow = 'shadow-brutal',
  onClick,
  ...props
}) {
  const base = `${color} border-2 border-brand-dark rounded-brutal ${shadow} ${className}`;
  if (onClick) {
    return (
      <motion.div
        className={`${base} cursor-pointer`}
        onClick={onClick}
        whileTap={{ scale: 0.98, x: 3, y: 3, boxShadow: 'none' }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <div className={base} {...props}>
      {children}
    </div>
  );
}

// ── BrutalButton ─────────────────────────────────────────
export function BrutalButton({
  children,
  onClick,
  className = '',
  variant = 'primary',   // 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size = 'md',           // 'sm' | 'md' | 'lg'
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon: Icon,
  ...props
}) {
  const variants = {
    primary:   'bg-brand-dark text-brand-bg border-brand-dark hover:bg-brand-dark/90',
    secondary: 'bg-brand-primary text-brand-dark border-brand-dark hover:bg-brand-primary/80',
    ghost:     'bg-transparent text-brand-dark border-brand-dark hover:bg-brand-dark/5',
    danger:    'bg-brand-secondary text-brand-dark border-brand-dark hover:bg-brand-secondary/80',
    success:   'bg-brand-accent text-brand-dark border-brand-dark hover:bg-brand-accent/80',
    gold:      'bg-brand-gold text-white border-brand-dark hover:bg-brand-gold/90',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  const shadows = {
    primary:   'shadow-brutal',
    secondary: 'shadow-brutal',
    ghost:     'shadow-brutal',
    danger:    'shadow-brutal',
    success:   'shadow-brutal',
    gold:      'shadow-brutal',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { x: 4, y: 4, boxShadow: 'none' }}
      transition={{ type: 'spring', stiffness: 600, damping: 20 }}
      className={`
        inline-flex items-center justify-center font-sans font-semibold
        border-2 rounded-brutal transition-colors
        ${variants[variant] || variants.primary}
        ${sizes[size]}
        ${shadows[variant] || 'shadow-brutal'}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} strokeWidth={2} />}
      {children}
    </motion.button>
  );
}

// ── BrutalBadge ──────────────────────────────────────────
export function BrutalBadge({
  children,
  className = '',
  color = 'bg-brand-primary',
}) {
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-pill
        border-2 border-brand-dark
        font-sans font-semibold text-xs uppercase tracking-widest
        ${color} ${className}
      `}
    >
      {children}
    </span>
  );
}

// ── Divider ───────────────────────────────────────────────
export function Divider({ className = '' }) {
  return <hr className={`border-t-2 border-brand-dark/20 ${className}`} />;
}

// ── Tag ───────────────────────────────────────────────────
export function Tag({ children, className = '', color = 'bg-brand-purple' }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-sans font-medium border border-brand-dark/20 ${color} ${className}`}>
      {children}
    </span>
  );
}
