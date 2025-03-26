import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Box, 
  Alert, 
  useTheme,
  alpha,
  InputAdornment,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon 
} from '@mui/icons-material';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { resetPassword, loading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // バリデーション
    if (!email) {
      setError('メールアドレスを入力してください');
      return;
    }

    // メールアドレスの簡易バリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('有効なメールアドレスを入力してください');
      return;
    }

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError('パスワードリセットリクエストの送信に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.dark, 0.9)} 0%, 
          ${alpha(theme.palette.primary.main, 0.8)} 50%, 
          ${alpha(theme.palette.primary.light, 0.7)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景パターン */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23FFFFFF" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E") repeat',
          zIndex: 0,
        }}
      />

      {/* 装飾用の抽象的な形 */}
      <Box
        sx={{
          position: 'absolute',
          width: '50%',
          height: '50%',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          background: alpha(theme.palette.secondary.main, 0.1),
          top: '-15%',
          left: '-10%',
          animation: 'float-slow 15s ease-in-out infinite',
          '@keyframes float-slow': {
            '0%': { transform: 'translateY(0) rotate(0deg)' },
            '50%': { transform: 'translateY(30px) rotate(5deg)' },
            '100%': { transform: 'translateY(0) rotate(0deg)' }
          },
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          width: '40%',
          height: '40%',
          borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%',
          background: alpha(theme.palette.primary.light, 0.1),
          bottom: '-10%',
          right: '-5%',
          animation: 'float-slow 10s ease-in-out 1s infinite reverse',
          zIndex: 1,
        }}
      />

      <Container 
        maxWidth="sm" 
        sx={{ 
          position: 'relative',
          zIndex: 2,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
        }}
      >
        <Paper 
          elevation={8} 
          sx={{ 
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            background: `linear-gradient(135deg, 
              ${alpha('#ffffff', 0.95)} 0%, 
              ${alpha('#ffffff', 0.9)} 100%)`,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.1)}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* カードの装飾要素 */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: `linear-gradient(90deg, 
                ${theme.palette.primary.main}, 
                ${theme.palette.secondary.main})`,
            }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 3,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0)' : 'translateX(-10px)',
              transition: 'opacity 0.5s ease-out 0.2s, transform 0.5s ease-out 0.2s',
            }}
          >
            <RouterLink 
              to="/login" 
              style={{ 
                color: theme.palette.text.secondary,
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                marginRight: '10px'
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </RouterLink>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                letterSpacing: '-0.5px',
                color: theme.palette.text.primary,
                fontSize: { xs: '1.8rem', sm: '2.2rem' },
              }}
            >
              パスワードをリセット
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
                '@keyframes shake': {
                  '0%, 100%': { transform: 'translateX(0)' },
                  '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
                  '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
                }
              }}
            >
              {error}
            </Alert>
          )}

          {isSubmitted ? (
            <Box 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.4s ease-out',
              }}
            >
              <Alert 
                severity="success"
                sx={{ 
                  width: '100%',
                  borderRadius: 2 
                }}
              >
                パスワードリセットの手順を記載したメールを送信しました。メールをご確認ください。
              </Alert>
              
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
                sx={{ 
                  py: 1.5,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.25)}`,
                  transition: 'all 0.3s ease',
                  background: `linear-gradient(45deg, 
                    ${theme.palette.primary.dark} 0%, 
                    ${theme.palette.primary.main} 100%)`,
                  '&:hover': {
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                ログイン画面に戻る
              </Button>
            </Box>
          ) : (
            <>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4,
                  color: theme.palette.text.secondary,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 0.5s ease-out 0.3s, transform 0.5s ease-out 0.3s',
                }}
              >
                アカウントに登録されているメールアドレスを入力してください。パスワードリセットのためのリンクをメールでお送りします。
              </Typography>

              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                noValidate
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 0.5s ease-out 0.4s, transform 0.5s ease-out 0.4s',
                }}
              >
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="メールアドレス"
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    py: 1.5,
                    mt: 1,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.25)}`,
                    transition: 'all 0.3s ease',
                    background: `linear-gradient(45deg, 
                      ${theme.palette.primary.dark} 0%, 
                      ${theme.palette.primary.main} 100%)`,
                    '&:hover': {
                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  {loading ? '送信中...' : 'リセットリンクを送信'}
                </Button>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    mt: 2
                  }}
                >
                  <RouterLink 
                    to="/login" 
                    style={{ 
                      textDecoration: 'none',
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    ログイン画面に戻る
                  </RouterLink>
                </Box>
              </Box>
            </>
          )}
        </Paper>

        <Typography 
          variant="body2" 
          align="center" 
          sx={{ 
            mt: 3, 
            color: 'white',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.5s ease-out 0.6s',
          }}
        >
          ポートフォリオ管理システム © {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
};

export default ForgotPassword; 