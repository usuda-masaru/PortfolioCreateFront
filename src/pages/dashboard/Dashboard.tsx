import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Box,
  Divider,
  Chip,
  Avatar,
  Paper,
  Stack
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Code as CodeIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  DesignServices as DesignServicesIcon,
  OpenInNew as OpenInNewIcon,
  ManageAccounts as ManageAccountsIcon,
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile } from '../../types/interfaces';
import { authAPI } from '../../services/api';

// PageLinkコンポーネント
interface PageLinkProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  external?: boolean;
}

const PageLink: React.FC<PageLinkProps> = ({ title, description, icon, to, external }) => {
  return (
    <Grid item xs={12} sm={6}>
      <Paper 
        sx={{ 
          p: 2, 
          height: '100%', 
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: 3
          }
        }}
        elevation={1}
      >
        <Box sx={{ display: 'flex', mb: 1 }}>
          <Box sx={{ color: 'primary.main', mr: 1 }}>
            {icon}
          </Box>
          <Typography variant="h6" component="h3" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
          {description}
        </Typography>
        
        <Button 
          variant="outlined" 
          size="small"
          component={external ? 'a' : Link}
          to={!external ? to : undefined}
          href={external ? to : undefined}
          target={external ? "_blank" : undefined}
          endIcon={external ? <OpenInNewIcon /> : null}
        >
          {external ? '開く' : '管理する'}
        </Button>
      </Paper>
    </Grid>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await authAPI.getMyProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Typography>データを読み込み中...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        ダッシュボード
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom>
        こんにちは、{profile?.display_name || user?.username}さん！
      </Typography>
      
      <Box sx={{ my: 3 }}>
        {profile?.portfolio_slug && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<OpenInNewIcon />}
            component="a"
            href={`/portfolio/${profile.portfolio_slug}`}
            target="_blank"
            sx={{ mb: 2 }}
          >
            公開ポートフォリオを表示
          </Button>
        )}
      </Box>
      
      <Grid container spacing={3}>
        {/* ステータスカード */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ポートフォリオステータス
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  <Typography>基本情報</Typography>
                </Box>
                <Chip 
                  label={profile?.bio ? "完了" : "未設定"} 
                  color={profile?.bio ? "success" : "default"} 
                  size="small" 
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CodeIcon sx={{ mr: 1 }} />
                  <Typography>スキル</Typography>
                </Box>
                <Chip 
                  label={profile?.skills.length ? `${profile.skills.length}個登録済み` : "未設定"} 
                  color={profile?.skills.length ? "success" : "default"} 
                  size="small" 
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DesignServicesIcon sx={{ mr: 1 }} />
                  <Typography>プロジェクト</Typography>
                </Box>
                <Chip 
                  label={profile?.projects.length ? `${profile.projects.length}個登録済み` : "未設定"} 
                  color={profile?.projects.length ? "success" : "default"} 
                  size="small" 
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  <Typography>学歴</Typography>
                </Box>
                <Chip 
                  label={profile?.education.length ? `${profile.education.length}個登録済み` : "未設定"} 
                  color={profile?.education.length ? "success" : "default"} 
                  size="small" 
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WorkIcon sx={{ mr: 1 }} />
                  <Typography>職歴</Typography>
                </Box>
                <Chip 
                  label={profile?.work_experiences.length ? `${profile.work_experiences.length}個登録済み` : "未設定"} 
                  color={profile?.work_experiences.length ? "success" : "default"} 
                  size="small" 
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
        
        {/* クイックアクション */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              クイックアクション
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={4}>
              <PageLink
                title="プロフィール管理"
                description="名前、スキル、経歴などのプロフィール情報を編集します"
                icon={<ManageAccountsIcon fontSize="large" />}
                to="/dashboard/profile"
              />
              <PageLink
                title="スキル管理"
                description="技術スキルやツールの追加・編集をします"
                icon={<BuildIcon fontSize="large" />}
                to="/dashboard/skills"
              />
              <PageLink
                title="担当工程管理"
                description="要件定義から運用までの工程経験を登録します"
                icon={<AssignmentIcon fontSize="large" />}
                to="/dashboard/process"
              />
              <PageLink
                title="ポートフォリオ確認"
                description="公開されているポートフォリオを表示します"
                icon={<VisibilityIcon fontSize="large" />}
                to={`/portfolio/${profile?.portfolio_slug}`}
                external
              />
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 