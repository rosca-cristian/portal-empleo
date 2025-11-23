import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'candidate' | 'company';
}

export default function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.userType !== requiredRole) {
    return <Navigate to="/browse" replace />;
  }

  return <>{children}</>;
}
