import { useAuth } from '../contexts/AuthContext';
import { useLocation, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, profile, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: '#0A0A0A'
        }}
      >
        <CircularProgress size={60} sx={{ color: '#E50914' }} />
      </Box>
    );
  }

  if (!isAuthenticated()) {
    // Redirecionar para login, mantendo a página original
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    // Se precisa ser admin mas não é, redirecionar para home
    return <Navigate to="/" replace />;
  }

  return children;
}

export function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: '#0A0A0A'
        }}
      >
        <CircularProgress size={60} sx={{ color: '#E50914' }} />
      </Box>
    );
  }

  // Se já está logado e tenta acessar login, redirecionar para home ou página de origem
  if (isAuthenticated() && location.pathname === '/login') {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
}