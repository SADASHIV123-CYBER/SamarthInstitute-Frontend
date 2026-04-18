import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return user && isAdmin ? children : <Navigate to="/login" />;
};

export default AdminRoute;