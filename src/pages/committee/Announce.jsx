import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Pin } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import { BrutalCard, BrutalButton } from '../../components/ui';
import { listenAnnouncements, createAnnouncement, deleteAnnouncement } from '../../lib/firestoreService';
import { useAuth } from '../../context/AuthContext';

/* ─────────────────────────────────────────────────────────
   Committee — Announcements (Phase 2: live Firestore)
───────────────────────────────────────────────────────── */

export default function Announce() {
  const { user }                      = useAuth();
  const [items, setItems]             = useState([]);
  const [title, setTitle]             = useState('');
  const [body,  setBody]              = useState('');
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    const unsub = listenAnnouncements(setItems);
    return () => unsub?.();
  }, []);

  const handlePost = async () => {
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    try {
      await createAnnouncement({ title, body, createdBy: user?.uid || '' });
      setTitle(''); setBody('');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try { await deleteAnnouncement(id); } catch (err) { console.error(err); }
  };

  return (
    <AnimatedPage direction={1} className="p-8">
      <div className="mb-6">
        <h2 className="font-serif font-bold text-3xl">Announcements</h2>
        <p className="font-sans text-sm text-brand-light mt-1">Broadcast to all students instantly</p>
      </div>

      {/* New announcement form */}
      <BrutalCard className="p-5 max-w-2xl mb-8">
        <h3 className="font-serif font-bold text-lg mb-4">New Announcement</h3>
        <div className="flex flex-col gap-3">
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Title (e.g. Special Sunday Feast)"
            className="border-2 border-brand-dark rounded-brutal px-3 py-2.5 font-sans text-sm bg-brand-bg outline-none" />
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={3}
            placeholder="Announcement body..."
            className="border-2 border-brand-dark rounded-brutal px-3 py-2.5 font-sans text-sm bg-brand-bg outline-none resize-none" />
          <BrutalButton icon={Plus} onClick={handlePost} disabled={saving || !title.trim() || !body.trim()}>
            {saving ? 'Posting...' : 'Post Announcement'}
          </BrutalButton>
        </div>
      </BrutalCard>

      {/* Existing announcements */}
      <h3 className="font-serif font-bold text-xl mb-4">All Announcements ({items.length})</h3>
      <div className="flex flex-col gap-3 max-w-2xl">
        <AnimatePresence>
          {items.map((ann, i) => (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ delay: i * 0.04 }}
            >
              <BrutalCard className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-sans font-bold text-sm">📢 {ann.title}</p>
                    <p className="font-sans text-xs text-brand-dark mt-1">{ann.body}</p>
                    <p className="font-sans text-[10px] text-brand-light mt-2">
                      {ann.createdAt?.toDate?.()
                        ? ann.createdAt.toDate().toLocaleString('en-IN')
                        : 'Just now'}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(ann.id)}
                    className="shrink-0 text-brand-light hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </BrutalCard>
            </motion.div>
          ))}
          {items.length === 0 && (
            <BrutalCard className="p-6 text-center">
              <p className="font-sans text-sm text-brand-light">No announcements yet. Post one above.</p>
            </BrutalCard>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}
