import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  useTheme,
  Chip,
  Grid,
  Divider,
  Tooltip,
  alpha
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
  Business as BusinessIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Computer as ComputerIcon,
  Group as GroupIcon,
  Category as CategoryIcon,
  Construction as ConstructionIcon
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

// 担当工程ごとの色を定義 - ProcessExperiencesSectionと同じ色にする
const PROCESS_COLORS = {
  '要件定義': 'rgba(63, 81, 181, 0.15)',     // インディゴ
  '基本設計': 'rgba(0, 121, 107, 0.15)',     // ティール
  '詳細設計': 'rgba(123, 31, 162, 0.15)',    // パープル
  '実装': 'rgba(255, 87, 34, 0.15)',         // ディープオレンジ
  '試験': 'rgba(211, 47, 47, 0.15)',         // レッド
  'デプロイ/リリース': 'rgba(76, 175, 80, 0.15)', // グリーン
  '運用/保守': 'rgba(2, 136, 209, 0.15)'     // ライトブルー
};

// 担当工程ごとのテキスト色を定義
const PROCESS_TEXT_COLORS = {
  '要件定義': '#3F51B5',      // インディゴ
  '基本設計': '#00796B',      // ティール
  '詳細設計': '#7B1FA2',      // パープル
  '実装': '#FF5722',          // ディープオレンジ
  '試験': '#D32F2F',          // レッド
  'デプロイ/リリース': '#4CAF50', // グリーン
  '運用/保守': '#0288D1'      // ライトブルー
};

const calculateDuration = (workExperience: WorkExperience): string => {
  const startDate = new Date(workExperience.start_date);
  const endDate = workExperience.current ? new Date() : 
                 (workExperience.end_date ? new Date(workExperience.end_date) : new Date());

  // 月数の差を計算
  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  months += endDate.getMonth() - startDate.getMonth();
  
  // 年と月に変換
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  // 表示文字列を生成
  if (years === 0) {
    return `${remainingMonths}か月`;
  } else if (remainingMonths === 0) {
    return `${years}年`;
  } else {
    return `${years}年${remainingMonths}か月`;
  }
};

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
  
  // 日付を整形する関数
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${year}年${month}月`;
    } catch (error) {
      console.error('日付の変換に失敗しました:', error);
      return '';
    }
  };
  
  // 工程に対応する色を取得する関数
  const getProcessColor = (process: string): string => {
    return PROCESS_COLORS[process as keyof typeof PROCESS_COLORS] || 'rgba(158, 158, 158, 0.15)';
  };
  
  // 工程に対応するテキスト色を取得する関数
  const getProcessTextColor = (process: string): string => {
    return PROCESS_TEXT_COLORS[process as keyof typeof PROCESS_TEXT_COLORS] || '#424242';
  };
  
  return (
    <Box component="section">
      <Timeline position="right" sx={{ p: 0, mt: 0 }}>
        {sortedExperiences.map((exp) => {
          const startDate = new Date(exp.start_date);
          const endDate = exp.end_date ? new Date(exp.end_date) : null;
          
          return (
            <TimelineItem key={exp.id}>
              <TimelineOppositeContent 
                sx={{ 
                  display: { xs: 'none', sm: 'flex' }, 
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                  pt: 1.5,
                  flex: 0.2 
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: exp.current ? theme.palette.primary.main : 'text.secondary',
                    fontWeight: exp.current ? 'medium' : 'regular',
                    mb: 0.5,
                    fontSize: '0.85rem'
                  }}
                >
                  {formatDate(exp.start_date)} - {exp.current ? '現在' : formatDate(exp.end_date)}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    mb: 0.5
                  }}
                >
                  （{calculateDuration(exp)}）
                </Typography>
                {exp.company && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.75rem'
                    }}
                  >
                    {exp.company}
                  </Typography>
                )}
              </TimelineOppositeContent>
              
              <TimelineSeparator>
                <TimelineDot 
                  sx={{ 
                    bgcolor: exp.current ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.7),
                    boxShadow: exp.current ? 3 : 1
                  }}
                >
                  <BusinessIcon fontSize="small" />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: alpha(theme.palette.primary.main, 0.2) }} />
              </TimelineSeparator>
              
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.97)}, ${alpha(theme.palette.background.paper, 1)})`,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      bgcolor: exp.current ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.7)
                    },
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                      transform: 'translateY(-3px)',
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                    }
                  }}
                >
                  <Box sx={{ 
                    position: 'relative', 
                    mb: 2,
                    pb: 1.5,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      fontWeight="bold"
                      sx={{ 
                        color: 'text.primary',
                        lineHeight: 1.3,
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      {exp.project_name || exp.position}
                    </Typography>
                    
                    {exp.project_name && exp.position && (
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          mt: 0.5, 
                          color: theme.palette.text.secondary,
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        {exp.position}
                      </Typography>
                    )}
                  </Box>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      mb: 1.5,
                      gap: 2
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                        borderRadius: 8,
                        px: 1.5,
                        py: 0.5
                      }}
                    >
                      <WorkIcon sx={{ fontSize: '0.875rem', mr: 0.75 }} />
                      <Typography 
                        variant="body2" 
                        fontWeight="medium"
                        sx={{ lineHeight: 1.2 }}
                      >
                        {exp.position}
                      </Typography>
                    </Box>
                    
                    {exp.team_size && (
                      <Box 
                        sx={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          bgcolor: alpha(theme.palette.grey[500], 0.1),
                          color: theme.palette.text.secondary,
                          borderRadius: 8,
                          px: 1.5,
                          py: 0.5
                        }}
                      >
                        <GroupIcon sx={{ fontSize: '0.875rem', mr: 0.75 }} />
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          sx={{ lineHeight: 1.2 }}
                        >
                          チーム {exp.team_size}名
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        display: { xs: 'inline-flex', sm: 'none' },
                        alignItems: 'center',
                        bgcolor: alpha(theme.palette.grey[500], 0.1),
                        color: exp.current ? theme.palette.primary.main : theme.palette.text.secondary,
                        fontWeight: exp.current ? 'medium' : 'regular',
                        borderRadius: 8,
                        px: 1.5,
                        py: 0.5
                      }}
                    >
                      {formatDate(exp.start_date)} - {exp.current ? '現在' : formatDate(exp.end_date)}
                    </Typography>
                  </Box>
                  
                  {/* 詳細内容 - 改行を反映 */}
                  {exp.details?.project_detail && (
                    <Box sx={{ 
                      mt: 2, 
                      mb: 2,
                      p: 2,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.background.paper, 0.7),
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '4px',
                        height: '100%',
                        backgroundColor: theme.palette.primary.main,
                      }
                    }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{
                          mb: 1.5,
                          color: theme.palette.primary.main,
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          '&::before': {
                            content: '""',
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: theme.palette.primary.main,
                            mr: 1
                          }
                        }}
                      >
                        案件詳細
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          whiteSpace: 'pre-line', // 改行を反映
                          color: theme.palette.text.primary,
                          lineHeight: 1.7,
                          pl: 0.5
                        }}
                      >
                        {exp.details.project_detail}
                      </Typography>
                    </Box>
                  )}
                  
                  {exp.details?.process_work_detail && (
                    <Box sx={{ 
                      mt: 2, 
                      mb: 3,
                      p: 2,
                      border: `1px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.background.paper, 0.7),
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '4px',
                        height: '100%',
                        backgroundColor: theme.palette.secondary.main,
                      }
                    }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{
                          mb: 1.5,
                          color: theme.palette.secondary.main,
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          '&::before': {
                            content: '""',
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: theme.palette.secondary.main,
                            mr: 1
                          }
                        }}
                      >
                        工程毎の作業詳細
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          whiteSpace: 'pre-line', // 改行を反映
                          color: theme.palette.text.primary,
                          lineHeight: 1.7,
                          pl: 0.5
                        }}
                      >
                        {exp.details.process_work_detail}
                      </Typography>
                    </Box>
                  )}
                  
                  {/* 担当工程 - 常に表示 - 色分け */}
                  <Box 
                    sx={{ 
                      mb: 3,
                      bgcolor: alpha(theme.palette.background.default, 0.7),
                      borderRadius: 1,
                      p: 2
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      fontWeight="bold" 
                      sx={{ 
                        mb: 1.5,
                        color: theme.palette.primary.main, 
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <CategoryIcon sx={{ mr: 1, fontSize: '1.1rem' }} />

                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {exp.process_roles && exp.process_roles.length > 0 ? (
                        exp.process_roles.map((role, index) => (
                          <Chip 
                            key={index} 
                            label={role} 
                            size="small"
                            sx={{
                              bgcolor: getProcessColor(role),
                              color: getProcessTextColor(role),
                              fontWeight: 'medium',
                              borderRadius: 1.5,
                              '& .MuiChip-label': {
                                px: 1.5
                              }
                            }}
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">記載なし</Typography>
                      )}
                    </Box>
                  </Box>
                  
                  {/* 使用技術 - グリッドデザインの改善 */}
                  <Box 
                    sx={{ 
                      bgcolor: alpha(theme.palette.background.default, 0.7),
                      borderRadius: 1,
                      p: 2
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      fontWeight="bold" 
                      sx={{ 
                        mb: 1.5,
                        color: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <CodeIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
                      使用技術
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {/* OS */}
                      <Grid item xs={12} sm={6}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            bgcolor: 'white',
                            borderRadius: 1,
                            p: 1.5
                          }}
                        >
                          <ComputerIcon 
                            fontSize="small" 
                            sx={{ 
                              mr: 1.5, 
                              color: theme.palette.primary.main,
                              mt: 0.2
                            }} 
                          />
                          <Box>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: theme.palette.text.secondary,
                                fontWeight: 'bold',
                                display: 'block',
                                mb: 0.5
                              }}
                            >
                              OS
                            </Typography>
                            <Typography 
                              variant="body2"
                              sx={{ lineHeight: 1.4 }}
                            >
                              {exp.os_used && exp.os_used.length > 0 
                                ? exp.os_used.join(', ') 
                                : '記載なし'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      {/* 言語 */}
                      <Grid item xs={12} sm={6}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            bgcolor: 'white',
                            borderRadius: 1,
                            p: 1.5
                          }}
                        >
                          <CodeIcon 
                            fontSize="small" 
                            sx={{ 
                              mr: 1.5, 
                              color: theme.palette.primary.main,
                              mt: 0.2
                            }} 
                          />
                          <Box>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: theme.palette.text.secondary,
                                fontWeight: 'bold',
                                display: 'block',
                                mb: 0.5
                              }}
                            >
                              言語
                            </Typography>
                            <Typography 
                              variant="body2"
                              sx={{ lineHeight: 1.4 }}
                            >
                              {exp.languages_used && exp.languages_used.length > 0 
                                ? exp.languages_used.join(', ') 
                                : '記載なし'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      {/* DB */}
                      <Grid item xs={12} sm={6}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            bgcolor: 'white',
                            borderRadius: 1,
                            p: 1.5
                          }}
                        >
                          <StorageIcon 
                            fontSize="small" 
                            sx={{ 
                              mr: 1.5, 
                              color: theme.palette.primary.main,
                              mt: 0.2
                            }} 
                          />
                          <Box>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: theme.palette.text.secondary,
                                fontWeight: 'bold',
                                display: 'block',
                                mb: 0.5
                              }}
                            >
                              データベース
                            </Typography>
                            <Typography 
                              variant="body2"
                              sx={{ lineHeight: 1.4 }}
                            >
                              {exp.db_used && exp.db_used.length > 0 
                                ? exp.db_used.join(', ') 
                                : '記載なし'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      {/* フレームワーク */}
                      <Grid item xs={12} sm={6}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            bgcolor: 'white',
                            borderRadius: 1,
                            p: 1.5
                          }}
                        >
                          <ConstructionIcon 
                            fontSize="small" 
                            sx={{ 
                              mr: 1.5, 
                              color: theme.palette.primary.main,
                              mt: 0.2
                            }} 
                          />
                          <Box>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: theme.palette.text.secondary,
                                fontWeight: 'bold',
                                display: 'block',
                                mb: 0.5
                              }}
                            >
                              フレームワーク
                            </Typography>
                            <Typography 
                              variant="body2"
                              sx={{ lineHeight: 1.4 }}
                            >
                              {exp.frameworks_used && exp.frameworks_used.length > 0 
                                ? exp.frameworks_used.join(', ') 
                                : '記載なし'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
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