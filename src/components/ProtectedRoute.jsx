import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({children}) => {
    const { isAdmin } = useAuth();
    const location = useLocation();
  
    if (!isAdmin) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return children;
  }
  
export default ProtectedRoute;