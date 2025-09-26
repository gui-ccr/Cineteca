import { Card, CardContent, Typography, Box, Chip, Rating, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { 
  ConfirmationNumber, 
  Star, 
  Schedule,
  CalendarMonth
} from '@mui/icons-material'

const StyledCard = styled(Card)({
  position: 'relative',
  height: '100%',
  background: 'linear-gradient(145deg, #1A1A1A, #0F0F0F)',
  border: '1px solid rgba(229, 9, 20, 0.2)',
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  cursor: 'pointer',
  
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(229, 9, 20, 0.4)',
    border: '1px solid rgba(229, 9, 20, 0.5)',
    
    '& .movie-poster': {
      transform: 'scale(1.1)',
      filter: 'brightness(1.1)',
    },
    
    '& .overlay-content': {
      opacity: 1,
      transform: 'translateY(0)',
    },
    
    '& .buy-button': {
      background: 'linear-gradient(135deg, #E50914, #FF3E46)',
    }
  }
});

const PosterContainer = styled(Box)({
  position: 'relative',
  height: '500px',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.9))',
});

const PosterImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'all 0.6s ease',
});

const OverlayContent = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '30px 20px 20px',
  background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.95))',
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'all 0.4s ease',
});

const MovieInfo = styled(CardContent)({
  padding: '20px',
  background: 'linear-gradient(180deg, #141414, #0A0A0A)',
});

const MovieTitle = styled(Typography)({
  fontFamily: '"Bebas Neue", cursive',
  fontSize: '1.8rem',
  fontWeight: 700,
  letterSpacing: '1px',
  color: '#FFFFFF',
  marginBottom: '12px',
  textTransform: 'uppercase',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

const RatingContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '15px',
});

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#FFD700',
  },
  '& .MuiRating-iconEmpty': {
    color: 'rgba(255, 215, 0, 0.3)',
  }
});

const RatingChip = styled(Chip)({
  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(229, 9, 20, 0.2))',
  color: '#FFD700',
  fontWeight: 700,
  border: '1px solid rgba(255, 215, 0, 0.3)',
});

const InfoRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#B3B3B3',
  marginBottom: '8px',
});

const BuyButton = styled(Button)({
  width: '100%',
  background: 'linear-gradient(135deg, #E50914, #B20710)',
  color: 'white',
  fontWeight: 700,
  fontSize: '1.1rem',
  padding: '14px',
  borderRadius: '12px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginTop: '15px',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  
  '&:hover': {
    background: 'linear-gradient(135deg, #FF3E46, #E50914)',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 30px rgba(229, 9, 20, 0.5)',
  }
});

const LiveBadge = styled(Box)({
  position: 'absolute',
  top: '20px',
  right: '20px',
  background: 'linear-gradient(135deg, #E50914, #B20710)',
  color: 'white',
  padding: '6px 14px',
  borderRadius: '20px',
  fontWeight: 700,
  fontSize: '0.875rem',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  animation: 'pulse 2s infinite',
  zIndex: 10,
  
  '@keyframes pulse': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(229, 9, 20, 0.7)',
    },
    '70%': {
      boxShadow: '0 0 0 10px rgba(229, 9, 20, 0)',
    },
    '100%': {
      boxShadow: '0 0 0 0 rgba(229, 9, 20, 0)',
    },
  }
});

const PulseDot = styled(Box)({
  width: '8px',
  height: '8px',
  background: 'white',
  borderRadius: '50%',
  animation: 'blink 1.5s infinite',
  
  '@keyframes blink': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.3,
    },
  }
});

export default function MovieCards({ movie }) {
  const navigate = useNavigate();
  
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-image.jpg';

  const handleCardClick = () => {
    navigate(`/filme/${movie.id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    }).replace('.', '');
  };

  return (
    <StyledCard onClick={handleCardClick}>
      <LiveBadge>
        <PulseDot />
        Em Cartaz
      </LiveBadge>
      
      <PosterContainer>
        <PosterImage 
          className="movie-poster"
          src={imageUrl}
          alt={movie.title}
        />
        
        <OverlayContent className="overlay-content">
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#FFD700',
              fontWeight: 600,
              mb: 1,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Disponível Agora
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {movie.overview || 'Confira os horários disponíveis para este filme.'}
          </Typography>
        </OverlayContent>
      </PosterContainer>
      
      <MovieInfo>
        <MovieTitle variant="h5">
          {movie.title}
        </MovieTitle>
        
        <RatingContainer>
          <StyledRating 
            value={movie.vote_average / 2} 
            readOnly 
            precision={0.1}
            size="small"
          />
          <RatingChip 
            icon={<Star sx={{ color: '#FFD700' }} />}
            label={movie.vote_average.toFixed(1)} 
            size="small" 
          />
        </RatingContainer>

        <InfoRow>
          <CalendarMonth sx={{ fontSize: '1.2rem', color: '#E50914' }} />
          <Typography variant="body2">
            Estreia: {formatDate(movie.release_date)}
          </Typography>
        </InfoRow>

        <InfoRow>
          <Schedule sx={{ fontSize: '1.2rem', color: '#E50914' }} />
          <Typography variant="body2">
            Múltiplas sessões disponíveis
          </Typography>
        </InfoRow>

        <BuyButton 
          className="buy-button"
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/filme/${movie.id}`);
          }}
        >
          <ConfirmationNumber />
          Comprar Ingresso
        </BuyButton>
      </MovieInfo>
    </StyledCard>
  );
}