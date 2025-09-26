import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper
} from '@mui/material';
import {
  Home,
  ArrowBack,
  SentimentVeryDissatisfied
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../App';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container maxWidth="md">
          <Paper sx={{
            background: 'rgba(10, 10, 10, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(229, 9, 20, 0.3)',
            borderRadius: 2,
            p: 6,
            textAlign: 'center'
          }}>
            <SentimentVeryDissatisfied 
              sx={{ 
                fontSize: 100, 
                color: '#E50914', 
                mb: 3,
                animation: 'pulse 2s infinite'
              }} 
            />
            
            <Typography variant="h2" sx={{ 
              color: '#E50914', 
              fontWeight: 'bold',
              mb: 2
            }}>
              404
            </Typography>
            
            <Typography variant="h4" sx={{ 
              color: '#fff', 
              mb: 2
            }}>
              Página Não Encontrada
            </Typography>
            
            <Typography variant="body1" sx={{ 
              color: '#ccc', 
              mb: 4,
              maxWidth: 400,
              mx: 'auto'
            }}>
              Ops! A página que você está procurando não existe ou foi movida. 
              Que tal voltar ao cinema?
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{
                  color: '#ccc',
                  borderColor: '#ccc',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: '#fff'
                  }
                }}
                variant="outlined"
              >
                Voltar
              </Button>
              
              <Button
                startIcon={<Home />}
                onClick={() => navigate('/')}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #E50914, #B20710)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FF3E46, #E50914)'
                  }
                }}
              >
                Ir ao Cinema
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}