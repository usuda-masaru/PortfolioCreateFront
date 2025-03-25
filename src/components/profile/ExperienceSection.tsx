import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid
} from '@mui/material';
import { WorkExperience } from '../../types/interfaces';

interface ExperienceSectionProps {
  experiences: WorkExperience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const sortedExperiences = [...experiences].sort((a, b) => {
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
  });

  return (
    <Box component="section">
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            職務経歴
          </Typography>
          <Grid container spacing={2}>
            {sortedExperiences.map((exp) => (
              <Grid item xs={12} key={exp.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {exp.project_name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {exp.position}
                  </Typography>
                </Box>
                {exp.company && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {exp.company}
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

export default ExperienceSection; 