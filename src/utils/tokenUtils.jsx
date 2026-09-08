import { format } from 'date-fns';

/* ─────────────────────────────────────────────────────────
   Shared Token Utilities
   ALL animations are pure CSS (keyframes in index.css).
   This guarantees they work inside any container —
   fixed overlays, overflow-hidden cards, nested divs.
───────────────────────────────────────────────────────── */

export const TOKEN_ASSETS = {
  token_01: { emoji: '🍛', bg: 'bg-brand-primary'   },
  token_02: { emoji: '🥗', bg: 'bg-brand-accent'    },
  token_03: { emoji: '🍞', bg: 'bg-brand-secondary' },
  token_04: { emoji: '🍱', bg: 'bg-brand-purple'    },
  token_05: { emoji: '🍚', bg: 'bg-brand-primary'   },
  token_06: { emoji: '🥘', bg: 'bg-brand-accent'    },
  token_07: { emoji: '🍵', bg: 'bg-brand-secondary' },
};

export const ANIM_TYPES = ['marquee-rtl', 'marquee-ltr', 'pulse', 'bounce', 'wave'];

export function getTodayToken() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86_400_000
  );
  const keys = Object.keys(TOKEN_ASSETS);
  return {
    asset:         TOKEN_ASSETS[keys[dayOfYear % keys.length]],
    animationType: ANIM_TYPES[dayOfYear % ANIM_TYPES.length],
    activeDate:    format(new Date(), 'yyyy-MM-dd'),
  };
}

/* ── 1. Marquee RTL ──────────────────────────────────────
   Duplicated emoji row → translate -50% → seamless loop  */
export function AnimMarqueeRTL({ emoji, size = 'text-6xl' }) {
  const items = [...Array(7)].map((_, i) => (
    <span key={i} className={`inline-block mx-4 ${size} select-none`} style={{ lineHeight: 1 }}>
      {emoji}
    </span>
  ));
  return (
    <div style={{ overflow: 'hidden', width: '100%', whiteSpace: 'nowrap' }}>
      <span className="token-marquee-rtl">
        {items}{items}
      </span>
    </div>
  );
}

/* ── 2. Marquee LTR ─────────────────────────────────────── */
export function AnimMarqueeLTR({ emoji, size = 'text-6xl' }) {
  const items = [...Array(7)].map((_, i) => (
    <span key={i} className={`inline-block mx-4 ${size} select-none`} style={{ lineHeight: 1 }}>
      {emoji}
    </span>
  ));
  return (
    <div style={{ overflow: 'hidden', width: '100%', whiteSpace: 'nowrap' }}>
      <span className="token-marquee-ltr">
        {items}{items}
      </span>
    </div>
  );
}

/* ── 3. Pulse — CSS scale keyframe with stagger ─────────── */
export function AnimPulse({ emoji, size = 'text-6xl' }) {
  return (
    <div className="w-full flex items-center justify-center gap-5 flex-wrap px-4">
      {[...Array(6)].map((_, i) => (
        <span
          key={i}
          className={`token-pulse token-delay-${i} ${size} select-none`}
          style={{ lineHeight: 1 }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

/* ── 4. Bounce — CSS translateY keyframe with stagger ────── */
export function AnimBounce({ emoji, size = 'text-6xl' }) {
  return (
    <div className="w-full flex items-center justify-center gap-5 flex-wrap px-4">
      {[...Array(6)].map((_, i) => (
        <span
          key={i}
          className={`token-bounce token-delay-${i} ${size} select-none`}
          style={{ lineHeight: 1 }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

/* ── 5. Wave — CSS ripple rotation keyframe with stagger ─── */
export function AnimWave({ emoji, size = 'text-6xl' }) {
  return (
    <div className="w-full flex items-center justify-center gap-4 flex-wrap px-4">
      {[...Array(7)].map((_, i) => (
        <span
          key={i}
          className={`token-wave token-delay-${i} ${size} select-none`}
          style={{ lineHeight: 1 }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

export const ANIM_COMPONENT_MAP = {
  'marquee-rtl': AnimMarqueeRTL,
  'marquee-ltr': AnimMarqueeLTR,
  'pulse':       AnimPulse,
  'bounce':      AnimBounce,
  'wave':        AnimWave,
};
