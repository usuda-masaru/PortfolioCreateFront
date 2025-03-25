import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { 
  GitHub as GitHubIcon,
  Star as StarIcon,
  CallSplit as ForkIcon,
  BugReport as IssueIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  featured: boolean;
  topics: string[];
  is_fork: boolean;
  is_private: boolean;
}

interface GitHubRepositoriesSectionProps {
  repositories: GitHubRepository[];
}

const MotionCard = motion(Card);

const GitHubRepositoriesSection: React.FC<GitHubRepositoriesSectionProps> = ({ repositories }) => {
  const theme = useTheme();
  
  if (!repositories || repositories.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          表示するGitHubリポジトリがありません
        </Typography>
      </Box>
    );
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };
  
  return (
    <Box component="section">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          {repositories.map((repo) => (
            <Grid item xs={12} sm={6} md={4} key={repo.id}>
              <RepoCard repo={repo} variants={itemVariants} />
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

interface RepoCardProps {
  repo: GitHubRepository;
  variants: any;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo, variants }) => {
  const theme = useTheme();
  
  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <MotionCard 
      variants={variants}
      whileHover={{ y: -10 }}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 8,
          borderColor: alpha(theme.palette.primary.main, 0.3),
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <GitHubIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" component="h3" fontWeight="bold" noWrap>
            {repo.name}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 2, 
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          height: '4.5em'
        }}>
          {repo.description || 'No description provided'}
        </Typography>
        
        {repo.language && (
          <Box sx={{ mb: 1.5 }}>
            <Chip
              label={repo.language}
              size="small"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                color: theme.palette.primary.main,
                fontWeight: 'medium'
              }}
            />
          </Box>
        )}
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StarIcon fontSize="small" sx={{ color: 'gold', mr: 0.5 }} />
            <Typography variant="body2">{repo.stargazers_count}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ForkIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="body2">{repo.forks_count}</Typography>
          </Box>
          
          {repo.open_issues_count > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IssueIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="body2">{repo.open_issues_count}</Typography>
            </Box>
          )}
        </Box>
        
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
          最終更新: {formatDate(repo.pushed_at)}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'center' }}>
        <Button 
          startIcon={<GitHubIcon />} 
          variant="contained"
          color="primary"
          size="small" 
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          fullWidth
        >
          GitHub で表示
        </Button>
      </CardActions>
    </MotionCard>
  );
};

export default GitHubRepositoriesSection; 