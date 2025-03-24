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
  Visibility as VisibilityIcon,
  GitHub as GitHubIcon
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
          p: 3, 
          height: '100%', 
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.25s ease-in-out',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '5px',
            height: '100%',
            backgroundColor: 'primary.main',
            opacity: 0.7
          }
        }}
        elevation={2}
      >
        <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
          <Box sx={{ color: 'primary.main', mr: 1.5, display: 'flex', alignItems: 'center' }}>
            {icon}
          </Box>
          <Typography variant="h6" component="h3" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
          {description}
        </Typography>
        
        <Button 
          variant="contained" 
          size="medium"
          disableElevation
          component={external ? 'a' : Link}
          to={!external ? to : undefined}
          href={external ? to : undefined}
          target={external ? "_blank" : undefined}
          endIcon={external ? <OpenInNewIcon /> : null}
          sx={{ 
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 'medium',
            alignSelf: 'flex-start'
          }}
        >
          {external ? '開く' : '管理する'}
        </Button>
      </Paper>
    </Grid>
  );
};

// StatusItemコンポーネント - ステータス項目を統一的に表示するための新コンポーネント
interface StatusItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  completed: boolean;
}

const StatusItem: React.FC<StatusItemProps> = ({ icon, label, value, completed }) => {
  return (
    <Paper
      sx={{
        p: 2.5,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 2,
        backgroundColor: completed ? 'rgba(46, 125, 50, 0.04)' : 'background.paper',
        border: 1,
        borderColor: completed ? 'rgba(46, 125, 50, 0.2)' : 'divider',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 1,
          transform: 'translateX(3px)'
        }
      }}
      elevation={0}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          sx={{
            mr: 2,
            bgcolor: completed ? 'success.light' : 'action.selected',
            color: completed ? 'success.contrastText' : 'text.secondary',
            width: 40,
            height: 40
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="subtitle1" fontWeight="medium">
          {label}
        </Typography>
      </Box>
      <Chip 
        label={value} 
        color={completed ? "success" : "default"} 
        variant={completed ? "filled" : "outlined"}
        size="medium"
        sx={{ fontWeight: 'medium', minWidth: 100, textAlign: 'center' }}
      />
    </Paper>
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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h5" component="div" sx={{ 
            fontWeight: 'medium', 
            mb: 1,
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Box component="span" sx={{ 
              width: 5, 
              height: 24, 
              bgcolor: 'primary.main',
              borderRadius: '4px',
              mr: 1.5,
              display: 'inline-block'
            }}/>
            ようこそ！
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            こんにちは、<Box component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{profile?.display_name || user?.username}</Box>さん！ポートフォリオを充実させましょう。
          </Typography>
        </Box>
        
        {profile?.portfolio_slug && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<OpenInNewIcon />}
            component="a"
            href={`/portfolio/${profile.portfolio_slug}`}
            target="_blank"
            sx={{ 
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 'medium',
              py: 1.2,
              px: 2.5
            }}
          >
            ポートフォリオを表示
          </Button>
        )}
      </Box>
      
      <Grid container spacing={4}>
        {/* ステータスカード */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 2, 
            height: '100%',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            border: '1px solid',
            borderColor: 'divider'
          }} 
          elevation={0}
          >
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 'bold', 
              mb: 3, 
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Box component="span" sx={{ 
                width: 3, 
                height: 20, 
                bgcolor: 'primary.main',
                borderRadius: '4px',
                mr: 1.5,
                display: 'inline-block'
              }}/>
              ポートフォリオステータス
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ mb: 2 }}>
              <StatusItem 
                icon={<PersonIcon />} 
                label="基本情報" 
                value={profile?.bio ? "完了" : "未設定"} 
                completed={!!profile?.bio} 
              />
              
              <StatusItem 
                icon={<CodeIcon />} 
                label="スキル" 
                value={profile?.skills.length ? `${profile.skills.length}個` : "未設定"} 
                completed={!!profile?.skills.length} 
              />
              
              <StatusItem 
                icon={<DesignServicesIcon />} 
                label="プロジェクト" 
                value={profile?.projects.length ? `${profile.projects.length}個` : "未設定"} 
                completed={!!profile?.projects.length} 
              />
              
              <StatusItem 
                icon={<SchoolIcon />} 
                label="学歴" 
                value={profile?.education.length ? `${profile.education.length}個` : "未設定"} 
                completed={!!profile?.education.length} 
              />
              
              <StatusItem 
                icon={<WorkIcon />} 
                label="職歴" 
                value={profile?.work_experiences.length ? `${profile.work_experiences.length}個` : "未設定"} 
                completed={!!profile?.work_experiences.length} 
              />

              <StatusItem 
                icon={<GitHubIcon />} 
                label="GitHub連携" 
                value={profile?.github_username ? "連携済み" : "未連携"} 
                completed={!!profile?.github_username} 
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* クイックアクション */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 2, 
            height: '100%',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            border: '1px solid',
            borderColor: 'divider'
          }} 
          elevation={0}
          >
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 'bold', 
              mb: 3, 
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Box component="span" sx={{ 
                width: 3, 
                height: 20, 
                bgcolor: 'primary.main',
                borderRadius: '4px',
                mr: 1.5,
                display: 'inline-block'
              }}/>
              クイックアクション
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
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
                title="職務経歴管理"
                description="プロジェクト経験や案件情報を登録・編集します"
                icon={<WorkIcon fontSize="large" />}
                to="/dashboard/work-experience"
              />
              <PageLink
                title="ポートフォリオ確認"
                description="公開されているポートフォリオを表示します"
                icon={<VisibilityIcon fontSize="large" />}
                to={`/portfolio/${profile?.portfolio_slug}`}
                external
              />
              <PageLink
                icon={<SchoolIcon />}
                title="学歴を管理"
                description="学位や研究内容を追加"
                to="/dashboard/education"
              />
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 