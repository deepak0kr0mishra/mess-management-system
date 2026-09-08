import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FullPageLoader } from './Feedback';

/* ─────────────────────────────────────────────────────────
   ProtectedRoute
   Guards routes by role. Redirects to /login if unauthenticated.
   Redirects to role's home if role doesn't match.
───────────────────────────────────────────────────────── */

const ROLE_HOME = {
  student:     '/student/routine',
  committee:   '/committee/dashboard',
  worker:      '/worker',
  super_admin: '/superadmin/dashboard',
};

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <FullPageLoader />;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] ?? '/login'} replace />;
  }

  return children;
}
