import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  useTheme,
  Chip
} from '@mui/material';
import { 
  Timeline, 
  TimelineItem, 
  TimelineSeparator, 
  TimelineConnector, 
  TimelineContent, 
  TimelineDot, 
  TimelineOppositeContent 
} from '@mui/lab';
import { 
  Work as WorkIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { WorkExperience } from '../../types/interfaces';

interface Skill {
  id: number;
  name: string;
  category: number;
  level: number;
  experience_years: number;
  order: number;
}

interface ExperienceSectionProps {
  experiences: WorkExperience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const theme = useTheme();
  
  // 日付を降順にソート
  const sortedExperiences = [...experiences].sort((a, b) => {
    const dateA = a.end_date ? new Date(a.end_date) : new Date();
    const dateB = b.end_date ? new Date(b.end_date) : new Date();
    
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    
    return dateB.getTime() - dateA.getTime();
  });
  
  return (
    <Box component="section">
      <Timeline position="right" sx={{ p: 0, mt: 0 }}>
        {sortedExperiences.map((exp) => {
          const startDate = new Date(exp.start_date);
          const endDate = exp.end_date ? new Date(exp.end_date) : null;
          
          return (
            <TimelineItem key={exp.id}>
              <TimelineOppositeContent sx={{ display: { xs: 'none', sm: 'block' }, flex: 0.2 }}>
                <Typography variant="body2" color="text.secondary">
                  {startDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' })} - {exp.current ? '現在' : endDate?.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' })}
                </Typography>
              </TimelineOppositeContent>
              
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <BusinessIcon />
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
                    borderLeft: `4px solid ${exp.current ? theme.palette.primary.main : theme.palette.secondary.main}`,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Typography variant="h6" component="h3" fontWeight="bold">
                    {exp.position}
                  </Typography>
                  
                  <Typography variant="subtitle1" color="primary">
                    {exp.company}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' }, mb: 1 }}>
                    {startDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' })} - {exp.current ? '現在' : endDate?.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' })}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {exp.description}
                  </Typography>
                  
                  {exp.process_roles && exp.process_roles.length > 0 && (
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                        担当工程:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {exp.process_roles.map((role, index) => (
                          <Chip 
                            key={index} 
                            label={role} 
                            size="small" 
                            color="secondary" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                      使用技術:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {exp.skills_used_details.map((skill) => (
                        <Chip 
                          key={skill.id} 
                          label={skill.name} 
                          size="small" 
                          color="primary" 
                        />
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Box>
  );
};

export default ExperienceSection; 