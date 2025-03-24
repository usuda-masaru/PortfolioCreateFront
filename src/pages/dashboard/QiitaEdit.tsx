import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  Alert,
  InputAdornment,
  useTheme,
  alpha,
  Container,
  Stack,
  Tooltip,
  Fade
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SaveIcon from '@mui/icons-material/Save';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import { QiitaArticle } from '../../types/interfaces';
import { qiitaAPI, profileAPI } from '../../services/api';
import { formatDistanceToNow, format } from 'date-fns';
import { ja } from 'date-fns/locale';

const QiitaEdit: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string>('');
  const [articles, setArticles] = useState<QiitaArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [syncLoading, setSyncLoading] = useState<boolean>(false);
  const [tokenSaved, setTokenSaved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    fetchArticles();
    fetchAccessToken();
  }, []);

  const fetchAccessToken = async () => {
    try {
      const profile = await profileAPI.getMyProfile();
      if (profile && profile.qiita_access_token) {
        setAccessToken(profile.qiita_access_token);
      }
    } catch (err) {
      console.error('Qiitaアクセストークン取得エラー:', err);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await qiitaAPI.getArticles();
      setArticles(data);
      setError(null);
    } catch (err) {
      console.error('Qiita記事取得エラー:', err);
      setError('記事の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToken = async () => {
    setLoading(true);
    try {
      await qiitaAPI.updateAccessToken(accessToken);
      setTokenSaved(true);
      setError(null);
      
      // トークン保存後も画面に表示されるようにする
      setAccessToken(accessToken);
      
      setTimeout(() => setTokenSaved(false), 3000);
      
      // アクセストークンが保存されたら自動的に記事を同期する
      await handleSyncArticles();
    } catch (err) {
      console.error('トークン保存エラー:', err);
      setError('アクセストークンの保存に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncArticles = async () => {
    setSyncLoading(true);
    try {
      await qiitaAPI.syncArticles();
      fetchArticles();
      setError(null);
    } catch (err) {
      console.error('記事同期エラー:', err);
      setError('記事の同期に失敗しました。アクセストークンが正しいか確認してください。');
    } finally {
      setSyncLoading(false);
    }
  };

  const handleToggleFeatured = async (articleId: string) => {
    try {
      await qiitaAPI.toggleFeatured(articleId);
      // 記事を更新（フロントエンドで状態を更新）
      setArticles(articles.map(article => 
        article.id === articleId 
          ? { ...article, is_featured: !article.is_featured } 
          : article
      ));
    } catch (err) {
      console.error('特集ステータス更新エラー:', err);
      setError('特集ステータスの更新に失敗しました。');
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日', { locale: ja });
  };

  const renderArticleList = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress size={40} thickness={4} />
        </Box>
      );
    }

    if (articles.length === 0) {
      return (
        <Box 
          p={4} 
          sx={{ 
            backgroundColor: alpha(theme.palette.info.light, 0.1),
            borderRadius: 2,
            border: `1px dashed ${theme.palette.info.main}`,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" color="info.main" gutterBottom>
            記事がまだ同期されていません
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            アクセストークンを設定して記事を同期すると、ここにQiita記事が表示されます。
          </Typography>
          <Button 
            variant="outlined" 
            color="info" 
            startIcon={<SyncIcon />}
            onClick={handleSyncArticles}
            disabled={syncLoading}
          >
            記事を同期する
          </Button>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {articles.map((article) => (
          <Grid item xs={12} key={article.id}>
            <Fade in={true} timeout={500}>
              <Card 
                sx={{ 
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: article.is_featured 
                    ? `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}` 
                    : '0 2px 8px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  },
                  ...(article.is_featured && {
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    backgroundColor: alpha(theme.palette.primary.main, 0.02)
                  })
                }}
              >
                {article.is_featured && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      right: 0,
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      px: 1.5,
                      py: 0.5,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      borderBottomLeftRadius: 8,
                      zIndex: 1,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    特集記事
                  </Box>
                )}
                <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      component="div" 
                      sx={{ 
                        fontWeight: 'bold',
                        mb: 1,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                      }}
                    >
                      {article.title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2 }}>
                      {article.tags.map((tag) => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          sx={{ 
                            borderRadius: '4px',
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            }
                          }} 
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <Stack 
                    direction="row" 
                    spacing={3} 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      mt: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarTodayIcon sx={{ fontSize: '1rem', mr: 0.5, color: theme.palette.text.secondary }} />
                      <Typography variant="body2">
                        {formatDate(article.created_at)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ThumbUpAltIcon sx={{ fontSize: '1rem', mr: 0.5, color: theme.palette.success.main }} />
                      <Typography variant="body2" color="success.main" fontWeight="medium">
                        {article.likes_count}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BookmarkIcon sx={{ fontSize: '1rem', mr: 0.5, color: theme.palette.info.main }} />
                      <Typography variant="body2" color="info.main" fontWeight="medium">
                        {article.stocks_count}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    p: 2,
                    borderLeft: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
                    borderTop: { xs: `1px solid ${theme.palette.divider}`, md: 'none' },
                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                  }}
                >
                  <Stack spacing={1.5}>
                    <Tooltip title="特集記事として設定" placement="left">
                      <IconButton 
                        onClick={() => handleToggleFeatured(article.id)} 
                        size="large"
                        color={article.is_featured ? "primary" : "default"}
                        sx={{
                          backgroundColor: article.is_featured 
                            ? alpha(theme.palette.primary.main, 0.1) 
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: article.is_featured 
                              ? alpha(theme.palette.primary.main, 0.2) 
                              : alpha(theme.palette.action.hover, 0.8)
                          }
                        }}
                      >
                        {article.is_featured ? <StarIcon /> : <StarBorderIcon />}
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="記事を開く" placement="left">
                      <IconButton 
                        component="a" 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        size="large"
                        sx={{
                          color: theme.palette.text.secondary,
                          '&:hover': {
                            color: theme.palette.primary.main,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1)
                          }
                        }}
                      >
                        <OpenInNewIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 4,
            pb: 2,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <SettingsIcon sx={{ fontSize: 28, color: theme.palette.primary.main, mr: 2 }} />
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Qiita連携設定
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.2)}`,
              borderRadius: 2
            }}
          >
            {error}
          </Alert>
        )}

        {tokenSaved && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3, 
              boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.2)}`,
              borderRadius: 2
            }}
          >
            アクセストークンを保存しました
          </Alert>
        )}

        <Card 
          sx={{ 
            mb: 5, 
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }}
        >
          <Box 
            sx={{ 
              p: 0.5, 
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` 
            }}
          />
          
          <Box
            sx={{ 
              height: 120,
              backgroundColor: '#55c500', // Qiitaのブランドカラー
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '2rem',
              letterSpacing: '0.05em',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)',
                backgroundSize: '10px 10px',
                opacity: 0.3
              }
            }}
          >
            Qiita
          </Box>
          
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Qiitaアクセストークンの設定
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: 3,
                lineHeight: 1.6
              }}
            >
              Qiitaの記事をポートフォリオに表示するには、アクセストークンを設定してください。
              アクセストークンは
              <Typography 
                component="a" 
                href="https://qiita.com/settings/applications" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ 
                  color: theme.palette.primary.main,
                  fontWeight: 'medium',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Qiita設定ページ
              </Typography>
              で取得できます。
            </Typography>
            
            <TextField
              fullWidth
              label="Qiitaアクセストークン"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              variant="outlined"
              sx={{ 
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '1px',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '2px',
                  }
                }
              }}
              margin="normal"
              type="password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={loading ? undefined : <SaveIcon />}
                      onClick={handleSaveToken}
                      disabled={loading || !accessToken}
                      sx={{ 
                        borderRadius: 8,
                        px: 3,
                        py: 1,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                        }
                      }}
                    >
                      {loading ? <CircularProgress size={24} /> : "保存"}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            mt: 6
          }}
        >
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.palette.primary.main
              }
            }}
          >
            Qiita記事リスト
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={syncLoading ? <CircularProgress size={20} color="inherit" /> : <SyncIcon />}
            onClick={handleSyncArticles}
            disabled={syncLoading}
            sx={{ 
              borderRadius: 8,
              px: 3,
              py: 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              textTransform: 'none',
              fontWeight: 'bold',
              backgroundColor: theme.palette.primary.main,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                backgroundColor: theme.palette.primary.dark
              }
            }}
          >
            {syncLoading ? '同期中...' : '記事を同期'}
          </Button>
        </Box>

        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            p: 2,
            backgroundColor: alpha(theme.palette.warning.light, 0.1),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
          }}
        >
          <StarIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
          星アイコンをクリックすると、その記事をポートフォリオで特集として表示できます。
        </Typography>

        {renderArticleList()}
      </Box>
    </Container>
  );
};

export default QiitaEdit; 