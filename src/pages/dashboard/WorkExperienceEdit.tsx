import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  TextField,
  Typography,
  Chip,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormLabel,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Collapse,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Business as BusinessIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { workExperienceAPI } from '../../services/api';
import { WorkExperience } from '../../types/interfaces';

// プロセス種別の選択肢
const PROCESS_TYPES = [
  { value: 'requirements', label: '要件定義' },
  { value: 'basic_design', label: '基本設計' },
  { value: 'detailed_design', label: '詳細設計' },
  { value: 'implementation', label: '実装' },
  { value: 'testing', label: '試験' },
  { value: 'deployment', label: 'デプロイ/リリース' },
  { value: 'operation', label: '運用/保守' }
];

// 日付をフォーマットする関数
const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}年${month}月`;
  } catch (error) {
    console.error('日付の変換に失敗しました:', error);
    return '';
  }
};

// 空の職務経歴オブジェクト
const emptyWorkExperience: Partial<WorkExperience> = {
  position: '',
  project_name: '',
  company: '',
  start_date: '',
  end_date: '',
  current: false,
  team_size: undefined,
  details: {
    project_detail: '',
    process_work_detail: ''
  },
  skills_used_details: [],
  os_used: [],
  languages_used: [],
  db_used: [],
  frameworks_used: [],
  process_roles: [],
  process_details: {
    requirements: false,
    basic_design: false,
    detailed_design: false,
    implementation: false,
    testing: false,
    deployment: false,
    operation: false,
    management: false
  }
};

// 文字列配列入力コンポーネント
const StringArrayInput: React.FC<{
  label: string;
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() !== '') {
      const newValues = [...value, inputValue.trim()];
      onChange(newValues);
      setInputValue('');
    }
  };

  const handleDelete = (index: number) => {
    const newValues = [...value];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Box>
      <FormControl fullWidth variant="outlined" sx={{ mb: 1 }}>
        <TextField
          label={label}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          InputProps={{
            endAdornment: (
              <Button
                onClick={handleAdd}
                variant="contained"
                size="small"
                sx={{ ml: 1 }}
                disabled={inputValue.trim() === ''}
              >
                追加
              </Button>
            )
          }}
        />
      </FormControl>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {value.map((item, index) => (
          <Chip
            key={index}
            label={item}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

// 担当工程選択コンポーネント
const ProcessSelector: React.FC<{
  processDetails: Record<string, boolean>;
  onChange: (processDetails: Record<string, boolean>) => void;
}> = ({ processDetails, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    onChange({
      ...processDetails,
      [name]: checked
    });
  };

  return (
    <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
      <FormLabel component="legend">担当工程</FormLabel>
      <FormGroup row>
        {PROCESS_TYPES.map((process) => (
          <FormControlLabel
            key={process.value}
            control={
              <Checkbox
                checked={processDetails[process.value] || false}
                onChange={handleChange}
                name={process.value}
              />
            }
            label={process.label}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};

// 職務経歴データを送信形式に整形する関数
const formatWorkExperienceData = (data: Partial<WorkExperience>): Partial<WorkExperience> => {
  // 現在の案件の場合は終了日をnullに設定
  const formattedData = {
    ...data,
    // 必須フィールドの初期値を設定
    position: data.position || '',
    description: data.details?.project_detail || '',
    // 日付フィールドの処理
    start_date: data.start_date,
    end_date: data.current ? null : data.end_date,
    // details オブジェクトが存在しない場合は作成
    details: data.details || {
      project_detail: '',
      process_work_detail: ''
    }
  };
  
  return formattedData;
};

// 職務経歴編集ダイアログ
const WorkExperienceDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  workExperience: Partial<WorkExperience>;
  onSave: (data: Partial<WorkExperience>) => void;
  isNew: boolean;
}> = ({ open, onClose, workExperience, onSave, isNew }) => {
  const [formData, setFormData] = useState<Partial<WorkExperience>>(emptyWorkExperience);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(workExperience || emptyWorkExperience);
  }, [workExperience]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [name]: value
      }
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleOsChange = (values: string[]) => {
    setFormData(prev => ({
      ...prev,
      os_used: values
    }));
  };

  const handleLanguagesChange = (values: string[]) => {
    setFormData(prev => ({
      ...prev,
      languages_used: values
    }));
  };

  const handleDbChange = (values: string[]) => {
    setFormData(prev => ({
      ...prev,
      db_used: values
    }));
  };

  const handleFrameworksChange = (values: string[]) => {
    setFormData(prev => ({
      ...prev,
      frameworks_used: values
    }));
  };

  const handleProcessChange = (processDetails: Record<string, boolean>) => {
    setFormData(prev => ({
      ...prev,
      process_details: processDetails
    }));

    // process_rolesも更新
    const selectedProcesses = Object.entries(processDetails)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => {
        const processType = PROCESS_TYPES.find(p => p.value === key);
        return processType ? processType.label : '';
      })
      .filter(label => label !== '');

    setFormData(prev => ({
      ...prev,
      process_roles: selectedProcesses
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.position?.trim()) {
      newErrors.position = '役職/ポジションは必須です';
    }

    if (!formData.start_date) {
      newErrors.start_date = '開始日は必須です';
    }

    if (!formData.current && !formData.end_date) {
      newErrors.end_date = '終了日は必須です（現在の案件の場合はチェックを入れてください）';
    }

    if (!formData.details?.project_detail?.trim()) {
      newErrors.project_detail = '案件詳細は必須です';
    }

    // 日付の妥当性チェック
    if (formData.start_date && formData.end_date && !formData.current) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (start > end) {
        newErrors.end_date = '終了日は開始日より後の日付を指定してください';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const finalData = formatWorkExperienceData(formData);
      onSave(finalData);
    }
  };

  // 日付入力フィールドのonChange処理
  const handleDateChange = (name: string, value: string) => {
    // value は 'YYYY-MM' 形式
    const formattedValue = value ? `${value}-01` : ''; // 月初日を設定
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isNew ? '職務経歴の新規登録' : '職務経歴の編集'}
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
              label="案件/プロジェクト名"
              name="project_name"
              value={formData.project_name || ''}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="役職/ポジション"
              name="position"
              value={formData.position || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.position}
              helperText={errors.position}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              label="開始日"
              name="start_date"
              type="month"
              value={formData.start_date ? formData.start_date.substring(0, 7) : ''}
              onChange={(e) => handleDateChange('start_date', e.target.value)}
              fullWidth
              required
              error={!!errors.start_date}
              helperText={errors.start_date || '年月を選択'}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              label="終了日"
              name="end_date"
              type="month"
              value={formData.end_date ? formData.end_date.substring(0, 7) : ''}
              onChange={(e) => handleDateChange('end_date', e.target.value)}
              fullWidth
              disabled={formData.current}
              error={!!errors.end_date && !formData.current}
              helperText={errors.end_date || '年月を選択'}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Checkbox
                  name="current"
                  checked={formData.current || false}
                  onChange={handleCheckboxChange}
                />
              }
              label="現在の案件"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              label="チーム人数"
              name="team_size"
              type="number"
              value={formData.team_size || ''}
              onChange={handleChange}
              fullWidth
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          
          {/* 詳細内容 */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              詳細内容
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="案件詳細"
              name="project_detail"
              value={formData.details?.project_detail || ''}
              onChange={handleDetailsChange}
              fullWidth
              multiline
              rows={3}
              required
              error={!!errors.project_detail}
              helperText={errors.project_detail}
              placeholder="プロジェクトの背景や目的、規模などの詳細情報を記入してください"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="工程毎の作業詳細"
              name="process_work_detail"
              value={formData.details?.process_work_detail || ''}
              onChange={handleDetailsChange}
              fullWidth
              multiline
              rows={4}
              placeholder="各工程で担当した作業内容の詳細を記入してください"
            />
          </Grid>
          
          {/* 担当工程 */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              担当工程
            </Typography>
            <ProcessSelector
              processDetails={formData.process_details || {}}
              onChange={handleProcessChange}
            />
          </Grid>
          
          {/* 使用技術 */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              使用技術
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StringArrayInput
              label="OS"
              value={formData.os_used || []}
              onChange={handleOsChange}
              placeholder="例: Windows, macOS, Linux"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StringArrayInput
              label="プログラミング言語"
              value={formData.languages_used || []}
              onChange={handleLanguagesChange}
              placeholder="例: JavaScript, Python, Java"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StringArrayInput
              label="データベース"
              value={formData.db_used || []}
              onChange={handleDbChange}
              placeholder="例: MySQL, PostgreSQL, MongoDB"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StringArrayInput
              label="フレームワーク"
              value={formData.frameworks_used || []}
              onChange={handleFrameworksChange}
              placeholder="例: React, Django, Spring Boot"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" startIcon={<CancelIcon />}>
          キャンセル
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          startIcon={<SaveIcon />}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 在籍期間を計算する関数
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

// 職務経歴アイテム
const WorkExperienceItem: React.FC<{
  workExperience: WorkExperience;
  onEdit: (workExperience: WorkExperience) => void;
  onDelete: (id: number) => void;
}> = ({ workExperience, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  
  const handleExpand = () => {
    setExpanded(!expanded);
  };
  
  const formatDateRange = (start: string, end: string | null, current: boolean) => {
    // 開始日をフォーマット
    const startDate = formatDate(start);
    
    // 終了日をフォーマットまたは「現在」を表示
    const endText = current ? '現在' : (end ? formatDate(end) : '');
    
    return `${startDate} 〜 ${endText}`;
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
              <BusinessIcon color="primary" />
              {workExperience.project_name || workExperience.position}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                mt: 1,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 0.5
              }}
            >
              {workExperience.position && (
                <Chip 
                  label={workExperience.position} 
                  size="small"
                  icon={<WorkIcon fontSize="small" />}
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 'medium',
                    fontSize: '0.75rem',
                  }}
                />
              )}
              
              {workExperience.company && (
                <Chip 
                  label={workExperience.company} 
                  size="small"
                  icon={<BusinessIcon fontSize="small" />}
                  sx={{ 
                    bgcolor: alpha(theme.palette.grey[500], 0.1),
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem',
                  }}
                />
              )}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box 
              sx={{ 
                display: 'flex',
                justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                alignItems: 'flex-start',
                gap: 1,
                height: '100%',
                flexDirection: 'column',
                textAlign: { xs: 'left', sm: 'right' },
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: workExperience.current ? theme.palette.primary.main : 'text.secondary',
                  fontWeight: workExperience.current ? 'medium' : 'regular',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                  gap: 0.5
                }}
              >
                <TimelineIcon fontSize="small" />
                {formatDateRange(
                  workExperience.start_date, 
                  workExperience.end_date || null, 
                  workExperience.current
                )}
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                  gap: 0.5,
                  mt: 0.5
                }}
              >
                （{calculateDuration(workExperience)}）
              </Typography>
              
              {workExperience.team_size && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                    gap: 0.5,
                    mt: 0.5
                  }}
                >
                  <GroupIcon fontSize="small" />
                  チーム人数: {workExperience.team_size}名
                </Typography>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box 
              sx={{ 
                mt: 1,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5
              }}
            >
              {workExperience.process_roles && workExperience.process_roles.map((role, index) => (
                <Chip 
                  key={index}
                  label={role}
                  size="small"
                  sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.dark,
                    fontSize: '0.75rem',
                  }}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mt: 0.5 }}
            >
              {workExperience.details?.project_detail?.length ? (
                workExperience.details.project_detail.substring(0, 150) + 
                (workExperience.details.project_detail.length > 150 ? '...' : '')
              ) : (
                '案件詳細なし'
              )}
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2
              }}
            >
              <Button
                size="small"
                startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={handleExpand}
                sx={{ mr: 1 }}
              >
                {expanded ? '詳細を閉じる' : '詳細を表示'}
              </Button>
              
              <Box>
                <IconButton 
                  size="small" 
                  color="primary" 
                  onClick={() => onEdit(workExperience)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => onDelete(workExperience.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0, pb: 3, px: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            {workExperience.details?.project_detail && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  案件詳細
                </Typography>
                <Typography variant="body2" paragraph>
                  {workExperience.details.project_detail}
                </Typography>
              </Grid>
            )}
            
            {workExperience.details?.process_work_detail && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  工程毎の作業詳細
                </Typography>
                <Typography variant="body2" paragraph>
                  {workExperience.details.process_work_detail}
                </Typography>
              </Grid>
            )}
            
            {/* 使用技術 */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                使用技術
              </Typography>
              
              <Grid container spacing={1}>
                {workExperience.os_used && workExperience.os_used.length > 0 && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CodeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">OS:</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {workExperience.os_used.map((os, index) => (
                        <Chip 
                          key={index} 
                          label={os} 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.dark,
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
                
                {workExperience.languages_used && workExperience.languages_used.length > 0 && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CodeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">言語:</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {workExperience.languages_used.map((lang, index) => (
                        <Chip 
                          key={index} 
                          label={lang} 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.dark,
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
                
                {workExperience.frameworks_used && workExperience.frameworks_used.length > 0 && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CodeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">FW:</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {workExperience.frameworks_used.map((fw, index) => (
                        <Chip 
                          key={index} 
                          label={fw} 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            color: theme.palette.warning.dark,
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
                
                {workExperience.db_used && workExperience.db_used.length > 0 && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <StorageIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">DB:</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {workExperience.db_used.map((db, index) => (
                        <Chip 
                          key={index} 
                          label={db} 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.dark,
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>
            
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};

// メインコンポーネント
const WorkExperienceEdit: React.FC = () => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentExperience, setCurrentExperience] = useState<Partial<WorkExperience>>({
    position: '',
    project_name: '',
    company: '',
    start_date: '',
    end_date: '',
    current: false,
    team_size: undefined,
    details: {
      project_detail: '',
      process_work_detail: ''
    },
    skills_used_details: [],
    os_used: [],
    languages_used: [],
    db_used: [],
    frameworks_used: [],
    process_roles: [],
    process_details: {
      requirements: false,
      basic_design: false,
      detailed_design: false,
      implementation: false,
      testing: false,
      deployment: false,
      operation: false,
      management: false
    }
  });
  const [experienceDialogOpen, setExperienceDialogOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // 職務経歴の取得
  const fetchWorkExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workExperienceAPI.getWorkExperiences();
      
      // 最新順（startDateの降順）に並べ替え
      const sortedData = [...data].sort((a, b) => {
        if (!a.start_date) return 1;
        if (!b.start_date) return -1;
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      });
      
      setExperiences(sortedData);
    } catch (err) {
      console.error('職務経歴の取得に失敗しました', err);
      setError('職務経歴の取得に失敗しました。再読み込みしてください。');
    } finally {
      setLoading(false);
    }
  };

  // 初回読み込み
  useEffect(() => {
    // 以前のLocalStorageキャッシュを削除
    localStorage.removeItem('workExperienceExtraData');
    
    fetchWorkExperiences();
  }, []);

  // 新規作成ダイアログを開く
  const handleOpenCreateDialog = () => {
    setCurrentExperience(emptyWorkExperience);
    setIsEditMode(false);
    setExperienceDialogOpen(true);
  };

  // 編集ダイアログを開く
  const handleOpenEditDialog = (workExperience: WorkExperience) => {
    setCurrentExperience(workExperience);
    setIsEditMode(true);
    setExperienceDialogOpen(true);
  };

  // ダイアログを閉じる
  const handleCloseDialog = () => {
    setExperienceDialogOpen(false);
  };

  // 職務経歴の保存（新規作成または更新）
  const handleSaveWorkExperience = async (data: Partial<WorkExperience>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isEditMode) {
        // 更新
        await workExperienceAPI.updateWorkExperience(data);
        setSuccess('職務経歴を更新しました');
      } else {
        // 新規作成
        await workExperienceAPI.createWorkExperience(data);
        setSuccess('職務経歴を新規作成しました');
      }
      
      // ダイアログを閉じて一覧を再取得
      setExperienceDialogOpen(false);
      await fetchWorkExperiences();
      
      // 成功メッセージを3秒後に消す
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('職務経歴の保存に失敗しました', err);
      // エラーレスポンスの詳細を表示
      if (err.response && err.response.data) {
        console.error('エラーの詳細情報:', err.response.data);
        // バックエンドのエラーメッセージがある場合は表示
        if (typeof err.response.data === 'object') {
          const errorMessages = Object.entries(err.response.data)
            .map(([field, msgs]) => `- ${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('\n');
          setError(`職務経歴の保存に失敗しました。以下のエラーを修正してください：\n${errorMessages}`);
        } else {
          setError('職務経歴の保存に失敗しました。再試行してください。');
        }
      } else {
        setError('職務経歴の保存に失敗しました。再試行してください。');
      }
    } finally {
      setLoading(false);
    }
  };

  // 職務経歴の削除
  const handleDeleteWorkExperience = async (id: number) => {
    if (window.confirm('この職務経歴を削除してもよろしいですか？')) {
      try {
        setLoading(true);
        setError(null);
        
        // APIから削除
        await workExperienceAPI.deleteWorkExperience(id);
        
        setSuccess('職務経歴を削除しました');
        await fetchWorkExperiences();
        
        // 成功メッセージを3秒後に消す
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (err) {
        console.error('職務経歴の削除に失敗しました', err);
        setError('職務経歴の削除に失敗しました。再試行してください。');
      } finally {
        setLoading(false);
      }
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
            <WorkIcon sx={{ mr: 1.5, fontSize: '1.75rem' }} />
            職務経歴管理
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            あなたの職務経歴や担当プロジェクトを管理し、ポートフォリオに表示できます。
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
      ) : experiences.length === 0 ? (
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
          <WorkIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
            職務経歴がまだ登録されていません
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            新しい職務経歴を追加して、あなたのキャリアをポートフォリオに表示しましょう。
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            sx={{ borderRadius: 2, px: 3 }}
          >
            職務経歴を登録する
          </Button>
        </Paper>
      ) : (
        <Box>
          {experiences.map((exp) => (
            <WorkExperienceItem
              key={exp.id}
              workExperience={exp}
              onEdit={handleOpenEditDialog}
              onDelete={handleDeleteWorkExperience}
            />
          ))}
        </Box>
      )}

      <WorkExperienceDialog
        open={experienceDialogOpen}
        onClose={handleCloseDialog}
        workExperience={currentExperience}
        onSave={handleSaveWorkExperience}
        isNew={!isEditMode}
      />
    </Box>
  );
};

export default WorkExperienceEdit;
