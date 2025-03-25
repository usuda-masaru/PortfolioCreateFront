import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  useTheme
} from '@mui/material';
import { GitHubRepository } from '../../types/interfaces';
import { GitHub as GitHubIcon } from '@mui/icons-material';

interface GitHubRepositoriesSectionProps {
  repositories: GitHubRepository[];
}

const GitHubRepositoriesSection: React.FC<GitHubRepositoriesSectionProps> = ({ repositories }) => {
  const theme = useTheme();
  
  const sortedRepositories = [...repositories].sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  return (
    <Box component="section">
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            GitHubリポジトリ
          </Typography>
          <Grid container spacing={2}>
            {sortedRepositories.map((repo) => (
              <Grid item xs={12} key={repo.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {repo.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {repo.language}
                  </Typography>
                </Box>
                {repo.description && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {repo.description}
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GitHubRepositoriesSection; 