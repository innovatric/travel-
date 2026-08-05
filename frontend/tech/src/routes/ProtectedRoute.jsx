import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, isDevelopmentMode, isDevelopmentSessionActive } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const allowDevelopmentAccess = isDevelopmentMode && isDevelopmentSessionActive;

  if (!isAuthenticated && !allowDevelopmentAccess) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
