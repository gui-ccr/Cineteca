import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Alert,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack,
  History,
  MovieFilter,
  Schedule,
  EventSeat,
  AttachMoney,
  GetApp,
  QrCode,
  CheckCircle,
  Cancel,
  AccessTime
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { ticketHelpers } from '../lib/supabase';
import { theme } from '../App';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TicketHistory() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrDialog, setQrDialog] = useState({ open: false, ticket: null });

  // Dados simulados (em uma implementação real, viriam da API)
  const mockTickets = [
    {
      id: '1',
      movie_title: 'Clube da Luta',
      poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
      session_date: '2025-09-26',
      session_time: '20:00',
      room: 'Sala 1',
      seat_numbers: ['A1', 'A2'],
      ticket_type: 'inteira',
      price: 32.00,
      status: 'confirmed',
      purchase_date: '2025-09-25T10:30:00',
      qr_code: 'QR123456789'
    },
    {
      id: '2',
      movie_title: 'Pulp Fiction',
      poster_path: '/dM2w364MScsjFf8pfMbaWUcWrR.jpg',
      session_date: '2025-09-20',
      session_time: '18:30',
      room: 'Sala 2',
      seat_numbers: ['B5'],
      ticket_type: 'meia',
      price: 17.50,
      status: 'used',
      purchase_date: '2025-09-18T14:20:00',
      qr_code: 'QR987654321'
    },
    {
      id: '3',
      movie_title: 'Forrest Gump',
      poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
      session_date: '2025-09-15',
      session_time: '16:00',
      room: 'Sala 3',
      seat_numbers: ['C10', 'C11'],
      ticket_type: 'inteira',
      price: 52.00,
      status: 'cancelled',
      purchase_date: '2025-09-14T09:15:00',
      qr_code: 'QR456789123'
    }
  ];

  useEffect(() => {
    const loadTickets = async () => {
      try {
        // Em uma implementação real:
        // const { data, error } = await ticketHelpers.getUserTickets(user.id);
        // setTickets(data || []);
        
        // Usando dados simulados:
        setTickets(mockTickets);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadTickets();
    }
  }, [user]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return { color: '#4CAF50', label: 'Confirmado', icon: <CheckCircle /> };
      case 'used':
        return { color: '#2196F3', label: 'Utilizado', icon: <CheckCircle /> };
      case 'cancelled':
        return { color: '#F44336', label: 'Cancelado', icon: <Cancel /> };
      default:
        return { color: '#FF9800', label: 'Pendente', icon: <AccessTime /> };
    }
  };

  const filterTickets = (status) => {
    if (status === 'all') return tickets;
    return tickets.filter(ticket => ticket.status === status);
  };

  const downloadTicket = (ticket) => {
    // Implementar download do PDF do ingresso
    console.log('Download ticket:', ticket.id);
  };

  const showQRCode = (ticket) => {
    setQrDialog({ open: true, ticket });
  };

  if (!user) {
    navigate('/login');
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
          {/* Header */}
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
              <Typography variant="h4" component="h1" sx={{ 
                color: '#E50914', 
                fontWeight: 'bold',
                textShadow: '0 0 20px rgba(229, 9, 20, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}>
                <History sx={{ fontSize: 40 }} />
                MEUS INGRESSOS
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#FFD700', mt: 1 }}>
                Histórico de compras e ingressos
              </Typography>
            </Box>
          </Box>

          {/* Filtros */}
          <Paper sx={{
            background: 'rgba(10, 10, 10, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(229, 9, 20, 0.3)',
            borderRadius: 2,
            mb: 3
          }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  color: '#fff',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&.Mui-selected': {
                    color: '#E50914'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#E50914'
                }
              }}
            >
              <Tab label="Todos os Ingressos" />
              <Tab label="Confirmados" />
              <Tab label="Utilizados" />
              <Tab label="Cancelados" />
            </Tabs>
          </Paper>

          {/* Lista de Ingressos */}
          <TabPanel value={tabValue} index={0}>
            <TicketList 
              tickets={filterTickets('all')} 
              onDownload={downloadTicket}
              onShowQR={showQRCode}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TicketList 
              tickets={filterTickets('confirmed')} 
              onDownload={downloadTicket}
              onShowQR={showQRCode}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <TicketList 
              tickets={filterTickets('used')} 
              onDownload={downloadTicket}
              onShowQR={showQRCode}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <TicketList 
              tickets={filterTickets('cancelled')} 
              onDownload={downloadTicket}
              onShowQR={showQRCode}
            />
          </TabPanel>

          {/* Dialog QR Code */}
          <Dialog
            open={qrDialog.open}
            onClose={() => setQrDialog({ open: false, ticket: null })}
            PaperProps={{
              sx: {
                background: 'rgba(10, 10, 10, 0.95)',
                border: '1px solid rgba(229, 9, 20, 0.3)',
                borderRadius: 2
              }
            }}
          >
            <DialogTitle sx={{ color: '#E50914', textAlign: 'center' }}>
              QR Code do Ingresso
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', p: 4 }}>
              {qrDialog.ticket && (
                <>
                  <Box sx={{ 
                    width: 200, 
                    height: 200, 
                    background: '#fff', 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}>
                    <QrCode sx={{ fontSize: 150, color: '#000' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    Código: {qrDialog.ticket.qr_code}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FFD700', mt: 1 }}>
                    Apresente este código na entrada do cinema
                  </Typography>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setQrDialog({ open: false, ticket: null })}
                sx={{ color: '#E50914' }}
              >
                Fechar
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

// Componente para lista de ingressos
function TicketList({ tickets, onDownload, onShowQR }) {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return { color: '#4CAF50', label: 'Confirmado', icon: <CheckCircle /> };
      case 'used':
        return { color: '#2196F3', label: 'Utilizado', icon: <CheckCircle /> };
      case 'cancelled':
        return { color: '#F44336', label: 'Cancelado', icon: <Cancel /> };
      default:
        return { color: '#FF9800', label: 'Pendente', icon: <AccessTime /> };
    }
  };

  if (tickets.length === 0) {
    return (
      <Paper sx={{
        background: 'rgba(10, 10, 10, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(229, 9, 20, 0.3)',
        borderRadius: 2,
        p: 4,
        textAlign: 'center'
      }}>
        <History sx={{ fontSize: 80, color: '#666', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#ccc', mb: 2 }}>
          Nenhum ingresso encontrado
        </Typography>
        <Typography variant="body2" sx={{ color: '#999' }}>
          Seus ingressos aparecerão aqui após a compra
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {tickets.map((ticket) => {
        const statusInfo = getStatusInfo(ticket.status);
        
        return (
          <Grid item xs={12} key={ticket.id}>
            <Card sx={{
              background: 'rgba(10, 10, 10, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(229, 9, 20, 0.3)',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={2}>
                    <CardMedia
                      component="img"
                      height="120"
                      image={`https://image.tmdb.org/t/p/w300${ticket.poster_path}`}
                      alt={ticket.movie_title}
                      sx={{ borderRadius: 1 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                      {ticket.movie_title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Schedule sx={{ color: '#FFD700', fontSize: 16 }} />
                      <Typography variant="body2" sx={{ color: '#ccc' }}>
                        {new Date(ticket.session_date).toLocaleDateString('pt-BR')} às {ticket.session_time}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EventSeat sx={{ color: '#FFD700', fontSize: 16 }} />
                      <Typography variant="body2" sx={{ color: '#ccc' }}>
                        {ticket.room} - Assentos: {ticket.seat_numbers.join(', ')}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip
                        label={ticket.ticket_type === 'inteira' ? 'Inteira' : 'Meia Entrada'}
                        size="small"
                        sx={{
                          backgroundColor: ticket.ticket_type === 'inteira' ? '#E50914' : '#FFD700',
                          color: ticket.ticket_type === 'inteira' ? '#fff' : '#000',
                          fontWeight: 'bold'
                        }}
                      />
                      
                      <Chip
                        icon={statusInfo.icon}
                        label={statusInfo.label}
                        size="small"
                        sx={{
                          backgroundColor: statusInfo.color,
                          color: '#fff',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ color: '#999' }}>
                      Comprado em: {new Date(ticket.purchase_date).toLocaleDateString('pt-BR')}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                        R$ {ticket.price.toFixed(2)}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                        {ticket.status === 'confirmed' && (
                          <>
                            <Button
                              startIcon={<QrCode />}
                              onClick={() => onShowQR(ticket)}
                              size="small"
                              sx={{ color: '#E50914' }}
                            >
                              Ver QR Code
                            </Button>
                            
                            <Button
                              startIcon={<GetApp />}
                              onClick={() => onDownload(ticket)}
                              size="small"
                              sx={{ color: '#FFD700' }}
                            >
                              Baixar PDF
                            </Button>
                          </>
                        )}
                        
                        {ticket.status === 'used' && (
                          <Button
                            startIcon={<GetApp />}
                            onClick={() => onDownload(ticket)}
                            size="small"
                            sx={{ color: '#FFD700' }}
                          >
                            Baixar Comprovante
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}