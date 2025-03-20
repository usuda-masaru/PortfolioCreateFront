import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  CircularProgress, Alert, Divider, Card, CardContent,
  Avatar, IconButton
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { profileAPI } from '../../services/api';
import { UserProfile } from '../../types/interfaces';

const ProfileEdit: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
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
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">プロフィールが見つかりませんでした</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>プロフィール編集</Typography>
      <Divider sx={{ mb: 4 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          {/* プロフィール画像セクション */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={profile.profile_image || ''}
                alt={profile.display_name || 'プロフィール画像'}
                sx={{ 
                  width: 150, 
                  height: 150, 
                  cursor: 'pointer',
                  border: '2px solid #eee'
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
              <IconButton
                color="primary"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'white',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
                disabled={uploadingImage}
                onClick={handleImageClick}
              >
                {uploadingImage ? <CircularProgress size={24} /> : <PhotoCameraIcon />}
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>基本情報</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="表示名"
                        name="display_name"
                        value={profile.display_name || ''}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="肩書き"
                        name="title"
                        value={profile.title || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="自己紹介"
                        name="bio"
                        value={profile.bio || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="専門分野"
                        name="specialty"
                        value={profile.specialty || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="所在地"
                        name="location"
                        value={profile.location || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>連絡先情報</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="email"
                        label="公開メールアドレス"
                        name="email_public"
                        value={profile.email_public || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="GitHubユーザー名"
                        name="github_username"
                        value={profile.github_username || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Qiitaユーザー名"
                        name="qiita_username"
                        value={profile.qiita_username || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Twitterユーザー名"
                        name="twitter_username"
                        value={profile.twitter_username || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="LinkedInのURL"
                        name="linkedin_url"
                        value={profile.linkedin_url || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="個人ウェブサイトのURL"
                        name="website_url"
                        value={profile.website_url || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={saving}
              sx={{ minWidth: 120 }}
            >
              {saving ? <CircularProgress size={24} /> : '保存'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ProfileEdit; 