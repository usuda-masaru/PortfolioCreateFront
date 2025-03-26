import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  Divider, 
  CircularProgress, 
  Alert,
  Avatar,
  alpha,
  useTheme,
  Chip
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
  Assignment as AssignmentIcon,
  Architecture as ArchitectureIcon,
  DesignServices as DesignServicesIcon,
  DeveloperMode as DeveloperModeIcon,
  BugReport as BugReportIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

// 担当工程の種類と表示名の定義
const PROCESS_TYPES = [
  { value: 'requirements', label: '要件定義', icon: <AssignmentIcon /> },
  { value: 'basic_design', label: '基本設計', icon: <ArchitectureIcon /> },
  { value: 'detailed_design', label: '詳細設計', icon: <DesignServicesIcon /> },
  { value: 'implementation', label: '実装', icon: <DeveloperModeIcon /> },
  { value: 'testing', label: '試験', icon: <BugReportIcon /> },
  { value: 'deployment', label: 'デプロイ/リリース', icon: <AssignmentIcon /> },
  { value: 'operation', label: '運用/保守', icon: <SettingsIcon /> },
];

// 工程タイプ別の色
const PROCESS_COLORS: Record<string, { main: string, light: string, dark: string }> = {
  "requirements": { main: '#3F51B5', light: '#C5CAE9', dark: '#303F9F' }, // インディゴ
  "basic_design": { main: '#00796B', light: '#B2DFDB', dark: '#00695C' }, // ティール
  "detailed_design": { main: '#7B1FA2', light: '#E1BEE7', dark: '#6A1B9A' }, // パープル
  "implementation": { main: '#FF5722', light: '#FFCCBC', dark: '#E64A19' }, // ディープオレンジ
  "testing": { main: '#D32F2F', light: '#FFCDD2', dark: '#C62828' },       // レッド
  "deployment": { main: '#4CAF50', light: '#C8E6C9', dark: '#388E3C' },    // グリーン
  "operation": { main: '#0288D1', light: '#B3E5FC', dark: '#0277BD' }      // ライトブルー
};

// 担当工程の経験データ型定義
interface ProcessExperience {
  id?: number;
  process_type: string;
  process_type_display?: string;
  experience_count: number;
  description: string;
}

// 初期状態のデータ
const initialProcessExperiences: ProcessExperience[] = PROCESS_TYPES.map(type => ({
  process_type: type.value,
  experience_count: 0,
  description: ''
}));

const ProcessEdit: React.FC = () => {
  const theme = useTheme();
  const { token } = useAuth();
  const [experiences, setExperiences] = useState<ProcessExperience[]>(initialProcessExperiences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // データの取得
  useEffect(() => {
    const fetchProcessExperiences = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/process-experiences/', {
          headers: { Authorization: `Token ${token}` }
        });
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setExperiences(response.data as ProcessExperience[]);
        } else {
          setExperiences(initialProcessExperiences);
        }
        setError(null);
      } catch (err) {
        console.error('担当工程データの取得に失敗しました:', err);
        setError('担当工程データの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProcessExperiences();
    }
  }, [token]);

  // 経験値の更新ハンドラ
  const handleExperienceChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      experience_count: numValue
    };
    setExperiences(updatedExperiences);
  };

  // 説明の更新ハンドラ
  const handleDescriptionChange = (index: number, value: string) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      description: value
    };
    setExperiences(updatedExperiences);
  };

  // データ保存ハンドラ
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSaveSuccess(false);

      const response = await api.post('/api/process-experiences/bulk-update/', 
        { process_experiences: experiences },
        { headers: { Authorization: `Token ${token}` } }
      );

      console.log('保存成功:', response.data);
      setSaveSuccess(true);
      
      // 保存成功メッセージを3秒後に消す
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('担当工程データの保存に失敗しました:', err);
      setError('担当工程データの保存に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  // 経験レベルを計算
  const getExperienceLevel = (count: number) => {
    if (count === 0) return '未経験';
    if (count <= 2) return '基礎経験あり';
    if (count <= 5) return '実務経験あり';
    if (count <= 10) return '豊富な経験あり';
    return '専門家レベル';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        py: 4,
        px: { xs: 2, sm: 3 },
        minHeight: 'calc(100vh - 64px)', // ヘッダーの高さを引く
        borderRadius: 0
      }}
    >
      {/* ヘッダー */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          bgcolor: 'rgba(33, 150, 243, 0.06)',
          color: 'primary.main',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              mb: 1
            }}
          >
            <TimelineIcon sx={{ mr: 1.5, fontSize: '1.75rem' }} />
            担当工程管理
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            あなたの担当工程や案件経験を管理し、ポートフォリオに表示できます。
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{ 
            px: 3, 
            py: 1,
            borderRadius: 2,
            boxShadow: 2,
            fontWeight: 'bold'
          }}
        >
          {saving ? '保存中...' : '変更を保存'}
        </Button>
      </Paper>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 0,
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          bgcolor: 'white',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* アラート */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mx: 3, 
              mt: 2,
              borderRadius: 1,
              '& .MuiAlert-icon': {
                color: theme.palette.error.main
              }
            }}
          >
            {error}
          </Alert>
        )}
        {saveSuccess && (
          <Alert 
            severity="success" 
            sx={{ 
              mx: 3, 
              mt: 2,
              borderRadius: 1,
              '& .MuiAlert-icon': {
                color: theme.palette.success.main
              }
            }}
          >
            変更が保存されました
          </Alert>
        )}

        {/* 工程リスト */}
        <Box sx={{ p: 3 }}>
          {PROCESS_TYPES.map((type, index) => {
            const experience = experiences[index];
            const processColor = PROCESS_COLORS[type.value]?.main || theme.palette.primary.main;
            const processColorLight = PROCESS_COLORS[type.value]?.light || theme.palette.primary.light;

            return (
              <Paper
                key={type.value}
                elevation={0}
                sx={{
                  p: 3,
                  mb: 2,
                  borderRadius: 2,
                  border: `1px solid ${alpha(processColor, 0.2)}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: `0 4px 20px ${alpha(processColor, 0.1)}`,
                    borderColor: alpha(processColor, 0.3),
                  }
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          mr: 2,
                          bgcolor: alpha(processColor, 0.1),
                          color: processColor,
                          width: 40,
                          height: 40
                        }}
                      >
                        {type.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {type.label}
                        </Typography>
                        <Chip
                          label={getExperienceLevel(experience.experience_count)}
                          size="small"
                          sx={{
                            mt: 0.5,
                            bgcolor: alpha(processColor, 0.1),
                            color: processColor,
                            fontWeight: 'medium'
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      label="担当案件回数"
                      type="number"
                      value={experience.experience_count}
                      onChange={(e) => handleExperienceChange(index, e.target.value)}
                      fullWidth
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: processColor,
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: processColor,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="特記事項"
                      value={experience.description}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      fullWidth
                      multiline
                      rows={2}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: processColor,
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: processColor,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};

export default ProcessEdit; 