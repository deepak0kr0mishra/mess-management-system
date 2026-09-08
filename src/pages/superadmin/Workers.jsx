import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserX, UserCheck, Hammer } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import { BrutalCard, BrutalButton, BrutalBadge } from '../../components/ui';
import { getAllStudents, setUserRole } from '../../lib/firestoreService';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

/* ─────────────────────────────────────────────────────────
   Super Admin — Worker Management
   Lists all approved workers, allows promoting students
   and revoking worker access back to student
───────────────────────────────────────────────────────── */

const getWorkers = () =>
  getDocs(query(collection(db, 'users'), where('role', '==', 'worker')))
    .then(snap => snap.docs.map(d => ({ uid: d.id, ...d.data() })));

export default function Workers() {
  const [workers,    setWorkers]    = useState([]);
  const [students,   setStudents]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [processing, setProcessing] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const [w, s] = await Promise.all([getWorkers(), getAllStudents()]);
      setWorkers(w);
      setStudents(s);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const promote = async (uid) => {
    setProcessing(p => ({ ...p, [uid]: true }));
    try { await setUserRole(uid, 'worker'); await load(); }
    catch (err) { console.error(err); }
    finally { setProcessing(p => ({ ...p, [uid]: false })); }
  };

  const revoke = async (uid) => {
    setProcessing(p => ({ ...p, [uid]: true }));
    try { await setUserRole(uid, 'student'); await load(); }
    catch (err) { console.error(err); }
    finally { setProcessing(p => ({ ...p, [uid]: false })); }
  };

  const filteredStudents = students.filter(
    s => s.displayName?.toLowerCase().includes(search.toLowerCase()) ||
         s.rollNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatedPage direction={1} className="p-8">
      <div className="mb-6">
        <h2 className="font-serif font-bold text-3xl">
          Worker <span className="highlight">Management</span>
        </h2>
        <p className="font-sans text-sm text-brand-light mt-1">
          Approve workers who operate the mess gate terminal
        </p>
      </div>

      {/* Active workers */}
      <h3 className="font-serif font-bold text-xl mb-3">
        Active Workers ({workers.length})
      </h3>
      <div className="flex flex-col gap-3 max-w-2xl mb-10">
        {workers.length === 0 && !loading && (
          <BrutalCard className="p-6 text-center">
            <Hammer size={28} className="mx-auto mb-2 text-brand-dark/30" />
            <p className="font-sans text-sm text-brand-light">
              No workers assigned yet. Promote students below.
            </p>
          </BrutalCard>
        )}
        <AnimatePresence>
          {workers.map((w, i) => (
            <motion.div key={w.uid}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}>
              <BrutalCard color="bg-brand-primary" className="p-4 flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-white border-2 border-brand-dark flex items-center justify-center font-serif font-bold shrink-0">
                  {(w.displayName || '?')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-bold text-sm">{w.displayName}</p>
                  <p className="font-mono text-xs text-brand-light">{w.rollNumber}</p>
                </div>
                <BrutalBadge color="bg-brand-dark text-brand-bg">Worker</BrutalBadge>
                <BrutalButton
                  size="sm" variant="danger" icon={UserX}
                  disabled={!!processing[w.uid]}
                  onClick={() => revoke(w.uid)}
                >
                  {processing[w.uid] ? '...' : 'Revoke'}
                </BrutalButton>
              </BrutalCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Promote from students */}
      <div className="flex items-center justify-between mb-3 max-w-2xl">
        <h3 className="font-serif font-bold text-xl">
          Promote Student to Worker
        </h3>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-light pointer-events-none" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-8 pr-3 py-2 border-2 border-brand-dark rounded-brutal font-sans text-xs bg-brand-bg outline-none w-36"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 max-w-2xl">
        {loading ? (
          <BrutalCard className="p-5 text-center">
            <p className="font-sans text-sm text-brand-light animate-pulse">Loading students...</p>
          </BrutalCard>
        ) : filteredStudents.length === 0 ? (
          <BrutalCard className="p-5 text-center">
            <p className="font-sans text-sm text-brand-light">No students found.</p>
          </BrutalCard>
        ) : (
          filteredStudents.map((s, i) => (
            <motion.div key={s.uid}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}>
              <BrutalCard className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-secondary border-2 border-brand-dark flex items-center justify-center font-serif font-bold text-sm shrink-0">
                  {(s.displayName || '?')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-bold text-sm">{s.displayName}</p>
                  <p className="font-mono text-xs text-brand-light">{s.rollNumber}</p>
                </div>
                <BrutalButton
                  size="sm" icon={UserCheck}
                  disabled={!!processing[s.uid]}
                  onClick={() => promote(s.uid)}
                >
                  {processing[s.uid] ? '...' : 'Make Worker'}
                </BrutalButton>
              </BrutalCard>
            </motion.div>
          ))
        )}
      </div>
    </AnimatedPage>
  );
}
