import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  Snackbar,
  IconButton
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Save,
  Cancel,
  Person,
  Email,
  Badge,
  AccountCircle
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { profileHelpers, supabase } from '../lib/supabase';
import { theme } from '../App';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, profile, setProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: ''
  });

  // Função para formatar CPF
  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para formatar telefone
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  useEffect(() => {
    if (profile) {
      console.log('Profile mudou, atualizando formData:', profile);
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        cpf: profile.cpf ? (profile.cpf.includes('.') ? profile.cpf : formatCPF(profile.cpf)) : '',
        phone: profile.phone ? (profile.phone.includes('(') ? profile.phone : formatPhone(profile.phone)) : ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    // Prevenir múltiplas chamadas
    if (loading) return;

    // Validações básicas
    if (!formData.name.trim()) {
      setSnackbar({ 
        open: true, 
        message: 'Nome é obrigatório!', 
        severity: 'error' 
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('Atualizando perfil:', profile.id, formData);
      
      // Preparar dados limpos (remover máscaras)
      const cleanData = {
        name: formData.name.trim(),
        cpf: formData.cpf ? formData.cpf.replace(/\D/g, '') : null,
        phone: formData.phone ? formData.phone.replace(/\D/g, '') : null,
        updated_at: new Date().toISOString()
      };

      console.log('Dados limpos:', cleanData);
      
      // Atualizar diretamente no Supabase
      const { data, error } = await supabase
        .from('profiles')
        .update(cleanData)
        .eq('id', profile.id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro do Supabase:', error);
        setSnackbar({ 
          open: true, 
          message: 'Erro ao atualizar perfil: ' + error.message, 
          severity: 'error' 
        });
        setLoading(false);
        return;
      }

      console.log('Perfil atualizado com sucesso:', data);
      
      // Buscar dados atualizados do banco para garantir sincronização
      const { data: freshProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profile.id)
        .single();

      if (!fetchError && freshProfile) {
        console.log('Dados frescos do banco:', freshProfile);
        setProfile(freshProfile);
      } else {
        // Fallback: usar dados da resposta anterior
        const updatedProfile = { 
          ...profile, 
          name: data.name,
          cpf: data.cpf || null,
          phone: data.phone || null,
          updated_at: data.updated_at
        };
        setProfile(updatedProfile);
      }
      
      setIsEditing(false);
      setSnackbar({ 
        open: true, 
        message: 'Perfil atualizado com sucesso!', 
        severity: 'success' 
      });
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      setSnackbar({ 
        open: true, 
        message: 'Erro inesperado: ' + error.message, 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Resetar para os dados originais do perfil
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        cpf: profile.cpf ? (profile.cpf.includes('.') ? profile.cpf : formatCPF(profile.cpf)) : '',
        phone: profile.phone ? (profile.phone.includes('(') ? profile.phone : formatPhone(profile.phone)) : ''
      });
    }
    setIsEditing(false);
  };

  const getUserInitials = () => {
    const name = profile?.name || user?.email || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
        <Container maxWidth="md">
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
                <Person sx={{ fontSize: 40 }} />
                MEU PERFIL
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={4}>
            {/* Card do Avatar e Info Básica */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                background: 'rgba(10, 10, 10, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(229, 9, 20, 0.3)',
                borderRadius: 2,
                textAlign: 'center',
                p: 3
              }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    backgroundColor: '#E50914',
                    fontSize: '3rem',
                    fontWeight: 'bold'
                  }}
                >
                  {getUserInitials()}
                </Avatar>
                
                <Typography variant="h5" sx={{ color: '#fff', mb: 1 }}>
                  {profile?.name || 'Usuário'}
                </Typography>
                
                <Typography variant="body2" sx={{ color: '#FFD700', mb: 2 }}>
                  {profile?.role === 'admin' ? 'Administrador' : 'Cliente'}
                </Typography>
                
                <Divider sx={{ my: 2, borderColor: 'rgba(229, 9, 20, 0.3)' }} />
                
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Membro desde: {new Date(profile?.created_at).toLocaleDateString('pt-BR')}
                </Typography>
              </Card>
            </Grid>

            {/* Card do Formulário */}
            <Grid item xs={12} md={8}>
              <Card sx={{
                background: 'rgba(10, 10, 10, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(229, 9, 20, 0.3)',
                borderRadius: 2
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#E50914' }}>
                      Informações Pessoais
                    </Typography>
                    
                    {!isEditing ? (
                      <Button
                        startIcon={<Edit />}
                        onClick={() => setIsEditing(true)}
                        sx={{ color: '#FFD700' }}
                      >
                        Editar
                      </Button>
                    ) : (
                      <Box>
                        <IconButton onClick={handleCancel} sx={{ color: '#ccc', mr: 1 }}>
                          <Cancel />
                        </IconButton>
                        <IconButton onClick={handleSave} sx={{ color: '#E50914' }} disabled={loading}>
                          <Save />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nome Completo"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <AccountCircle sx={{ color: '#E50914', mr: 1 }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': { borderColor: 'rgba(229, 9, 20, 0.3)' },
                            '&:hover fieldset': { borderColor: '#E50914' },
                            '&.Mui-focused fieldset': { borderColor: '#E50914' }
                          },
                          '& .MuiInputLabel-root': { color: '#ccc' }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={formData.email}
                        disabled={true} // Email não pode ser editado
                        InputProps={{
                          startAdornment: <Email sx={{ color: '#E50914', mr: 1 }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': { borderColor: 'rgba(229, 9, 20, 0.3)' }
                          },
                          '& .MuiInputLabel-root': { color: '#ccc' }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="CPF"
                        value={formData.cpf}
                        onChange={(e) => {
                          const formatted = formatCPF(e.target.value);
                          if (formatted.replace(/\D/g, '').length <= 11) {
                            setFormData({ ...formData, cpf: formatted });
                          }
                        }}
                        disabled={!isEditing}
                        placeholder="000.000.000-00"
                        inputProps={{ maxLength: 14 }}
                        InputProps={{
                          startAdornment: <Badge sx={{ color: '#E50914', mr: 1 }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': { borderColor: 'rgba(229, 9, 20, 0.3)' },
                            '&:hover fieldset': { borderColor: '#E50914' },
                            '&.Mui-focused fieldset': { borderColor: '#E50914' }
                          },
                          '& .MuiInputLabel-root': { color: '#ccc' }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Telefone"
                        value={formData.phone}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          if (formatted.replace(/\D/g, '').length <= 11) {
                            setFormData({ ...formData, phone: formatted });
                          }
                        }}
                        disabled={!isEditing}
                        placeholder="(11) 99999-9999"
                        inputProps={{ maxLength: 15 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': { borderColor: 'rgba(229, 9, 20, 0.3)' },
                            '&:hover fieldset': { borderColor: '#E50914' },
                            '&.Mui-focused fieldset': { borderColor: '#E50914' }
                          },
                          '& .MuiInputLabel-root': { color: '#ccc' }
                        }}
                      />
                    </Grid>
                  </Grid>

                  {isEditing && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button
                        onClick={handleCancel}
                        sx={{ color: '#ccc' }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={loading}
                        sx={{
                          background: loading ? '#666' : 'linear-gradient(135deg, #E50914, #B20710)',
                          '&:hover': {
                            background: loading ? '#666' : 'linear-gradient(135deg, #FF3E46, #E50914)'
                          },
                          '&:disabled': {
                            color: '#ccc'
                          }
                        }}
                      >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

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