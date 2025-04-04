import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, Container, Typography, CircularProgress, Alert, 
  Paper, useTheme, alpha
} from '@mui/material';
import { PublicProfile } from '../../types/interfaces';
import { profileAPI } from '../../services/api';

import ProfileHeader from '../../components/profile/ProfileHeader';
import SkillsSection from '../../components/profile/SkillsSection';
import ProcessExperiencesSection from '../../components/profile/ProcessExperiencesSection';
import ExperienceSection from '../../components/profile/ExperienceSection';
import EducationSection from '../../components/profile/EducationSection';
import ContactSection from '../../components/profile/ContactSection';
import GitHubRepositoriesSection from '../../components/profile/GitHubRepositoriesSection';
import QiitaArticlesSection from '../../components/profile/QiitaArticlesSection';

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
  const { portfolio_slug } = useParams<{ portfolio_slug: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  // fetchProfileをuseCallbackでメモ化
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching profile for portfolio_slug:', portfolio_slug);
      
      const myProfile = await profileAPI.getMyProfile();
      console.log('My profile data:', myProfile);
      
      const publicProfile: PublicProfile = {
        ...myProfile,
        display_name: myProfile.display_name,
        profile_image: myProfile.profile_image,
        title: myProfile.title,
        bio: myProfile.bio,
        specialty: myProfile.specialty,
        location: myProfile.location,
        email_public: myProfile.email_public,
        github_username: myProfile.github_username,
        qiita_username: myProfile.qiita_username,
        twitter_username: myProfile.twitter_username,
        linkedin_url: myProfile.linkedin_url,
        website_url: myProfile.website_url,
        skills: myProfile.skills || [],
        process_experiences: myProfile.process_experiences || [],
        education: myProfile.education || [],
        work_experiences: myProfile.work_experiences || [],
        github_repositories: (myProfile as any).github_repositories || [],
        qiita_articles: (myProfile as any).qiita_articles || [],
      };
      
      setProfile(publicProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('プロフィールの取得に失敗しました');
      
      // 開発中はエラー時にもサンプルデータを表示（本番環境では削除してください）
      console.log('Using sample data for development');
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
        education: [],
        work_experiences: [],
      });
    } finally {
      setLoading(false);
    }
  }, [portfolio_slug]);

  useEffect(() => {
    console.log('Portfolio component mounted, portfolio_slug:', portfolio_slug);
    fetchProfile();
  }, [portfolio_slug, fetchProfile]);

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
            <SkillsSection skills={profile.skills || []} />
          </SectionContainer>
        </Box>

        <Box sx={{ mt: 4 }}>
          <SectionContainer title="担当工程">
            <ProcessExperiencesSection processExperiences={profile.process_experiences || []} />
          </SectionContainer>
        </Box>

        <Box sx={{ mt: 4 }}>
          <SectionContainer title="職務経歴">
            <ExperienceSection experiences={profile.work_experiences || []} />
          </SectionContainer>
        </Box>

        <Box sx={{ mt: 4 }}>
          <SectionContainer title="学歴">
            <EducationSection education={profile.education || []} />
          </SectionContainer>
        </Box>

        {profile.github_repositories && profile.github_repositories.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <SectionContainer title="GitHubリポジトリ">
              <GitHubRepositoriesSection repositories={profile.github_repositories} />
            </SectionContainer>
          </Box>
        )}

        {profile.qiita_articles && profile.qiita_articles.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <SectionContainer title="Qiita記事">
              <QiitaArticlesSection articles={profile.qiita_articles} />
            </SectionContainer>
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <SectionContainer title="連絡先">
            <ContactSection profile={profile} />
          </SectionContainer>
        </Box>
      </Container>
    </Box>
  );
};

export default Portfolio; 