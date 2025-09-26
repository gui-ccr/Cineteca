import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import { MovieFilter, AdminPanelSettings, LocalActivity } from '@mui/icons-material'

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
          <AdminButton
            startIcon={<AdminPanelSettings />}
            onClick={() => {
              // Aqui você pode adicionar a lógica de login do admin
              console.log('Admin login clicked');
            }}
          >
            Admin
          </AdminButton>
        </NavContainer>
      </ToolbarContent>
    </StyledAppBar>
  );
}