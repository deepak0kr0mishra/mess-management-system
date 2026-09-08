/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Base palette */
        'brand-bg':        '#FDF9F1',  // creamy off-white
        'brand-dark':      '#2C2C2C',  // near-black for borders/text
        'brand-light':     '#6B6B6B',  // muted secondary text
        'brand-surface':   '#FFFFFF',  // card surfaces

        /* Accent palette */
        'brand-primary':   '#F7D58B',  // warm yellow – breakfast
        'brand-secondary': '#F3B3B3',  // soft pink – lunch/alerts
        'brand-accent':    '#B5E0D8',  // mint green – dinner/success
        'brand-purple':    '#D4C5F9',  // lavender – announcements
        'brand-gold':      '#E8A020',  // wallet / currency

        /* Semantic states */
        'brand-green':     '#4ADE80',  // ALLOW flash
        'brand-green-bg':  '#DCFCE7',  // ALLOW background
        'brand-red':       '#F87171',  // DENY flash
        'brand-red-bg':    '#FEE2E2',  // DENY background
        'brand-warn':      '#FCD34D',  // warning / locked

        /* Role identity */
        'role-student':    '#F7D58B',
        'role-committee':  '#B5E0D8',
        'role-worker':     '#D4C5F9',
        'role-admin':      '#F3B3B3',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans:  ['Work Sans', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'brutal':       '4px 4px 0px #2C2C2C',
        'brutal-sm':    '2px 2px 0px #2C2C2C',
        'brutal-lg':    '6px 6px 0px #2C2C2C',
        'brutal-green': '4px 4px 0px #16A34A',
        'brutal-red':   '4px 4px 0px #DC2626',
        'brutal-nav':   '0px -3px 0px #2C2C2C',
        'brutal-side':  '3px 0px 0px #2C2C2C',
      },
      borderRadius: {
        'brutal': '12px',
        'pill':   '999px',
      },
      animation: {
        'marquee-left':   'marqueeLeft 12s linear infinite',
        'marquee-right':  'marqueeRight 12s linear infinite',
        'marquee-bounce': 'marqueeBounce 8s ease-in-out infinite',
        'pulse-glow':     'pulseGlow 2s ease-in-out infinite',
        'flash-green':    'flashGreen 0.6s ease-out forwards',
        'flash-red':      'flashRed 0.6s ease-out forwards',
        'press':          'press 0.1s ease-out forwards',
        'float':          'float 3s ease-in-out infinite',
        'wiggle':         'wiggle 0.5s ease-in-out',
        'slide-up':       'slideUp 0.3s ease-out',
        'slide-down':     'slideDown 0.3s ease-out',
        'fade-in':        'fadeIn 0.4s ease-out',
        'rhythm':         'rhythm 0.6s infinite ease-in-out',
        'spin-slow':      'spin 3s linear infinite',
        'bounce-slow':    'bounce 2s infinite',
      },
      keyframes: {
        marqueeLeft: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRight: {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        marqueeBounce: {
          '0%, 100%': { transform: 'translateX(0%)' },
          '50%':      { transform: 'translateX(-30%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0px 0px rgba(74,222,128,0)' },
          '50%':      { boxShadow: '0 0 20px 8px rgba(74,222,128,0.4)' },
        },
        flashGreen: {
          '0%':   { backgroundColor: '#4ADE80' },
          '100%': { backgroundColor: '#DCFCE7' },
        },
        flashRed: {
          '0%':   { backgroundColor: '#F87171' },
          '100%': { backgroundColor: '#FEE2E2' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%':      { transform: 'rotate(-5deg)' },
          '75%':      { transform: 'rotate(5deg)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',      opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        rhythm: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.15)' },
        },
      },
    },
  },
  plugins: [],
};
