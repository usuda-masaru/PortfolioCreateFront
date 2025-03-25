import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid
} from '@mui/material';
import { ProcessExperience } from '../../types/interfaces';

interface ProcessExperiencesSectionProps {
  processExperiences: ProcessExperience[];
}

const ProcessExperiencesSection: React.FC<ProcessExperiencesSectionProps> = ({ processExperiences }) => {
  const sortedExperiences = [...processExperiences].sort((a, b) => {
    return b.experience_count - a.experience_count;
  });

  return (
    <Box component="section">
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            工程別経験
          </Typography>
          <Grid container spacing={2}>
            {sortedExperiences.map((exp) => (
              <Grid item xs={12} key={exp.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {exp.process_type}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {exp.experience_count}年
                  </Typography>
                </Box>
                {exp.description && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {exp.description}
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

export default ProcessExperiencesSection; 