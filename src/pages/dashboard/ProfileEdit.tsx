import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  CircularProgress, Alert, Divider, Card, CardContent,
  Avatar, IconButton, useTheme, alpha, Chip, Tooltip,
  Container, InputAdornment, Fade, Grow
} from '@mui/material';
import { 
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  TextSnippet as TextSnippetIcon,
  LocalOffer as LocalOfferIcon,
  LocationOn as LocationOnIcon,
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
      setError('プロフィールの保存に失敗しました: ' + (error instanceof Error ? error.message : String(error)));
      
      // 開発モードではエラー表示を詳細にする
      if (process.env.NODE_ENV === 'development') {
        console.warn('開発モード: 詳細なエラーログを表示します');
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          position: 'relative',
          pb: 1,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1"
          fontWeight="700"
          sx={{
            backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            color: 'transparent',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -6,
              left: 0,
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: theme.palette.primary.main,
            }
          }}
        >
          プロフィール編集
        </Typography>
      </Box>

      {/* アラート表示セクション */}
      <Box sx={{ mb: 2 }}>
        <Fade in={!!error}>
          <Alert 
            severity="error" 
            variant="filled"
            sx={{ 
              mb: 1,
              animation: error ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none',
              '@keyframes shake': {
                '0%, 100%': { transform: 'translateX(0)' },
                '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
                '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
              }
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Fade>
        
        <Fade in={!!success}>
          <Alert 
            severity="success"
            variant="filled"
            sx={{ mb: 1 }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        </Fade>
      </Box>

      <Grow in={mounted} timeout={500}>
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
            background: `linear-gradient(to right bottom, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.98)})`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* プロフィール画像セクション */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                py: 3,
                background: `linear-gradient(120deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.07)} 100%)`,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'radial-gradient(circle at 20% 90%, rgba(216, 223, 234, 0.1) 0%, rgba(216, 223, 234, 0) 50%)',
                  backgroundSize: '60% 60%',
                  backgroundRepeat: 'no-repeat'
                }
              }}
            >
              <Box 
                sx={{ 
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <Avatar
                  src={profile.profile_image || ''}
                  alt={profile.display_name || 'プロフィール画像'}
                  sx={{ 
                    width: 140, 
                    height: 140, 
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                    border: `4px solid ${theme.palette.background.paper}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 15px 35px -5px rgba(0,0,0,0.2)',
                    }
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
                      bottom: 10,
                      right: 10,
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: theme.shadows[2],
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        backgroundColor: alpha(theme.palette.primary.light, 0.1),
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4],
                      }
                    }}
                    disabled={uploadingImage}
                    onClick={handleImageClick}
                    size="large"
                  >
                    {uploadingImage ? <CircularProgress size={24} /> : <PhotoCameraIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Grid container spacing={3}>
                {/* 基本情報セクション */}
                <Grid item xs={12}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      mb: 4,
                      border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 10px 30px -5px rgba(0,0,0,0.08)',
                        transform: 'translateY(-2px)'
                      },
                      borderRadius: 2,
                    }}
                  >
                    <Box 
                      sx={{ 
                        px: 3,
                        py: 2,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                        background: `linear-gradient(90deg, ${alpha(theme.palette.primary.light, 0.03)}, transparent)`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                      }}
                    >
                      <PersonIcon 
                        sx={{ 
                          color: theme.palette.primary.main,
                          opacity: 0.9
                        }} 
                      />
                      <Typography 
                        variant="h6" 
                        fontWeight="600"
                        color="primary"
                      >
                        基本情報
                      </Typography>
                    </Box>
                    <CardContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
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
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                  borderWidth: '1px',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                  borderWidth: '2px',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="肩書き"
                            name="title"
                            value={profile.title || ''}
                            onChange={handleChange}
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <WorkIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                  borderWidth: '1px',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={5}
                            label="自己紹介"
                            name="bio"
                            value={profile.bio || ''}
                            onChange={handleChange}
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                  <TextSnippetIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                  borderWidth: '1px',
                                },
                              },
                              '& .MuiInputAdornment-root': {
                                '& .MuiSvgIcon-root': {
                                  fontSize: '1.2rem',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="専門分野"
                            name="specialty"
                            value={profile.specialty || ''}
                            onChange={handleChange}
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocalOfferIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                  borderWidth: '1px',
                                },
                              },
                            }}
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
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocationOnIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                  borderWidth: '1px',
                                },
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* 連絡先情報セクション */}
                  <Card 
                    elevation={0} 
                    sx={{ 
                      mb: 4,
                      border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 10px 30px -5px rgba(0,0,0,0.08)',
                        transform: 'translateY(-2px)'
                      },
                      borderRadius: 2,
                    }}
                  >
                    <Box 
                      sx={{ 
                        px: 3,
                        py: 2,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                        background: `linear-gradient(90deg, ${alpha(theme.palette.primary.light, 0.03)}, transparent)`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                      }}
                    >
                      <EmailIcon 
                        sx={{ 
                          color: theme.palette.primary.main,
                          opacity: 0.9
                        }} 
                      />
                      <Typography 
                        variant="h6" 
                        fontWeight="600"
                        color="primary"
                      >
                        連絡先情報
                      </Typography>
                    </Box>
                    <CardContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            type="email"
                            label="公開メールアドレス"
                            name="email_public"
                            value={profile.email_public || ''}
                            onChange={handleChange}
                            variant="outlined"
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
                                  borderWidth: '1px',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="GitHubユーザー名"
                            name="github_username"
                            value={profile.github_username || ''}
                            onChange={handleChange}
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <GitHubIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                  borderWidth: '1px',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Qiitaユーザー名"
                            name="qiita_username"
                            value={profile.qiita_username || ''}
                            onChange={handleChange}
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CodeIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                  borderWidth: '1px',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Twitterユーザー名"
                            name="twitter_username"
                            value={profile.twitter_username || ''}
                            onChange={handleChange}
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <TwitterIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                  borderWidth: '1px',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="LinkedInのURL"
                            name="linkedin_url"
                            value={profile.linkedin_url || ''}
                            onChange={handleChange}
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LinkedInIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                  borderWidth: '1px',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="個人ウェブサイトのURL"
                            name="website_url"
                            value={profile.website_url || ''}
                            onChange={handleChange}
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LanguageIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                  borderWidth: '1px',
                                },
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* 送信ボタン */}
              <Box 
                sx={{ 
                  mt: 4, 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  position: 'relative'
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
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: theme.shadows[4],
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: theme.shadows[8],
                      transform: 'translateY(-2px)',
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    }
                  }}
                >
                  {saving ? <CircularProgress size={24} color="inherit" /> : '変更を保存'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Grow>
    </Container>
  );
};

export default ProfileEdit;