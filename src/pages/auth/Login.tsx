import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Box, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearErrors } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
          ポートフォリオアプリ
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          ログイン
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearErrors}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="ユーザー名"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </Button>
          
          {/* <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              アカウントをお持ちでないですか？{' '}
              <RouterLink to="/register" style={{ textDecoration: 'none' }}>
                新規登録
              </RouterLink>
            </Typography>
          </Box> */}
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 