import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Verificar autenticação quando o componente montar
    checkAuth();
  }, [checkAuth]);

  if (!isAuthenticated) {
    // Salvar a rota atual para redirecionar após login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}