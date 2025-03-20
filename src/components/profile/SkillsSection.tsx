import React from 'react';
import { Box, Typography, Tooltip, alpha, useTheme, Paper, Grid } from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AccessTime as TimeIcon, Star as StarIcon, Code as CodeIcon } from '@mui/icons-material';
import { Skill, ProcessExperience, SkillCategory } from '../../types/interfaces';
import { Radar } from 'react-chartjs-2';
import { API_BASE_URL } from '../../services/api';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';

// プログラミング言語やツールのアイコンをインポート
import { 
  SiReact, SiAngular, SiVuedotjs, SiSvelte, SiNextdotjs,
  SiTypescript, SiJavascript, SiHtml5, SiCss3, SiTailwindcss, 
  SiBootstrap, SiMui, SiChakraui,
  SiNodedotjs, SiExpress, SiNestjs, SiDjango, SiFlask,
  SiPython, SiJavascript as SiJavaIcon, SiPhp, SiRuby, SiRubyonrails, SiGo, SiRust, SiCplusplus, SiC,
  SiPostgresql, SiMysql, SiMongodb, SiRedis, SiFirebase, SiSqlite,
  SiGit, SiGithub, SiGitlab, SiBitbucket,
  SiDocker, SiKubernetes, SiAmazon, SiGooglecloud, SiVercel, SiNetlify,
  SiJira, SiTrello, SiNotion, SiConfluence,
  SiFigma, SiAdobexd, SiSketch,
  SiLinux, SiUbuntu, SiDebian, SiCentos, SiRedhat, SiApple,
  SiAndroid, SiIos, SiReact as SiReactNativeIcon, SiFlutter
} from 'react-icons/si';
import { FaWindows, FaMicrosoft, FaAws, FaCloud, FaServer, FaDatabase, FaAmazon } from 'react-icons/fa';
import { IconType } from 'react-icons';

// ChartJSの必要なコンポーネントを登録
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  Legend
);

// アイコン定義の型
interface IconDefinition {
  id: string;
  label: string;
  component?: IconType;
  category?: string;
  imageUrl?: string;
}

// アイコン定義マップ
const ICON_COMPONENTS: Record<string, IconType> = {
  // フロントエンド
  'SiReact': SiReact,
  'SiAngular': SiAngular,
  'SiVuedotjs': SiVuedotjs,
  'SiSvelte': SiSvelte,
  'SiNextdotjs': SiNextdotjs,
  'SiHtml5': SiHtml5,
  'SiCss3': SiCss3,
  'SiTailwindcss': SiTailwindcss,
  'SiBootstrap': SiBootstrap,
  'SiMui': SiMui,
  'SiChakraui': SiChakraui,
  
  // バックエンド
  'SiNodedotjs': SiNodedotjs,
  'SiExpress': SiExpress,
  'SiNestjs': SiNestjs,
  'SiDjango': SiDjango,
  'SiFlask': SiFlask,
  
  // 言語
  'SiTypescript': SiTypescript,
  'SiJavascript': SiJavascript,
  'SiPython': SiPython,
  'SiJavaIcon': SiJavaIcon,
  'SiPhp': SiPhp,
  'SiRuby': SiRuby,
  'SiRubyonrails': SiRubyonrails,
  'SiGo': SiGo,
  'SiRust': SiRust,
  'SiCplusplus': SiCplusplus,
  'SiC': SiC,
  
  // データベース
  'SiPostgresql': SiPostgresql,
  'SiMysql': SiMysql,
  'SiMongodb': SiMongodb,
  'SiRedis': SiRedis,
  'SiFirebase': SiFirebase,
  'SiSqlite': SiSqlite,
  
  // ツール
  'SiGit': SiGit,
  'SiGithub': SiGithub,
  'SiGitlab': SiGitlab,
  'SiBitbucket': SiBitbucket,
  
  // インフラ
  'SiDocker': SiDocker,
  'SiKubernetes': SiKubernetes,
  'SiAmazon': SiAmazon,
  'SiGooglecloud': SiGooglecloud,
  'SiVercel': SiVercel,
  'SiNetlify': SiNetlify,
  
  // AWS
  'FaAws': FaAws,
  'FaAmazon': FaAmazon,
  
  // デザイン
  'SiFigma': SiFigma,
  'SiAdobexd': SiAdobexd,
  'SiSketch': SiSketch,
  
  // OS/プラットフォーム
  'SiLinux': SiLinux,
  'SiUbuntu': SiUbuntu,
  'SiDebian': SiDebian,
  'SiCentos': SiCentos, 
  'SiRedhat': SiRedhat,
  'SiApple': SiApple,
  'FaWindows': FaWindows,
  'FaMicrosoft': FaMicrosoft,
  
  // モバイル
  'SiAndroid': SiAndroid,
  'SiIos': SiIos,
  'SiReactNativeIcon': SiReactNativeIcon,
  'SiFlutter': SiFlutter,
  
  // その他
  'FaCloud': FaCloud,
  'FaServer': FaServer,
  'FaDatabase': FaDatabase,
};

// アイコン表示用のコンポーネント
const IconDisplay: React.FC<{ iconId: string; size?: number }> = ({ iconId, size = 24 }) => {
  const [hasError, setHasError] = React.useState(false);
  
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
  
  // 直接URL形式のアイコンの場合（画像パス）
  if (normalizedIconId.startsWith('http://') || normalizedIconId.startsWith('https://')) {
    console.log(`完全なURL: ${normalizedIconId}`);
    
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
          {effectiveIconId.substring(0, 2)}
        </div>
      );
    }
    
    return (
      <img 
        src={normalizedIconId} 
        alt="スキルアイコン" 
        width={size} 
        height={size} 
        style={{ objectFit: 'contain' }}
        onError={(e) => {
          console.error(`アイコン読み込みエラー: ${normalizedIconId}`, e);
          setHasError(true);
        }}
      />
    );
  }
  
  // react-iconsのコンポーネントを使用
  const IconComponent = ICON_COMPONENTS[effectiveIconId];
  if (IconComponent) {
    console.log(`コンポーネント使用: ${effectiveIconId}`);
    try {
      // IconComponentをReact Componentとして明示的に型付け
      const Icon = IconComponent as React.FC<{ size?: number }>;
      return <Icon size={size} />;
    } catch (error) {
      console.error(`コンポーネント表示エラー: ${effectiveIconId}`, error);
      // エラーの場合はフォールバック表示
      return (
        <div style={{ 
          width: size, 
          height: size, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#ffeeee',
          borderRadius: '4px',
          fontSize: size * 0.5,
          color: 'red'
        }}>
          {effectiveIconId.substring(0, 2)}
        </div>
      );
    }
  }
  
  // 外部画像パスの場合（AWSアイコンなど）
  if (normalizedIconId.includes('/media/')) {
    const iconUrl = `${API_BASE_URL}${normalizedIconId.startsWith('/') ? normalizedIconId : '/' + normalizedIconId}`;
    console.log(`メディアパス: ${iconUrl}`);
    
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
          {effectiveIconId.substring(0, 2)}
        </div>
      );
    }
    
    return (
      <img 
        src={iconUrl} 
        alt="スキルアイコン" 
        width={size} 
        height={size} 
        style={{ objectFit: 'contain' }}
        onError={(e) => {
          console.error(`アイコン読み込みエラー: ${iconUrl}`, e);
          setHasError(true);
        }}
      />
    );
  }
  
  // それ以外の場合はフォールバック表示
  console.log(`未定義のアイコン: ${effectiveIconId}`);
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
      {effectiveIconId.substring(0, 2)}
    </div>
  );
};

interface SkillsSectionProps {
  skills: SkillCategory[] | Skill[];
  processExperiences: ProcessExperience[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, processExperiences }) => {
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
  
  const renderExperienceStars = (years: number) => {
    // 経験年数に応じた色の決定
    const getColorByYears = (years: number) => {
      if (years >= 5) {
        return {
          bg: alpha(theme.palette.warning.main, 0.15),
          color: theme.palette.warning.dark,
          label: '熟練'
        };
      } else if (years >= 3) {
        return {
          bg: alpha(theme.palette.success.main, 0.15),
          color: theme.palette.success.dark,
          label: '経験豊富'
        };
      } else {
        return {
          bg: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          label: ''
        };
      }
    };

    const colorConfig = getColorByYears(years);

    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: colorConfig.bg,
            color: colorConfig.color,
            borderRadius: '16px',
            px: 1.5,
            py: 0.5
          }}
        >
          <TimeIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.85rem' }} />
          <Typography 
            variant="caption" 
            sx={{ 
              lineHeight: 1,
              fontWeight: 'medium'
            }}
          >
            {years}年{colorConfig.label && ` (${colorConfig.label})`}
          </Typography>
        </Box>
      </Box>
    );
  };

  // 担当工程のレーダーチャートデータ
  const processChartData = React.useMemo(() => {
    if (!processExperiences || processExperiences.length === 0) {
      return null;
    }

    const labels = processExperiences.map(exp => exp.process_type_display);
    const data = processExperiences.map(exp => exp.experience_count);
    
    return {
      labels,
      datasets: [
        {
          label: '担当回数',
          data,
          backgroundColor: alpha(theme.palette.primary.main, 0.2),
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
          pointBackgroundColor: theme.palette.primary.main,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: theme.palette.primary.main
        }
      ]
    };
  }, [processExperiences, theme]);

  const chartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };
  
  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h4" component="h2" textAlign="center" mb={4} fontWeight="bold">
        スキル
      </Typography>

      {processChartData && (
        <Paper 
          elevation={2} 
          sx={{ 
            mb: 6, 
            p: 3, 
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}
        >
          <Typography 
            variant="h5" 
            component="h3" 
            sx={{ 
              mb: 3, 
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              pb: 1,
              display: 'inline-block'
            }}
          >
            担当工程
          </Typography>
          
          <Grid container spacing={4}>
            {/* レーダーチャート（左側） */}
            <Grid item xs={12} md={5}>
              <Box sx={{ height: 300, width: '100%' }}>
                <Radar data={processChartData} options={chartOptions} />
              </Box>
            </Grid>
            
            {/* 工程詳細リスト（右側） */}
            <Grid item xs={12} md={7}>
              <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
                <Grid container spacing={2}>
                  {processExperiences.map((exp) => (
                    <Grid item xs={12} key={exp.id}>
                      <Paper
                        variant="outlined"
                        sx={{ 
                          p: 2, 
                          borderRadius: 1,
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          '&:hover': {
                            boxShadow: 1,
                            borderColor: theme.palette.primary.main
                          }
                        }}
                      >
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs={4} sm={3}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {exp.process_type_display}
                            </Typography>
                            <Box 
                              sx={{ 
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                borderRadius: 1,
                                px: 1,
                                py: 0.5,
                                display: 'inline-block',
                                mt: 0.5
                              }}
                            >
                              <Typography variant="caption" fontWeight="medium">
                                {exp.experience_count}回
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={8} sm={9}>
                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                              {exp.description || '特記事項なし'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {groupedSkills.map((category) => (
        <Box key={category.id} sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            component="h3" 
            sx={{ 
              mb: 3, 
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              pb: 1,
              display: 'inline-block'
            }}
          >
            {category.name}
          </Typography>
          
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
              },
              gap: 3,
            }}
          >
            {category.skills && category.skills.map((skill) => (
              <Box key={skill.id}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: { xs: 3, sm: 4 },
                    width: '100%',
                    height: '100%',
                    borderRadius: 2,
                    transition: 'all 0.3s ease-in-out',
                    position: 'relative',
                    border: skill.is_highlighted ? `2px solid ${theme.palette.warning.main}` : 'none',
                    boxShadow: skill.is_highlighted ? `0 4px 12px ${alpha(theme.palette.warning.main, 0.3)}` : 'none',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: skill.is_highlighted 
                        ? `0 6px 14px ${alpha(theme.palette.warning.main, 0.4)}` 
                        : 1,
                      backgroundColor: alpha(theme.palette.background.paper, 0.5)
                    },
                  }}
                >
                  {skill.is_highlighted && (
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: theme.palette.warning.main,
                        color: theme.palette.warning.contrastText,
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 1
                      }}
                    >
                      <StarIcon sx={{ fontSize: '14px' }} />
                    </Box>
                  )}
                  <Box sx={{ width: 80, height: 80, mb: 2 }}>
                    <Tooltip title={`スキルレベル: ${skill.level}/5`}>
                      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                        <CircularProgressbar
                          value={skill.level * 20}
                          strokeWidth={8}
                          styles={buildStyles({
                            strokeLinecap: 'round',
                            pathColor: skill.is_highlighted ? theme.palette.warning.main : theme.palette.primary.main,
                            trailColor: theme.palette.grey[200],
                            pathTransitionDuration: 0.5,
                          })}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '60%',
                            height: '60%',
                            borderRadius: '50%',
                            bgcolor: 'background.paper',
                            boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
                          }}
                        >
                          <Box 
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: skill.is_highlighted ? theme.palette.warning.main : theme.palette.primary.main,
                            }}
                          >
                            <IconDisplay iconId={skill.icon || ''} size={28} />
                          </Box>
                        </Box>
                      </Box>
                    </Tooltip>
                  </Box>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                      mb: 1,
                      color: skill.is_highlighted ? theme.palette.warning.dark : 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1.2,
                      maxWidth: '100%'
                    }}
                  >
                    <Box 
                      component="span" 
                      sx={{ 
                        width: '100%', 
                        textAlign: 'center'
                      }}
                    >
                      {skill.name}
                    </Box>
                    {skill.is_highlighted && (
                      <StarIcon 
                        fontSize="small" 
                        color="warning" 
                        sx={{ ml: 0.5, fontSize: '0.8rem', flexShrink: 0 }} 
                      />
                    )}
                  </Typography>
                  
                  {renderExperienceStars(skill.experience_years)}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default SkillsSection;
