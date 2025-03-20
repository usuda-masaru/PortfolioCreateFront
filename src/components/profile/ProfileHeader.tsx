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
  Paper
} from '@mui/material';
import { 
  GitHub as GitHubIcon, 
  Language as WebsiteIcon, 
  Twitter as TwitterIcon, 
  LinkedIn as LinkedInIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { PublicProfile } from '../../types/interfaces';

interface ProfileHeaderProps {
  profile: PublicProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box 
      sx={{ 
        position: 'relative',
        width: '100%',
        bgcolor: 'primary.main',
        color: 'white',
        pt: isMobile ? 8 : 12,
        pb: 2,
        overflow: 'hidden'
      }}
    >
      {/* 背景パターン */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      
      <Container maxWidth="lg">
        <Grid 
          container 
          spacing={4} 
          alignItems="center"
          sx={{ 
            position: 'relative', 
            zIndex: 2
          }}
        >
          <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <Avatar
              src={profile.profile_image}
              alt={profile.display_name}
              sx={{ 
                width: { xs: 180, sm: 180, md: 220 }, 
                height: { xs: 180, sm: 180, md: 220 },
                border: '4px solid white',
                boxShadow: theme.shadows[3],
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={8} md={9}>
            <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                {profile.display_name}
              </Typography>
              
              <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2, opacity: 0.9 }}>
                {profile.title}
              </Typography>
              
              {profile.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                  <LocationIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                  <Typography variant="body1">{profile.location}</Typography>
                </Box>
              )}

              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3, 
                  maxWidth: '800px',
                  lineHeight: 1.7,
                  opacity: 0.9
                }}
              >
                {profile.bio}
              </Typography>
              
              {profile.specialty && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    専門分野
                  </Typography>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1,
                      justifyContent: isMobile ? 'center' : 'flex-start'
                    }}
                  >
                    {profile.specialty.split('、').map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          borderRadius: '4px',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.3)',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 1,
                  justifyContent: isMobile ? 'center' : 'flex-start'
                }}
              >
                {profile.github_username && (
                  <IconButton
                    href={`https://github.com/${profile.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                      },
                    }}
                    aria-label="GitHub"
                  >
                    <GitHubIcon />
                  </IconButton>
                )}
                
                {profile.twitter_username && (
                  <IconButton
                    href={`https://twitter.com/${profile.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                      },
                    }}
                    aria-label="Twitter"
                  >
                    <TwitterIcon />
                  </IconButton>
                )}
                
                {profile.linkedin_url && (
                  <IconButton
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                      },
                    }}
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon />
                  </IconButton>
                )}
                
                {profile.website_url && (
                  <IconButton
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                      },
                    }}
                    aria-label="Website"
                  >
                    <WebsiteIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfileHeader; 