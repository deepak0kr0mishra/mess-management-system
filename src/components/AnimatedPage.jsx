import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────
   AnimatedPage
   Wraps each page with a left/right slide transition.
   Pass `direction` (+1 = going right/forward, -1 = going left/back).
───────────────────────────────────────────────────────── */

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

const transition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1], // cubic-bezier — feels snappy not floaty
  duration: 0.28,
};

export default function AnimatedPage({ children, direction = 1, className = '' }) {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
