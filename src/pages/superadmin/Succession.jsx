import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Copy, AlertTriangle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import { BrutalCard, BrutalButton, BrutalBadge } from '../../components/ui';

/* ─────────────────────────────────────────────────────────
   Super Admin — Succession Protocol
   Generate successor credentials (shown ONCE).
   Revoke old admin access.
   Phase 2: Cloud Function createSuccessor + revokeAdmin
───────────────────────────────────────────────────────── */

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!$';
  return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function Succession() {
  const year = new Date().getFullYear();
  const [credentials, setCredentials] = useState(null);
  const [showPass, setShowPass]        = useState(false);
  const [copied, setCopied]            = useState('');
  const [confirmed, setConfirmed]      = useState(false);

  const handleGenerate = () => {
    if (!confirmed) return;
    // Phase 2: call Cloud Function createSuccessor
    const newCreds = {
      email:    `warden_${year + 1}@gecmess.internal`,
      password: generatePassword(),
      uid:      `warden-${Date.now()}`,
    };
    setCredentials(newCreds);
    setConfirmed(false);
  };

  const handleCopy = (field, val) => {
    navigator.clipboard.writeText(val);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <AnimatedPage direction={1} className="p-8">
      <div className="mb-6">
        <h2 className="font-serif font-bold text-3xl">
          Succession <span className="highlight-pink">Protocol</span>
        </h2>
        <p className="font-sans text-sm text-brand-light mt-1">
          Transfer root access to a new Warden
        </p>
      </div>

      {/* Warning card */}
      <BrutalCard color="bg-brand-secondary" className="p-5 mb-6 max-w-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-brand-dark shrink-0 mt-0.5" />
          <div>
            <h3 className="font-sans font-bold text-sm mb-1">Important</h3>
            <ul className="font-sans text-xs text-brand-dark/80 space-y-1">
              <li>• Generated credentials will be shown <strong>one time only</strong>.</li>
              <li>• Copy and securely hand them to the incoming Warden.</li>
              <li>• The new Warden must log in and revoke your access.</li>
              <li>• Only one active Super Admin exists at a time.</li>
            </ul>
          </div>
        </div>
      </BrutalCard>

      {/* Generate section */}
      <BrutalCard className="p-6 max-w-md mb-6">
        <h3 className="font-serif font-bold text-lg mb-4">Generate Successor Account</h3>

        <div className="flex items-start gap-3 mb-4 p-3 bg-brand-primary/40 rounded-brutal border border-brand-dark/20">
          <input
            type="checkbox"
            id="confirm"
            checked={confirmed}
            onChange={e => setConfirmed(e.target.checked)}
            className="mt-0.5 accent-brand-dark"
          />
          <label htmlFor="confirm" className="font-sans text-xs text-brand-dark cursor-pointer">
            I understand this will create a new Super Admin account and the credentials will be shown only once.
          </label>
        </div>

        <BrutalButton
          icon={RefreshCw}
          onClick={handleGenerate}
          variant="secondary"
          fullWidth
          disabled={!confirmed}
        >
          Generate Successor
        </BrutalButton>
      </BrutalCard>

      {/* Credentials display — shown ONCE */}
      <AnimatePresence>
        {credentials && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <BrutalCard color="bg-brand-accent" className="p-6 max-w-md mb-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={18} className="text-green-700" />
                <h3 className="font-sans font-bold text-sm text-green-800">New Successor Account</h3>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="font-sans font-semibold text-xs text-brand-light uppercase tracking-wider">
                  Roll No / Email
                </label>
                <div className="flex items-center gap-2 mt-1 bg-white border-2 border-brand-dark rounded-brutal px-3 py-2">
                  <code className="flex-1 font-mono text-sm text-brand-dark">{credentials.email}</code>
                  <button onClick={() => handleCopy('email', credentials.email)} className="text-brand-light hover:text-brand-dark">
                    <Copy size={14} />
                  </button>
                </div>
                {copied === 'email' && <p className="font-sans text-xs text-green-700 mt-1">Copied!</p>}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="font-sans font-semibold text-xs text-brand-light uppercase tracking-wider">
                  Password
                </label>
                <div className="flex items-center gap-2 mt-1 bg-white border-2 border-brand-dark rounded-brutal px-3 py-2">
                  <code className="flex-1 font-mono text-sm text-brand-dark">
                    {showPass ? credentials.password : '●'.repeat(credentials.password.length)}
                  </code>
                  <button onClick={() => setShowPass(p => !p)} className="text-brand-light hover:text-brand-dark">
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => handleCopy('pass', credentials.password)} className="text-brand-light hover:text-brand-dark">
                    <Copy size={14} />
                  </button>
                </div>
                {copied === 'pass' && <p className="font-sans text-xs text-green-700 mt-1">Copied!</p>}
              </div>

              <p className="font-sans text-xs text-green-800 bg-green-100 border border-green-300 rounded-brutal p-2">
                ⚠️ This is the only time these credentials will be shown. Copy them now.
              </p>

              <BrutalButton
                className="mt-4"
                variant="ghost"
                fullWidth
                onClick={() => setCredentials(null)}
              >
                I've saved the credentials — Dismiss
              </BrutalButton>
            </BrutalCard>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
