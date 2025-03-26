import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  CircularProgress, Alert,
  Avatar, IconButton, useTheme, alpha, Chip, Tooltip,
  Container, InputAdornment
} from '@mui/material';
import { 
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  TextSnippet as TextSnippetIcon,
  LocalOffer as LocalOfferIcon,
  Email as EmailIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Code as CodeIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { profileAPI } from '../../services/api';
import { UserProfile } from '../../types/interfaces';

const ProfileEdit: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  useEffect(() => {
    fetchProfile();
    // コンポーネントがマウントされた状態を追跡
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await profileAPI.getMyProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('プロフィールの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    // 画像ファイルのプレビューを設定
    reader.onload = (event) => {
      if (profile && event.target) {
        setProfile({
          ...profile,
          profile_image: event.target.result as string
        });
      }
    };
    reader.readAsDataURL(file);
    
    // APIを使って画像をアップロード
    setUploadingImage(true);
    setError(null);
    try {
      const updatedProfile = await profileAPI.uploadProfileImage(profile.id, file);
      setProfile(updatedProfile);
      setSuccess('プロフィール画像をアップロードしました');
      
      // 成功メッセージを3秒後に消す
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('画像のアップロードに失敗しました: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    // 必須フィールドのバリデーション
    if (!profile.display_name?.trim()) {
      setError('表示名は必須です');
      return;
    }
    if (!profile.title?.trim()) {
      setError('役職・肩書きは必須です');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // APIを直接呼び出すだけ - API側で必要なフィールド除外を行う
      await profileAPI.updateProfile(profile);
      setSuccess('プロフィールを保存しました');
      
      // 成功メッセージを3秒後に消す
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error instanceof Error) {
        setError(`プロフィールの保存に失敗しました: ${error.message}`);
      } else {
        setError('プロフィールの保存に失敗しました');
      }
      
      // 開発モードではエラー表示を詳細にする
      if (process.env.NODE_ENV === 'development') {
        console.warn('開発モード: 詳細なエラーログを表示します');
        console.error(error);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={40} thickness={4} />
        <Typography color="textSecondary" variant="body1">
          プロフィール情報を読み込んでいます...
        </Typography>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box 
        sx={{ 
          p: 4, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh'  
        }}
      >
        <Alert 
          severity="error" 
          variant="filled"
          sx={{ 
            maxWidth: 500,
            boxShadow: theme.shadows[3]
          }}
        >
          プロフィールが見つかりませんでした
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
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
              <PersonIcon sx={{ mr: 1.5, fontSize: '1.75rem' }} />
              プロフィール編集
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              あなたの基本情報やスキルを編集して、ポートフォリオの内容を更新できます。
            </Typography>
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

        <Paper 
          elevation={2}
          sx={{ 
            borderRadius: 2, 
            overflow: 'hidden',
            mb: 4
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* プロフィール画像セクション */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                py: 4,
                bgcolor: alpha(theme.palette.primary.light, 0.05),
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={profile.profile_image || ''}
                  alt={profile.display_name || 'プロフィール画像'}
                  sx={{ 
                    width: 140, 
                    height: 140, 
                    border: `4px solid ${theme.palette.background.paper}`,
                    boxShadow: theme.shadows[2]
                  }}
                  onClick={handleImageClick}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Tooltip title="プロフィール画像を変更">
                  <IconButton
                    color="primary"
                    sx={{
                      position: 'absolute',
                      bottom: 5,
                      right: 5,
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: theme.shadows[1],
                    }}
                    disabled={uploadingImage}
                    onClick={handleImageClick}
                    size="medium"
                  >
                    {uploadingImage ? <CircularProgress size={24} /> : <PhotoCameraIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* 基本情報セクション */}
                <Grid item xs={12}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      pb: 1,
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      基本情報
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="表示名"
                        name="display_name"
                        value={profile.display_name || ''}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="役職・肩書き"
                        name="title"
                        value={profile.title || ''}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="自己紹介"
                        name="bio"
                        value={profile.bio || ''}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="専門分野"
                        name="specialty"
                        value={profile.specialty || ''}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        helperText="例: Webアプリケーション開発, UI/UXデザイン, モバイルアプリ開発"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="所在地"
                        name="location"
                        value={profile.location || ''}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        helperText="例: 東京都, 大阪府, リモートワーク"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* 連絡先セクション */}
                <Grid item xs={12}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      pb: 1,
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <EmailIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      連絡先・SNS
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="公開メールアドレス"
                        name="email_public"
                        value={profile.email_public || ''}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        helperText="ポートフォリオに表示される連絡先メールアドレス"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="GitHub ユーザー名"
                        name="github_username"
                        value={profile.github_username || ''}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                          startAdornment: <GitHubIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Twitter ユーザー名"
                        name="twitter_username"
                        value={profile.twitter_username || ''}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                          startAdornment: <TwitterIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Qiita ユーザー名"
                        name="qiita_username"
                        value={profile.qiita_username || ''}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                          startAdornment: <CodeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="LinkedIn URL"
                        name="linkedin_url"
                        value={profile.linkedin_url || ''}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                          startAdornment: <LinkedInIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="個人サイト/ブログ URL"
                        name="website_url"
                        value={profile.website_url || ''}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                          startAdornment: <LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                
                {/* 高度な設定セクション */}
                <Grid item xs={12}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      pb: 1,
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <LocalOfferIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      ポートフォリオ設定
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="ポートフォリオURL (slug)"
                        name="portfolio_slug"
                        value={profile.portfolio_slug || ''}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        margin="normal"
                        helperText={`このIDはポートフォリオのURLとして使われます: ${window.location.origin}/portfolio/`}
                        InputProps={{
                          endAdornment: profile.portfolio_slug && (
                            <InputAdornment position="end">
                              <Chip 
                                label={profile.portfolio_slug} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="職務経歴書 URL"
                        name="resume"
                        value={profile.resume || ''}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        helperText="PDFなどのダウンロード可能な職務経歴書のURL"
                        InputProps={{
                          startAdornment: <TextSnippetIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 4,
                  pt: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={saving}
                  size="large"
                  startIcon={saving ? undefined : <SaveIcon />}
                  sx={{ 
                    minWidth: 180,
                    py: 1,
                    borderRadius: 2
                  }}
                >
                  {saving ? <CircularProgress size={24} color="inherit" /> : '変更を保存'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfileEdit;