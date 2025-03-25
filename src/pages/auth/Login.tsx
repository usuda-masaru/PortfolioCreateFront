import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  IconButton,
  Link
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { Person as PersonIcon, Lock as LockIcon, Visibility, VisibilityOff, PersonAddAlt, HelpOutline } from '@mui/icons-material';

const Login = () => {
  const { login, error, loading } = useAuth();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
              textAlign: 'center',
              mb: 4,
              pt: 1,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.5s ease-out 0.2s, transform 0.5s ease-out 0.2s',
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                letterSpacing: '-0.5px',
                color: theme.palette.text.primary,
                mb: 0.5,
                fontSize: { xs: '1.8rem', sm: '2.2rem' },
              }}
            >
              ポートフォリオアプリ
            </Typography>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: { xs: '1.3rem', sm: '1.5rem' },
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: '25%',
                  width: '50%',
                  height: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.4),
                  borderRadius: 2,
                }
              }}
            >
              ログイン
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

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            noValidate
            sx={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.5s ease-out 0.4s, transform 0.5s ease-out 0.4s',
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="ユーザー名"
              name="email"
              autoComplete="username"
              autoFocus
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="パスワード"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="パスワードの表示切り替え"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                mb: 4,
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
              {loading ? 'ログイン中...' : 'ログイン'}
            </Button>
            
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: 1.5,
                mt: 4,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.5s ease-out 0.5s, transform 0.5s ease-out 0.5s',
              }}
            >
              <Link 
                component={RouterLink} 
                to="/register" 
                variant="body2"
                sx={{ 
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    color: theme.palette.primary.dark,
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                <PersonAddAlt sx={{ mr: 0.5, fontSize: '1rem' }} />
                会員登録はこちら
              </Link>
              
              <Link 
                component={RouterLink} 
                to="/forgot-password" 
                variant="body2"
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                <HelpOutline sx={{ mr: 0.5, fontSize: '1rem' }} />
                パスワードを忘れてしまった方はこちら
              </Link>
            </Box>
          </Box>
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

export default Login; 