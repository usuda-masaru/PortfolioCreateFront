import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { 
  GitHub as GitHubIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Project } from '../../types/interfaces';

interface ProjectsSectionProps {
  projects: Project[];
}

const MotionCard = motion(Card);

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const theme = useTheme();
  
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
  
  // 特集プロジェクトとその他のプロジェクトに分ける
  const featuredProjects = projects.filter(project => project.is_featured);
  const otherProjects = projects.filter(project => !project.is_featured);
  
  return (
    <Box component="section">
      {featuredProjects.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h3" color="primary" fontWeight="bold" sx={{ mb: 3 }}>
            主要プロジェクト
          </Typography>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {featuredProjects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <ProjectCard project={project} variants={itemVariants} />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>
      )}
      
      {otherProjects.length > 0 && (
        <Box>
          <Typography variant="h6" component="h3" color="primary" fontWeight="bold" sx={{ mb: 3 }}>
            その他のプロジェクト
          </Typography>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {otherProjects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <ProjectCard project={project} variants={itemVariants} />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>
      )}
    </Box>
  );
};

interface ProjectCardProps {
  project: Project;
  variants: any;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, variants }) => {
  const theme = useTheme();
  
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
      {project.thumbnail && (
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="160"
            image={project.thumbnail}
            alt={project.title}
            sx={{ 
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          {project.is_featured && (
            <Chip
              label="おすすめ"
              size="small"
              color="secondary"
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8,
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
              }}
            />
          )}
        </Box>
      )}
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
          {project.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
          {project.description}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {project.technologies.map((tech) => (
            <Chip
              key={tech.id}
              label={tech.name}
              size="small"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                color: theme.palette.primary.main,
                fontSize: '0.675rem',
                fontWeight: 'medium',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            />
          ))}
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
        {project.github_url && (
          <Button 
            startIcon={<GitHubIcon />} 
            size="small" 
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Button>
        )}
        
        {project.project_url && (
          <Button 
            startIcon={<LaunchIcon />} 
            size="small" 
            variant="contained"
            href={project.project_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Demo
          </Button>
        )}
      </CardActions>
    </MotionCard>
  );
};

export default ProjectsSection; 