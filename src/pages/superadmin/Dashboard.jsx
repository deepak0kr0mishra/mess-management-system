import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Wallet, TrendingUp, FileText } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import { BrutalCard } from '../../components/ui';
import { getAllStudents, listenPendingOptOuts } from '../../lib/firestoreService';

/* ─────────────────────────────────────────────────────────
   Super Admin — Dashboard (Phase 2: real Firestore data)
───────────────────────────────────────────────────────── */

function StatCard({ color, icon: Icon, label, value, onClick }) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
      <BrutalCard color={color} className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-brutal bg-white/50 border border-brand-dark/20 flex items-center justify-center">
            <Icon size={18} className="text-brand-dark" />
          </div>
          <div>
            <p className="font-sans text-xs text-brand-dark/60 uppercase tracking-wider">{label}</p>
            <p className="font-serif font-bold text-3xl text-brand-dark">{value}</p>
          </div>
        </div>
      </BrutalCard>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    getAllStudents()
      .then(setStudents)
      .finally(() => setLoading(false));

    const unsub = listenPendingOptOuts(setPending);
    return () => unsub?.();
  }, []);

  const totalWallet = students.reduce((s, u) => s + (u.walletBalance || 0), 0);
  const totalRefunds = pending.reduce((s, r) => s + (r.estimatedRefund || 0), 0);

  return (
    <AnimatedPage direction={1} className="p-8">
      <div className="mb-6">
        <h2 className="font-serif font-bold text-3xl">
          Control <span className="highlight">Panel</span>
        </h2>
        <p className="font-sans text-sm text-brand-light mt-1">
          {loading ? 'Loading...' : `${students.length} students registered`}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-2xl">
        <StatCard
          color="bg-brand-primary"
          icon={Users}
          label="Total Students"
          value={loading ? '...' : students.length}
          onClick={() => setShowList(true)}
        />
        <StatCard
          color="bg-brand-secondary"
          icon={FileText}
          label="Pending Requests"
          value={pending.length}
        />
        <StatCard
          color="bg-brand-gold"
          icon={Wallet}
          label="Total Wallet (₹)"
          value={`₹${totalWallet.toLocaleString('en-IN')}`}
        />
        <StatCard
          color="bg-brand-accent"
          icon={TrendingUp}
          label="Pending Refunds"
          value={`₹${totalRefunds.toLocaleString('en-IN')}`}
        />
      </div>

      {/* Recent opt-out requests */}
      <h3 className="font-serif font-bold text-xl mb-4">Recent Pending Requests</h3>
      <div className="flex flex-col gap-3 max-w-2xl mb-8">
        {pending.slice(0, 5).map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <BrutalCard className="p-4 flex items-center justify-between">
              <div>
                <p className="font-sans font-bold text-sm">{r.studentName || r.rollNumber}</p>
                <p className="font-sans text-xs text-brand-light">{r.numDays} day(s) from {r.startDate}</p>
              </div>
              <span className="font-serif font-bold text-brand-gold text-lg">₹{r.estimatedRefund || 0}</span>
            </BrutalCard>
          </motion.div>
        ))}
        {pending.length === 0 && !loading && (
          <BrutalCard className="p-5 text-center">
            <p className="font-sans text-sm text-brand-light">🎉 No pending requests.</p>
          </BrutalCard>
        )}
      </div>

      {/* Student list modal */}
      {showList && (
        <div className="fixed inset-0 bg-brand-dark/50 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-brand-bg border-2 border-brand-dark rounded-brutal shadow-brutal-lg w-full max-w-xl max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b-2 border-brand-dark">
              <h3 className="font-serif font-bold text-xl">All Students ({students.length})</h3>
              <button onClick={() => setShowList(false)} className="font-sans text-sm text-brand-light hover:text-brand-dark">✕ Close</button>
            </div>
            <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-2">
              {students.map(s => (
                <div key={s.uid} className="flex items-center gap-3 py-2 border-b border-brand-dark/10">
                  <div className="w-8 h-8 rounded-full bg-brand-primary border-2 border-brand-dark flex items-center justify-center font-serif font-bold text-sm shrink-0">
                    {(s.displayName || '?')[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-sans font-bold text-sm">{s.displayName}</p>
                    <p className="font-mono text-xs text-brand-light">{s.rollNumber}</p>
                  </div>
                  <span className={`font-serif font-bold text-sm ${Number(s.walletBalance) < 0 ? 'text-red-600' : 'text-brand-gold'}`}>
                    ₹{s.walletBalance || 0}
                  </span>
                </div>
              ))}
              {students.length === 0 && (
                <p className="font-sans text-sm text-brand-light text-center py-8">No students found.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatedPage>
  );
}
