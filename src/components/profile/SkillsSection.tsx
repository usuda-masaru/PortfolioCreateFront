import React from 'react';
import { Box, Typography, Tooltip, alpha, useTheme, Card, CardContent, Grid } from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AccessTime as TimeIcon, Star as StarIcon } from '@mui/icons-material';
import { Skill, SkillCategory } from '../../types/interfaces';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';

// ChartJSの必要なコンポーネントを登録
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  Legend
);

// アイコン表示用のコンポーネント
const IconDisplay: React.FC<{ iconId: string; size?: number }> = ({ iconId, size = 24 }) => {
  const [hasError, setHasError] = React.useState(false);
  const [iconVariant, setIconVariant] = React.useState<string>('original');
  
  if (!iconId) {
    console.log('アイコンIDが空です');
    return null;
  }
  
  console.log(`IconDisplay: アイコンID=${iconId}`);

  // URLからアイコンIDを抽出する関数
  const extractIconIdFromUrl = (url: string): string => {
    // URLの場合は最後の部分を抽出
    if (url.includes('/media/')) {
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      console.log(`URLからアイコンIDを抽出: ${url} → ${lastPart}`);
      return lastPart;
    }
    return url;
  };

  // URLが二重に含まれている場合は修正
  const cleanUrl = (url: string): string => {
    if (url.includes('http%3A')) {
      // URL-encodedな部分を修正
      try {
        const decodedUrl = decodeURIComponent(url);
        console.log(`URLデコード: ${url} → ${decodedUrl}`);
        return decodedUrl;
      } catch (e) {
        console.error(`URLデコードエラー: ${url}`, e);
        return url;
      }
    }
    return url;
  };

  // アイコンIDを正規化し、最終的に使用するIDを取得
  const normalizedIconId = cleanUrl(iconId);
  const effectiveIconId = extractIconIdFromUrl(normalizedIconId);
  
  console.log(`アイコン識別子: ${effectiveIconId}`);
  
  // hasErrorの場合はフォールバック表示
  if (hasError) {
    return (
      <div style={{ 
        width: size, 
        height: size, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        fontSize: size * 0.5
      }}>
        {effectiveIconId.substring(0, 2).toUpperCase()}
      </div>
    );
  }
  
  // バリエーションを含めたDeviconのアイコンURL
  const getIconUrl = (variant: string): string => {
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${effectiveIconId}/${effectiveIconId}-${variant}.svg`;
  };
  
  const deviconUrl = getIconUrl(iconVariant);
  
  // エラーハンドラ - 次のバリエーションを試す
  const handleIconError = () => {
    console.error(`Deviconアイコン読み込みエラー: ${effectiveIconId}-${iconVariant}`);
    
    // 次のバリエーションを試す
    const variants = ['original', 'plain', 'line', 'plain-wordmark', 'original-wordmark'];
    const currentIndex = variants.indexOf(iconVariant);
    
    if (currentIndex < variants.length - 1) {
      const nextVariant = variants[currentIndex + 1];
      console.log(`次のバリエーションを試行: ${nextVariant}`);
      setIconVariant(nextVariant);
    } else {
      // 全バリエーションが失敗した場合
      console.log(`全バリエーション失敗: ${effectiveIconId}`);
      setHasError(true);
    }
  };
  
  return (
    <img 
      key={`${effectiveIconId}-${iconVariant}`}
      src={deviconUrl}
      alt={`${effectiveIconId} icon`} 
      width={size} 
      height={size} 
      style={{ objectFit: 'contain' }}
      onError={handleIconError}
    />
  );
};

interface SkillsSectionProps {
  skills: SkillCategory[] | Skill[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const theme = useTheme();

  // スキルをカテゴリごとにグループ化
  const groupedSkills = React.useMemo(() => {
    // skillsがSkillCategory[]型の場合（PublicProfileのskills）
    if (skills.length > 0 && 'skills' in skills[0]) {
      return skills as SkillCategory[];
    }
    
    // skillsがSkill[]型の場合
    const simpleSkills = skills as Skill[];
    const grouped: Record<string, { id: number; name: string; skills: Skill[] }> = {};
    
    simpleSkills.forEach(skill => {
      const categoryId = skill.category?.toString() || 'uncategorized';
      const categoryName = skill.category_name || 'その他';
      
      if (!grouped[categoryId]) {
        grouped[categoryId] = {
          id: parseInt(categoryId) || 0,
          name: categoryName,
          skills: []
        };
      }
      
      grouped[categoryId].skills.push(skill);
    });
    
    return Object.values(grouped).sort((a, b) => a.id - b.id);
  }, [skills]);

  return (
    <Box component="section">
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            スキル
          </Typography>
          <Grid container spacing={2}>
            {groupedSkills.map((category) => (
              <Grid item xs={12} key={category.id}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {category.name}
                </Typography>
                <Grid container spacing={2}>
                  {(category.skills || []).map((skill) => (
                    <Grid item xs={12} sm={6} md={4} key={skill.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <IconDisplay iconId={skill.icon_id || ''} size={24} />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {skill.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {skill.experience_years}年
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SkillsSection;
