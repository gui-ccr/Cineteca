import { useState, useEffect } from 'react'
import { Box, Container, Typography, Skeleton, Alert, IconButton, Tooltip } from '@mui/material'
import { styled, ThemeProvider, createTheme } from '@mui/material/styles'
import { Refresh, MovieFilter } from '@mui/icons-material'
import Header from './components/Header'
import MovieCard from './components/MovieCards'
import './App.css'

// Tema customizado com cores de cinema
export const theme = createTheme({
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
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
  },
  typography: {
    fontFamily: '"Bebas Neue", "Roboto", "Arial", sans-serif',
    h1: {
      fontFamily: '"Bebas Neue", cursive',
      letterSpacing: '2px',
    },
    h2: {
      fontFamily: '"Bebas Neue", cursive',
      letterSpacing: '1.5px',
    },
    h3: {
      fontFamily: '"Bebas Neue", cursive',
      letterSpacing: '1px',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const MainContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0A0A0A 0%, #1A0000 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'radial-gradient(circle at 20% 50%, rgba(229, 9, 20, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  }
});

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: '30px 0',
  background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, transparent 100%)',
  borderBottom: '2px solid rgba(229, 9, 20, 0.2)',
  marginBottom: '30px',
  
  [theme.breakpoints.down('sm')]: {
    padding: '20px 0',
    marginBottom: '20px',
  },
  
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
  }
}));

const NeonTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  fontSize: '3rem',
  textAlign: 'center',
  textTransform: 'uppercase',
  background: 'linear-gradient(45deg, #E50914, #FFD700)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 0 40px rgba(229, 9, 20, 0.5)',
  marginBottom: '8px',
  
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  }
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '1.2rem',
  color: '#FFD700',
  fontWeight: 300,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  opacity: 0.9,
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
    letterSpacing: '1px',
  }
}));

const MoviesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '30px',
  padding: '0 20px',
  maxWidth: '1200px',
  margin: '0 auto',
  
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: '20px',
    padding: '0 15px',
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '30px',
  padding: '0 20px',
  maxWidth: '1200px',
  margin: '0 auto 30px',
  
  [theme.breakpoints.down('sm')]: {
    marginBottom: '20px',
    padding: '0 15px',
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '2px',
  color: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
    letterSpacing: '1px',
  },
  
  '&::before': {
    content: '""',
    width: '4px',
    height: '30px',
    background: 'linear-gradient(180deg, #E50914, #FFD700)',
    borderRadius: '2px',
    
    [theme.breakpoints.down('sm')]: {
      height: '25px',
      width: '3px',
    }
  }
}));

const LoadingCard = styled(Box)({
  background: 'linear-gradient(145deg, #1A1A1A, #0F0F0F)',
  borderRadius: '12px',
  padding: '20px',
  border: '1px solid rgba(229, 9, 20, 0.2)',
});

const CompactIconSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '10px',
  
  [theme.breakpoints.down('sm')]: {
    marginBottom: '5px',
  }
}));

function App() {
  const API_KEY = '6ceadc41cf0872e0a149f2cb4782846e'
  
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMovies = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=pt-BR&page=1`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Falha ao buscar filmes');
      }
      
      const data = await response.json();
      setMovies(data.results.slice(0, 3)); // Mostrar apenas 3 filmes
    } catch (error) {
      console.error("Falha ao buscar filmes:", error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []); 

  return (
    <ThemeProvider theme={theme}>
      <MainContainer>
        <Header title='CINETECA' />
        
        <HeroSection>
          <Container maxWidth="lg">
            <CompactIconSection>
              <MovieFilter sx={{ 
                fontSize: { xs: '3rem', sm: '4rem', md: '5rem' }, 
                color: '#E50914'
              }} />
            </CompactIconSection>
            <NeonTitle variant="h1">
              Em Cartaz
            </NeonTitle>
            <Subtitle>
              A magia do cinema na palma da sua mão
            </Subtitle>
          </Container>
        </HeroSection>

        <Container maxWidth={false} sx={{ px: { xs: 1, sm: 2, md: 4 }, pb: 4 }}>
          <SectionHeader>
            <SectionTitle variant="h2">
              Filmes em Exibição
            </SectionTitle>
            <Tooltip title="Atualizar filmes">
              <IconButton 
                onClick={fetchMovies}
                disabled={loading}
                sx={{ 
                  color: '#FFD700',
                  '&:hover': {
                    background: 'rgba(255, 215, 0, 0.1)',
                  }
                }}
              >
                <Refresh sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
              </IconButton>
            </Tooltip>
          </SectionHeader>

          {error && (
            <Box sx={{ mb: 3, maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3 } }}>
              <Alert 
                severity="error" 
                sx={{ 
                  background: 'rgba(229, 9, 20, 0.1)',
                  color: '#FF6B6B',
                  border: '1px solid rgba(229, 9, 20, 0.3)',
                }}
              >
                {error}
              </Alert>
            </Box>
          )}

          <MoviesGrid>
            {loading ? (
              Array.from(new Array(3)).map((_, index) => (
                <LoadingCard key={index}>
                  <Skeleton 
                    variant="rectangular" 
                    height={400} 
                    sx={{ 
                      borderRadius: '8px',
                      background: 'linear-gradient(90deg, #1A1A1A 25%, #2A2A2A 50%, #1A1A1A 75%)',
                    }} 
                  />
                  <Skeleton 
                    variant="text" 
                    sx={{ 
                      fontSize: '1.5rem', 
                      mt: 2,
                      background: 'linear-gradient(90deg, #1A1A1A 25%, #2A2A2A 50%, #1A1A1A 75%)',
                    }} 
                  />
                  <Skeleton 
                    variant="text" 
                    sx={{ 
                      fontSize: '1rem',
                      background: 'linear-gradient(90deg, #1A1A1A 25%, #2A2A2A 50%, #1A1A1A 75%)',
                    }} 
                  />
                </LoadingCard>
              ))
            ) : (
              movies.map((movie, index) => (
                <Box
                  key={movie.id}
                  sx={{
                    animation: 'fadeInUp 0.6s ease-out',
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both',
                  }}
                >
                  <MovieCard movie={movie} />
                </Box>
              ))
            )}
          </MoviesGrid>

          {!loading && movies.length === 0 && !error && (
            <Box sx={{ 
              textAlign: 'center', 
              py: { xs: 6, sm: 8, md: 12 },
              background: 'radial-gradient(circle, rgba(229, 9, 20, 0.05) 0%, transparent 70%)',
              borderRadius: '20px',
            }}>
              <MovieFilter sx={{ fontSize: { xs: '4rem', sm: '6rem' }, color: '#333', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#666', fontWeight: 300, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                Nenhum filme em cartaz no momento
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', mt: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Volte em breve para conferir as novidades!
              </Typography>
            </Box>
          )}
        </Container>
      </MainContainer>
    </ThemeProvider>
  )
}

export default App