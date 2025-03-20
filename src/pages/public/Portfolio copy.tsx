import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, Container, Typography, CircularProgress, Alert, 
  Paper, useTheme, alpha, Chip
} from '@mui/material';
import { PublicProfile } from '../../types/interfaces';
import { profileAPI } from '../../services/api';

import ProfileHeader from '../../components/profile/ProfileHeader';
import SkillsSection from '../../components/profile/SkillsSection';
import ProjectsSection from '../../components/profile/ProjectsSection';
import ExperienceSection from '../../components/profile/ExperienceSection';
import EducationSection from '../../components/profile/EducationSection';
import ContactSection from '../../components/profile/ContactSection';

// セクションコンポーネントのためのラッパー
interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const SectionContainer: React.FC<SectionProps> = ({ title, children }) => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '5px',
          height: '100%',
          backgroundColor: theme.palette.primary.main,
        }
      }}
    >
      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 2
        }}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

const Portfolio: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  // プロフィールデータの取得
  const fetchProfile = async () => {
    setLoading(true);
    try {
      // APIからデータを取得
      const data = await profileAPI.getPublicProfile(slug || '');
      console.log('Fetched profile data:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('プロフィールの取得に失敗しました');
      
      // 開発中はエラー時にもサンプルデータを表示（本番環境では削除してください）
      setProfile({
        display_name: "山田 太郎",
        profile_image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        title: "フルスタックエンジニア",
        bio: "Webアプリケーション開発に情熱を持つフルスタックエンジニアです。フロントエンドからバックエンド、インフラまで幅広く対応します。最新技術のキャッチアップを欠かさず、効率的で堅牢なシステム開発を心がけています。",
        specialty: "Webアプリケーション開発、モバイルアプリ開発、クラウドインフラ構築",
        location: "東京都",
        email_public: "yamada.taro@example.com",
        github_username: "yamada-taro",
        qiita_username: "yamada_taro",
        twitter_username: "yamada_taro",
        linkedin_url: "https://linkedin.com/in/yamada-taro",
        website_url: "https://yamada-taro.example.com",
        skills: [],
        qiita_articles: [],
        projects: [],
        education: [],
        work_experiences: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">プロフィールが見つかりませんでした</Alert>
      </Container>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: alpha(theme.palette.background.default, 0.7),
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            mb: 4,
          }}
        >
          <ProfileHeader profile={profile} />
        </Paper>
        
        <Box sx={{ mt: 4 }}>
          <SectionContainer title="スキル">
            <SkillsSection skills={profile.skills || []} processExperiences={profile.process_experiences || []} />
          </SectionContainer>
        </Box>

        <Box sx={{ mt: 4 }}>
          <SectionContainer title="プロジェクト">
            <ProjectsSection projects={profile.projects || []} />
          </SectionContainer>
        </Box>

        <Box sx={{ mt: 4 }}>
          <SectionContainer title="職歴">
            <ExperienceSection experiences={profile.work_experiences || []} />
          </SectionContainer>
        </Box>

        <Box sx={{ mt: 4 }}>
          <SectionContainer title="学歴">
            <EducationSection education={profile.education || []} />
          </SectionContainer>
        </Box>

        <Box sx={{ mt: 4, mb: 4 }}>
          <SectionContainer title="連絡先">
            <ContactSection profile={profile} />
          </SectionContainer>
        </Box>
      </Container>
    </Box>
  );
};

export default Portfolio; 