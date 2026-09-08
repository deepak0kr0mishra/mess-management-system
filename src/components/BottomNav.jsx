import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ToggleLeft, User, MessageSquare } from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   BottomNav — 3 tabs (Token removed — it's now a button)
   Fixed: pill is now centered with equal flex widths
───────────────────────────────────────────────────────── */

const STUDENT_TABS = [
  { path: '/student/routine',  label: 'Menu',     Icon: UtensilsCrossed },
  { path: '/student/opt-out',  label: 'Opt Out',  Icon: ToggleLeft      },
  { path: '/student/feedback', label: 'Feedback', Icon: MessageSquare   },
  { path: '/student/profile',  label: 'Profile',  Icon: User            },
];

export default function BottomNav({ tabs = STUDENT_TABS }) {
  const location = useLocation();
  const navigate  = useNavigate();

  const activeIdx = tabs.findIndex(t => location.pathname.startsWith(t.path));
  const safeIdx   = activeIdx === -1 ? 0 : activeIdx;
  const tabW      = 100 / tabs.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 pointer-events-none">
      <nav
        className="pointer-events-auto relative flex items-center bg-brand-bg border-2 border-brand-dark rounded-pill px-2 py-2 shadow-brutal"
        style={{ width: 'min(340px, 92vw)' }}
      >
        {/* Sliding pill indicator */}
        <motion.div
          className="absolute top-2 bottom-2 rounded-pill bg-brand-dark z-0"
          style={{ width: `${tabW}%`, left: `${safeIdx * tabW}%` }}
          animate={{ left: `${safeIdx * tabW}%` }}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />

        {tabs.map((tab, idx) => {
          const isActive = idx === safeIdx;
          return (
            <motion.button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              style={{ width: `${tabW}%` }}
              className={`
                relative z-10 flex flex-col items-center justify-center gap-0.5
                py-2 rounded-pill cursor-pointer select-none
                transition-colors duration-200
                ${isActive ? 'text-brand-bg' : 'text-brand-dark'}
              `}
              aria-label={tab.label}
            >
              <tab.Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-sans font-semibold tracking-wide">
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
