import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  IconButton,
  Chip,
  Grid,
  CircularProgress,
  Paper,
  Alert,
  InputAdornment,
  useTheme,
  alpha,
  Tooltip,
  Grow
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SaveIcon from '@mui/icons-material/Save';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArticleIcon from '@mui/icons-material/Article';
import { QiitaArticle } from '../../types/interfaces';
import { qiitaAPI, profileAPI } from '../../services/api';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import api from '../../services/api';

const QiitaEdit: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string>('');
  const [qiitaUsername, setQiitaUsername] = useState<string>('');
  const [articles, setArticles] = useState<QiitaArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [syncLoading, setSyncLoading] = useState<boolean>(false);
  const [tokenSaved, setTokenSaved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    fetchArticles();
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const profile = await profileAPI.getMyProfile();
      if (profile) {
        if (profile.qiita_access_token) {
          setAccessToken(profile.qiita_access_token);
        }
        if (profile.qiita_username) {
          setQiitaUsername(profile.qiita_username);
        }
      }
    } catch (err) {
      console.error('プロフィール取得エラー:', err);
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
      // プロフィールを取得
      const profile = await profileAPI.getMyProfile();
      if (!profile.id) {
        throw new Error('プロフィールIDが取得できませんでした');
      }

      // プロフィールを更新
      await api.patch(`/api/profiles/${profile.id}/`, {
        qiita_access_token: accessToken,
        qiita_username: qiitaUsername
      });

      setTokenSaved(true);
      setError(null);
      
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
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: 'grey.50',
            border: '1px dashed',
            borderColor: 'grey.300'
          }}
        >
          <ArticleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
            記事がまだ同期されていません
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            アクセストークンを設定して記事を同期すると、ここにQiita記事が表示されます。
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SyncIcon />}
            onClick={handleSyncArticles}
            disabled={syncLoading || !accessToken || !qiitaUsername}
            sx={{ borderRadius: 2, px: 3 }}
          >
            記事を同期する
          </Button>
        </Paper>
      );
    }

    return (
      <Box>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3
          }}
        >
          <Typography variant="h5" component="h2" fontWeight="bold">
            Qiita記事リスト
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            ⭐ アイコンをクリックすると、記事をポートフォリオで特集として表示できます。
          </Typography>
        </Box>

        {articles.map((article) => (
          <Card 
            key={article.id}
            elevation={2} 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              overflow: 'visible',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <ArticleIcon color="primary" />
                    {article.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {article.tags.map((tag) => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontWeight: 'medium',
                          fontSize: '0.75rem',
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                      alignItems: 'flex-start',
                      gap: 1,
                      height: '100%',
                      flexDirection: 'column',
                      textAlign: { xs: 'left', sm: 'right' },
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                        gap: 0.5
                      }}
                    >
                      <CalendarTodayIcon fontSize="small" />
                      {formatDate(article.created_at)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ThumbUpAltIcon sx={{ fontSize: '0.875rem', mr: 0.5, color: theme.palette.success.main }} />
                        <Typography variant="body2" color="text.secondary">
                          {article.likes_count}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BookmarkIcon sx={{ fontSize: '0.875rem', mr: 0.5, color: theme.palette.info.main }} />
                        <Typography variant="body2" color="text.secondary">
                          {article.stocks_count}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 2
                    }}
                  >
                    <Button
                      startIcon={<OpenInNewIcon />}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                    >
                      記事を開く
                    </Button>
                    
                    <Box>
                      <Tooltip title={article.is_featured ? "特集記事から削除" : "特集記事として設定"}>
                        <IconButton 
                          size="small" 
                          color={article.is_featured ? "primary" : "default"}
                          onClick={() => handleToggleFeatured(article.id)}
                          sx={{ 
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              bgcolor: alpha(theme.palette.primary.main, 0.1)
                            }
                          }}
                        >
                          {article.is_featured ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          bgcolor: 'rgba(33, 150, 243, 0.06)',
          color: 'primary.main',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              mb: 1
            }}
          >
            <ArticleIcon sx={{ mr: 1.5, fontSize: '1.75rem' }} />
            Qiita連携設定
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Qiitaの記事をポートフォリオに表示して、あなたの技術発信をアピールできます。
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SyncIcon />}
          onClick={handleSyncArticles}
          disabled={syncLoading || !accessToken || !qiitaUsername}
          sx={{ 
            px: 3, 
            py: 1,
            borderRadius: 2,
            boxShadow: 2,
            fontWeight: 'bold'
          }}
        >
          記事を同期
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, whiteSpace: 'pre-line', borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {tokenSaved && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          設定を保存しました
        </Alert>
      )}

      <Grow in={true} timeout={500}>
        <Paper 
          elevation={2}
          sx={{ 
            mb: 4,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              p: 0.5, 
              bgcolor: theme.palette.primary.main
            }}
          />
          
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="medium">
              Qiita連携設定
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Qiitaの記事をポートフォリオに表示するには、ユーザー名とアクセストークンを設定してください。
              アクセストークンは
              <Typography 
                component="a" 
                href="https://qiita.com/settings/applications" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ 
                  color: theme.palette.primary.main,
                  mx: 0.5,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Qiita設定ページ
              </Typography>
              で取得できます。
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Qiitaユーザー名"
                  value={qiitaUsername}
                  onChange={(e) => setQiitaUsername(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  placeholder="例: johndoe"
                  helperText="Qiitaのユーザー名を入力してください"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ArticleIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Qiitaアクセストークン"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  type="password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SaveIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={loading ? undefined : <SaveIcon />}
                          onClick={handleSaveToken}
                          disabled={loading || !accessToken || !qiitaUsername}
                          sx={{ ml: 1 }}
                        >
                          {loading ? <CircularProgress size={24} /> : "保存"}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Paper>
      </Grow>

      <Box>
        {renderArticleList()}
      </Box>
    </Box>
  );
};

export default QiitaEdit; 