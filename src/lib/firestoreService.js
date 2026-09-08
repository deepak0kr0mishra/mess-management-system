<<<<<<< HEAD
// ─────────────────────────────────────────────────────────
=======
gh auth login// ─────────────────────────────────────────────────────────
>>>>>>> f8cf1c4 (test case)
//  src/lib/firestoreService.js
//  All Firestore read/write helpers — imported by components
// ─────────────────────────────────────────────────────────
import {
  doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc,
  collection, query, where, orderBy, onSnapshot,
  serverTimestamp, getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import { format } from 'date-fns';

const TODAY = () => format(new Date(), 'yyyy-MM-dd');

/* ── Users ──────────────────────────────────────────────── */

/** Fetch a single user document */
export const getUser = (uid) =>
  getDoc(doc(db, 'users', uid)).then(s => s.exists() ? { uid, ...s.data() } : null);

/** Create or overwrite a user document (used during registration) */
export const setUser = (uid, data) =>
  setDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });

/** Fetch all users with role = 'student' */
export const getAllStudents = () =>
  getDocs(query(collection(db, 'users'), where('role', '==', 'student')))
    .then(snap => snap.docs.map(d => ({ uid: d.id, ...d.data() })));

/** Live listener for all students (so approval status updates in real-time) */
export const listenAllStudents = (callback) => {
  const q = query(collection(db, 'users'), where('role', '==', 'student'));
  return onSnapshot(q, snap =>
    callback(
      snap.docs
        .map(d => ({ uid: d.id, ...d.data() }))
        .sort((a, b) => (a.rollNumber || '').localeCompare(b.rollNumber || ''))
    )
  );
};

/** Approve a student registration (sets isApproved: true) */
export const approveStudent = (uid) =>
  updateDoc(doc(db, 'users', uid), { isApproved: true,  updatedAt: serverTimestamp() });

/** Reject / unapprove a student registration */
export const rejectStudent = (uid) =>
  updateDoc(doc(db, 'users', uid), { isApproved: false, updatedAt: serverTimestamp() });

/** Fetch all users with role = 'committee' */
export const getAllCommittee = () =>
  getDocs(query(collection(db, 'users'), where('role', '==', 'committee')))
    .then(snap => snap.docs.map(d => ({ uid: d.id, ...d.data() })));

/** Update a user's role (Super Admin only — enforced by security rules) */
export const setUserRole = (uid, role) =>
  updateDoc(doc(db, 'users', uid), { role, updatedAt: serverTimestamp() });

/** Update wallet balance */
export const updateWallet = (uid, newBalance) =>
  updateDoc(doc(db, 'users', uid), { walletBalance: newBalance, updatedAt: serverTimestamp() });

/* ── Opt-Out Requests ───────────────────────────────────── */

/** Submit a new opt-out request */
export const submitOptOut = async (uid, data) => {
<<<<<<< HEAD
  // Same-day opt-out block — UI bypass ho tab bhi guard rahe
  if (!data?.startDate || data.startDate <= TODAY()) {
    throw new Error('SAME_DAY_NOT_ALLOWED');
  }
=======
>>>>>>> f8cf1c4 (test case)
  const ref = await addDoc(collection(db, 'optouts'), {
    uid,
    ...data,               // startDate, numDays, reason, docBase64, docFileName
    status:      'pending',
    submittedAt: serverTimestamp(),
  });
  return ref.id;
};

/** Live listener for pending opt-out requests (committee view) */
export const listenPendingOptOuts = (callback) => {
  // Only filter by status — no orderBy to avoid needing a composite index
  const q = query(
    collection(db, 'optouts'),
    where('status', '==', 'pending')
  );
  return onSnapshot(q, snap =>
    callback(
      snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.submittedAt?.seconds ?? 0) - (a.submittedAt?.seconds ?? 0))
    )
  );
};

/** Live listener for ALL opt-out requests (admin/committee overview) */
export const listenAllOptOuts = (callback) => {
  const q = query(
    collection(db, 'optouts'),
    orderBy('submittedAt', 'desc')
  );
  return onSnapshot(q, snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
};

/** Approve: status → 'approved', credit refund to wallet */
export const approveOptOut = async (requestId, { uid, refundAmount, currentBalance }) => {
  const batch = [
    updateDoc(doc(db, 'optouts', requestId), {
      status:      'approved',
      processedAt: serverTimestamp(),
    }),
    updateWallet(uid, (currentBalance || 0) + refundAmount),
  ];
  await Promise.all(batch);
};

/** Reject: status → 'rejected' */
export const rejectOptOut = (requestId) =>
  updateDoc(doc(db, 'optouts', requestId), {
    status:      'rejected',
    processedAt: serverTimestamp(),
  });

/** Get a student's own opt-out history */
export const listenMyOptOuts = (uid, callback) => {
  // Filter by uid only — no orderBy to avoid composite index requirement
  const q = query(
    collection(db, 'optouts'),
    where('uid', '==', uid)
  );
  return onSnapshot(q, snap =>
    callback(
      snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.submittedAt?.seconds ?? 0) - (a.submittedAt?.seconds ?? 0))
    )
  );
};

/* ── Daily Token ────────────────────────────────────────── */

/** Get today's token document */
export const getDailyToken = () =>
  getDoc(doc(db, 'system', 'dailyToken')).then(s => s.exists() ? s.data() : null);

/** Live listener for the daily token */
export const listenDailyToken = (callback) =>
  onSnapshot(doc(db, 'system', 'dailyToken'), snap =>
    snap.exists() && callback(snap.data())
  );

/** Set today's token (committee/admin) */
export const setDailyToken = (data) =>
  setDoc(doc(db, 'system', 'dailyToken'), {
    ...data,
    activeDate: TODAY(),
    updatedAt:  serverTimestamp(),
  });

/* ── Blocklist ──────────────────────────────────────────── */

/** Get today's opt-out blocklist as an array of UIDs */
export const getTodayBlocklist = async () => {
  const ref = doc(db, 'blocklist', TODAY());
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data().uids || []) : [];
};

/** Rebuild blocklist from approved opt-outs for today
    Called by committee after approving requests */
export const rebuildBlocklist = async () => {
  const today = TODAY();
  const snap  = await getDocs(
    query(collection(db, 'optouts'), where('status', '==', 'approved'))
  );
  const uids = snap.docs
    .map(d => d.data())
    .filter(r => r.startDate <= today && r.startDate + r.numDays > today)
    .map(r => r.uid);

  await setDoc(doc(db, 'blocklist', today), { uids, updatedAt: serverTimestamp() });
  return uids;
};

/* ── Meal Scans ─────────────────────────────────────────── */

/** Record that a student's QR was scanned for a meal */
export const recordScan = async (uid, mealKey, date, studentName, rollNumber) => {
  await setDoc(
    doc(db, 'scans', date, mealKey, uid),
    { uid, mealKey, date, studentName, rollNumber, scannedAt: serverTimestamp() },
    { merge: true }
  );
};

/** Live listener for scans of a specific meal on a given date */
export const listenMealScans = (date, mealKey, callback) =>
  onSnapshot(
    collection(db, 'scans', date, mealKey),
    snap => callback(snap.docs.map(d => ({ uid: d.id, ...d.data() })))
  );

/** Get UIDs of students opted out today (for worker panel) */
export const getTodayOptOutUIDs = async () => {
  const today = TODAY();
  const snap  = await getDoc(doc(db, 'blocklist', today));
  return snap.exists() ? new Set(snap.data().uids || []) : new Set();
};

/* ── Penalties ──────────────────────────────────────────── */

/**
 * Apply a penalty to a student:
<<<<<<< HEAD
 * - Deducts amount from wallet (min 0)
=======
 * - Deducts amount from wallet (negative balances are allowed)
>>>>>>> f8cf1c4 (test case)
 * - Writes a record to /penalties collection
 */
export const applyPenalty = async (uid, { amount, reason, appliedBy }) => {
  const userSnap = await getDoc(doc(db, 'users', uid));
  if (!userSnap.exists()) throw new Error('Student not found');
  const student = userSnap.data();
<<<<<<< HEAD
  const newBalance = Math.max(0, (student.walletBalance || 0) - amount);
=======
  const balanceBefore = Number(student.walletBalance) || 0;
  const penaltyAmount = Number(amount);
  if (!Number.isFinite(penaltyAmount) || penaltyAmount <= 0) {
    throw new Error('Penalty amount must be greater than zero');
  }
  const newBalance = balanceBefore - penaltyAmount;
>>>>>>> f8cf1c4 (test case)

  await Promise.all([
    // Deduct from wallet
    updateDoc(doc(db, 'users', uid), {
      walletBalance: newBalance,
      updatedAt: serverTimestamp(),
    }),
    // Write penalty record
    addDoc(collection(db, 'penalties'), {
      uid,
      studentName:  student.displayName || '',
      rollNumber:   student.rollNumber  || '',
<<<<<<< HEAD
      amount,
      reason,
      appliedBy,
      appliedAt:    serverTimestamp(),
      balanceBefore: student.walletBalance || 0,
=======
      amount: penaltyAmount,
      reason,
      appliedBy,
      appliedAt:    serverTimestamp(),
      balanceBefore,
>>>>>>> f8cf1c4 (test case)
      balanceAfter:  newBalance,
    }),
  ]);
  return newBalance;
};

/** Live listener for penalty records, ordered newest first */
export const listenPenalties = (callback) => {
  const q = query(
    collection(db, 'penalties'),
    orderBy('appliedAt', 'desc')
  );
  return onSnapshot(q, snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
};

<<<<<<< HEAD
/** Mark a penalty as resolved (and refund the amount back to the student's wallet) */
export const resolvePenalty = async (penaltyId, uid, amount) => {
  const userSnap = await getDoc(doc(db, 'users', uid));
  if (!userSnap.exists()) throw new Error('Student not found');
  const current = userSnap.data().walletBalance || 0;
  await Promise.all([
    updateDoc(doc(db, 'users', uid), {
      walletBalance: current + amount,
=======
/** Mark a penalty as resolved and refund only the amount actually deducted */
export const resolvePenalty = async (penaltyId, uid, amount) => {
  const userSnap = await getDoc(doc(db, 'users', uid));
  if (!userSnap.exists()) throw new Error('Student not found');
  const current = Number(userSnap.data().walletBalance) || 0;
  const penalty = Number(amount) || 0;
  const penaltySnapshot = await getDoc(doc(db, 'penalties', penaltyId));
  if (!penaltySnapshot.exists()) throw new Error('Penalty not found');
  const record = penaltySnapshot.data();
  const hasBalanceSnapshot = Number.isFinite(Number(record.balanceBefore))
    && Number.isFinite(Number(record.balanceAfter));
  const deducted = Math.max(
    0,
    (Number(record.balanceBefore) || 0) - (Number(record.balanceAfter) || 0)
  );
  const refund = hasBalanceSnapshot ? deducted : Math.min(penalty, current);
  await Promise.all([
    updateDoc(doc(db, 'users', uid), {
      walletBalance: current + refund,
>>>>>>> f8cf1c4 (test case)
      updatedAt: serverTimestamp(),
    }),
    updateDoc(doc(db, 'penalties', penaltyId), {
      resolved: true,
      resolvedAt: serverTimestamp(),
    }),
  ]);
};

/** Permanently remove a penalty record (no refund) */
export const removePenalty = async (penaltyId) => {
  const { deleteDoc } = await import('firebase/firestore');
  await deleteDoc(doc(db, 'penalties', penaltyId));
};

/* ── Menu ───────────────────────────────────────────────── */

/** Live listener for today's menu */
export const listenTodayMenu = (callback) =>
  onSnapshot(doc(db, 'menu', TODAY()), snap =>
    snap.exists() && callback(snap.data())
  );

/** Save today's menu (committee) */
export const saveTodayMenu = (menuData) =>
  setDoc(doc(db, 'menu', TODAY()), { ...menuData, updatedAt: serverTimestamp() }, { merge: true });

/* ── Announcements ──────────────────────────────────────── */

/** Live listener for pinned + recent announcements */
export const listenAnnouncements = (callback) => {
  const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
};

/** Create announcement */
export const createAnnouncement = (data) =>
  addDoc(collection(db, 'announcements'), { ...data, createdAt: serverTimestamp() });

/** Delete announcement */
export const deleteAnnouncement = (id) =>
  deleteDoc(doc(db, 'announcements', id));

/* ── Feedback Chat ──────────────────────────────────────────────────── */

/** Live listener — last 60 messages, ordered ascending for chat display */
export const listenFeedback = (callback) => {
  const q = query(
    collection(db, 'feedback'),
    orderBy('sentAt', 'asc')
  );
  return onSnapshot(q, snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
};

/** Send a plain message */
export const sendFeedbackMessage = async (senderProfile, text, replyTo = null) => {
  return addDoc(collection(db, 'feedback'), {
    uid:         senderProfile.uid,
    displayName: senderProfile.displayName || 'User',
    rollNumber:  senderProfile.rollNumber  || '',
    role:        senderProfile.role        || 'student',
    type:        'message',
    text,
    replyTo,       // null | { id, text, displayName }
    reactions:   {},  // { emoji: [uid, uid, …] }
    sentAt:      serverTimestamp(),
  });
};

/** Create a poll (committee / auto) */
export const sendFeedbackPoll = async (senderProfile, question, options, meta = {}) => {
  return addDoc(collection(db, 'feedback'), {
    uid:          senderProfile.uid,
    displayName:  senderProfile.displayName || 'Mess Committee',
    rollNumber:   senderProfile.rollNumber  || '',
    role:         senderProfile.role        || 'committee',
    type:         'poll',
    text:         question,
    pollOptions:  options.map(label => ({ label, voters: [] })),
    reactions:    {},
    replyTo:      null,
    isAutomatic:  meta.isAutomatic  ?? false,
    pollMeal:     meta.pollMeal     ?? null,
    pollDate:     meta.pollDate     ?? TODAY(),
    sentAt:       serverTimestamp(),
  });
};

/** Toggle reaction emoji on a message */
export const toggleReaction = async (msgId, uid, emoji) => {
  const ref  = doc(db, 'feedback', msgId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const reactions = snap.data().reactions || {};
  const voters    = reactions[emoji] || [];
  const already   = voters.includes(uid);
  await updateDoc(ref, {
    [`reactions.${emoji}`]: already
      ? voters.filter(u => u !== uid)
      : [...voters, uid],
  });
};

/** Vote on a poll option (removes previous vote from same poll) */
export const voteOnPoll = async (msgId, uid, optionIndex) => {
  const ref  = doc(db, 'feedback', msgId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const opts = snap.data().pollOptions || [];
  // Remove uid from all options, then add to chosen one
  const updated = opts.map((o, i) => ({
    ...o,
    voters: i === optionIndex
      ? (o.voters.includes(uid) ? o.voters.filter(u => u !== uid) : [...o.voters, uid])
      : o.voters.filter(u => u !== uid),
  }));
  await updateDoc(ref, { pollOptions: updated });
};

/** Count messages sent by uid in the last hour (rate limiting) */
export const getMyMessageCountLastHour = async (uid) => {
  const oneHourAgo = new Date(Date.now() - 3_600_000);
  // Firestore Timestamp comparison — use simple query
  const snap = await getDocs(
    query(
      collection(db, 'feedback'),
      where('uid',  '==', uid),
      where('type', '==', 'message')
    )
  );
  return snap.docs.filter(d => {
    const ts = d.data().sentAt;
    if (!ts) return false;
    return ts.toDate() >= oneHourAgo;
  }).length;
};

/** Check if an auto-poll for a given meal+date has already been sent */
export const hasAutoPollForMeal = async (meal, date) => {
  const snap = await getDocs(
    query(
      collection(db, 'feedback'),
      where('isAutomatic', '==', true),
      where('pollMeal',    '==', meal),
      where('pollDate',    '==', date)
    )
  );
  return !snap.empty;
};
<<<<<<< HEAD

=======
>>>>>>> f8cf1c4 (test case)
