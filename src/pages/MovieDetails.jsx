import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Chip, 
  Button, 
  CircularProgress, 
  Alert, 
  Container,
  Paper,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Divider,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Snackbar
} from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  ArrowBack, 
  AccessTime, 
  Star, 
  EventSeat,
  ConfirmationNumber,
  Payment,
  CheckCircle,
  Close,
  LocalActivity,
  Pix,
  CreditCard,
  Receipt,
  ContentCopy
} from '@mui/icons-material';

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
});

const BackdropSection = styled(Box)({
  position: 'relative',
  height: '60vh',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'linear-gradient(180deg, transparent 0%, rgba(10,10,10,0.8) 70%, #0A0A0A 100%)',
  }
});

const BackdropImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  filter: 'brightness(0.4)',
});

const ContentWrapper = styled(Container)({
  position: 'relative',
  marginTop: '-200px',
  zIndex: 10,
  paddingBottom: '60px',
});

const MovieHeader = styled(Box)({
  display: 'flex',
  gap: '40px',
  marginBottom: '40px',
  '@media (max-width: 900px)': {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  }
});

const PosterContainer = styled(Box)({
  flex: '0 0 300px',
  '@media (max-width: 900px)': {
    flex: '0 0 auto',
    width: '250px',
  }
});

const Poster = styled('img')({
  width: '100%',
  borderRadius: '16px',
  boxShadow: '0 20px 60px rgba(229, 9, 20, 0.3)',
  border: '2px solid rgba(229, 9, 20, 0.3)',
});

const MovieInfoSection = styled(Box)({
  flex: 1,
  color: 'white',
});

const MovieTitle = styled(Typography)({
  fontFamily: '"Bebas Neue", cursive',
  fontSize: '3.5rem',
  fontWeight: 900,
  letterSpacing: '2px',
  marginBottom: '16px',
  textTransform: 'uppercase',
  background: 'linear-gradient(45deg, #FFFFFF, #FFD700)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  '@media (max-width: 600px)': {
    fontSize: '2.5rem',
  }
});

const InfoChip = styled(Chip)({
  background: 'rgba(255, 215, 0, 0.1)',
  color: '#FFD700',
  border: '1px solid rgba(255, 215, 0, 0.3)',
  marginRight: '10px',
  marginBottom: '10px',
  fontWeight: 600,
});

const ContentSection = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '40px',
  '@media (max-width: 900px)': {
    gridTemplateColumns: '1fr',
  }
});

const SessionsPanel = styled(Paper)({
  background: 'linear-gradient(145deg, #1A1A1A, #0F0F0F)',
  border: '1px solid rgba(229, 9, 20, 0.2)',
  borderRadius: '16px',
  padding: '24px',
  height: 'fit-content',
  position: 'sticky',
  top: '100px',
});

const SessionCard = styled(Box)(({ selected }) => ({
  background: selected 
    ? 'linear-gradient(135deg, rgba(229, 9, 20, 0.2), rgba(255, 215, 0, 0.1))' 
    : 'rgba(255, 255, 255, 0.03)',
  border: selected 
    ? '2px solid #E50914' 
    : '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.1), rgba(255, 215, 0, 0.05))',
    borderColor: '#E50914',
    transform: 'translateX(-5px)',
  }
}));

const BuyButton = styled(Button)({
  width: '100%',
  background: 'linear-gradient(135deg, #E50914, #B20710)',
  color: 'white',
  fontWeight: 700,
  fontSize: '1.2rem',
  padding: '16px',
  borderRadius: '12px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginTop: '20px',
  
  '&:hover': {
    background: 'linear-gradient(135deg, #FF3E46, #E50914)',
    boxShadow: '0 10px 30px rgba(229, 9, 20, 0.5)',
  },
  
  '&:disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.3)',
  }
});

const StepContent = styled(Box)({
  minHeight: '300px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '20px',
});

const PaymentOption = styled(Paper)(({ selected }) => ({
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  background: selected 
    ? 'linear-gradient(135deg, rgba(229, 9, 20, 0.2), rgba(255, 215, 0, 0.1))'
    : 'rgba(255, 255, 255, 0.03)',
  border: selected 
    ? '2px solid #E50914'
    : '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.1), rgba(255, 215, 0, 0.05))',
    borderColor: '#E50914',
    transform: 'translateY(-5px)',
  }
}));

const TicketCode = styled(Typography)({
  fontFamily: 'monospace',
  fontSize: '2rem',
  fontWeight: 700,
  letterSpacing: '3px',
  color: '#FFD700',
  background: 'rgba(255, 215, 0, 0.1)',
  padding: '16px',
  borderRadius: '8px',
  border: '2px dashed rgba(255, 215, 0, 0.3)',
  textAlign: 'center',
  marginTop: '20px',
});

// Mock data
const mockSessions = [
  { id: 1, time: '14:30', price: 25.00, seats: 45, period: 'Matinê' },
  { id: 2, time: '17:15', price: 28.00, seats: 23, period: 'Tarde' },
  { id: 3, time: '20:00', price: 32.00, seats: 67, period: 'Prime' },
  { id: 4, time: '22:45', price: 28.00, seats: 89, period: 'Noite' },
];

const steps = ['Confirmação', 'Pagamento', 'Finalização'];

export default function MovieDetails() {
  const API_KEY = '6ceadc41cf0872e0a149f2cb4782846e';
  const navigate = useNavigate();
  const { movieId } = useParams();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [ticketType, setTicketType] = useState('inteira');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [ticketCode, setTicketCode] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    async function fetchMovieDetails() {
      if (!movieId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do filme');
        }
        
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Falha ao buscar detalhes do filme:", error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMovieDetails();
  }, [movieId]);

  const handleSessionSelect = (sessionId) => {
    setSelectedSession(sessionId);
  };

  const handleBuyTicket = () => {
    if (selectedSession) {
      setBuyDialogOpen(true);
    }
  };

  const handleCloseBuyDialog = () => {
    setBuyDialogOpen(false);
    setActiveStep(0);
    setTicketType('inteira');
    setPaymentMethod('');
    setTicketCode('');
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Gerar código do ingresso
      const code = `CNT${Date.now().toString(36).toUpperCase()}`;
      setTicketCode(code);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const copyTicketCode = () => {
    navigator.clipboard.writeText(ticketCode);
    setSnackbarOpen(true);
  };

  const calculatePrice = (basePrice, type) => {
    return type === 'meia' ? basePrice * 0.5 : basePrice;
  };

  const selectedSessionData = mockSessions.find(s => s.id === selectedSession);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0A0A0A' }}>
          <CircularProgress size={60} sx={{ color: '#E50914' }} />
        </Box>
      </ThemeProvider>
    );
  }

  if (error || !movie) {
    return (
      <ThemeProvider theme={theme}>
        <PageContainer>
          <Container sx={{ py: 4 }}>
            <Alert severity="error" sx={{ mb: 2 }}>{error || 'Filme não encontrado'}</Alert>
            <Button 
              onClick={() => navigate('/')} 
              startIcon={<ArrowBack />}
              variant="contained"
            >
              Voltar para Home
            </Button>
          </Container>
        </PageContainer>
      </ThemeProvider>
    );
  }

  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : '/placeholder-image.jpg';

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
    : imageUrl;

  return (
    <ThemeProvider theme={theme}>
      <PageContainer>
        {/* Backdrop */}
        <BackdropSection>
          <BackdropImage src={backdropUrl} alt={movie.title} />
          <IconButton
            onClick={() => navigate('/')}
            sx={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 20,
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              '&:hover': {
                background: 'rgba(229, 9, 20, 0.8)',
              }
            }}
          >
            <ArrowBack />
          </IconButton>
        </BackdropSection>

        <ContentWrapper maxWidth="xl">
          <MovieHeader>
            <PosterContainer>
              <Poster src={imageUrl} alt={movie.title} />
            </PosterContainer>
            
            <MovieInfoSection>
              <MovieTitle variant="h1">
                {movie.title}
              </MovieTitle>
              
              <Box sx={{ mb: 2 }}>
                <InfoChip 
                  icon={<Star />} 
                  label={`${movie.vote_average.toFixed(1)}/10`} 
                />
                {movie.runtime && (
                  <InfoChip 
                    icon={<AccessTime />} 
                    label={`${movie.runtime} min`} 
                  />
                )}
                {movie.release_date && (
                  <InfoChip 
                    label={new Date(movie.release_date).getFullYear()} 
                  />
                )}
              </Box>
              
              {movie.genres && (
                <Box sx={{ mb: 3 }}>
                  {movie.genres.map((genre) => (
                    <Chip 
                      key={genre.id} 
                      label={genre.name} 
                      sx={{ 
                        mr: 1, 
                        mb: 1,
                        background: 'rgba(229, 9, 20, 0.1)',
                        color: '#E50914',
                        border: '1px solid rgba(229, 9, 20, 0.3)',
                      }}
                    />
                  ))}
                </Box>
              )}
              
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                {movie.overview || 'Sinopse não disponível.'}
              </Typography>
            </MovieInfoSection>
          </MovieHeader>

          <ContentSection>
            <Box>
              {/* Informações adicionais podem ser adicionadas aqui */}
            </Box>

            <SessionsPanel>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                mb: 3,
                color: '#FFD700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                <LocalActivity sx={{ verticalAlign: 'middle', mr: 1 }} />
                Sessões Hoje
              </Typography>
              
              {mockSessions.map((session) => (
                <SessionCard 
                  key={session.id}
                  selected={selectedSession === session.id}
                  onClick={() => handleSessionSelect(session.id)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                      {session.time}
                    </Typography>
                    <Chip 
                      label={session.period} 
                      size="small"
                      sx={{ 
                        background: 'rgba(255, 215, 0, 0.1)',
                        color: '#FFD700',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        {session.seats} lugares disponíveis
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700 }}>
                      R$ {session.price.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ 
                      width: '100%', 
                      height: '4px', 
                      background: 'rgba(255,255,255,0.1)', 
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}>
                      <Box sx={{ 
                        width: `${(session.seats / 100) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #FFD700, #E50914)',
                      }} />
                    </Box>
                  </Box>
                </SessionCard>
              ))}

              <BuyButton
                disabled={!selectedSession}
                onClick={handleBuyTicket}
                startIcon={<ConfirmationNumber />}
              >
                {selectedSession 
                  ? `Comprar Ingresso` 
                  : 'Selecione um Horário'}
              </BuyButton>
            </SessionsPanel>
          </ContentSection>
        </ContentWrapper>

        {/* Dialog de Compra */}
        <Dialog 
          open={buyDialogOpen} 
          onClose={handleCloseBuyDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(145deg, #1A1A1A, #0F0F0F)',
              border: '1px solid rgba(229, 9, 20, 0.3)',
            }
          }}
        >
          <Box sx={{ p: 3, borderBottom: '1px solid rgba(229, 9, 20, 0.2)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFD700' }}>
                  Finalizar Compra
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  {movie.title} • {selectedSessionData?.time}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseBuyDialog} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                <Close />
              </IconButton>
            </Box>
          </Box>
          
          <DialogContent>
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                mb: 4,
                '& .MuiStepIcon-root.Mui-active': {
                  color: '#E50914',
                },
                '& .MuiStepIcon-root.Mui-completed': {
                  color: '#FFD700',
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <StepContent>
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3, color: '#FFD700' }}>
                    Confirme os detalhes do seu pedido
                  </Typography>
                  
                  <Paper sx={{ p: 3, mb: 3, background: 'rgba(255,255,255,0.03)' }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Sessão: <strong>{selectedSessionData?.time}</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Tipo: <strong>{ticketType === 'inteira' ? 'Entrada Inteira' : 'Meia Entrada'}</strong>
                    </Typography>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Quantidade de Ingressos</InputLabel>
                      <Select
                        value={ticketQuantity}
                        label="Quantidade de Ingressos"
                        onChange={(e) => setTicketQuantity(e.target.value)}
                      >
                        {[1,2,3,4,5,6].map(num => (
                          <MenuItem key={num} value={num}>{num} {num === 1 ? 'Ingresso' : 'Ingressos'}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Tipo de Ingresso</InputLabel>
                      <Select
                        value={ticketType}
                        label="Tipo de Ingresso"
                        onChange={(e) => setTicketType(e.target.value)}
                      >
                        <MenuItem value="inteira">
                          Entrada Inteira - R$ {selectedSessionData?.price.toFixed(2)}
                        </MenuItem>
                        <MenuItem value="meia">
                          Meia Entrada - R$ {calculatePrice(selectedSessionData?.price || 0, 'meia').toFixed(2)}
                        </MenuItem>
                      </Select>
                    </FormControl>
                    
                    {ticketType === 'meia' && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          <strong>Meia Entrada:</strong> Apresente documento de estudante, carteira de trabalho (desempregados), 
                          documento de idoso (+60 anos) ou pessoa com deficiência na entrada do cinema.
                        </Typography>
                      </Alert>
                    )}
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">Total:</Typography>
                      <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 700 }}>
                        R$ {(calculatePrice(selectedSessionData?.price || 0, ticketType) * ticketQuantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              )}

              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3, color: '#FFD700' }}>
                    Escolha a forma de pagamento
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
                    <PaymentOption 
                      selected={paymentMethod === 'pix'}
                      onClick={() => setPaymentMethod('pix')}
                    >
                      <Pix sx={{ fontSize: 40, color: '#32BCAD', mb: 1 }} />
                      <Typography variant="body1">PIX</Typography>
                    </PaymentOption>
                    
                    <PaymentOption 
                      selected={paymentMethod === 'card'}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard sx={{ fontSize: 40, color: '#FFD700', mb: 1 }} />
                      <Typography variant="body1">Cartão</Typography>
                    </PaymentOption>
                    
                    <PaymentOption 
                      selected={paymentMethod === 'boleto'}
                      onClick={() => setPaymentMethod('boleto')}
                    >
                      <Receipt sx={{ fontSize: 40, color: '#E50914', mb: 1 }} />
                      <Typography variant="body1">Boleto</Typography>
                    </PaymentOption>
                  </Box>
                  
                  {paymentMethod && (
                    <Alert severity="info" sx={{ mt: 3 }}>
                      {paymentMethod === 'pix' && 'Você será redirecionado para gerar o QR Code do PIX'}
                      {paymentMethod === 'card' && 'Você será redirecionado para inserir os dados do cartão'}
                      {paymentMethod === 'boleto' && 'O boleto será gerado e enviado por e-mail'}
                    </Alert>
                  )}
                </Box>
              )}

              {activeStep === 2 && (
                <Box sx={{ textAlign: 'center' }}>
                  <CheckCircle sx={{ fontSize: 80, color: '#FFD700', mb: 2 }} />
                  <Typography variant="h5" sx={{ mb: 2, color: '#FFD700' }}>
                    Compra Confirmada!
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)' }}>
                    Apresente este código na portaria do cinema:
                  </Typography>
                  
                  <TicketCode>
                    {ticketCode}
                  </TicketCode>
                  
                  <Button
                    startIcon={<ContentCopy />}
                    onClick={copyTicketCode}
                    sx={{ mt: 2 }}
                  >
                    Copiar Código
                  </Button>
                  
                  <Typography variant="body2" sx={{ mt: 3, color: 'rgba(255,255,255,0.5)' }}>
                    Um e-mail com os detalhes foi enviado para você
                  </Typography>
                </Box>
              )}
            </StepContent>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button 
                onClick={activeStep === 2 ? handleCloseBuyDialog : handleBack}
                disabled={activeStep === 0}
                sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
              >
                {activeStep === 2 ? 'Fechar' : 'Voltar'}
              </Button>
              
              {activeStep < 2 && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={activeStep === 1 && !paymentMethod}
                  sx={{
                    background: 'linear-gradient(135deg, #E50914, #B20710)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FF3E46, #E50914)',
                    }
                  }}
                >
                  {activeStep === 1 ? 'Finalizar Pagamento' : 'Continuar'}
                </Button>
              )}
            </Box>
          </DialogContent>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message="Código copiado!"
        />
      </PageContainer>
    </ThemeProvider>
  );
}