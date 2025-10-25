import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

/**
 * A component to protect routes that require authentication.
 * If the user is not logged in, it redirects them to the /auth page.
 */
const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();

  if (!user) {
    // User is not authenticated, redirect to auth page
    // `replace` prop avoids adding the current URL to history
    return <Navigate to="/auth" replace />;
  }

  // User is authenticated, render the child component
  return children;
};

export default ProtectedRoute;
