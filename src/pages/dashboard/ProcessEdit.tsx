import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Divider, Slider, FormControl, InputLabel, MenuItem, Select, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
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
  // 開発プロセス（主要7工程）
  { value: 'requirements', label: '要件定義', category: 'process' },
  { value: 'basic_design', label: '基本設計', category: 'process' },
  { value: 'detailed_design', label: '詳細設計', category: 'process' },
  { value: 'implementation', label: '実装', category: 'process' },
  { value: 'testing', label: '試験', category: 'process' },
  { value: 'deployment', label: 'デプロイ/リリース', category: 'process' },
  { value: 'operation', label: '運用/保守', category: 'process' },
];

// カテゴリの定義
const CATEGORIES = [
  { id: 'process', label: '開発プロセス' },
];

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
  const [isReady, setIsReady] = useState(false);  // レンダリング準備状態

  // データの取得
  useEffect(() => {
    const fetchProcessExperiences = async () => {
      try {
        setLoading(true);
        setIsReady(false);
        
        const response = await api.get('/api/process-experiences/', {
          headers: { Authorization: `Token ${token}` }
        });
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // バックエンドから取得したデータをセット
          setExperiences(response.data as ProcessExperience[]);
        } else {
          // データがない場合は初期状態をセット
          setExperiences(initialProcessExperiences);
        }
        setError(null);
      } catch (err) {
        console.error('担当工程データの取得に失敗しました:', err);
        setError('担当工程データの取得に失敗しました。');
      } finally {
        setLoading(false);
        // UIレンダリングの準備を整える
        setTimeout(() => setIsReady(true), 500);
      }
    };

    if (token) {
      fetchProcessExperiences();
    }
  }, [token]);

  // 経験値の更新ハンドラ
  const handleExperienceChange = (index: number, value: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      experience_count: value
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

  // レーダーチャートのデータ生成
  const chartData = {
    labels: PROCESS_TYPES.map(type => type.label),
    datasets: [
      {
        label: '担当回数',
        data: isReady && experiences.length > 0 
          ? PROCESS_TYPES.map(type => {
              const exp = experiences.find(e => e.process_type === type.value);
              return exp ? exp.experience_count : 0;
            })
          : Array(PROCESS_TYPES.length).fill(0),
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

  // 説明付きの数値入力フィールド
  const ExperienceInput = ({ index }: { index: number }) => {
    // Hooks は常に最初に呼び出す必要がある
    const [tempDescription, setTempDescription] = useState('');
    
    // インデックスが有効な場合のみ exp.description をセットする
    useEffect(() => {
      if (index >= 0 && index < experiences.length) {
        const exp = experiences[index];
        setTempDescription(exp.description || '');
      }
    }, [index, experiences]);
    
    // インデックスが範囲外でないかチェック
    if (index < 0 || index >= experiences.length) {
      return null;
    }

    const exp = experiences[index];
    const processType = PROCESS_TYPES.find(t => t.value === exp.process_type);
    
    return (
      <Paper sx={{ p: 3, mb: 2, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
          {processType?.label || '未定義の工程'}
        </Typography>

        <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>担当回数</Typography>
            <TextField
              type="number"
              variant="outlined"
              size="small"
              label={`${exp.experience_count}回`}
              value={exp.experience_count || 0}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 0 && val <= 20) {
                  handleExperienceChange(index, val);
                }
              }}
              inputProps={{ min: 0, max: 20, step: 1 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="説明/備考"
              multiline
              rows={2}
              variant="outlined"
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              onBlur={() => handleDescriptionChange(index, tempDescription)}
              placeholder={`${processType?.label || ''}での経験について入力してください`}
            />
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // カテゴリごとに工程を表示するコンポーネント
  const CategoryGroup = ({ categoryId }: { categoryId: string }) => {
    const categoryProcesses = experiences.filter(exp => 
      PROCESS_TYPES.find(type => type.value === exp.process_type)?.category === categoryId
    );
    
    if (categoryProcesses.length === 0) return null;
    
    // カテゴリの表示名を取得
    let categoryTitle = "";
    switch(categoryId) {
      case 'process':
        categoryTitle = "開発プロセス";
        break;
      default:
        categoryTitle = "その他";
    }
    
    // 工程の正しい順序を取得するための配列
    const orderedProcessTypes = PROCESS_TYPES.map(type => type.value);
    
    // 工程を定義順にソート
    const sortedProcesses = [...categoryProcesses].sort((a, b) => {
      const indexA = orderedProcessTypes.indexOf(a.process_type);
      const indexB = orderedProcessTypes.indexOf(b.process_type);
      return indexA - indexB;
    });
    
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
          {categoryTitle}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {sortedProcesses.map(exp => {
          const index = experiences.findIndex(e => e.process_type === exp.process_type);
          return <ExperienceInput key={exp.process_type} index={index} />;
        })}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // データは読み込まれたが、UIレンダリングの準備ができていない場合
  if (!isReady) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress size={24} sx={{ opacity: 0.5 }} />
      </Box>
    );
  }

  // カテゴリの表示順序
  const categoryOrder = ['process'];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" color="primary" gutterBottom fontWeight="bold">
        担当工程管理
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          担当工程情報が正常に保存されました。
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* レーダーチャート */}
        <Grid item xs={12} md={5}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%', 
              borderRadius: 2,
              boxShadow: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
              担当工程の経験バランス
            </Typography>
            
            {!isReady ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '300px',
                color: 'text.secondary'
              }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  データ読み込み中...
                </Typography>
                <CircularProgress size={20} sx={{ opacity: 0.5 }} />
              </Box>
            ) : (
              <>
                {experiences.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    データがありません
                  </Typography>
                ) : (
                  <>
                    {/* 全体のレーダーチャート */}
                    <Box sx={{ 
                      flex: 1, 
                      minHeight: '300px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <Radar data={chartData} options={chartOptions} />
                    </Box>
                  </>
                )}
              </>
            )}
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
              各工程の担当回数をレーダーチャートで表示しています。
            </Typography>
          </Paper>
        </Grid>

        {/* 編集フォーム */}
        <Grid item xs={12} md={7}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
              各工程の担当経験を入力
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              {categoryOrder.map(categoryId => (
                <CategoryGroup key={categoryId} categoryId={categoryId} />
              ))}
            </Box>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSave}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {saving ? '保存中...' : '保存する'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProcessEdit; 