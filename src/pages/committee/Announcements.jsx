import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Plus, Trash2 } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import { BrutalCard, BrutalButton, BrutalBadge } from '../../components/ui';

/* Committee — Announcements */

const MOCK_ANNOUNCEMENTS = [
  { id: 'a1', title: 'Sunday Special Feast', body: 'Dal Makhani + Rasgulla this Sunday. Don\'t miss it!', type: 'success', date: '11 Aug 2026', createdBy: 'Priya Singh' },
  { id: 'a2', title: 'Water Supply Disruption', body: 'Water supply will be off 6–8 AM tomorrow. Please plan accordingly.', type: 'warning', date: '10 Aug 2026', createdBy: 'Priya Singh' },
  { id: 'a3', title: 'Menu Change Today', body: 'Lunch sabzi changed from Aloo Gobi to Matar Paneer due to supply.', type: 'info', date: '9 Aug 2026', createdBy: 'Priya Singh' },
];

const TYPE_STYLES = {
  success: 'bg-brand-accent',
  warning: 'bg-brand-primary',
  info:    'bg-brand-purple',
};
const TYPE_ICONS = { success: '✅', warning: '⚠️', info: 'ℹ️' };

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [showForm, setShowForm]           = useState(false);
  const [form, setForm]                   = useState({ title: '', body: '', type: 'info' });

  const handlePost = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    const newAnn = { id: Date.now().toString(), ...form, date: 'Just now', createdBy: 'Committee' };
    setAnnouncements(prev => [newAnn, ...prev]);
    setShowForm(false);
    setForm({ title: '', body: '', type: 'info' });
  };

  const handleDelete = (id) => setAnnouncements(prev => prev.filter(a => a.id !== id));

  return (
    <AnimatedPage direction={1} className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif font-bold text-3xl">
            <span className="highlight-purple">Announcements</span>
          </h2>
          <p className="font-sans text-sm text-brand-light mt-1">Push live updates to all students</p>
        </div>
        <BrutalButton icon={Plus} onClick={() => setShowForm(true)} variant="secondary">
          New Post
        </BrutalButton>
      </div>

      <div className="flex flex-col gap-4 max-w-2xl">
        <AnimatePresence>
          {announcements.map((ann) => (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <BrutalCard color={TYPE_STYLES[ann.type]} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-xl shrink-0">{TYPE_ICONS[ann.type]}</span>
                    <div>
                      <h3 className="font-sans font-bold text-sm">{ann.title}</h3>
                      <p className="font-sans text-sm text-brand-dark/80 mt-1">{ann.body}</p>
                      <p className="font-sans text-xs text-brand-light mt-2">
                        {ann.date} · by {ann.createdBy}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="text-brand-light hover:text-brand-dark transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </BrutalCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-brand-dark/40 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-brand-bg border-2 border-brand-dark rounded-brutal shadow-brutal-lg p-6 w-full max-w-md"
          >
            <h3 className="font-serif font-bold text-xl mb-4">New Announcement</h3>
            <div className="flex flex-col gap-3 mb-4">
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Title"
                className="border-2 border-brand-dark rounded-brutal px-3 py-2.5 font-sans text-sm bg-brand-bg outline-none"
              />
              <textarea
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                placeholder="Announcement text..."
                rows={3}
                className="border-2 border-brand-dark rounded-brutal px-3 py-2.5 font-sans text-sm bg-brand-bg outline-none resize-none"
              />
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="border-2 border-brand-dark rounded-brutal px-3 py-2.5 font-sans text-sm bg-brand-bg outline-none"
              >
                <option value="info">Info</option>
                <option value="success">Success / Positive</option>
                <option value="warning">Warning</option>
              </select>
            </div>
            <div className="flex gap-3">
              <BrutalButton onClick={handlePost} variant="secondary" fullWidth>Post</BrutalButton>
              <BrutalButton onClick={() => setShowForm(false)} variant="ghost" fullWidth>Cancel</BrutalButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatedPage>
  );
}
