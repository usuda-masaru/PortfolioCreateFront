import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Grid, Chip, Divider, 
  Card, CardContent, CardActions, CardHeader, CardMedia,
  IconButton, Alert, CircularProgress, Link, Switch, 
  FormControlLabel, Tooltip, TextField, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { 
  Sync as SyncIcon,
  GitHub as GitHubIcon,
  Star as StarIcon,
  Code as CodeIcon,
  CallSplit as ForkIcon,
  BugReport as IssueIcon,
  Visibility as WatchIcon,
  Link as LinkIcon,
  Star as StarredIcon,
  StarBorder as UnstarredIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { githubAPI, profileAPI } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

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

interface GitHubCommitStats {
  commit_count_total: number;
  commit_count_last_year: number;
  contributions_by_month: Record<string, number>;
  languages_used: Record<string, number>;
  last_updated: string;
}

const GitHubManagement: React.FC = () => {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [stats, setStats] = useState<GitHubCommitStats | null>(null);
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
  
  // リポジトリデータを取得
  const fetchRepositories = async () => {
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
  };
  
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
  
  // 初回表示時にリポジトリを取得
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
  }, []);
  
  // プライベートリポジトリの表示設定が変わったら再取得
  useEffect(() => {
    fetchRepositories();
  }, [showPrivate]);
  
  // 言語ごとの色を取得
  const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C#': '#178600',
      PHP: '#4F5D95',
      CSS: '#563d7c',
      HTML: '#e34c26',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      Dart: '#00B4AB',
    };
    
    return colors[language] || '#8257e5'; // デフォルト色
  };
  
  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <GitHubIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
          GitHub連携
        </Typography>
        
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SyncIcon />}
            onClick={handleSyncRepositories}
            disabled={syncLoading}
            sx={{ mr: 2 }}
          >
            {syncLoading ? <CircularProgress size={24} color="inherit" /> : 'リポジトリを同期'}
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={<GitHubIcon />}
            onClick={handleConnectGithub}
            sx={{ mr: 2 }}
          >
            GitHubと連携
          </Button>
          
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<SettingsIcon />}
            onClick={handleOpenSettings}
          >
            設定
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center',
          color: 'primary.main',
          fontWeight: 'medium',
          mb: 2
        }}>
          <GitHubIcon sx={{ mr: 1.5 }} />
          GitHub連携設定
        </Typography>
        
        <Box sx={{ 
          bgcolor: 'info.light', 
          color: 'info.contrastText', 
          p: 2, 
          borderRadius: 1,
          mb: 3,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            GitHubのリポジトリ情報をポートフォリオに表示できます。以下の手順で設定してください。
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
          <Paper elevation={1} sx={{ 
            p: 2, 
            flex: 1, 
            borderTop: '4px solid #3f51b5', 
            borderRadius: 1,
            position: 'relative'
          }}>
            <Box sx={{ 
              position: 'absolute', 
              top: -12, 
              left: 16, 
              bgcolor: '#3f51b5', 
              color: 'white',
              width: 24,
              height: 24,
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold'
            }}>1</Box>
            <Typography variant="h6" sx={{ mb: 1.5, mt: 0.5 }}>
              GitHubでOAuth Appを登録
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.5 }}>
              <Link 
                href="https://github.com/settings/developers" 
                target="_blank"
                sx={{ fontWeight: 'medium' }}
              >
                GitHub Developer Settings
              </Link>
              で新しいOAuth Appを登録します：
            </Typography>
            <Box sx={{ 
              bgcolor: '#f5f5f5', 
              p: 1.5, 
              borderRadius: 1,
              '& li': {
                mb: 0.5
              }
            }}>
              <li>「New OAuth App」をクリック</li>
              <li>Application name: 任意の名前</li>
              <li>Homepage URL: <code>http://localhost:3000</code></li>
              <li>Authorization callback URL: <code>http://localhost:8000/api/oauth/github/callback/</code></li>
            </Box>
          </Paper>
          
          <Paper elevation={1} sx={{ 
            p: 2, 
            flex: 1, 
            borderTop: '4px solid #f50057',
            borderRadius: 1,
            position: 'relative'
          }}>
            <Box sx={{ 
              position: 'absolute', 
              top: -12, 
              left: 16, 
              bgcolor: '#f50057', 
              color: 'white',
              width: 24,
              height: 24,
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold'
            }}>2</Box>
            <Typography variant="h6" sx={{ mb: 1.5, mt: 0.5 }}>
              Client情報を設定
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              OAuth AppページでClient IDとClient Secretを取得し、「設定」ボタンから入力します。
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              startIcon={<SettingsIcon />}
              onClick={handleOpenSettings}
              sx={{ mt: 1 }}
            >
              設定
            </Button>
          </Paper>
          
          <Paper elevation={1} sx={{ 
            p: 2, 
            flex: 1, 
            borderTop: '4px solid #4caf50',
            borderRadius: 1,
            position: 'relative'
          }}>
            <Box sx={{ 
              position: 'absolute', 
              top: -12, 
              left: 16, 
              bgcolor: '#4caf50', 
              color: 'white',
              width: 24,
              height: 24,
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold'
            }}>3</Box>
            <Typography variant="h6" sx={{ mb: 1.5, mt: 0.5 }}>
              連携と同期
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              GitHub連携ボタンをクリックしてアカウントを連携した後、リポジトリを同期します。
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
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
                color="primary"
                startIcon={<SyncIcon />}
                onClick={handleSyncRepositories}
                disabled={syncLoading}
              >
                リポジトリを同期
              </Button>
            </Box>
          </Paper>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : repositories.length > 0 ? (
        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}>
            <GitHubIcon sx={{ mr: 2, fontSize: 28, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight="medium" color="primary.main">
              リポジトリ一覧 
              <Box component="span" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.8em' }}>
                ({repositories.length}件)
              </Box>
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {repositories.map(repo => (
              <Grid item xs={12} md={6} lg={4} key={repo.id}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: '0.3s',
                    borderLeft: repo.featured ? `4px solid #f50057` : 'none',
                    '&:hover': {
                      boxShadow: 6,
                    }
                  }}
                >
                  <CardHeader
                    title={
                      <Typography variant="h6" noWrap title={repo.name}>
                        {repo.name}
                      </Typography>
                    }
                    subheader={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        {repo.language && (
                          <Chip 
                            size="small" 
                            label={repo.language}
                            sx={{ 
                              mr: 1,
                              backgroundColor: getLanguageColor(repo.language),
                              color: '#fff',
                              fontWeight: 'medium',
                            }}
                          />
                        )}
                        
                        {repo.is_private && (
                          <Chip size="small" label="Private" sx={{ mr: 1 }} />
                        )}
                        
                        {repo.is_fork && (
                          <Chip size="small" label="Fork" color="default" variant="outlined" />
                        )}
                      </Box>
                    }
                    action={
                      <IconButton
                        onClick={() => handleToggleFeatured(repo.id)}
                        title={repo.featured ? 'ポートフォリオから外す' : 'ポートフォリオに追加'}
                      >
                        {repo.featured ? 
                          <StarredIcon sx={{ color: '#f50057' }} /> : 
                          <UnstarredIcon />
                        }
                      </IconButton>
                    }
                  />
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {repo.description || '説明なし'}
                    </Typography>
                    
                    {repo.topics.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {repo.topics.map(topic => (
                          <Chip
                            key={topic}
                            label={topic}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Tooltip title="スター数">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StarIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {repo.stargazers_count}
                          </Typography>
                        </Box>
                      </Tooltip>
                      
                      <Tooltip title="フォーク数">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ForkIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {repo.forks_count}
                          </Typography>
                        </Box>
                      </Tooltip>
                      
                      <Tooltip title="Issue数">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IssueIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {repo.open_issues_count}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions>
                    <Button
                      startIcon={<GitHubIcon />}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                    >
                      GitHubで表示
                    </Button>
                    
                    <Box sx={{ flexGrow: 1 }} />
                    
                    <Tooltip title="最終更新日">
                      <Typography variant="caption" color="text.secondary">
                        {new Date(repo.pushed_at).toLocaleDateString()}
                      </Typography>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ) : (
        <Box sx={{ textAlign: 'center', my: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <GitHubIcon sx={{ fontSize: 60, color: '#9e9e9e', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            リポジトリがありません
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            GitHubと連携して、リポジトリ情報を同期してください。
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<GitHubIcon />}
            onClick={handleConnectGithub}
          >
            GitHubと連携する
          </Button>
        </Box>
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