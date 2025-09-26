import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  Phone,
  CalendarMonth,
  Badge,
  ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Tema
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E50914',
      light: '#FF3E46',
      dark: '#B20710',
    },
    secondary: {
      main: '#FFD700',
      light: '#FFE44D',
      dark: '#CCB000',
    },
    background: {
      default: '#0A0A0A',
      paper: '#141414',
    },
  },
  typography: {
    fontFamily: '"Bebas Neue", "Roboto", "Arial", sans-serif',
  },
});

// Styled Components
const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0A0A0A 0%, #1A0000 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
});

const AuthPaper = styled(Paper)({
  background: 'linear-gradient(145deg, #1A1A1A, #0F0F0F)',
  border: '1px solid rgba(229, 9, 20, 0.3)',
  borderRadius: '20px',
  padding: '40px',
  width: '100%',
  maxWidth: '500px',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #E50914, #FFD700)',
  }
});

const AuthTitle = styled(Typography)({
  fontFamily: '"Bebas Neue", cursive',
  fontSize: '2.5rem',
  fontWeight: 900,
  letterSpacing: '2px',
  textAlign: 'center',
  marginBottom: '30px',
  textTransform: 'uppercase',
  background: 'linear-gradient(45deg, #E50914, #FFD700)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

const StyledTextField = styled(TextField)({
  marginBottom: '20px',
  
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    
    '&:hover fieldset': {
      borderColor: 'rgba(229, 9, 20, 0.5)',
    },
    
    '&.Mui-focused fieldset': {
      borderColor: '#E50914',
    },
  },
  
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'none', // Previne caps lock automático
    
    '&.Mui-focused': {
      color: '#FFD700',
    },
  },
  
  '& .MuiInputBase-input': {
    color: '#FFFFFF',
    textTransform: 'none', // Previne caps lock automático
    '&::placeholder': {
      textTransform: 'none',
    }
  },
});

const AuthButton = styled(Button)({
  width: '100%',
  background: 'linear-gradient(135deg, #E50914, #B20710)',
  color: 'white',
  fontWeight: 700,
  fontSize: '1.1rem',
  padding: '16px',
  borderRadius: '12px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginTop: '20px',
  
  '&:hover': {
    background: 'linear-gradient(135deg, #FF3E46, #E50914)',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 30px rgba(229, 9, 20, 0.4)',
  },
  
  '&:disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.3)',
  }
});

const BackButton = styled(IconButton)({
  position: 'absolute',
  top: '20px',
  left: '20px',
  background: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  
  '&:hover': {
    background: 'rgba(229, 9, 20, 0.8)',
  }
});

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loading: authLoading } = useAuth();
  
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados para login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Estados para registro
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    birthDate: '',
    phone: ''
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Tentativa de login:', { email: loginData.email, password: '***' });

    try {
      const result = await login(loginData.email, loginData.password);
      
      console.log('Resultado do login:', result);
      
      if (result.success) {
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validações
    if (registerData.password !== registerData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    // Validar CPF (formato básico)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(registerData.cpf)) {
      setError('CPF deve estar no formato XXX.XXX.XXX-XX');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...dataToSubmit } = registerData;
      const result = await register(dataToSubmit);
      
      if (result.success) {
        if (result.needsVerification) {
          setSuccess('Cadastro realizado! Verifique seu email para confirmar a conta.');
          setTabValue(0); // Voltar para aba de login
        } else {
          const from = location.state?.from?.pathname || '/';
          navigate(from);
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value) => {
    // Remove tudo que não é dígito
    const cleanValue = value.replace(/\D/g, '');
    
    // Aplica a máscara XXX.XXX.XXX-XX
    if (cleanValue.length <= 11) {
      return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    return value;
  };

  if (authLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0A0A0A' }}>
          <CircularProgress size={60} sx={{ color: '#E50914' }} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <PageContainer>
        <BackButton onClick={() => navigate('/')}>
          <ArrowBack />
        </BackButton>
        
        <Container>
          <AuthPaper elevation={10}>
            <AuthTitle variant="h1">
              🎬 Cineteca
            </AuthTitle>

            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              centered
              sx={{
                mb: 3,
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                },
                '& .Mui-selected': {
                  color: '#FFD700 !important',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#E50914',
                  height: '3px',
                },
              }}
            >
              <Tab label="Login" />
              <Tab label="Cadastro" />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
                {success}
              </Alert>
            )}

            {/* Aba de Login */}
            {tabValue === 0 && (
              <Box component="form" onSubmit={handleLoginSubmit}>
                <StyledTextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <StyledTextField
                  fullWidth
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <AuthButton
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </AuthButton>
                </Box>
              </Box>
            )}

            {/* Aba de Cadastro */}
            {tabValue === 1 && (
              <Box component="form" onSubmit={handleRegisterSubmit}>
                <StyledTextField
                  fullWidth
                  label="Nome Completo"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <StyledTextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <StyledTextField
                  fullWidth
                  label="CPF"
                  value={registerData.cpf}
                  onChange={(e) => setRegisterData({ ...registerData, cpf: formatCPF(e.target.value) })}
                  placeholder="000.000.000-00"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <StyledTextField
                  fullWidth
                  label="Data de Nascimento"
                  type="date"
                  value={registerData.birthDate}
                  onChange={(e) => setRegisterData({ ...registerData, birthDate: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonth sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <StyledTextField
                  fullWidth
                  label="Telefone"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <StyledTextField
                  fullWidth
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <StyledTextField
                  fullWidth
                  label="Confirmar Senha"
                  type={showPassword ? 'text' : 'password'}
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <AuthButton
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {loading ? 'Cadastrando...' : 'Cadastrar'}
                </AuthButton>
              </Box>
            )}
          </AuthPaper>
        </Container>
      </PageContainer>
    </ThemeProvider>
  );
}