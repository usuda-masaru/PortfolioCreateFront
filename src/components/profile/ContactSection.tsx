import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  IconButton,
  Divider,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Email as EmailIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Language as WebsiteIcon,
  FileDownload as DownloadIcon
} from '@mui/icons-material';
import { PublicProfile } from '../../types/interfaces';

interface ContactSectionProps {
  profile: PublicProfile;
}

const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const theme = useTheme();
  
  return (
    <Box component="section">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            メッセージを送る
          </Typography>
          
          <Typography variant="body1" paragraph>
            お仕事のご依頼やご質問など、お気軽にご連絡ください。
          </Typography>
          
          {profile.email_public && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<EmailIcon />}
              href={`mailto:${profile.email_public}`}
              sx={{ mt: 2 }}
              fullWidth
            >
              メールを送る
            </Button>
          )}
          
          {profile.resume && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<DownloadIcon />}
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mt: 2 }}
              fullWidth
            >
              職務経歴書をダウンロード
            </Button>
          )}
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            SNS & リンク
          </Typography>
          
          <Divider sx={{ mb: 3 }} />
          
          <Stack spacing={2}>
            {profile.github_username && (
              <SocialLink 
                icon={<GitHubIcon />}
                label="GitHub"
                value={profile.github_username}
                link={`https://github.com/${profile.github_username}`}
              />
            )}
            
            {profile.twitter_username && (
              <SocialLink 
                icon={<TwitterIcon />}
                label="Twitter"
                value={`@${profile.twitter_username}`}
                link={`https://twitter.com/${profile.twitter_username}`}
              />
            )}
            
            {profile.linkedin_url && (
              <SocialLink 
                icon={<LinkedInIcon />}
                label="LinkedIn"
                value="プロフィール"
                link={profile.linkedin_url}
              />
            )}
            
            {profile.website_url && (
              <SocialLink 
                icon={<WebsiteIcon />}
                label="ウェブサイト"
                value={profile.website_url.replace(/^https?:\/\//, '')}
                link={profile.website_url}
              />
            )}
            
            {profile.email_public && (
              <SocialLink 
                icon={<EmailIcon />}
                label="メール"
                value={profile.email_public}
                link={`mailto:${profile.email_public}`}
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

interface SocialLinkProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  link: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon, label, value, link }) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        p: 1.5,
        borderRadius: 1,
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: theme.palette.action.hover
        }
      }}
    >
      <Tooltip title={`${label}を開く`}>
        <IconButton 
          size="small" 
          color="primary"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mr: 2 }}
        >
          {icon}
        </IconButton>
      </Tooltip>
      
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1">
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default ContactSection; 