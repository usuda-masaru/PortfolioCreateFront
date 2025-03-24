import React from 'react';
import { Box, Typography, Paper, Grid, useTheme, alpha } from '@mui/material';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Fade } from 'react-awesome-reveal';

// Chart.jsコンポーネントを登録
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// 担当工程の種類と表示名の定義
const PROCESS_TYPES = [
  { value: 'requirements', label: '要件定義', description: '顧客要件の分析と仕様のまとめ' },
  { value: 'basic_design', label: '基本設計', description: 'システム全体のアーキテクチャと基本機能の設計' },
  { value: 'detailed_design', label: '詳細設計', description: '各機能の詳細な実装方法の設計' },
  { value: 'implementation', label: '実装', description: 'コーディングとユニットテスト' },
  { value: 'testing', label: '試験', description: '結合テスト、システムテスト、受入テスト' },
  { value: 'deployment', label: 'デプロイ/リリース', description: 'システムのリリースと導入' },
  { value: 'operation', label: '運用/保守', description: 'システム運用、保守、トラブルシューティング' },
];

// 担当工程の経験データ型定義
interface ProcessExperience {
  id?: number;
  process_type: string;
  process_type_display?: string;
  experience_count: number;
  description: string;
}

interface ProcessSectionProps {
  processExperiences: ProcessExperience[];
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ processExperiences }) => {
  const theme = useTheme();

  // 表示用データの準備
  const experiences = PROCESS_TYPES.map(type => {
    const exp = processExperiences?.find(e => e.process_type === type.value);
    return {
      ...type,
      experience_count: exp?.experience_count || 0,
      description: exp?.description || type.description
    };
  });

  // レーダーチャートのデータ生成
  const chartData = {
    labels: PROCESS_TYPES.map(type => type.label),
    datasets: [
      {
        label: '担当回数',
        data: experiences.map(exp => exp.experience_count),
        backgroundColor: `${theme.palette.primary.main}50`,
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        pointBackgroundColor: theme.palette.primary.main,
        pointHoverRadius: 5,
      }
    ]
  };

  // レーダーチャートのオプション
  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        ticks: {
          stepSize: 2
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `担当回数: ${context.raw}回`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <Box sx={{ width: '100%', mb: 8 }}>
      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom 
        fontWeight="bold"
        sx={{ 
          color: theme.palette.primary.main,
          pb: 1, 
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          mb: 4
        }}
      >
        担当工程経験
      </Typography>

      <Grid container spacing={4}>
        {/* レーダーチャート */}
        <Grid item xs={12} md={6}>
          <Fade direction="left" triggerOnce>
            <Paper 
              elevation={1}
              sx={{ 
                p: 3, 
                height: '100%', 
                borderRadius: 2,
                boxShadow: 2,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: theme.palette.primary.main,
                  opacity: 0.7
                }
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                工程バランス
              </Typography>
              <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Radar data={chartData} options={chartOptions} />
              </Box>
            </Paper>
          </Fade>
        </Grid>
        
        {/* 詳細リスト */}
        <Grid item xs={12} md={6}>
          <Fade direction="right" cascade damping={0.1} triggerOnce>
            <Box>
              {experiences.map((exp, index) => (
                <Paper
                  key={exp.value}
                  elevation={1}
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    borderRadius: 2,
                    boxShadow: 1,
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <Grid container>
                    <Grid item xs={8}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {exp.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {exp.description || 'この工程の詳細情報はありません。'}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          backgroundColor: `${theme.palette.primary.main}30`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `2px solid ${theme.palette.primary.main}`
                        }}
                      >
                        <Typography 
                          variant="h5" 
                          fontWeight="bold" 
                          sx={{ color: theme.palette.primary.main }}
                        >
                          {exp.experience_count}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProcessSection; 