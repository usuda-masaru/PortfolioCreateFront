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

  // レーダーチャートのオプションを改善
  const chartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          backdropColor: 'transparent',
          color: theme.palette.text.secondary,
          font: {
            size: 10
          }
        },
        angleLines: {
          color: alpha(theme.palette.divider, 0.3)
        },
        grid: {
          color: alpha(theme.palette.divider, 0.2)
        },
        pointLabels: {
          color: theme.palette.text.primary,
          font: {
            size: 11,
            weight: 500
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 12
        },
        titleFont: {
          size: 13,
          weight: "bold" as const
        }
      }
    },
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 2,
        tension: 0.3
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2
      }
    }
  };
  
  return (
    <Box sx={{ py: 4 }}>
      {groupedSkills.map((category) => (
        <Box key={category.id} sx={{ mb: 8 }}>
          {/* カテゴリヘッダー */}
          <Box 
            sx={{ 
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <Box 
              sx={{ 
                width: 8,
                height: 36,
                bgcolor: theme.palette.primary.main,
                borderRadius: 4,
                mr: 2,
                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            />
            <Typography 
              variant="h5" 
              component="h3" 
              sx={{ 
                fontWeight: 600,
                letterSpacing: '0.015em',
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                position: 'relative',
              }}
            >
              {category.name}
            </Typography>
            <Box 
              sx={{ 
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: '50px',
                height: '2px',
                bgcolor: alpha(theme.palette.primary.main, 0.3),
                borderRadius: 1
              }}
            />
          </Box>
          
          {/* スキルグリッド */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
                xl: 'repeat(6, 1fr)',
              },
              gap: { xs: 2, sm: 3 },
            }}
          >
            {category.skills && category.skills.map((skill) => (
              <Box 
                key={skill.id} 
                sx={{
                  transformOrigin: 'center bottom',
                  transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': {
                    transform: 'scale(1.04)',
                    zIndex: 2
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: { xs: 2, sm: 2.5 },
                    height: '100%',
                    borderRadius: 2.5,
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: skill.is_highlighted 
                      ? alpha(theme.palette.warning.main, 0.3)
                      : alpha(theme.palette.divider, 0.08),
                    boxShadow: skill.is_highlighted 
                      ? `0 8px 24px ${alpha(theme.palette.warning.main, 0.15)}` 
                      : `0 4px 16px ${alpha(theme.palette.common.black, 0.04)}`,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: skill.is_highlighted 
                        ? `0 12px 28px ${alpha(theme.palette.warning.main, 0.2)}` 
                        : `0 8px 28px ${alpha(theme.palette.primary.main, 0.1)}`,
                      borderColor: skill.is_highlighted 
                        ? theme.palette.warning.main 
                        : alpha(theme.palette.primary.main, 0.25),
                      '& .skill-icon-wrapper': {
                        transform: 'translateY(-3px)'
                      }
                    },
                  }}
                >
                  {/* 背景の装飾 */}
                  {skill.is_highlighted && (
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: -15,
                        right: -15,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.warning.main, 0.04),
                        zIndex: 0
                      }}
                    />
                  )}
                  
                  {/* ハイライトバッジ */}
                  {skill.is_highlighted && (
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: theme.palette.warning.main,
                        color: theme.palette.warning.contrastText,
                        borderRadius: '12px',
                        px: 1,
                        py: 0.3,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: `0 2px 8px ${alpha(theme.palette.warning.dark, 0.25)}`,
                        zIndex: 1
                      }}
                    >
                      <StarIcon sx={{ fontSize: '0.75rem', mr: 0.3 }} />
                      注目
                    </Box>
                  )}
                  
                  {/* アイコン部分 */}
                  <Box 
                    className="skill-icon-wrapper"
                    sx={{ 
                      mb: 2,
                      width: 76,
                      height: 76,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.6)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
                      boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.06)}`,
                      border: '1px solid',
                      borderColor: alpha(theme.palette.divider, 0.08),
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    <Tooltip 
                      title={`経験: ${skill.experience_years}年`}
                      arrow
                      placement="top"
                    >
                      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                        {/* 進捗円 */}
                        <CircularProgressbar
                          value={(Math.min(5, skill.experience_years) / 5) * 100}
                          strokeWidth={6}
                          styles={buildStyles({
                            strokeLinecap: 'round',
                            pathColor: skill.is_highlighted ? theme.palette.warning.main : theme.palette.primary.main,
                            trailColor: alpha(theme.palette.divider, 0.12),
                            pathTransitionDuration: 0.5,
                          })}
                        />
                        
                        {/* アイコン中央表示 */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '72%',
                            height: '72%',
                            borderRadius: '50%',
                            bgcolor: theme.palette.background.paper,
                            boxShadow: `0 0 0 2px ${alpha(skill.is_highlighted ? theme.palette.warning.light : theme.palette.primary.light, 0.15)}`,
                          }}
                        >
                          <Box 
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: skill.is_highlighted ? theme.palette.warning.main : theme.palette.primary.main,
                              fontSize: 28
                            }}
                          >
                            <IconDisplay iconId={skill.icon || ''} size={30} />
                          </Box>
                        </Box>
                      </Box>
                    </Tooltip>
                  </Box>
                  
                  {/* スキル名 */}
                  <Typography 
                    variant="subtitle2" 
                    sx={{
                      mb: 1.5,
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      fontWeight: 600,
                      color: skill.is_highlighted ? theme.palette.warning.dark : theme.palette.text.primary,
                      lineHeight: 1.3,
                      height: '2.6em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {skill.name}
                  </Typography>
                  
                  {/* 経験年数表示 */}
                  <Box 
                    sx={{ 
                      mt: 'auto',
                      pt: 1,
                      px: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '24px',
                        height: '2px',
                        bgcolor: alpha(theme.palette.divider, 0.4),
                        borderRadius: '1px'
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        bgcolor: alpha(skill.is_highlighted ? theme.palette.warning.main : theme.palette.primary.main, 0.1),
                        color: skill.is_highlighted ? theme.palette.warning.dark : theme.palette.primary.dark,
                      }}
                    >
                      <TimeIcon 
                        sx={{ 
                          mr: 0.5, 
                          fontSize: '0.8rem', 
                          opacity: 0.9 
                        }} 
                      />
                      {skill.experience_years}年経験
                    </Box>
                  </Box>
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
