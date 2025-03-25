import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  CircularProgress, Alert, Divider, IconButton,
  FormControlLabel, Checkbox,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Card, CardContent,
  useTheme,
  alpha,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

import { educationAPI } from '../../services/api';
import { Education } from '../../types/interfaces';

// 空の学歴データ
const emptyEducation: Partial<Education> = {
  institution: '',
  degree: '',
  field_of_study: '',
  start_date: '',
  end_date: null,
  description: null,
  is_visible: true
};

// 日付フォーマット関数
const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '';
  try {
    return format(new Date(dateStr), 'yyyy年MM月');
  } catch (e) {
    console.error('日付のフォーマットに失敗しました:', e);
    return dateStr;
  }
};

// 学歴編集ダイアログ
const EducationDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  education: Partial<Education>;
  onSave: (data: Partial<Education>) => void;
  isNew: boolean;
}> = ({ open, onClose, education, onSave, isNew }) => {
  const [formData, setFormData] = useState<Partial<Education>>(emptyEducation);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(education || emptyEducation);
  }, [education]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.institution?.trim()) {
      newErrors.institution = '学校名は必須です';
    }
    
    if (!formData.degree?.trim()) {
      newErrors.degree = '学位は必須です';
    }
    
    if (!formData.field_of_study?.trim()) {
      newErrors.field_of_study = '専攻は必須です';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = '開始日は必須です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isNew ? '学歴の新規登録' : '学歴の編集'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* 基本情報 */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              基本情報
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="学校名"
              name="institution"
              value={formData.institution || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.institution}
              helperText={errors.institution}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="学位"
              name="degree"
              value={formData.degree || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.degree}
              helperText={errors.degree}
              placeholder="例: 学士（情報工学）、修士（コンピュータサイエンス）"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="専攻"
              name="field_of_study"
              value={formData.field_of_study || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.field_of_study}
              helperText={errors.field_of_study}
              placeholder="例: 情報工学、コンピュータサイエンス"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              label="開始日"
              name="start_date"
              type="date"
              value={formData.start_date || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.start_date}
              helperText={errors.start_date || 'YYYY-MM-DD形式で入力'}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              label="終了日"
              name="end_date"
              type="date"
              value={formData.end_date || ''}
              onChange={handleChange}
              fullWidth
              helperText={'YYYY-MM-DD形式で入力'}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          {/* 詳細情報 */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              詳細情報
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="説明"
              name="description"
              multiline
              rows={4}
              value={formData.description || ''}
              onChange={handleChange}
              fullWidth
              placeholder="学位論文のテーマ、研究内容、特別な成果などを記入してください"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="is_visible"
                  checked={formData.is_visible !== false}
                  onChange={handleCheckboxChange}
                  color="primary"
                />
              }
              label="ポートフォリオに表示する"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          キャンセル
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={<SaveIcon />}
          color="primary"
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 学歴アイテム
const EducationItem: React.FC<{
  education: Education;
  onEdit: (education: Education) => void;
  onDelete: (id: number) => void;
}> = ({ education, onEdit, onDelete }) => {
  const theme = useTheme();
  
  const formatDateRange = (start: string, end: string | null | undefined) => {
    const startDate = formatDate(start);
    const endDate = end ? formatDate(end) : '現在';
    return `${startDate} 〜 ${endDate}`;
  };
  
  return (
    <Card 
      elevation={2} 
      sx={{ 
        mb: 3, 
        borderRadius: 2,
        overflow: 'visible',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <SchoolIcon color="secondary" />
              {education.degree} - {education.field_of_study}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mt: 1,
                color: theme.palette.secondary.main,
                fontWeight: 'medium'
              }}
            >
              {education.institution}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              {formatDateRange(education.start_date, education.end_date)}
            </Typography>
            
            {education.description && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 2,
                  whiteSpace: 'pre-line'
                }}
              >
                {education.description}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <IconButton
                size="small"
                onClick={() => onEdit(education)}
                sx={{
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              
              <IconButton
                size="small"
                onClick={() => onDelete(education.id)}
                sx={{
                  color: theme.palette.error.main,
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.error.main, 0.2),
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Chip 
                label={education.is_visible !== false ? "表示" : "非表示"} 
                size="small"
                color={education.is_visible !== false ? "success" : "default"}
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// メインコンポーネント
const EducationEdit: React.FC = () => {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentEducation, setCurrentEducation] = useState<Partial<Education>>(emptyEducation);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);

  // 学歴データの取得
  const fetchEducation = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await educationAPI.getEducation();
      
      // 日付の降順に並べ替え
      const sortedData = [...data].sort((a, b) => {
        if (!a.end_date && !b.end_date) return 0;
        if (!a.end_date) return -1;
        if (!b.end_date) return 1;
        return new Date(b.end_date).getTime() - new Date(a.end_date).getTime();
      });
      
      setEducationList(sortedData);
    } catch (err) {
      console.error('学歴データの取得に失敗しました', err);
      setError('学歴データの取得に失敗しました。再読み込みしてください。');
    } finally {
      setLoading(false);
    }
  };

  // 初回読み込み
  useEffect(() => {
    fetchEducation();
  }, []);

  // 新規作成ダイアログを開く
  const handleOpenCreateDialog = () => {
    setCurrentEducation(emptyEducation);
    setIsNew(true);
    setDialogOpen(true);
  };

  // 編集ダイアログを開く
  const handleOpenEditDialog = (educationItem: Education) => {
    setCurrentEducation(educationItem);
    setIsNew(false);
    setDialogOpen(true);
  };

  // ダイアログを閉じる
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // 学歴の保存処理
  const handleSaveEducation = async (data: Partial<Education>) => {
    try {
      setError(null);
      let savedEducation: Education;
      
      if (isNew) {
        // 新規作成
        savedEducation = await educationAPI.createEducation(data);
        setSuccess('学歴情報を新規登録しました。');
      } else {
        // 更新
        savedEducation = await educationAPI.updateEducation(data);
        setSuccess('学歴情報を更新しました。');
      }
      
      // 成功メッセージを表示して3秒後に消す
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      // データを再取得
      fetchEducation();
      
      // ダイアログを閉じる
      setDialogOpen(false);
    } catch (err) {
      console.error('学歴の保存に失敗しました', err);
      setError('学歴の保存に失敗しました。もう一度お試しください。');
    }
  };

  // 学歴の削除処理
  const handleDeleteEducation = async (id: number) => {
    if (!window.confirm('この学歴情報を削除してもよろしいですか？')) {
      return;
    }
    
    try {
      setError(null);
      await educationAPI.deleteEducation(id);
      
      // 成功メッセージを表示
      setSuccess('学歴情報を削除しました。');
      
      // 成功メッセージを3秒後に消す
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      // データを再取得
      fetchEducation();
    } catch (err) {
      console.error('学歴の削除に失敗しました', err);
      setError('学歴の削除に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
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
            <SchoolIcon sx={{ mr: 1.5, fontSize: '1.75rem' }} />
            学歴管理
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            あなたの学歴情報を管理し、ポートフォリオに表示できます。
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          sx={{ 
            px: 3, 
            py: 1,
            borderRadius: 2,
            boxShadow: 2,
            fontWeight: 'bold'
          }}
        >
          新規作成
        </Button>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, whiteSpace: 'pre-line', borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : educationList.length === 0 ? (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: 'grey.50',
            border: '1px dashed',
            borderColor: 'grey.300'
          }}
        >
          <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
            学歴情報がまだ登録されていません
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            学歴情報を追加して、あなたの経歴をポートフォリオに表示しましょう。
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            sx={{ borderRadius: 2, px: 3 }}
          >
            学歴を登録する
          </Button>
        </Paper>
      ) : (
        <Box>
          {educationList.map((edu) => (
            <EducationItem
              key={edu.id}
              education={edu}
              onEdit={handleOpenEditDialog}
              onDelete={handleDeleteEducation}
            />
          ))}
        </Box>
      )}
      
      <EducationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        education={currentEducation}
        onSave={handleSaveEducation}
        isNew={isNew}
      />
    </Box>
  );
};

export default EducationEdit;
