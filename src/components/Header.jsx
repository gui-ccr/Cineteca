import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link, useNavigate } from 'react-router-dom'
import { MovieFilter, AdminPanelSettings, LocalActivity, Person, ExitToApp, ShoppingCart, History } from '@mui/icons-material'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const StyledAppBar = styled(AppBar)({
  background: 'rgba(10, 10, 10, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: '2px solid rgba(229, 9, 20, 0.3)',
  boxShadow: '0 4px 30px rgba(229, 9, 20, 0.2)',
  padding: '8px 0',
});

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    '& .logo-icon': {
      transform: 'rotate(360deg)',
    }
  }
});

const LogoText = styled(Typography)({
  fontFamily: '"Bebas Neue", cursive',
  fontSize: '2.5rem',
  fontWeight: 900,
  letterSpacing: '3px',
  background: 'linear-gradient(45deg, #E50914, #FFD700)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 0 30px rgba(229, 9, 20, 0.5)',
  '@media (max-width: 600px)': {
    fontSize: '2rem',
  }
});

const TicketIcon = styled(LocalActivity)({
  fontSize: '2.5rem',
  color: '#E50914',
  transition: 'transform 0.6s ease',
  filter: 'drop-shadow(0 0 10px rgba(229, 9, 20, 0.6))',
});

const AdminButton = styled(Button)({
  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(229, 9, 20, 0.1))',
  color: '#FFD700',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  borderRadius: '25px',
  padding: '10px 25px',
  border: '1px solid rgba(255, 215, 0, 0.3)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(229, 9, 20, 0.2))',
    borderColor: '#FFD700',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
  },
  
  '@media (max-width: 600px)': {
    padding: '8px 16px',
    fontSize: '0.875rem',
  }
});

const NavContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
});

const ToolbarContent = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 20px',
  minHeight: '80px',
  '@media (max-width: 600px)': {
    minHeight: '70px',
    padding: '0 10px',
  }
});

export default function Header({ title }) {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, isAdmin, logout } = useAuth();
  

  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      console.log('Clicou em logout');
      handleUserMenuClose();
      
      const result = await logout();
      console.log('Resultado do logout:', result);
      
      // Navegar para home independentemente do resultado
      navigate('/');
      
      // Recarregar a página para garantir que o estado seja limpo
      window.location.reload();
    } catch (error) {
      console.error('Erro no handleLogout:', error);
      handleUserMenuClose();
      navigate('/');
      window.location.reload();
    }
  };

  const getUserInitials = () => {
    if (profile?.name) {
      return profile.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email?.substring(0, 2).toUpperCase() || '??';
  };

  return (
    <StyledAppBar position="sticky" elevation={0}>
      <ToolbarContent>
        <LogoContainer component={Link} to="/">
          <TicketIcon className="logo-icon" />
          <LogoText variant="h1">
            {title}
          </LogoText>
        </LogoContainer>

        <NavContainer>
          {!isAuthenticated() ? (
            <AdminButton
              startIcon={<Person />}
              onClick={() => navigate('/login')}
            >
              Login
            </AdminButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isAdmin() && (
                <AdminButton
                  startIcon={<AdminPanelSettings />}
                  onClick={() => navigate('/admin')}
                  sx={{ 
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(229, 9, 20, 0.2))',
                    borderColor: '#FFD700',
                  }}
                >
                  Admin
                </AdminButton>
              )}
              
              <IconButton
                onClick={handleUserMenuOpen}
                sx={{
                  background: 'linear-gradient(135deg, #E50914, #B20710)',
                  color: 'white',
                  width: 45,
                  height: 45,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FF3E46, #E50914)',
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    backgroundColor: 'transparent',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {getUserInitials()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
                PaperProps={{
                  sx: {
                    background: 'linear-gradient(145deg, #1A1A1A, #0F0F0F)',
                    border: '1px solid rgba(229, 9, 20, 0.3)',
                    borderRadius: '12px',
                    mt: 1.5,
                    minWidth: 200,
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body1" sx={{ color: '#FFD700', fontWeight: 600 }}>
                    {profile?.name || 'Usuário'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    {user?.email}
                  </Typography>
                </Box>
                
                <Divider sx={{ borderColor: 'rgba(229, 9, 20, 0.2)' }} />
                
                <MenuItem 
                  onClick={() => { handleUserMenuClose(); navigate('/perfil'); }}
                  sx={{ color: 'white', gap: 2 }}
                >
                  <Person />
                  Meu Perfil
                </MenuItem>
                
                <MenuItem 
                  onClick={() => { handleUserMenuClose(); navigate('/carrinho'); }}
                  sx={{ color: 'white', gap: 2 }}
                >
                  <ShoppingCart />
                  Carrinho
                </MenuItem>
                
                <MenuItem 
                  onClick={() => { handleUserMenuClose(); navigate('/historico'); }}
                  sx={{ color: 'white', gap: 2 }}
                >
                  <History />
                  Meus Ingressos
                </MenuItem>
                
                <Divider sx={{ borderColor: 'rgba(229, 9, 20, 0.2)' }} />
                
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ color: '#E50914', gap: 2 }}
                >
                  <ExitToApp />
                  Sair
                </MenuItem>
              </Menu>
            </Box>
          )}
        </NavContainer>
      </ToolbarContent>
    </StyledAppBar>
  );
}