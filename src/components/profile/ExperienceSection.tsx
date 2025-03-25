import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Work as WorkIcon } from '@mui/icons-material';
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
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            職務経歴
          </Typography>
          <Grid container spacing={2}>
            {sortedExperiences.map((exp) => {
              const startDate = new Date(exp.start_date);
              const endDate = exp.end_date ? new Date(exp.end_date) : null;
              
              return (
                <Grid item xs={12} key={exp.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {exp.project_name || exp.position}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {formatDate(exp.start_date)} - {exp.current ? '現在' : formatDate(exp.end_date)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    ({calculateDuration(exp)})
                  </Typography>
                  {exp.company && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {exp.company}
                    </Typography>
                  )}
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExperienceSection; 