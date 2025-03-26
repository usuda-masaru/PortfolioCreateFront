import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Button, Paper, Grid, Chip, 
  Card, CardContent,
  IconButton, Alert, CircularProgress, Link, Switch, 
  FormControlLabel, Tooltip, TextField, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Grow
} from '@mui/material';
import { 
  Sync as SyncIcon,
  GitHub as GitHubIcon,
  Star as StarIcon,
  CallSplit as ForkIcon,
  BugReport as IssueIcon,
  Star as StarredIcon,
  StarBorder as UnstarredIcon,
  Settings as SettingsIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import { githubAPI, profileAPI } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  featured: boolean;
  topics: string[];
  is_fork: boolean;
  is_private: boolean;
}

// interface GitHubCommitStats {
//   commit_count_total: number;
//   commit_count_last_year: number;
//   contributions_by_month: Record<string, number>;
//   languages_used: Record<string, number>;
//   last_updated: string;
// }

const GitHubManagement: React.FC = () => {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPrivate, setShowPrivate] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);
  const { user } = useAuth();
  const theme = useTheme();
  
  // 設定を読み込む
  const loadGitHubSettings = async () => {
    try {
      const profile = await profileAPI.getMyProfile();
      setProfileId(profile.id);
      if (profile.github_client_id) {
        setClientId(profile.github_client_id);
      }
      if (profile.github_client_secret) {
        setClientSecret(profile.github_client_secret);
      }
    } catch (err) {
      console.error('GitHub設定の読み込みに失敗しました', err);
    }
  };
  
  // 設定を保存する
  const saveGitHubSettings = async () => {
    try {
      setSavingSettings(true);
      setError(null);
      
      if (!profileId) {
        setError('プロフィールIDが見つかりません');
        return;
      }
      
      await profileAPI.updateProfile({
        id: profileId,
        github_client_id: clientId,
        github_client_secret: clientSecret
      });
      
      setSuccess('GitHub連携設定を保存しました');
      setTimeout(() => setSuccess(null), 5000);
      setOpenSettings(false);
    } catch (err: any) {
      console.error('GitHub設定の保存に失敗しました', err);
      let errorMessage = 'GitHub設定の保存に失敗しました';
      
      // レスポンスからエラーメッセージを抽出して表示
      if (err.response && err.response.data) {
        const responseData = err.response.data;
        if (typeof responseData === 'string') {
          errorMessage += `: ${responseData}`;
        } else if (typeof responseData === 'object') {
          // オブジェクトの場合はエラーメッセージを連結
          const messages: string[] = [];
          Object.entries(responseData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              messages.push(`${key}: ${value.join(', ')}`);
            } else {
              messages.push(`${key}: ${value}`);
            }
          });
          if (messages.length > 0) {
            errorMessage += `: ${messages.join('; ')}`;
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setSavingSettings(false);
    }
  };
  
  // 設定ダイアログを開く
  const handleOpenSettings = () => {
    loadGitHubSettings();
    setOpenSettings(true);
  };
  
  // 設定ダイアログを閉じる
  const handleCloseSettings = () => {
    setOpenSettings(false);
  };
  
  // リポジトリデータを取得（useCallbackでメモ化）
  const fetchRepositories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await githubAPI.getRepositories();
      
      // フォーク・プライベート表示フラグに応じてフィルター
      let filteredData = data;
      if (!showPrivate) {
        filteredData = data.filter(repo => !repo.is_private);
      }
      
      // 特集を上部に、その後は更新日時の降順でソート
      const sortedData = [...filteredData].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        const dateA = new Date(a.pushed_at);
        const dateB = new Date(b.pushed_at);
        return dateB.getTime() - dateA.getTime();
      });
      
      setRepositories(sortedData);
    } catch (err: any) {
      console.error('リポジトリの取得に失敗しました', err);
      setError('GitHubリポジトリの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, [showPrivate]);
  
  // useEffectはそのまま
  useEffect(() => {
    fetchRepositories();
    
    // URLパラメータをチェック（OAuth認証後のリダイレクト時）
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('success') === 'true') {
      setSuccess('GitHub連携が完了しました！リポジトリを同期してください。');
      setTimeout(() => setSuccess(null), 5000);
    } else if (searchParams.get('error')) {
      const errorType = searchParams.get('error');
      let errorMessage = 'GitHub連携中にエラーが発生しました。';
      
      switch (errorType) {
        case 'no_code':
          errorMessage = '認証コードが取得できませんでした。';
          break;
        case 'token_error':
          errorMessage = 'アクセストークンの取得に失敗しました。Client IDとClient Secretを確認してください。';
          break;
        case 'no_token':
          errorMessage = 'アクセストークンが取得できませんでした。';
          break;
        case 'invalid_user':
        case 'no_user':
          errorMessage = 'ユーザー情報の取得に失敗しました。';
          break;
      }
      
      setError(errorMessage);
    }
  }, [fetchRepositories]);
  
  // プライベートリポジトリの表示設定が変わったら再取得
  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);
  
  // 言語ごとの色を取得
  // const getLanguageColor = (language: string): string => {
  //   const colors: Record<string, string> = {
  //     JavaScript: '#f1e05a',
  //     TypeScript: '#2b7489',
  //     Python: '#3572A5',
  //     Java: '#b07219',
  //     'C#': '#178600',
  //     PHP: '#4F5D95',
  //     CSS: '#563d7c',
  //     HTML: '#e34c26',
  //     Ruby: '#701516',
  //     Go: '#00ADD8',
  //     Rust: '#dea584',
  //     Swift: '#ffac45',
  //     Kotlin: '#F18E33',
  //     Dart: '#00B4AB',
  //   };
    
  //   return colors[language] || '#8257e5'; // デフォルト色
  // };
  
  // GitHub連携ログイン
  const handleConnectGithub = () => {
    // Client IDが設定されているか確認
    if (!clientId) {
      setError('GitHub Client IDが設定されていません。「設定」から入力してください。');
      handleOpenSettings();
      return;
    }
    
    // state引数にユーザーIDを渡して認証後にユーザーを特定できるようにする
    const userId = user?.id;
    
    // 設定画面で入力したClient IDを使用
    const oauthUrl = githubAPI.getOAuthUrl(userId, clientId);
    
    window.location.href = oauthUrl;
  };
  
  // リポジトリ同期
  const handleSyncRepositories = async () => {
    try {
      setSyncLoading(true);
      setError(null);
      const result = await githubAPI.syncRepositories();
      
      setSuccess(`GitHubリポジトリを同期しました（${result.repository_count}件）`);
      setTimeout(() => setSuccess(null), 5000);
      
      await fetchRepositories();
    } catch (err: any) {
      console.error('リポジトリの同期に失敗しました', err);
      setError('GitHubリポジトリの同期に失敗しました。再試行してください。');
    } finally {
      setSyncLoading(false);
    }
  };
  
  // リポジトリの特集フラグを切り替え
  const handleToggleFeatured = async (id: number) => {
    try {
      setError(null);
      await githubAPI.toggleFeatured(id);
      
      // 状態を更新
      setRepositories(prevRepos => 
        prevRepos.map(repo => 
          repo.id === id ? { ...repo, featured: !repo.featured } : repo
        )
      );
    } catch (err: any) {
      console.error('特集フラグの切り替えに失敗しました', err);
      setError('リポジトリの特集フラグ切り替えに失敗しました。');
    }
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
            <GitHubIcon sx={{ mr: 1.5, fontSize: '1.75rem' }} />
            GitHub連携設定
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            GitHubのリポジトリ情報をポートフォリオに表示して、あなたの開発実績をアピールできます。
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SyncIcon />}
            onClick={handleSyncRepositories}
            disabled={syncLoading}
            sx={{ 
              px: 3, 
              py: 1,
              borderRadius: 2,
              boxShadow: 2,
              fontWeight: 'bold'
            }}
          >
            {syncLoading ? <CircularProgress size={24} color="inherit" /> : 'リポジトリを同期'}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SettingsIcon />}
            onClick={handleOpenSettings}
            sx={{ 
              px: 3, 
              py: 1,
              borderRadius: 2,
              fontWeight: 'bold'
            }}
          >
            設定
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, whiteSpace: 'pre-line', borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
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
          
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="medium">
              GitHub連携手順
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              以下の手順でGitHubリポジトリをポートフォリオに表示できます。
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 3,
                    height: '100%',
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    bgcolor: alpha(theme.palette.background.paper, 0.98),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        mr: 2
                      }}
                    >
                      1
                    </Box>
                    <Typography variant="h6" fontWeight="medium">
                      OAuth App作成
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    GitHubのDeveloper settingsでOAuth Appを作成し、Client IDとClient Secretを取得します。
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    href="https://github.com/settings/developers"
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<GitHubIcon />}
                  >
                    OAuth App作成
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 3,
                    height: '100%',
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    bgcolor: alpha(theme.palette.background.paper, 0.98),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        mr: 2
                      }}
                    >
                      2
                    </Box>
                    <Typography variant="h6" fontWeight="medium">
                      Client情報設定
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    取得したClient IDとClient Secretを設定画面で入力します。
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<SettingsIcon />}
                    onClick={handleOpenSettings}
                  >
                    設定画面を開く
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 3,
                    height: '100%',
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    bgcolor: alpha(theme.palette.background.paper, 0.98),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        mr: 2
                      }}
                    >
                      3
                    </Box>
                    <Typography variant="h6" fontWeight="medium">
                      連携と同期
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    GitHubアカウントと連携し、リポジトリ情報を同期します。
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<GitHubIcon />}
                      onClick={handleConnectGithub}
                    >
                      GitHubと連携
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<SyncIcon />}
                      onClick={handleSyncRepositories}
                      disabled={syncLoading}
                    >
                      同期
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={showPrivate} 
                    onChange={e => setShowPrivate(e.target.checked)} 
                    color="primary"
                  />
                }
                label="プライベートリポジトリも表示する"
              />
            </Box>
          </Box>
        </Paper>
      </Grow>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : repositories.length > 0 ? (
        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              リポジトリ一覧
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              ⭐ アイコンをクリックすると、リポジトリをポートフォリオで特集として表示できます。
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {repositories.map(repo => (
              <Grid item xs={12} key={repo.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    mb: 0,
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
                          <GitHubIcon color="primary" />
                          {repo.name}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ mt: 1, mb: 2 }}
                        >
                          {repo.description || '説明なし'}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {repo.language && (
                            <Chip 
                              label={repo.language}
                              size="small"
                              sx={{ 
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                fontWeight: 'medium',
                                fontSize: '0.75rem',
                              }}
                            />
                          )}
                          
                          {repo.is_private && (
                            <Chip 
                              label="Private"
                              size="small"
                              sx={{ 
                                bgcolor: alpha(theme.palette.warning.main, 0.1),
                                color: theme.palette.warning.main,
                                fontWeight: 'medium',
                                fontSize: '0.75rem',
                              }}
                            />
                          )}
                          
                          {repo.is_fork && (
                            <Chip 
                              label="Fork"
                              size="small"
                              sx={{ 
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                color: theme.palette.info.main,
                                fontWeight: 'medium',
                                fontSize: '0.75rem',
                              }}
                            />
                          )}
                        </Box>

                        {repo.topics.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                            {repo.topics.map(topic => (
                              <Chip
                                key={topic}
                                label={topic}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  bgcolor: alpha(theme.palette.success.main, 0.1),
                                  color: theme.palette.success.main,
                                  fontWeight: 'medium',
                                  fontSize: '0.75rem',
                                }}
                              />
                            ))}
                          </Box>
                        )}
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
                            {new Date(repo.pushed_at).toLocaleDateString()}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                            <Tooltip title="スター数">
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <StarIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.warning.main }} />
                                <Typography variant="body2" color="text.secondary">
                                  {repo.stargazers_count}
                                </Typography>
                              </Box>
                            </Tooltip>
                            
                            <Tooltip title="フォーク数">
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ForkIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.info.main }} />
                                <Typography variant="body2" color="text.secondary">
                                  {repo.forks_count}
                                </Typography>
                              </Box>
                            </Tooltip>
                            
                            <Tooltip title="Issue数">
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IssueIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.success.main }} />
                                <Typography variant="body2" color="text.secondary">
                                  {repo.open_issues_count}
                                </Typography>
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 2,
                            pt: 2,
                            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                          }}
                        >
                          <Button
                            startIcon={<GitHubIcon />}
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                          >
                            GitHubで表示
                          </Button>
                          
                          <Box>
                            <Tooltip title={repo.featured ? "ポートフォリオから外す" : "ポートフォリオに追加"}>
                              <IconButton 
                                size="small" 
                                color={repo.featured ? "primary" : "default"}
                                onClick={() => handleToggleFeatured(repo.id)}
                                sx={{ 
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                                  }
                                }}
                              >
                                {repo.featured ? <StarredIcon /> : <UnstarredIcon />}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ) : (
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
          <GitHubIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
            リポジトリがまだ同期されていません
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            GitHubと連携してリポジトリを同期すると、ここにリポジトリ一覧が表示されます。
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<GitHubIcon />}
            onClick={handleConnectGithub}
            sx={{ borderRadius: 2, px: 3 }}
          >
            GitHubと連携する
          </Button>
        </Paper>
      )}
      
      {/* GitHub設定ダイアログ */}
      <Dialog open={openSettings} onClose={handleCloseSettings}>
        <DialogTitle>GitHub連携設定</DialogTitle>
        <DialogContent>
          <DialogContentText>
            GitHubのOAuth Appから取得したClient IDとClient Secretを入力してください。
            <Link href="https://github.com/settings/developers" target="_blank" sx={{ display: 'block', mt: 1 }}>
              GitHubのOAuth Apps設定ページを開く
            </Link>
          </DialogContentText>
          
          <TextField
            margin="normal"
            fullWidth
            label="GitHub Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            variant="outlined"
          />
          
          <TextField
            margin="normal"
            fullWidth
            label="GitHub Client Secret"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            variant="outlined"
            type="password"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings}>キャンセル</Button>
          <Button 
            onClick={saveGitHubSettings} 
            color="primary" 
            disabled={savingSettings || !clientId || !clientSecret}
          >
            {savingSettings ? <CircularProgress size={24} /> : '保存'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GitHubManagement; 