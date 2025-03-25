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
  OpenInNew as OpenInNewIcon,
  ManageAccounts as ManageAccountsIcon,
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  GitHub as GitHubIcon,
  Article as ArticleIcon
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
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            ポートフォリオ管理
          </Typography>
          <Typography variant="body1" color="text.secondary">
            各項目を設定して、あなたのポートフォリオを完成させましょう。
          </Typography>
        </Box>
        
        {profile?.portfolio_slug && (
          <Button
            variant="contained"
            color="primary"
            component="a"
            href={`/portfolio/${profile.portfolio_slug}`}
            target="_blank"
            startIcon={<VisibilityIcon />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium'
            }}
          >
            ポートフォリオを表示
          </Button>
        )}
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          設定状況
        </Typography>

        <StatusItem
          icon={<PersonIcon />}
          label="基本情報"
          value={profile?.display_name ? "完了" : "未設定"}
          completed={!!profile?.display_name}
        />

        <StatusItem
          icon={<CodeIcon />}
          label="スキル"
          value={profile?.skills.length ? `${profile.skills.length}個` : "未設定"}
          completed={!!profile?.skills.length}
        />

        <StatusItem
          icon={<SchoolIcon />}
          label="学歴"
          value={profile?.education.length ? `${profile.education.length}件` : "未設定"}
          completed={!!profile?.education.length}
        />

        <StatusItem
          icon={<WorkIcon />}
          label="職務経歴"
          value={profile?.work_experiences.length ? `${profile.work_experiences.length}件` : "未設定"}
          completed={!!profile?.work_experiences.length}
        />

        <StatusItem
          icon={<AssignmentIcon />}
          label="担当工程"
          value={profile?.process_experiences?.length ? `${profile.process_experiences.length}件` : "未設定"}
          completed={!!profile?.process_experiences?.length}
        />

        <StatusItem
          icon={<GitHubIcon />}
          label="GitHub連携"
          value={profile?.github_username ? "連携済" : "未連携"}
          completed={!!profile?.github_username}
        />

        <StatusItem
          icon={<ArticleIcon />}
          label="Qiita連携"
          value={profile?.qiita_username ? "連携済" : "未連携"}
          completed={!!profile?.qiita_username}
        />
      </Paper>

      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        各項目の管理
      </Typography>

      <Grid container spacing={3}>
        <PageLink
          title="基本情報"
          description="名前、職業、自己紹介文などの基本的な情報を設定します。"
          icon={<PersonIcon />}
          to="/dashboard/profile"
        />
        
        <PageLink
          title="スキル"
          description="あなたが持つプログラミング言語やツールのスキルを設定します。"
          icon={<CodeIcon />}
          to="/dashboard/skills"
        />
        
        <PageLink
          title="学歴"
          description="学歴情報を時系列で設定します。"
          icon={<SchoolIcon />}
          to="/dashboard/education"
        />
        
        <PageLink
          title="職務経歴"
          description="これまでの職務経歴を時系列で設定します。"
          icon={<WorkIcon />}
          to="/dashboard/work-experience"
        />

        <PageLink
          title="担当工程"
          description="要件定義から運用までの工程経験を登録します。"
          icon={<AssignmentIcon />}
          to="/dashboard/process"
        />
        
        <PageLink
          title="GitHub連携"
          description="GitHubと連携してリポジトリ情報を表示します。"
          icon={<GitHubIcon />}
          to="/dashboard/github"
        />
        
        <PageLink
          title="Qiita連携"
          description="Qiitaと連携して投稿記事を表示します。"
          icon={<ArticleIcon />}
          to="/dashboard/qiita"
        />
      </Grid>
    </Box>
  );
};

export default Dashboard; 