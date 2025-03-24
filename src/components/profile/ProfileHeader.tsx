import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Avatar, 
  Grid, 
  Chip, 
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  alpha,
  Tooltip,
  Link,
  Paper
} from '@mui/material';
import { 
  GitHub as GitHubIcon, 
  Language as WebsiteIcon, 
  Twitter as TwitterIcon, 
  LinkedIn as LinkedInIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Code as CodeIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { PublicProfile } from '../../types/interfaces';

interface ProfileHeaderProps {
  profile: PublicProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  
  // ソーシャルリンク情報
  const socialLinks = [
    { 
      name: 'GitHub', 
      url: profile.github_username ? `https://github.com/${profile.github_username}` : '', 
      icon: <GitHubIcon />,
      color: '#333333',
      visible: !!profile.github_username
    },
    { 
      name: 'Twitter', 
      url: profile.twitter_username ? `https://twitter.com/${profile.twitter_username}` : '', 
      icon: <TwitterIcon />,
      color: '#1DA1F2',
      visible: !!profile.twitter_username
    },
    { 
      name: 'LinkedIn', 
      url: profile.linkedin_url || '', 
      icon: <LinkedInIcon />,
      color: '#0A66C2',
      visible: !!profile.linkedin_url
    },
    { 
      name: 'Website', 
      url: profile.website_url || '', 
      icon: <WebsiteIcon />,
      color: '#4CAF50',
      visible: !!profile.website_url
    },
    { 
      name: 'Email', 
      url: profile.email_public ? `mailto:${profile.email_public}` : '', 
      icon: <EmailIcon />,
      color: '#D44638',
      visible: !!profile.email_public
    }
  ].filter(link => link.visible);

  // 専門分野タグのアニメーション用遅延を計算
  const getTagDelay = (index: number) => `${0.15 + index * 0.08}s`;
  
  return (
    <Box 
      sx={{ 
        position: 'relative',
        width: '100%',
        borderRadius: { xs: 0, sm: '16px' },
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: { xs: 0, sm: '0 10px 40px rgba(0,0,0,0.08)' },
      }}
    >
      {/* ヘッダーの上部背景 */}
      <Box 
        sx={{ 
          position: 'relative',
          width: '100%',
          height: { xs: 180, sm: 260, md: 280 },
          background: `linear-gradient(125deg, 
            ${alpha(theme.palette.primary.dark, 0.95)} 0%, 
            ${alpha(theme.palette.primary.main, 0.85)} 35%,
            ${alpha(theme.palette.primary.light, 0.75)} 75%,
            ${alpha(theme.palette.secondary.light, 0.7)} 100%)`,
          overflow: 'hidden'
        }}
      >
        {/* 背景の装飾パターン - クリスタル効果 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.4,
            background: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.35) 0%, transparent 25%),
              radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 20%),
              radial-gradient(circle at 40% 60%, rgba(255,255,255,0.3) 0%, transparent 15%),
              radial-gradient(circle at 70% 20%, rgba(255,255,255,0.25) 0%, transparent 18%)
            `,
            zIndex: 1
          }}
        />
        
        {/* 抽象的な背景形状 */}
        <Box
          sx={{
            position: 'absolute',
            top: -150,
            right: -150,
            width: 600,
            height: 600,
            borderRadius: '40%',
            background: `linear-gradient(140deg, 
              ${alpha(theme.palette.secondary.main, 0.3)} 0%, 
              ${alpha(theme.palette.primary.main, 0.1)} 50%, 
              transparent 80%)`,
            transform: 'rotate(25deg)',
            zIndex: 0
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: -180,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `linear-gradient(220deg, 
              ${alpha(theme.palette.primary.dark, 0.3)} 0%, 
              ${alpha(theme.palette.primary.main, 0.1)} 60%, 
              transparent 85%)`,
            zIndex: 0
          }}
        />
        
        {/* 動くグラデーションオーバーレイ */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
            background: `linear-gradient(45deg, 
              transparent 45%, 
              ${alpha(theme.palette.common.white, 0.1)} 45%, 
              ${alpha(theme.palette.common.white, 0.15)} 55%, 
              transparent 55%)`,
            backgroundSize: '250% 250%',
            animation: 'gradient-shimmer 6s ease infinite',
            '@keyframes gradient-shimmer': {
              '0%': { backgroundPosition: '0% 0%' },
              '50%': { backgroundPosition: '100% 100%' },
              '100%': { backgroundPosition: '0% 0%' }
            },
            zIndex: 2
          }}
        />
        
        {/* 浮遊する装飾要素 */}
        <Box
          sx={{
            position: 'absolute',
            width: { xs: 120, sm: 200 },
            height: { xs: 120, sm: 200 },
            borderRadius: '50%',
            border: `2px solid ${alpha(theme.palette.common.white, 0.1)}`,
            top: { xs: '30%', sm: '40%' },
            right: { xs: '-10%', sm: '5%' },
            animation: 'float-slow 12s ease-in-out infinite',
            '@keyframes float-slow': {
              '0%': { transform: 'translateY(0) rotate(0deg)' },
              '50%': { transform: 'translateY(-15px) rotate(5deg)' },
              '100%': { transform: 'translateY(0) rotate(0deg)' }
            },
            zIndex: 2
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            width: { xs: 80, sm: 150 },
            height: { xs: 80, sm: 150 },
            borderRadius: '30%',
            border: `2px solid ${alpha(theme.palette.common.white, 0.15)}`,
            bottom: { xs: '10%', sm: '15%' },
            left: { xs: '5%', sm: '15%' },
            animation: 'float-slow 8s ease-in-out infinite reverse',
            animationDelay: '1s',
            zIndex: 2
          }}
        />
      </Box>
      
      <Container maxWidth="xl" sx={{ position: 'relative' }}>
        {/* プロフィール情報コンテナ */}
        <Box
          sx={{
            position: 'relative',
            mt: { xs: -10, sm: -12, md: -14 },
            mb: { xs: 4, sm: 5 },
            px: { xs: 2, sm: 3, md: 2 },
            zIndex: 10,
            width: '100%'
          }}
        >
          <Grid 
            container 
            spacing={{ xs: 3, sm: 6, md: 8 }} 
            alignItems="stretch"
          >
            {/* 左側：アバターとソーシャルリンク */}
            <Grid item xs={12} sm={4} md={3} lg={2.5} sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: isMobile ? 'center' : 'flex-start',
            }}>
              <Box sx={{ position: 'relative' }}>
                {/* アバター画像の背景ハロー効果 */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, 
                      ${alpha(theme.palette.primary.main, 0.15)} 0%, 
                      transparent 70%)`,
                    transform: 'scale(1.5)',
                    filter: 'blur(15px)',
                    top: 0,
                    left: 0,
                    zIndex: -1
                  }}
                />
                
                {/* アバターの輝き効果（外枠） */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '108%',
                    height: '108%',
                    borderRadius: '50%',
                    background: `conic-gradient(
                      ${alpha(theme.palette.primary.light, 0)},
                      ${alpha(theme.palette.primary.light, 0.8)},
                      ${alpha(theme.palette.primary.main, 0.8)},
                      ${alpha(theme.palette.secondary.light, 0.8)},
                      ${alpha(theme.palette.primary.light, 0.8)},
                      ${alpha(theme.palette.primary.light, 0)}
                    )`,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: 'rotate-slow 10s linear infinite',
                    '@keyframes rotate-slow': {
                      '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                      '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' }
                    },
                    zIndex: 0
                  }}
                />
                
                {/* メインアバター */}
                <Avatar
                  src={profile.profile_image}
                  alt={profile.display_name}
                  sx={{ 
                    position: 'relative',
                    width: { xs: 150, sm: 180, md: 200 }, 
                    height: { xs: 150, sm: 180, md: 200 },
                    border: `4px solid white`,
                    boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.15)}`,
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    zIndex: 1,
                    '&:hover': {
                      transform: 'scale(1.03) translateY(-5px)',
                      boxShadow: `0 15px 35px ${alpha(theme.palette.common.black, 0.2)}`,
                    },
                  }}
                />
              </Box>
              
              {/* ソーシャルリンク */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 1.5,
                  mt: 3.5,
                  justifyContent: isMobile ? 'center' : 'flex-start',
                  width: '100%',
                }}
              >
                {socialLinks.map((link, index) => (
                  <Tooltip key={link.name} title={link.name} arrow placement="top">
                    <Link 
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer" 
                      underline="none"
                    >
                      <IconButton
                        sx={{
                          position: 'relative',
                          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          bgcolor: alpha(link.color, 0.15),
                          color: link.color,
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `radial-gradient(circle at center, ${alpha(link.color, 0.2)} 0%, transparent 70%)`,
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                          },
                          '&:hover': {
                            bgcolor: alpha(link.color, 0.25),
                            transform: 'translateY(-5px)',
                            boxShadow: `0 5px 15px ${alpha(link.color, 0.25)}`,
                            '&::before': {
                              opacity: 1
                            }
                          },
                          animation: 'fadeInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                          animationDelay: `${0.3 + index * 0.1}s`,
                          opacity: 0,
                          '@keyframes fadeInUp': {
                            '0%': {
                              opacity: 0,
                              transform: 'translateY(15px)'
                            },
                            '100%': {
                              opacity: 1,
                              transform: 'translateY(0)'
                            }
                          }
                        }}
                        aria-label={link.name}
                        size="medium"
                      >
                        {link.icon}
                      </IconButton>
                    </Link>
                  </Tooltip>
                ))}
              </Box>
            </Grid>
            
            {/* 右側：プロフィール情報 */}
            <Grid item xs={12} sm={8} md={9} lg={9.5} sx={{ px: { xs: 0, md: 2 } }}>
              <Box 
                component={Paper} 
                elevation={0}
                sx={{ 
                  position: 'relative',
                  height: '100%',
                  textAlign: isMobile ? 'center' : 'left',
                  background: `linear-gradient(145deg, 
                    ${alpha(theme.palette.background.paper, 0.8)} 0%, 
                    ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                  p: { xs: 3, md: 4 },
                  boxShadow: `
                    0 20px 40px ${alpha(theme.palette.common.black, 0.05)},
                    0 1px 3px ${alpha(theme.palette.common.black, 0.03)}
                  `,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `
                      linear-gradient(90deg, 
                        ${alpha(theme.palette.primary.light, 0.05)} 0%, 
                        transparent 50%),
                      linear-gradient(180deg, 
                        ${alpha(theme.palette.background.paper, 0.01)} 0%, 
                        ${alpha(theme.palette.background.paper, 0.02)} 100%)
                    `,
                    opacity: 0.8,
                    zIndex: 0,
                    borderRadius: 'inherit'
                  },
                  overflow: 'hidden',
                  maxWidth: '100%'
                }}
              >
                {/* 装飾要素 - 角の光 */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 120,
                    height: 120,
                    background: `radial-gradient(circle, 
                      ${alpha(theme.palette.primary.light, 0.15)} 0%, 
                      transparent 70%)`,
                    opacity: 0.5,
                    zIndex: 0
                  }}
                />
                
                <Box
                  sx={{ 
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {/* 名前・肩書き */}
                  <Box sx={{ mb: 2 }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 0.5,
                        justifyContent: isMobile ? 'center' : 'flex-start'
                      }}
                    >
                      <Typography 
                        variant="h3" 
                        component="h1" 
                        sx={{ 
                          fontWeight: 700,
                          fontSize: { xs: '2rem', sm: '2.4rem', md: '2.8rem' },
                          letterSpacing: '-0.02em',
                          background: `linear-gradient(135deg, 
                            ${theme.palette.text.primary} 0%, 
                            ${alpha(theme.palette.text.primary, 0.8)} 70%,
                            ${alpha(theme.palette.primary.main, 0.9)} 100%)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          animation: 'fadeInSlide 0.8s ease forwards',
                          '@keyframes fadeInSlide': {
                            '0%': { 
                              opacity: 0,
                              transform: 'translateY(10px)'
                            },
                            '100%': { 
                              opacity: 1,
                              transform: 'translateY(0)'
                            }
                          }
                        }}
                      >
                        {profile.display_name}
                      </Typography>
                      
                      {profile.github_username && (
                        <Tooltip title="GitHub連携済み" arrow placement="top">
                          <Box
                            sx={{
                              ml: 1.5,
                              animation: 'fadeInSlide 0.8s ease forwards',
                              animationDelay: '0.3s',
                              opacity: 0,
                            }}
                          >
                            <VerifiedIcon 
                              color="primary" 
                              sx={{ 
                                fontSize: { xs: 20, sm: 24 },
                                animation: 'pulse 1.5s ease-in-out infinite',
                                '@keyframes pulse': {
                                  '0%': { opacity: 0.7, transform: 'scale(1)' },
                                  '50%': { opacity: 1, transform: 'scale(1.1)' },
                                  '100%': { opacity: 0.7, transform: 'scale(1)' }
                                }
                              }} 
                            />
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{ 
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        fontSize: { xs: '1.1rem', sm: '1.3rem' },
                        letterSpacing: '0.01em',
                        opacity: 0,
                        animation: 'fadeInSlide 0.8s ease forwards',
                        animationDelay: '0.2s',
                        position: 'relative',
                        display: 'inline-block',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -4,
                          left: 0,
                          right: 0,
                          height: 2,
                          background: `linear-gradient(90deg, 
                            ${alpha(theme.palette.primary.main, 0.5)} 0%, 
                            ${alpha(theme.palette.primary.light, 0.3)} 70%,
                            transparent 100%)`,
                          borderRadius: 4,
                          opacity: isMobile ? 0 : 1
                        }
                      }}
                    >
                      {profile.title}
                    </Typography>
                  </Box>
                  
                  {/* 所在地 */}
                  {profile.location && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2.5, 
                      justifyContent: isMobile ? 'center' : 'flex-start',
                      animation: 'fadeInSlide 0.8s ease forwards',
                      animationDelay: '0.3s',
                      opacity: 0,
                    }}>
                      <Box 
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 2,
                          p: 0.7,
                          mr: 1
                        }}
                      >
                        <LocationIcon 
                          sx={{ 
                            fontSize: '1.1rem',
                            color: theme.palette.primary.main 
                          }} 
                        />
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: alpha(theme.palette.text.primary, 0.8),
                          fontWeight: 500,
                        }}
                      >
                        {profile.location}
                      </Typography>
                    </Box>
                  )}
                  
                  <Divider 
                    sx={{ 
                      my: 2.5, 
                      opacity: 0.08,
                      animation: 'expandWidth 1s ease forwards',
                      animationDelay: '0.4s',
                      width: '0%',
                      '@keyframes expandWidth': {
                        '0%': { width: '0%' },
                        '100%': { width: '100%' }
                      }
                    }} 
                  />
                  
                  {/* プロフィール文 */}
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 3.5,
                      lineHeight: 1.8,
                      color: alpha(theme.palette.text.primary, 0.85),
                      animation: 'fadeIn 1s ease forwards',
                      animationDelay: '0.5s',
                      opacity: 0,
                      fontWeight: 400,
                      letterSpacing: '0.02em',
                      textAlign: 'justify',
                      maxWidth: '800px',
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      textShadow: `0 1px 1px ${alpha(theme.palette.background.paper, 0.5)}`,
                      '&::first-letter': {
                        fontSize: '1.2em',
                        fontWeight: 600,
                        color: theme.palette.primary.main
                      },
                      '@keyframes fadeIn': {
                        '0%': { opacity: 0 },
                        '100%': { opacity: 1 }
                      }
                    }}
                  >
                    {profile.bio}
                  </Typography>
                  
                  {/* 専門分野 */}
                  {profile.specialty && (
                    <Box sx={{ 
                      animation: 'fadeIn 1s ease forwards',
                      animationDelay: '0.6s',
                      opacity: 0,
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mb: 2,
                        gap: 1.2,
                        justifyContent: isMobile ? 'center' : 'flex-start',
                      }}>
                        <Box 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            borderRadius: 1.5,
                            p: 0.8
                          }}
                        >
                          <CodeIcon 
                            sx={{ 
                              color: theme.palette.primary.main,
                              fontSize: '1.2rem'
                            }} 
                          />
                        </Box>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            letterSpacing: '0.03em'
                          }}
                        >
                          専門分野
                        </Typography>
                      </Box>
                      
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 1.2,
                          justifyContent: isMobile ? 'center' : 'flex-start'
                        }}
                      >
                        {profile.specialty.split('、').map((item, index) => (
                          <Chip
                            key={index}
                            label={item}
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              color: theme.palette.primary.dark,
                              fontSize: '0.88rem',
                              fontWeight: 500,
                              borderRadius: '10px',
                              py: 2.2,
                              px: 0.5,
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              animation: 'fadeInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                              animationDelay: getTagDelay(index),
                              opacity: 0,
                              transform: 'translateY(20px)',
                              position: 'relative',
                              overflow: 'hidden',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: `linear-gradient(135deg, 
                                  transparent 0%, 
                                  ${alpha(theme.palette.primary.light, 0.1)} 50%, 
                                  transparent 100%)`,
                                opacity: 0,
                                transition: 'opacity 0.3s ease'
                              },
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.13),
                                transform: 'translateY(-4px) scale(1.03)',
                                boxShadow: `0 6px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                                '&::before': {
                                  opacity: 1
                                }
                              },
                              '@keyframes fadeInUp': {
                                '0%': {
                                  opacity: 0,
                                  transform: 'translateY(20px)'
                                },
                                '100%': {
                                  opacity: 1,
                                  transform: 'translateY(0)'
                                }
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfileHeader; 