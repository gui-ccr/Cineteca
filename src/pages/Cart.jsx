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
  Snackbar,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack,
  ShoppingCart,
  Delete,
  Payment,
  MovieFilter,
  Schedule,
  EventSeat,
  AttachMoney
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../App';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, itemId: null });

  // Simulação de itens no carrinho (em uma implementação real, viria do contexto/localStorage/API)
  useEffect(() => {
    // Buscar itens do carrinho do localStorage ou API
    const savedCart = JSON.parse(localStorage.getItem('cineteca_cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cineteca_cart', JSON.stringify(updatedCart));
    setSnackbar({ open: true, message: 'Item removido do carrinho!', severity: 'success' });
    setConfirmDialog({ open: false, itemId: null });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cineteca_cart', JSON.stringify([]));
    setSnackbar({ open: true, message: 'Carrinho limpo!', severity: 'success' });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.ticketType === 'meia' ? item.price / 2 : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setSnackbar({ open: true, message: 'Carrinho vazio!', severity: 'warning' });
      return;
    }

    setLoading(true);
    // Simulação de processamento de pagamento
    setTimeout(() => {
      setSnackbar({ open: true, message: 'Compra realizada com sucesso!', severity: 'success' });
      clearCart();
      setLoading(false);
      // Redirecionar para página de sucesso ou histórico
      setTimeout(() => navigate('/historico'), 2000);
    }, 2000);
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
                <ShoppingCart sx={{ fontSize: 40 }} />
                MEU CARRINHO
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#FFD700', mt: 1 }}>
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'} no carrinho
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={4}>
            {/* Lista de Itens do Carrinho */}
            <Grid item xs={12} md={8}>
              {cartItems.length === 0 ? (
                <Paper sx={{
                  background: 'rgba(10, 10, 10, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(229, 9, 20, 0.3)',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center'
                }}>
                  <ShoppingCart sx={{ fontSize: 80, color: '#666', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#ccc', mb: 2 }}>
                    Seu carrinho está vazio
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                    sx={{
                      background: 'linear-gradient(135deg, #E50914, #B20710)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FF3E46, #E50914)'
                      }
                    }}
                  >
                    Escolher Filmes
                  </Button>
                </Paper>
              ) : (
                <Box>
                  {cartItems.map((item, index) => (
                    <Card key={index} sx={{
                      background: 'rgba(10, 10, 10, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(229, 9, 20, 0.3)',
                      borderRadius: 2,
                      mb: 2,
                      overflow: 'hidden'
                    }}>
                      <CardContent>
                        <Grid container spacing={3} alignItems="center">
                          <Grid item xs={12} sm={3}>
                            <CardMedia
                              component="img"
                              height="140"
                              image={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                              alt={item.title}
                              sx={{ borderRadius: 1 }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                              {item.title}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Schedule sx={{ color: '#FFD700', fontSize: 16 }} />
                              <Typography variant="body2" sx={{ color: '#ccc' }}>
                                {new Date(item.date).toLocaleDateString('pt-BR')} às {item.time}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <EventSeat sx={{ color: '#FFD700', fontSize: 16 }} />
                              <Typography variant="body2" sx={{ color: '#ccc' }}>
                                Sala {item.room} - {item.seats?.join(', ') || 'Assentos selecionados'}
                              </Typography>
                            </Box>

                            <Chip
                              label={item.ticketType === 'inteira' ? 'Inteira' : 'Meia Entrada'}
                              size="small"
                              sx={{
                                backgroundColor: item.ticketType === 'inteira' ? '#E50914' : '#FFD700',
                                color: item.ticketType === 'inteira' ? '#fff' : '#000',
                                fontWeight: 'bold'
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={3}>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h6" sx={{ color: '#FFD700', mb: 1 }}>
                                R$ {((item.ticketType === 'meia' ? item.price / 2 : item.price) * (item.quantity || 1)).toFixed(2)}
                              </Typography>
                              
                              <Typography variant="body2" sx={{ color: '#ccc', mb: 2 }}>
                                Qtd: {item.quantity || 1}
                              </Typography>
                              
                              <IconButton
                                onClick={() => setConfirmDialog({ open: true, itemId: index })}
                                sx={{ color: '#E50914' }}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                      onClick={clearCart}
                      sx={{ color: '#ccc' }}
                    >
                      Limpar Carrinho
                    </Button>
                  </Box>
                </Box>
              )}
            </Grid>

            {/* Resumo do Pedido */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                background: 'rgba(10, 10, 10, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(229, 9, 20, 0.3)',
                borderRadius: 2,
                position: 'sticky',
                top: 20
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#E50914', mb: 3 }}>
                    Resumo do Pedido
                  </Typography>

                  {cartItems.map((item, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#ccc' }}>
                          {item.title} ({item.ticketType})
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          R$ {((item.ticketType === 'meia' ? item.price / 2 : item.price) * (item.quantity || 1)).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}

                  {cartItems.length > 0 && (
                    <>
                      <Divider sx={{ my: 2, borderColor: 'rgba(229, 9, 20, 0.3)' }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                          Total:
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                          R$ {calculateTotal().toFixed(2)}
                        </Typography>
                      </Box>
                    </>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Payment />}
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || loading}
                    sx={{
                      background: 'linear-gradient(135deg, #E50914, #B20710)',
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FF3E46, #E50914)'
                      },
                      '&:disabled': {
                        background: '#666'
                      }
                    }}
                  >
                    {loading ? 'Processando...' : 'Finalizar Compra'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Dialog de Confirmação */}
          <Dialog
            open={confirmDialog.open}
            onClose={() => setConfirmDialog({ open: false, itemId: null })}
            PaperProps={{
              sx: {
                background: 'rgba(10, 10, 10, 0.95)',
                border: '1px solid rgba(229, 9, 20, 0.3)'
              }
            }}
          >
            <DialogTitle sx={{ color: '#E50914' }}>
              Confirmar Remoção
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ color: '#fff' }}>
                Deseja realmente remover este item do carrinho?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setConfirmDialog({ open: false, itemId: null })}
                sx={{ color: '#ccc' }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => removeFromCart(confirmDialog.itemId)}
                sx={{ color: '#E50914' }}
              >
                Remover
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar para feedback */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert 
              onClose={() => setSnackbar({ ...snackbar, open: false })} 
              severity={snackbar.severity}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}