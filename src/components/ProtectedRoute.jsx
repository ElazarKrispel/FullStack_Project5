import { Navigate } from 'react-router-dom';
import { getLoggedUser } from '../utils/storage';

/**
 * Renders children if a user is logged in, otherwise redirects to /login.
 */
export default function ProtectedRoute({ children }) {
  const user = getLoggedUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
