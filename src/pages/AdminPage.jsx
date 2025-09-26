import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  Fab,
  Snackbar
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Movie,
  Schedule,
  People,
  Assessment,
  Visibility,
  VisibilityOff,
  ArrowBack,
  TrendingUp,
  AttachMoney,
  EventSeat,
  Dashboard
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { movieHelpers, sessionHelpers, profileHelpers, ticketHelpers } from '../lib/supabase';

// Importar o tema do App.jsx
import { theme } from '../App';

// Componente de Dashboard com estatísticas melhorado
const DashboardStats = ({ stats }) => (
  <Grid container spacing={4}>
    <Grid item xs={12} sm={6} md={3}>
      <Card 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'translateY(-5px)' }
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>Total de Filmes</Typography>
            <Typography variant="h3" fontWeight="bold">{stats.totalMovies}</Typography>
          </Box>
          <Movie sx={{ fontSize: 50, opacity: 0.8 }} />
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <Card 
        sx={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'translateY(-5px)' }
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>Total de Sessões</Typography>
            <Typography variant="h3" fontWeight="bold">{stats.totalSessions}</Typography>
          </Box>
          <Schedule sx={{ fontSize: 50, opacity: 0.8 }} />
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <Card 
        sx={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'translateY(-5px)' }
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>Total de Usuários</Typography>
            <Typography variant="h3" fontWeight="bold">{stats.totalUsers}</Typography>
          </Box>
          <People sx={{ fontSize: 50, opacity: 0.8 }} />
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <Card 
        sx={{ 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          color: 'white',
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'translateY(-5px)' }
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>Ingressos Vendidos</Typography>
            <Typography variant="h3" fontWeight="bold">{stats.totalTickets}</Typography>
          </Box>
          <EventSeat sx={{ fontSize: 50, opacity: 0.8 }} />
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

// Componente de Dashboard com estatísticas
const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card sx={{ 
    minHeight: 120, 
    background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.1), rgba(139, 69, 19, 0.1))',
    border: '1px solid rgba(229, 9, 20, 0.2)',
    '&:hover': {
      transform: 'translateY(-2px)',
      transition: 'all 0.3s ease'
    }
  }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="h4" color="primary" fontWeight="bold">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Box sx={{ color: `${color}.main`, opacity: 0.7 }}>
        {icon}
      </Box>
    </CardContent>
  </Card>
);

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ 
          p: 4,
          background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95), rgba(20, 20, 20, 0.95))',
          minHeight: '500px'
        }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [movies, setMovies] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalSessions: 0,
    totalUsers: 0,
    totalTickets: 0,
    revenue: 0
  });
  const [openMovieDialog, setOpenMovieDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openSessionDialog, setOpenSessionDialog] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados do formulário de filme
  const [movieForm, setMovieForm] = useState({
    title: '',
    overview: '',
    poster_path: '',
    backdrop_path: '',
    release_date: '',
    runtime: '',
    vote_average: '',
    genres: '',
    is_active: true
  });

  // Estados do formulário de sessão
  const [sessionForm, setSessionForm] = useState({
    movie_id: '',
    date: '',
    time: '',
    price: '',
    room: '',
    total_seats: 100
  });

  // Verificar se é administrador
  useEffect(() => {
    if (!user || !profile || profile.role !== 'admin') {
      window.location.href = '#/login';
    }
  }, [user, profile]);

  // Carregar dados
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [moviesData, sessionsData, usersData, ticketsData] = await Promise.all([
        movieHelpers.getAllMovies(),
        sessionHelpers.getAllSessions(),
        profileHelpers.getAllProfiles(),
        ticketHelpers.getAllTickets()
      ]);

      const moviesArray = moviesData || [];
      const sessionsArray = sessionsData || [];
      const usersArray = usersData || [];
      const ticketsArray = ticketsData || [];

      setMovies(moviesArray);
      setSessions(sessionsArray);
      setUsers(usersArray);
      setTickets(ticketsArray);

      // Calcular estatísticas
      const revenue = ticketsArray.reduce((sum, ticket) => sum + (ticket.price || 0), 0);
      setStats({
        totalMovies: moviesArray.filter(m => m.is_active).length,
        totalSessions: sessionsArray.length,
        totalUsers: usersArray.filter(u => u.role === 'user').length,
        totalTickets: ticketsArray.length,
        revenue: revenue
      });

    } catch (err) {
      setError('Erro ao carregar dados: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handlers para filmes
  const handleCreateMovie = () => {
    setSelectedMovie(null);
    setMovieForm({
      title: '',
      overview: '',
      poster_path: '',
      backdrop_path: '',
      release_date: '',
      runtime: '',
      vote_average: '',
      genres: '',
      is_active: true
    });
    setOpenMovieDialog(true);
  };

  const handleEditMovie = (movie) => {
    setSelectedMovie(movie);
    setMovieForm({
      title: movie.title || '',
      overview: movie.overview || '',
      poster_path: movie.poster_path || '',
      backdrop_path: movie.backdrop_path || '',
      release_date: movie.release_date || '',
      runtime: movie.runtime || '',
      vote_average: movie.vote_average || '',
      genres: Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres || '',
      is_active: movie.is_active ?? true
    });
    setOpenMovieDialog(true);
  };

  const handleSaveMovie = async () => {
    try {
      setLoading(true);
      const movieData = {
        ...movieForm,
        runtime: parseInt(movieForm.runtime) || 0,
        vote_average: parseFloat(movieForm.vote_average) || 0,
        genres: movieForm.genres ? movieForm.genres.split(',').map(g => g.trim()) : []
      };

      if (selectedMovie) {
        await movieHelpers.updateMovie(selectedMovie.id, movieData);
      } else {
        await movieHelpers.createMovie(movieData);
      }

      setOpenMovieDialog(false);
      loadData();
    } catch (err) {
      setError('Erro ao salvar filme: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (window.confirm('Tem certeza que deseja excluir este filme?')) {
      try {
        setLoading(true);
        await movieHelpers.deleteMovie(movieId);
        loadData();
      } catch (err) {
        setError('Erro ao excluir filme: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handlers para sessões
  const handleCreateSession = () => {
    setSelectedSession(null);
    setSessionForm({
      movie_id: '',
      date: '',
      time: '',
      price: '',
      room: '',
      total_seats: 100
    });
    setOpenSessionDialog(true);
  };

  const handleSaveSession = async () => {
    try {
      setLoading(true);
      const sessionData = {
        ...sessionForm,
        movie_id: parseInt(sessionForm.movie_id),
        price: parseFloat(sessionForm.price),
        total_seats: parseInt(sessionForm.total_seats),
        available_seats: parseInt(sessionForm.total_seats)
      };

      if (selectedSession) {
        await sessionHelpers.updateSession(selectedSession.id, sessionData);
      } else {
        await sessionHelpers.createSession(sessionData);
      }

      setOpenSessionDialog(false);
      loadData();
    } catch (err) {
      setError('Erro ao salvar sessão: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        minHeight: '100vh',
        py: 4 
      }}>
        <Container maxWidth="lg">
          {/* Header com botão de voltar */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 4,
            background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.1), rgba(139, 69, 19, 0.1))',
            borderRadius: 2,
            p: 3,
            border: '1px solid rgba(229, 9, 20, 0.3)'
          }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{
                mr: 3,
                color: '#E50914',
                borderColor: '#E50914',
                '&:hover': {
                  backgroundColor: 'rgba(229, 9, 20, 0.1)',
                  borderColor: '#E50914'
                }
              }}
              variant="outlined"
            >
              Voltar ao Cinema
            </Button>
            
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Typography variant="h3" component="h1" sx={{ 
                color: '#E50914', 
                fontWeight: 'bold',
                textShadow: '0 0 20px rgba(229, 9, 20, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}>
                <Dashboard sx={{ fontSize: 40 }} />
                PAINEL ADMINISTRATIVO
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#FFD700', mt: 1 }}>
                Bem-vindo, {profile?.name || 'Administrador'}!
              </Typography>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Paper sx={{ 
            width: '100%', 
            bgcolor: 'rgba(10, 10, 10, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(229, 9, 20, 0.3)',
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <Tabs 
              value={tabValue} 
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="fullWidth"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'rgba(229, 9, 20, 0.3)',
                '& .MuiTab-root': {
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&.Mui-selected': {
                    color: '#E50914',
                    background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.1), rgba(139, 69, 19, 0.1))'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#E50914',
                  height: 3
                }
              }}
            >
              <Tab icon={<Assessment />} label="DASHBOARD" />
              <Tab icon={<Movie />} label="FILMES" />
              <Tab icon={<Schedule />} label="SESSÕES" />
              <Tab icon={<People />} label="USUÁRIOS" />
            </Tabs>

            {/* ABA DASHBOARD */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h4" gutterBottom sx={{ 
                mb: 4, 
                color: '#E50914',
                textAlign: 'center',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(229, 9, 20, 0.5)'
              }}>
                📊 Dashboard Administrativo
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Filmes Ativos"
                    value={stats.totalMovies}
                    icon={<Movie sx={{ fontSize: 40 }} />}
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Sessões Programadas"
                    value={stats.totalSessions}
                    icon={<Schedule sx={{ fontSize: 40 }} />}
                    color="secondary"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Usuários Cadastrados"
                    value={stats.totalUsers}
                    icon={<People sx={{ fontSize: 40 }} />}
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Receita Total"
                    value={`R$ ${stats.revenue.toFixed(2)}`}
                    icon={<Assessment sx={{ fontSize: 40 }} />}
                    color="warning"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Filmes Mais Populares
                      </Typography>
                      {movies.slice(0, 5).map((movie, index) => (
                        <Box key={movie.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                          <Typography variant="body2">{movie.title}</Typography>
                          <Chip 
                            label={`${movie.vote_average}/10`} 
                            size="small" 
                            color="primary" 
                          />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Sessões de Hoje
                      </Typography>
                      {sessions
                        .filter(s => new Date(s.date).toDateString() === new Date().toDateString())
                        .slice(0, 5)
                        .map((session) => (
                          <Box key={session.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                            <Typography variant="body2">
                              {session.movies?.title || 'N/A'} - {session.time}
                            </Typography>
                            <Chip 
                              label={`${session.available_seats}/${session.total_seats}`}
                              size="small" 
                              color={session.available_seats < 20 ? 'error' : 'success'}
                            />
                          </Box>
                        ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* ABA FILMES */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Gerenciar Filmes</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleCreateMovie}
                  sx={{ bgcolor: 'primary.main' }}
                >
                  Adicionar Filme
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ bgcolor: 'background.default' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Título</TableCell>
                      <TableCell>Duração</TableCell>
                      <TableCell>Nota</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {movies.map((movie) => (
                      <TableRow key={movie.id}>
                        <TableCell>{movie.id}</TableCell>
                        <TableCell>{movie.title}</TableCell>
                        <TableCell>{movie.runtime} min</TableCell>
                        <TableCell>{movie.vote_average}</TableCell>
                        <TableCell>
                          <Chip 
                            label={movie.is_active ? 'Ativo' : 'Inativo'} 
                            color={movie.is_active ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEditMovie(movie)}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteMovie(movie.id)} color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* ABA SESSÕES */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Gerenciar Sessões</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleCreateSession}
                  sx={{ bgcolor: 'primary.main' }}
                >
                  Adicionar Sessão
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ bgcolor: 'background.default' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Filme</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Horário</TableCell>
                      <TableCell>Sala</TableCell>
                      <TableCell>Preço</TableCell>
                      <TableCell>Assentos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{session.id}</TableCell>
                        <TableCell>{session.movies?.title || 'N/A'}</TableCell>
                        <TableCell>{new Date(session.date).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{session.time}</TableCell>
                        <TableCell>{session.room}</TableCell>
                        <TableCell>R$ {session.price}</TableCell>
                        <TableCell>{session.available_seats}/{session.total_seats}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* ABA USUÁRIOS */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h5" sx={{ mb: 3 }}>Usuários do Sistema</Typography>
              
              <TableContainer component={Paper} sx={{ bgcolor: 'background.default' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Função</TableCell>
                      <TableCell>Criado em</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role} 
                            color={user.role === 'admin' ? 'secondary' : 'primary'}
                          />
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* ABA RELATÓRIOS */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h5" sx={{ mb: 3 }}>Relatórios e Estatísticas</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: 'background.paper' }}>
                    <CardContent>
                      <Typography variant="h6">Total de Filmes</Typography>
                      <Typography variant="h4" sx={{ color: 'primary.main' }}>
                        {movies.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: 'background.paper' }}>
                    <CardContent>
                      <Typography variant="h6">Total de Sessões</Typography>
                      <Typography variant="h4" sx={{ color: 'secondary.main' }}>
                        {sessions.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: 'background.paper' }}>
                    <CardContent>
                      <Typography variant="h6">Total de Usuários</Typography>
                      <Typography variant="h4" sx={{ color: 'success.main' }}>
                        {users.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>

          {/* DIALOG PARA ADICIONAR/EDITAR FILME */}
          <Dialog open={openMovieDialog} onClose={() => setOpenMovieDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              {selectedMovie ? 'Editar Filme' : 'Adicionar Novo Filme'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  label="Título"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({...movieForm, title: e.target.value})}
                  fullWidth
                />
                <TextField
                  label="Sinopse"
                  value={movieForm.overview}
                  onChange={(e) => setMovieForm({...movieForm, overview: e.target.value})}
                  multiline
                  rows={3}
                  fullWidth
                />
                <TextField
                  label="URL do Poster"
                  value={movieForm.poster_path}
                  onChange={(e) => setMovieForm({...movieForm, poster_path: e.target.value})}
                  fullWidth
                />
                <TextField
                  label="Data de Lançamento"
                  type="date"
                  value={movieForm.release_date}
                  onChange={(e) => setMovieForm({...movieForm, release_date: e.target.value})}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Duração (minutos)"
                  type="number"
                  value={movieForm.runtime}
                  onChange={(e) => setMovieForm({...movieForm, runtime: e.target.value})}
                  fullWidth
                />
                <TextField
                  label="Nota (0-10)"
                  type="number"
                  step="0.1"
                  value={movieForm.vote_average}
                  onChange={(e) => setMovieForm({...movieForm, vote_average: e.target.value})}
                  fullWidth
                />
                <TextField
                  label="Gêneros (separados por vírgula)"
                  value={movieForm.genres}
                  onChange={(e) => setMovieForm({...movieForm, genres: e.target.value})}
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={movieForm.is_active}
                      onChange={(e) => setMovieForm({...movieForm, is_active: e.target.checked})}
                    />
                  }
                  label="Filme Ativo"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenMovieDialog(false)}>Cancelar</Button>
              <Button onClick={handleSaveMovie} variant="contained">
                {selectedMovie ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* DIALOG PARA ADICIONAR SESSÃO */}
          <Dialog open={openSessionDialog} onClose={() => setOpenSessionDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Adicionar Nova Sessão</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  select
                  label="Filme"
                  value={sessionForm.movie_id}
                  onChange={(e) => setSessionForm({...sessionForm, movie_id: e.target.value})}
                  fullWidth
                  SelectProps={{ native: true }}
                >
                  <option value="">Selecione um filme</option>
                  {movies.filter(m => m.is_active).map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title}
                    </option>
                  ))}
                </TextField>
                <TextField
                  label="Data"
                  type="date"
                  value={sessionForm.date}
                  onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Horário"
                  type="time"
                  value={sessionForm.time}
                  onChange={(e) => setSessionForm({...sessionForm, time: e.target.value})}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Preço (R$)"
                  type="number"
                  step="0.01"
                  value={sessionForm.price}
                  onChange={(e) => setSessionForm({...sessionForm, price: e.target.value})}
                  fullWidth
                />
                <TextField
                  label="Sala"
                  value={sessionForm.room}
                  onChange={(e) => setSessionForm({...sessionForm, room: e.target.value})}
                  fullWidth
                />
                <TextField
                  label="Total de Assentos"
                  type="number"
                  value={sessionForm.total_seats}
                  onChange={(e) => setSessionForm({...sessionForm, total_seats: e.target.value})}
                  fullWidth
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenSessionDialog(false)}>Cancelar</Button>
              <Button onClick={handleSaveSession} variant="contained">
                Criar Sessão
              </Button>
            </DialogActions>
          </Dialog>

          {/* Botão flutuante para voltar ao topo */}
          <Fab 
            sx={{ 
              position: 'fixed', 
              bottom: 32, 
              right: 32,
              background: 'linear-gradient(135deg, #E50914, #B20710)',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF3E46, #E50914)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease'
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowBack sx={{ transform: 'rotate(90deg)' }} />
          </Fab>

          {/* Snackbar para feedback */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            message={snackbar.message}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}