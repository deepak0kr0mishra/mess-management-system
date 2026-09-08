import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, UtensilsCrossed, AlertCircle, Clock, CheckCircle2, XCircle, FileText } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import { BrutalCard, BrutalBadge, BrutalButton } from '../../components/ui';
import { listenPendingOptOuts, approveOptOut, rejectOptOut, getAllStudents } from '../../lib/firestoreService';

/* ─────────────────────────────────────────────────────────
   Committee — Dashboard (Opt-Out Request Queue)
   Phase 2: Live Firestore data
───────────────────────────────────────────────────────── */

const STATUS_CONF = {
  pending:  { label: 'Pending',  color: 'bg-brand-purple',    Icon: Clock         },
  approved: { label: 'Approved', color: 'bg-brand-accent',    Icon: CheckCircle2  },
  rejected: { label: 'Rejected', color: 'bg-brand-secondary', Icon: XCircle       },
};

function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 22 }}
    >
      <BrutalCard color={color} className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-brutal bg-white/40 border border-brand-dark/20">
            <Icon size={18} className="text-brand-dark" />
          </div>
        </div>
        <p className="font-serif font-bold text-3xl text-brand-dark">{value}</p>
        <p className="font-sans font-semibold text-sm text-brand-dark mt-1">{label}</p>
      </BrutalCard>
    </motion.div>
  );
}

export default function Dashboard() {
  const [requests,  setRequests]  = useState([]);
  const [students,  setStudents]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [actioning, setActioning] = useState(null); // id being approved/rejected

  useEffect(() => {
    getAllStudents().then(s => { setStudents(s); setLoading(false); });
    const unsub = listenPendingOptOuts(setRequests);
    return () => unsub?.();
  }, []);

  const handleApprove = async (r) => {
    setActioning(r.id);
    const student = students.find(s => s.uid === r.uid);
    try {
      await approveOptOut(r.id, {
        uid:            r.uid,
        refundAmount:   r.estimatedRefund || 0,
        currentBalance: student?.walletBalance || 0,
      });
    } finally {
      setActioning(null);
    }
  };

  const handleReject = async (r) => {
    setActioning(r.id);
    try {
      await rejectOptOut(r.id);
    } finally {
      setActioning(null);
    }
  };

  const totalStudents  = students.length;
  const totalOptOut    = requests.length;
  const eating         = totalStudents - totalOptOut;
  const totalRefunds   = requests.reduce((s, r) => s + (r.estimatedRefund || 0), 0);

  return (
    <AnimatedPage direction={1} className="p-8">
      <div className="mb-6">
        <h2 className="font-serif font-bold text-3xl text-brand-dark">
          Today's <span className="highlight">Headcount</span>
        </h2>
        <p className="font-sans text-sm text-brand-light mt-1">
          {loading ? 'Loading...' : `${totalStudents} students registered`}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Users}           label="Total Students"  value={loading ? '...' : totalStudents} color="bg-brand-surface"   delay={0}    />
        <StatCard icon={UtensilsCrossed} label="Eating Today"    value={loading ? '...' : eating}        color="bg-brand-accent"    delay={0.06} />
        <StatCard icon={TrendingUp}      label="Opted Out"       value={totalOptOut}                     color="bg-brand-secondary" delay={0.12} />
        <StatCard icon={AlertCircle}     label="Pending Refunds" value={`₹${totalRefunds}`}              color="bg-brand-primary"   delay={0.18} />
      </div>

      {/* Opt-out request queue */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-bold text-xl">Student Opt-Out Requests</h3>
        {requests.length > 0 && (
          <span className="font-sans text-xs font-bold bg-brand-secondary border-2 border-brand-dark px-2.5 py-1 rounded-pill">
            {requests.length} pending
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 max-w-3xl">
        {requests.length === 0 && !loading && (
          <BrutalCard className="p-8 text-center">
            <CheckCircle2 size={32} className="mx-auto mb-2 text-brand-accent" />
            <p className="font-sans font-bold text-sm">No pending requests 🎉</p>
            <p className="font-sans text-xs text-brand-light mt-1">All opt-out requests have been processed.</p>
          </BrutalCard>
        )}

        {requests.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: i * 0.05 }}
          >
            <BrutalCard className="p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                {/* Student info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary border-2 border-brand-dark flex items-center justify-center font-serif font-bold shrink-0">
                    {(r.studentName || r.rollNumber || '?')[0]}
                  </div>
                  <div>
                    <p className="font-sans font-bold text-sm">{r.studentName || 'Unknown'}</p>
                    <p className="font-mono text-xs text-brand-light">{r.rollNumber}</p>
                  </div>
                </div>

                {/* Status + Refund */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <BrutalBadge color="bg-brand-purple">Pending</BrutalBadge>
                  <span className="font-serif font-bold text-brand-gold">₹{r.estimatedRefund || 0}</span>
                </div>
              </div>

              {/* Request details */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-brand-bg border border-brand-dark/15 rounded-brutal p-2.5 text-center">
                  <p className="font-sans text-[10px] text-brand-light uppercase tracking-wider">Duration</p>
                  <p className="font-serif font-bold text-base">{r.numDays}d</p>
                </div>
                <div className="bg-brand-bg border border-brand-dark/15 rounded-brutal p-2.5 text-center">
                  <p className="font-sans text-[10px] text-brand-light uppercase tracking-wider">Start</p>
                  <p className="font-mono text-xs font-bold">{r.startDate}</p>
                </div>
                <div className="bg-brand-bg border border-brand-dark/15 rounded-brutal p-2.5 text-center">
                  <p className="font-sans text-[10px] text-brand-light uppercase tracking-wider">Refund</p>
                  <p className="font-serif font-bold text-base text-brand-gold">₹{r.estimatedRefund || 0}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-brand-bg border border-brand-dark/15 rounded-brutal p-3 mb-4">
                <p className="font-sans text-[10px] text-brand-light uppercase tracking-wider mb-1">Reason</p>
                <p className="font-sans text-sm text-brand-dark">{r.reason}</p>
              </div>

              {/* Document link */}
              {r.docFileName && (
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={14} className="text-brand-light" />
                  <a
                    href={r.docBase64}
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans text-xs underline text-brand-dark hover:text-brand-purple"
                  >
                    {r.docFileName}
                  </a>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <BrutalButton
                  variant="secondary"
                  fullWidth
                  disabled={actioning === r.id}
                  onClick={() => handleApprove(r)}
                >
                  {actioning === r.id ? '…' : '✓ Approve'}
                </BrutalButton>
                <BrutalButton
                  variant="ghost"
                  fullWidth
                  disabled={actioning === r.id}
                  onClick={() => handleReject(r)}
                >
                  {actioning === r.id ? '…' : '✕ Reject'}
                </BrutalButton>
              </div>
            </BrutalCard>
          </motion.div>
        ))}
      </div>
    </AnimatedPage>
  );
}
