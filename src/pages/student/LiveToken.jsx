import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import AnimatedPage from '../../components/AnimatedPage';
import { useAuth } from '../../context/AuthContext';
import { getTodayToken, ANIM_COMPONENT_MAP } from '../../utils/tokenUtils';

function useLiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function LiveToken({ direction }) {
  const { user }                 = useAuth();
  const time                     = useLiveClock();
  const { asset, animationType } = getTodayToken();

  const timeStr = format(time, 'HH:mm:ss');
  const dateStr = format(time, 'EEE, dd MMM yyyy');

  const AnimComp = ANIM_COMPONENT_MAP[animationType] ?? ANIM_COMPONENT_MAP['marquee-rtl'];

  return (
    <AnimatedPage direction={direction} className="min-h-[calc(100dvh-160px)] flex flex-col">
      {/* Instructions */}
      <div className="px-5 pt-4 pb-2">
        <h2 className="font-serif font-bold text-xl text-brand-dark">
          Entry <span className="highlight-mint">Token</span>
        </h2>
        <p className="font-sans text-xs text-brand-light mt-0.5">
          Show this screen at the mess door · Do not screenshot
        </p>
      </div>

      {/* Token Card */}
      <div className="flex-1 px-5 pb-5">
        <div
          className={`relative w-full h-full min-h-[500px] ${asset.bg} border-2 border-brand-dark rounded-brutal shadow-brutal overflow-hidden flex flex-col`}
          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          onContextMenu={e => e.preventDefault()}
        >
          {/* Roll number watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
            <span
              className="font-serif font-bold select-none whitespace-nowrap"
              style={{
                fontSize: 'clamp(2.5rem, 16vw, 7rem)',
                transform: 'rotate(-20deg)',
                color: 'rgba(30,24,16,0.07)',
              }}
            >
              {user?.rollNumber ?? '00CS000'}
            </span>
          </div>

          <div className="relative z-10 flex flex-col flex-1">

            {/* 1 — Date badge */}
            <div className="px-4 pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 border border-brand-dark/20 rounded-pill">
                <span className="font-sans font-semibold text-xs text-brand-dark">📅 {dateStr}</span>
              </div>
            </div>

            {/* 2 — Live clock */}
            <div className="px-4 pt-3 pb-2 text-center">
              <motion.p
                key={timeStr}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                className="font-mono font-bold text-brand-dark text-5xl tracking-widest leading-none"
              >
                {timeStr}
              </motion.p>
              <p className="font-sans text-brand-dark/40 text-[10px] mt-1 uppercase tracking-widest">
                Live clock
              </p>
            </div>

            {/* 3 — Emoji animation (large flex area) */}
            <div className="flex-1 flex items-center justify-center py-4 overflow-hidden">
              <AnimComp emoji={asset.emoji} size="text-6xl" />
            </div>

            {/* 4 — Name + Roll (bottom, large, centered) */}
            <div className="border-t-2 border-brand-dark/15 bg-white/30 px-4 py-5 text-center">
              <p className="font-serif font-bold text-2xl text-brand-dark leading-tight">
                {user?.displayName ?? 'Student Name'}
              </p>
              <p className="font-mono font-bold text-brand-dark/70 text-lg mt-1 tracking-widest">
                {user?.rollNumber ?? '00CS000'}
              </p>
            </div>

          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
