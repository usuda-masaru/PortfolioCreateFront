import React from 'react';
import { Box, Typography, alpha, useTheme, Paper, Grid, Chip, Divider } from '@mui/material';
import { ProcessExperience } from '../../types/interfaces';
import { 
  Assignment as AssignmentIcon,
  Architecture as ArchitectureIcon,
  DesignServices as DesignServicesIcon,
  DeveloperMode as DeveloperModeIcon,
  BugReport as BugReportIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

// 工程タイプの正式な順序（定数）
const PROCESS_ORDER = [
  "requirements", // 要件定義
  "basic_design", // 基本設計
  "detailed_design", // 詳細設計
  "implementation", // 実装
  "testing", // 試験
  "deployment", // デプロイ/リリース
  "operation" // 運用/保守
];

// 工程タイプの表示名（定数）
const PROCESS_DISPLAY_NAMES: Record<string, string> = {
  "requirements": "要件定義",
  "basic_design": "基本設計",
  "detailed_design": "詳細設計", 
  "implementation": "実装",
  "testing": "試験",
  "deployment": "デプロイ/リリース",
  "operation": "運用/保守"
};

// 工程タイプ別の色（定数）
const PROCESS_COLORS: Record<string, { main: string, light: string, dark: string }> = {
  "requirements": { main: '#3F51B5', light: '#C5CAE9', dark: '#303F9F' }, // インディゴ
  "basic_design": { main: '#00796B', light: '#B2DFDB', dark: '#00695C' }, // ティール
  "detailed_design": { main: '#7B1FA2', light: '#E1BEE7', dark: '#6A1B9A' }, // パープル
  "implementation": { main: '#FF5722', light: '#FFCCBC', dark: '#E64A19' }, // ディープオレンジ
  "testing": { main: '#D32F2F', light: '#FFCDD2', dark: '#C62828' },       // レッド
  "deployment": { main: '#4CAF50', light: '#C8E6C9', dark: '#388E3C' },    // グリーン
  "operation": { main: '#0288D1', light: '#B3E5FC', dark: '#0277BD' }      // ライトブルー
};

// 工程タイプ別のアイコン
const PROCESS_ICONS: Record<string, React.ReactElement> = {
  "requirements": <AssignmentIcon />,
  "basic_design": <ArchitectureIcon />,
  "detailed_design": <DesignServicesIcon />,
  "implementation": <DeveloperModeIcon />,
  "testing": <BugReportIcon />,
  "deployment": <AssignmentIcon />,
  "operation": <SettingsIcon />
};

interface ProcessExperiencesSectionProps {
  processExperiences: ProcessExperience[];
}

const ProcessExperiencesSection = ({ processExperiences }: ProcessExperiencesSectionProps) => {
  const theme = useTheme();

  // デバッグログ: 入力データを確認
  console.log("入力データ processExperiences:", processExperiences);

  // 工程タイプでデータを整理して必要なものがすべて存在するようにする
  const normalizedProcessData = React.useMemo(() => {
    // 全ての工程タイプのデータを初期化（0案件に設定）
    const initialData: Record<string, { count: number, description: string, id: number }> = {};
    PROCESS_ORDER.forEach((type, index) => {
      // 要件定義の場合は特別にID=1を設定
      if (type === "requirements") {
        initialData[type] = { 
          count: 0, 
          description: '特記事項なし', 
          id: 1 // 要件定義のIDは1を設定
        };
      } else {
        initialData[type] = { 
          count: 0, 
          description: '特記事項なし', 
          id: 1000 + index // 正の値でダミーIDを設定（実データと重複しない値）
        };
      }
    });
    
    // 実際のデータで上書き
    if (processExperiences && processExperiences.length > 0) {
      processExperiences.forEach(exp => {
        console.log(`処理中: process_type=${exp.process_type}, id=${exp.id}, count=${exp.experience_count}`);
        if (exp.process_type in initialData) {
          initialData[exp.process_type] = {
            count: exp.experience_count,
            description: exp.description || '特記事項なし',
            id: exp.id
          };
        }
      });
    }
    
    // 各工程のデータを確認
    console.log("処理後のデータ:", initialData);
    
    // 正しい順序でデータを返す
    return PROCESS_ORDER.map(type => ({
      id: initialData[type].id,
      process_type: type,
      process_type_display: PROCESS_DISPLAY_NAMES[type] || type,
      experience_count: initialData[type].count,
      description: initialData[type].description
    }));
  }, [processExperiences]);

  // デバッグログ: どのようなデータが生成されているか確認
  console.log("normalizedProcessData:", normalizedProcessData);

  // 担当工程がない場合は何も表示しない
  if (normalizedProcessData.length === 0) {
    return null;
  }

  // 経験数の最大値を取得（進行バーの表示用）
  const maxExperienceCount = Math.max(...normalizedProcessData.map(exp => exp.experience_count), 1);

  // 経験レベルを計算
  const getExperienceLevel = (count: number) => {
    if (count === 0) return '未経験';
    if (count <= 2) return '基礎経験あり';
    if (count <= 5) return '実務経験あり';
    if (count <= 10) return '豊富な経験あり';
    return '専門家レベル';
  };

  // 工程タイプに応じた色を取得する関数
  const getProcessColor = (processType: string, variant: 'main' | 'light' | 'dark' = 'main') => {
    const colors = PROCESS_COLORS[processType] || { main: theme.palette.primary.main, light: theme.palette.primary.light, dark: theme.palette.primary.dark };
    return colors[variant];
  };

  // 色の濃さを経験数に応じて計算
  const getColorIntensity = (count: number) => {
    if (count === 0) return 0.1;
    const normalized = count / maxExperienceCount;
    // 最低でも0.2の濃さにする
    return 0.2 + (normalized * 0.8);
  };

  return (
    <Box sx={{ py: 3 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        {/* ヘッダー */}
        <Box sx={{ 
          px: 3, 
          py: 2.5, 
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          bgcolor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TimelineIcon 
              sx={{ 
                mr: 1.5, 
                color: theme.palette.text.secondary,
                fontSize: '1.5rem'
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary,
                letterSpacing: '0.02em'
              }}
            >
              システム開発工程
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {/* 開発工程の概要カード */}
          <Grid container spacing={2} alignItems="stretch">
            {normalizedProcessData.map((exp) => {
              const hasExperience = exp.experience_count > 0;
              const processColor = getProcessColor(exp.process_type);
              const processColorLight = getProcessColor(exp.process_type, 'light');
              
              return (
                <Grid item xs={6} sm={4} md={2} key={exp.id}>
                  <Paper
                    elevation={0}
                    sx={{ 
                      height: '100%',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: `1px solid ${hasExperience 
                        ? alpha(processColor, 0.2) 
                        : alpha(theme.palette.divider, 0.12)}`,
                      boxShadow: hasExperience 
                        ? `0 4px 12px ${alpha(processColor, 0.08)}` 
                        : 'none',
                      opacity: hasExperience ? 1 : 0.7,
                      transition: 'all 0.25s ease',
                      '&:hover': hasExperience ? {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 16px ${alpha(processColor, 0.12)}`,
                        borderColor: alpha(processColor, 0.3),
                      } : {},
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* ヘッダー部分 */}
                    <Box sx={{ 
                      px: 2,
                      pt: 2.5,
                      pb: 1.5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 1,
                    }}>
                      {/* バックグラウンドの円（装飾） */}
                      {hasExperience && (
                        <Box sx={{
                          position: 'absolute',
                          top: -40,
                          right: -40,
                          width: 100,
                          height: 100,
                          borderRadius: '50%',
                          bgcolor: alpha(processColor, 0.05),
                          zIndex: -1
                        }} />
                      )}
                      
                      {/* アイコンと工程名 */}
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 52,
                        height: 52,
                        borderRadius: '12px',
                        bgcolor: hasExperience 
                          ? alpha(processColor, 0.12)
                          : alpha(theme.palette.grey[100], 0.5),
                        color: hasExperience 
                          ? processColor
                          : theme.palette.text.disabled,
                        mb: 1.5
                      }}>
                        {PROCESS_ICONS[exp.process_type] || <TimelineIcon fontSize="medium" />}
                      </Box>
                      
                      <Typography 
                        variant="subtitle2" 
                        sx={{
                          fontWeight: 600,
                          color: hasExperience ? theme.palette.text.primary : theme.palette.text.secondary,
                          textAlign: 'center',
                          fontSize: '0.9rem',
                          mb: 0.75,
                          letterSpacing: '0.02em'
                        }}
                      >
                        {exp.process_type_display}
                      </Typography>

                      {/* 経験レベル */}
                      {hasExperience && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: theme.palette.text.secondary,
                            fontSize: '0.75rem',
                            textAlign: 'center',
                            mb: 1,
                            letterSpacing: '0.01em'
                          }}
                        >
                          {getExperienceLevel(exp.experience_count)}
                        </Typography>
                      )}
                    </Box>
                    
                    {/* 案件数バッジとプログレスバー */}
                    {hasExperience && (
                      <Box sx={{ 
                        px: 2,
                        pb: 2,
                        mt: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}>
                        <Divider flexItem sx={{ mb: 1.5, opacity: 0.6 }} />
                        
                        {/* プログレスバー */}
                        <Box sx={{ width: '100%', mb: 1.5 }}>
                          <Box sx={{ 
                            width: '100%', 
                            height: 3, 
                            bgcolor: alpha(processColorLight, 0.4),
                            borderRadius: 5,
                            overflow: 'hidden'
                          }}>
                            <Box sx={{ 
                              width: `${Math.min(100, (exp.experience_count / maxExperienceCount) * 100)}%`, 
                              height: '100%', 
                              bgcolor: processColor,
                            }} />
                          </Box>
                        </Box>
                        
                        {/* 案件数表示 */}
                        <Box sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Typography 
                            sx={{ 
                              color: processColor,
                              fontWeight: 700,
                              fontSize: '1.1rem',
                              mr: 0.3
                            }}
                          >
                            {exp.experience_count}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ 
                              color: theme.palette.text.secondary,
                              fontSize: '0.75rem'
                            }}
                          >
                            案件
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
          
          {/* 工程詳細リスト */}
          <Box sx={{ mt: 5 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                fontSize: '1.1rem',
                color: theme.palette.text.primary,
                position: 'relative',
                pl: 1.5,
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 4,
                  height: '70%',
                  bgcolor: theme.palette.primary.main,
                  borderRadius: 4
                }
              }}
            >
              工程別詳細経験
            </Typography>
            
            <Grid container spacing={2.5}>
              {normalizedProcessData
                .filter(exp => exp.experience_count > 0)
                .map((exp) => {
                  const processColor = getProcessColor(exp.process_type);
                  const processColorLight = getProcessColor(exp.process_type, 'light');
                  
                  return (
                    <Grid item xs={12} sm={6} key={exp.id}>
                      <Paper
                        elevation={0}
                        sx={{ 
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                          boxShadow: `0 2px 12px ${alpha(processColor, 0.06)}`,
                          transition: 'all 0.25s ease',
                          '&:hover': {
                            boxShadow: `0 6px 16px ${alpha(processColor, 0.1)}`,
                            borderColor: alpha(processColor, 0.2),
                          }
                        }}
                      >
                        {/* ヘッダー */}
                        <Box sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          py: 1.6,
                          px: 2,
                          position: 'relative',
                          overflow: 'hidden',
                        }}>
                          {/* 背景の装飾 */}
                          <Box sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            bgcolor: alpha(processColor, 0.06),
                            zIndex: 0
                          }} />
                          
                          {/* 左上の装飾 */}
                          <Box sx={{ 
                            position: 'absolute',
                            top: -10,
                            left: -10,
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            bgcolor: alpha(processColor, 0.1),
                            zIndex: 0
                          }} />
                          
                          {/* 工程名とアイコン */}
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            zIndex: 1
                          }}>
                            <Box sx={{
                              mr: 1.5,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 36,
                              height: 36,
                              borderRadius: '10px',
                              bgcolor: alpha(processColor, 0.12),
                              color: processColor
                            }}>
                              {PROCESS_ICONS[exp.process_type] || <TimelineIcon fontSize="small" />}
                            </Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                fontSize: '0.95rem',
                                letterSpacing: '0.02em'
                              }}
                            >
                              {exp.process_type_display}
                            </Typography>
                          </Box>
                          
                          {/* 案件数表示 */}
                          <Chip
                            label={`${exp.experience_count}案件`}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              bgcolor: alpha(processColor, 0.12),
                              color: processColor,
                              border: 'none',
                              height: 26,
                              fontSize: '0.75rem',
                              zIndex: 1
                            }}
                          />
                        </Box>
                        
                        {/* 説明 */}
                        <Box sx={{ p: 2.5, pt: 2 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: alpha(theme.palette.text.primary, 0.85),
                              fontSize: '0.875rem',
                              lineHeight: 1.6,
                              whiteSpace: 'pre-line',
                              letterSpacing: '0.015em'
                            }}
                          >
                            {exp.description}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProcessExperiencesSection; 