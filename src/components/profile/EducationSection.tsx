import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { 
  Timeline, 
  TimelineItem, 
  TimelineSeparator, 
  TimelineConnector, 
  TimelineContent, 
  TimelineDot, 
  TimelineOppositeContent 
} from '@mui/lab';
import { School as SchoolIcon } from '@mui/icons-material';
import { Education } from '../../types/interfaces';

interface EducationSectionProps {
  education: Education[];
}

const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  const theme = useTheme();
  
  // 日付を降順にソート
  const sortedEducation = [...education].sort((a, b) => {
    const dateA = a.end_date ? new Date(a.end_date) : new Date();
    const dateB = b.end_date ? new Date(b.end_date) : new Date();
    return dateB.getTime() - dateA.getTime();
  });
  
  return (
    <Box component="section">
      <Timeline position="right" sx={{ p: 0, mt: 0 }}>
        {sortedEducation.map((edu) => {
          const startDate = new Date(edu.start_date);
          const endDate = edu.end_date ? new Date(edu.end_date) : null;
          
          return (
            <TimelineItem key={edu.id}>
              <TimelineOppositeContent sx={{ display: { xs: 'none', sm: 'block' }, flex: 0.2 }}>
                <Typography variant="body2" color="text.secondary">
                  {startDate.getFullYear()} - {endDate ? endDate.getFullYear() : '現在'}
                </Typography>
              </TimelineOppositeContent>
              
              <TimelineSeparator>
                <TimelineDot color="secondary">
                  <SchoolIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    transition: '0.3s',
                    borderLeft: `4px solid ${theme.palette.secondary.main}`,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Typography variant="h6" component="h3" fontWeight="bold">
                    {edu.degree} - {edu.field_of_study}
                  </Typography>
                  
                  <Typography variant="subtitle1" color="secondary">
                    {edu.institution}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' }, mb: 1 }}>
                    {startDate.getFullYear()} - {endDate ? endDate.getFullYear() : '現在'}
                  </Typography>
                  
                  {edu.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {edu.description}
                    </Typography>
                  )}
                </Paper>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Box>
  );
};

export default EducationSection; 