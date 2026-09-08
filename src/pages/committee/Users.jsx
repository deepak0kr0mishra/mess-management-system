import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ShieldOff, Eye, EyeOff } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import { BrutalCard, BrutalButton, BrutalBadge } from '../../components/ui';

/* Committee — Worker Management */

const MOCK_WORKERS = [
  { uid: 'w1', name: 'Ramesh Yadav',  roll: 'WRK001', createdAt: '1 Aug 2026', isActive: true },
  { uid: 'w2', name: 'Suresh Kumar',  roll: 'WRK002', createdAt: '1 Aug 2026', isActive: true },
  { uid: 'w3', name: 'Mohan Lal',     roll: 'WRK003', createdAt: '5 Aug 2026', isActive: false },
];

export default function Users() {
  const [workers, setWorkers]   = useState(MOCK_WORKERS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ name: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const handleCreate = () => {
    if (!form.name.trim() || !form.password.trim()) return;
    const rollNo = `WRK${String(workers.length + 1).padStart(3, '0')}`;
    setWorkers(prev => [...prev, {
      uid: Date.now().toString(), name: form.name, roll: rollNo,
      createdAt: 'Just now', isActive: true,
    }]);
    setShowForm(false);
    setForm({ name: '', password: '' });
    // Phase 2: Cloud Function createWorker
  };

  const toggleActive = (uid) => {
    setWorkers(prev => prev.map(w => w.uid === uid ? { ...w, isActive: !w.isActive } : w));
    // Phase 2: Firebase set isActive flag
  };

  return (
    <AnimatedPage direction={1} className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif font-bold text-3xl">Mess <span className="highlight-mint">Workers</span></h2>
          <p className="font-sans text-sm text-brand-light mt-1">Create and manage worker accounts</p>
        </div>
        <BrutalButton icon={UserPlus} onClick={() => setShowForm(true)} variant="secondary">
          Add Worker
        </BrutalButton>
      </div>

      <div className="flex flex-col gap-3 max-w-2xl">
        {workers.map((w, i) => (
          <motion.div
            key={w.uid}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 22 }}
          >
            <BrutalCard className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-purple border-2 border-brand-dark flex items-center justify-center font-serif font-bold text-sm">
                    {w.name[0]}
                  </div>
                  <div>
                    <p className="font-sans font-bold text-sm">{w.name}</p>
                    <p className="font-mono text-xs text-brand-light">{w.roll}</p>
                    <p className="font-sans text-xs text-brand-light">Added {w.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BrutalBadge color={w.isActive ? 'bg-brand-accent' : 'bg-brand-secondary'}>
                    {w.isActive ? 'Active' : 'Inactive'}
                  </BrutalBadge>
                  <BrutalButton
                    size="sm"
                    variant={w.isActive ? 'danger' : 'success'}
                    icon={ShieldOff}
                    onClick={() => toggleActive(w.uid)}
                  >
                    {w.isActive ? 'Deactivate' : 'Activate'}
                  </BrutalButton>
                </div>
              </div>
            </BrutalCard>
          </motion.div>
        ))}
      </div>

      {/* Create Worker Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-brand-dark/40 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-brand-bg border-2 border-brand-dark rounded-brutal shadow-brutal-lg p-6 w-full max-w-sm"
          >
            <h3 className="font-serif font-bold text-xl mb-4">Create Worker Account</h3>
            <div className="flex flex-col gap-3 mb-4">
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Worker full name"
                className="border-2 border-brand-dark rounded-brutal px-3 py-2.5 font-sans text-sm bg-brand-bg outline-none"
              />
              <div className="flex items-center gap-2 border-2 border-brand-dark rounded-brutal px-3 py-2.5 bg-brand-bg">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Set password"
                  className="flex-1 bg-transparent font-sans text-sm outline-none"
                />
                <button onClick={() => setShowPass(p => !p)} className="text-brand-light hover:text-brand-dark">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="font-sans text-xs text-brand-light">
                A roll number (WRK00X) will be auto-assigned.
              </p>
            </div>
            <div className="flex gap-3">
              <BrutalButton onClick={handleCreate} variant="secondary" fullWidth>Create</BrutalButton>
              <BrutalButton onClick={() => setShowForm(false)} variant="ghost" fullWidth>Cancel</BrutalButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatedPage>
  );
}
