import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  CircularProgress, Alert, Divider, IconButton, MenuItem,
  Select, FormControl, InputLabel, Card, CardContent, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormHelperText, Chip, Tooltip, Avatar, SelectChangeEvent,
  InputAdornment, Tab, Tabs, Modal, TextField as MuiTextField,
  Checkbox, FormControlLabel, List, ListItem, ListItemText,
  ListItemButton, useTheme, alpha
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Error as ErrorIcon } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import EmojiSymbolsIcon from '@mui/icons-material/EmojiSymbols';
import StarIcon from '@mui/icons-material/Star';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AccessTime as TimeIcon, Code as CodeIcon } from '@mui/icons-material';
import { skillAPI } from '../../services/api';
import { API_BASE_URL } from '../../services/api';
import { Skill, SkillCategory } from '../../types/interfaces';
import api from '../../services/api'; // 既にimportされている場合は無視
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

// アイコンカテゴリの定義
const ICON_CATEGORIES = [
  'フロントエンド', 'バックエンド', 'プログラミング言語', 'データベース', 
  'ツール', 'ホスティング', 'デザイン', 'OS/プラットフォーム', 'モバイル', 'AWS'
];

// アイコン定義の型
interface IconDefinition {
  id: string;
  label: string;
  category: string;
}

// 利用可能なアイコンの定義
const AVAILABLE_ICONS: IconDefinition[] = [
  // フロントエンド
  { id: 'react', label: 'React', category: 'フロントエンド' },
  { id: 'angularjs', label: 'Angular', category: 'フロントエンド' },
  { id: 'vuejs', label: 'Vue.js', category: 'フロントエンド' },
  { id: 'svelte', label: 'Svelte', category: 'フロントエンド' },
  { id: 'nextjs', label: 'Next.js', category: 'フロントエンド' },
  { id: 'html5', label: 'HTML5', category: 'フロントエンド' },
  { id: 'css3', label: 'CSS3', category: 'フロントエンド' },
  { id: 'tailwindcss', label: 'Tailwind CSS', category: 'フロントエンド' },
  { id: 'bootstrap', label: 'Bootstrap', category: 'フロントエンド' },
  { id: 'materialui', label: 'Material UI', category: 'フロントエンド' },
  { id: 'sass', label: 'Sass', category: 'フロントエンド' },
  
  // バックエンド
  { id: 'nodejs', label: 'Node.js', category: 'バックエンド' },
  { id: 'express', label: 'Express', category: 'バックエンド' },
  { id: 'nestjs', label: 'NestJS', category: 'バックエンド' },
  { id: 'django', label: 'Django', category: 'バックエンド' },
  { id: 'flask', label: 'Flask', category: 'バックエンド' },
  { id: 'rails', label: 'Ruby on Rails', category: 'バックエンド' },
  { id: 'spring', label: 'Spring', category: 'バックエンド' },
  { id: 'laravel', label: 'Laravel', category: 'バックエンド' },
  
  // プログラミング言語
  { id: 'javascript', label: 'JavaScript', category: 'プログラミング言語' },
  { id: 'typescript', label: 'TypeScript', category: 'プログラミング言語' },
  { id: 'python', label: 'Python', category: 'プログラミング言語' },
  { id: 'java', label: 'Java', category: 'プログラミング言語' },
  { id: 'php', label: 'PHP', category: 'プログラミング言語' },
  { id: 'ruby', label: 'Ruby', category: 'プログラミング言語' },
  { id: 'go', label: 'Go', category: 'プログラミング言語' },
  { id: 'rust', label: 'Rust', category: 'プログラミング言語' },
  { id: 'cplusplus', label: 'C++', category: 'プログラミング言語' },
  { id: 'c', label: 'C', category: 'プログラミング言語' },
  { id: 'csharp', label: 'C#', category: 'プログラミング言語' },
  { id: 'kotlin', label: 'Kotlin', category: 'プログラミング言語' },
  { id: 'swift', label: 'Swift', category: 'プログラミング言語' },
  
  // データベース
  { id: 'postgresql', label: 'PostgreSQL', category: 'データベース' },
  { id: 'mysql', label: 'MySQL', category: 'データベース' },
  { id: 'mongodb', label: 'MongoDB', category: 'データベース' },
  { id: 'redis', label: 'Redis', category: 'データベース' },
  { id: 'firebase', label: 'Firebase', category: 'データベース' },
  { id: 'sqlite', label: 'SQLite', category: 'データベース' },
  
  // ツール
  { id: 'git', label: 'Git', category: 'ツール' },
  { id: 'github', label: 'GitHub', category: 'ツール' },
  { id: 'gitlab', label: 'GitLab', category: 'ツール' },
  { id: 'bitbucket', label: 'Bitbucket', category: 'ツール' },
  { id: 'docker', label: 'Docker', category: 'ツール' },
  { id: 'kubernetes', label: 'Kubernetes', category: 'ツール' },
  { id: 'npm', label: 'npm', category: 'ツール' },
  { id: 'yarn', label: 'Yarn', category: 'ツール' },
  { id: 'webpack', label: 'Webpack', category: 'ツール' },
  
  // クラウド/ホスティング
  { id: 'amazonwebservices', label: 'AWS', category: 'ホスティング' },
  { id: 'googlecloud', label: 'Google Cloud', category: 'ホスティング' },
  { id: 'azure', label: 'Azure', category: 'ホスティング' },
  { id: 'heroku', label: 'Heroku', category: 'ホスティング' },
  { id: 'vercel', label: 'Vercel', category: 'ホスティング' },
  { id: 'netlify', label: 'Netlify', category: 'ホスティング' },
  
  // デザイン
  { id: 'figma', label: 'Figma', category: 'デザイン' },
  { id: 'adobexd', label: 'Adobe XD', category: 'デザイン' },
  { id: 'photoshop', label: 'Photoshop', category: 'デザイン' },
  { id: 'illustrator', label: 'Illustrator', category: 'デザイン' },
  
  // OS/プラットフォーム
  { id: 'linux', label: 'Linux', category: 'OS/プラットフォーム' },
  { id: 'ubuntu', label: 'Ubuntu', category: 'OS/プラットフォーム' },
  { id: 'debian', label: 'Debian', category: 'OS/プラットフォーム' },
  { id: 'centos', label: 'CentOS', category: 'OS/プラットフォーム' },
  { id: 'redhat', label: 'Red Hat', category: 'OS/プラットフォーム' },
  { id: 'apple', label: 'macOS', category: 'OS/プラットフォーム' },
  { id: 'windows', label: 'Windows', category: 'OS/プラットフォーム' },
  
  // モバイル
  { id: 'android', label: 'Android', category: 'モバイル' },
  { id: 'flutter', label: 'Flutter', category: 'モバイル' },
  { id: 'react', label: 'React Native', category: 'モバイル' },
  { id: 'swift', label: 'iOS/Swift', category: 'モバイル' },
];

// アイコンを表示するコンポーネント
const IconDisplay: React.FC<{ iconId: string }> = ({ iconId }) => {
  const [currentVariant, setCurrentVariant] = useState<string>('original');
  const [error, setError] = useState<boolean>(false);
  
  // アイコンIDを正規化する関数
  const normalizeIconId = (id: string): string => {
    if (!id) return '';
    
    // URLをデコード
    let decodedId = decodeURIComponent(id);
    
    // URLの場合は最後のパスセグメントを取得
    if (decodedId.startsWith('http')) {
      decodedId = decodedId.split('/').pop() || '';
    }
    
    // Siプレフィックスを削除
    if (decodedId.startsWith('Si')) {
      decodedId = decodedId.substring(2).toLowerCase();
    }
    
    return decodedId;
  };
  
  // アイコンのURLを生成する関数
  const getIconUrl = (id: string, variant: string): string => {
    const normalizedId = normalizeIconId(id);
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${normalizedId}/${normalizedId}-${variant}.svg`;
  };
  
  // エラー発生時の処理
  const handleIconError = () => {
    const normalizedId = normalizeIconId(iconId);
    console.log('Deviconアイコン読み込みエラー:', `${normalizedId}-${currentVariant}`);
    
    // 次のバリエーションを試す
    const variants = ['original', 'plain', 'line', 'plain-wordmark', 'original-wordmark'];
    const currentIndex = variants.indexOf(currentVariant);
    
    if (currentIndex < variants.length - 1) {
      console.log('次のバリエーションを試行:', variants[currentIndex + 1]);
      setCurrentVariant(variants[currentIndex + 1]);
    } else {
      console.log('全バリエーション失敗:', normalizedId);
      setError(true);
    }
  };
  
  // エラー状態をリセット
  useEffect(() => {
    setError(false);
    setCurrentVariant('original');
  }, [iconId]);
  
  if (!iconId) return null;
  
  console.log('IconDisplay: アイコンID=', iconId);
  console.log('アイコン識別子:', normalizeIconId(iconId));
  
  if (error) {
    return <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ErrorIcon color="error" />
    </Box>;
  }
  
  return (
    <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src={getIconUrl(iconId, currentVariant)}
        alt={`${normalizeIconId(iconId)} icon`}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        onError={handleIconError}
      />
    </Box>
  );
};

// アイコングリッド表示用のコンポーネント
const GridIconDisplay: React.FC<{ iconId: string }> = ({ iconId }) => {
  return (
    <Box sx={{ 
      position: 'relative', 
      width: 40, 
      height: 40, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center'
    }}>
      <IconDisplay iconId={iconId} />
    </Box>
  );
};

// カテゴリにヘッダーデザインを追加するためのスタイル定義
const CATEGORY_COLORS: Record<string, { bg: string; icon: string; color: string }> = {
  'フロントエンド': { bg: 'rgba(33, 150, 243, 0.06)', icon: 'SiReact', color: '#1565c0' },
  'バックエンド': { bg: 'rgba(76, 175, 80, 0.06)', icon: 'SiNodedotjs', color: '#2e7d32' },
  'データベース': { bg: 'rgba(156, 39, 176, 0.06)', icon: 'SiPostgresql', color: '#7b1fa2' },
  'プログラミング言語': { bg: 'rgba(255, 152, 0, 0.06)', icon: 'SiJavascript', color: '#e65100' },
  'ツール': { bg: 'rgba(0, 150, 136, 0.06)', icon: 'SiGit', color: '#00695c' },
  'ホスティング': { bg: 'rgba(3, 169, 244, 0.06)', icon: 'SiDocker', color: '#0277bd' },
  'デザイン': { bg: 'rgba(244, 67, 54, 0.06)', icon: 'SiFigma', color: '#d32f2f' },
  'OS/プラットフォーム': { bg: 'rgba(121, 85, 72, 0.06)', icon: 'SiLinux', color: '#5d4037' },
  'モバイル': { bg: 'rgba(233, 30, 99, 0.06)', icon: 'SiAndroid', color: '#c2185b' },
  'AWS': { bg: 'rgba(255, 193, 7, 0.06)', icon: 'FaAws', color: '#ff8f00' },
};

const getCategoryStyle = (categoryName: string): { bg: string; icon: string; color: string } => {
  return CATEGORY_COLORS[categoryName] || { bg: 'rgba(97, 97, 97, 0.06)', icon: 'CategoryIcon', color: '#616161' };
};

const SkillsEdit: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill>>({ name: '', description: '', level: 3, category: undefined, icon: undefined, experience_years: 0, order: 0 });
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
  const [skillDialogOpen, setSkillDialogOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<Partial<SkillCategory>>({ name: '', order: 1 });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [savingSkill, setSavingSkill] = useState<boolean>(false);
  const [savingCategory, setSavingCategory] = useState<boolean>(false);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [iconDialogOpen, setIconDialogOpen] = useState<boolean>(false);
  const [customIconUrl, setCustomIconUrl] = useState<string>('');
  const [iconSearchQuery, setIconSearchQuery] = useState<string>('');
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [iconUploadFile, setIconUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);
  const [selectedIconCategory, setSelectedIconCategory] = useState<string>('all');
  const [showCategoryDialog, setShowCategoryDialog] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const theme = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  // スキルとカテゴリの取得
  const fetchData = async () => {
    setLoading(true);
    try {
      // スキルとカテゴリを同時に取得
      const [skillsData, categoriesData] = await Promise.all([
        skillAPI.getSkills(),
        skillAPI.getCategories()
      ]);
      
      // カテゴリを順序で並べ替え
      const sortedCategories = [...categoriesData].sort((a, b) => a.order - b.order);
      setCategories(sortedCategories);
      
      // スキルをカテゴリごとに分類
      setSkills(skillsData);
      
      // 初期カテゴリ選択
      if (sortedCategories.length > 0) {
        setSelectedCategory(sortedCategories[0]);
      }
      
      setLoading(false);
      setError(null);
    } catch (err: any) {
      console.error('データの取得に失敗しました:', err);
      setError('スキルデータの取得に失敗しました。ページを再読み込みしてください。');
      setLoading(false);
    }
  };

  // スキル検証
  const validateSkill = (skill: Partial<Skill>): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!skill.name?.trim()) {
      errors.name = 'スキル名は必須です';
    }
    
    if (!skill.category) {
      errors.category = 'カテゴリーは必須です';
    }
    
    if (skill.level === undefined || skill.level < 1 || skill.level > 5) {
      errors.level = 'レベルは1〜5の範囲で指定してください';
    }
    
    if (skill.experience_years === undefined || skill.experience_years < 0) {
      errors.experience_years = '経験年数は0以上の数値で指定してください';
    }
    
    return errors;
  };

  // スキル編集ダイアログを開く
  const handleOpenSkillDialog = (skill?: Skill) => {
    if (skill) {
      setCurrentSkill({...skill});
      setIsEditMode(true);
    } else {
      setCurrentSkill({
        name: '',
        description: '',
        level: 3,
        category: selectedCategory?.id || undefined,
        icon: undefined,
        experience_years: 0,
        order: skills.length + 1
      });
      setIsEditMode(false);
    }
    setSkillDialogOpen(true);
  };

  // スキル編集ダイアログを閉じる
  const handleCloseSkillDialog = () => {
    setSkillDialogOpen(false);
  };

  // アイコン選択ダイアログを開く
  const handleOpenIconDialog = () => {
    setIconDialogOpen(true);
  };

  // アイコン選択ダイアログを閉じる
  const handleCloseIconDialog = () => {
    setIconDialogOpen(false);
  };

  // アイコンを選択
  const handleSelectIcon = (iconId: string) => {
    // アイコン定義を検索
    const selectedIcon = AVAILABLE_ICONS.find(i => i.id === iconId);
    console.log('アイコン選択:', iconId, selectedIcon);
    
    // スキル名が空かどうかを確認
    const isNameEmpty = !currentSkill.name || currentSkill.name.trim() === '';
    console.log('スキル名が空か:', isNameEmpty, '現在の名前:', currentSkill.name);
    
    // アイコンIDを正規化
    let normalizedIconId = iconId;
    if (normalizedIconId.startsWith('http')) {
      normalizedIconId = decodeURIComponent(normalizedIconId).split('/').pop() || '';
    }
    if (normalizedIconId.startsWith('Si')) {
      normalizedIconId = normalizedIconId.substring(2).toLowerCase();
    }
    
    // currentSkillのステートを更新
    setCurrentSkill(prev => {
      const updatedSkill = {
        ...prev,
        icon: `Si${normalizedIconId}`, // Siプレフィックスを付けて保存
        // スキル名がまだ設定されていないか空の場合にのみ、アイコンのラベルをスキル名として設定
        name: isNameEmpty && selectedIcon ? selectedIcon.label : prev.name
      };
      console.log('更新後のスキル:', updatedSkill);
      return updatedSkill;
    });
    
    // 選択されたアイコンIDを状態に保存
    setSelectedIconId(iconId);
    
    // 更新が完了した後のスキル情報を表示
    setTimeout(() => {
      console.log('アイコン選択後の現在のスキル状態:', currentSkill);
    }, 100);
    
    // ダイアログを閉じる
    setIconDialogOpen(false);
  };

  // スキル保存
  const handleSaveSkill = async () => {
    if (!currentSkill) return;
    
    // バリデーション
    const errors = validateSkill(currentSkill);
    if (Object.keys(errors).length > 0) {
      console.error('バリデーションエラー:', errors);
      setError(Object.values(errors).join('\n'));
      return;
    }
    
    setSavingSkill(true);
    try {
      // バックエンドに送信するデータを整形
      const skillData: Partial<Skill> = { ...currentSkill };
      
      // アイコンIDが存在する場合は、そのまま保存
      if (skillData.icon) {
        // アイコンIDを正規化
        let iconId = skillData.icon;
        if (iconId.startsWith('http')) {
          iconId = decodeURIComponent(iconId).split('/').pop() || '';
        }
        if (iconId.startsWith('Si')) {
          iconId = iconId.substring(2).toLowerCase();
        }
        console.log('保存するアイコンID:', iconId);
        skillData.icon_id = iconId;
        delete skillData.icon;
      }
      
      console.log('バックエンドに送信するデータ:', skillData);
      
      let savedSkill: Skill;
      
      if (isEditMode && currentSkill.id) {
        // 既存スキルの更新
        savedSkill = await skillAPI.updateSkill(skillData);
        setSkills(skills.map(s => s.id === savedSkill.id ? savedSkill : s));
        setSuccess(`スキル「${savedSkill.name}」を更新しました`);
      } else {
        // 新規スキルの作成
        savedSkill = await skillAPI.createSkill(skillData);
        setSkills([...skills, savedSkill]);
        setSuccess(`スキル「${savedSkill.name}」を作成しました`);
      }
      
      // 成功メッセージを表示して3秒後に消す
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      // データを再取得して最新の状態を表示
      fetchData();
      
      // ダイアログを閉じる
      setSkillDialogOpen(false);
    } catch (err: any) {
      console.error('スキルの保存に失敗しました:', err);
      const errorMessage = err.response?.data?.icon 
        ? `アイコンフィールドのエラー: ${err.response.data.icon.join(', ')}`
        : err.response?.data 
          ? `APIエラー: ${JSON.stringify(err.response.data)}`
          : 'スキルの保存に失敗しました。もう一度お試しください。';
      setError(errorMessage);
    } finally {
      setSavingSkill(false);
    }
  };

  // カテゴリダイアログを閉じる
  const handleCloseCategoryDialog = () => {
    setCategoryDialogOpen(false);
  };

  // カテゴリを作成
  const handleCreateCategory = async () => {
    if (!newCategory.name?.trim()) {
      setError('カテゴリ名は必須です');
      return;
    }
    
    setSavingCategory(true);
    try {
      const createdCategory = await skillAPI.createCategory(newCategory);
      setCategories([...categories, createdCategory]);
      setSuccess(`カテゴリ「${createdCategory.name}」を作成しました`);
      
      // 成功メッセージを表示して3秒後に消す
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      // ダイアログを閉じる
      setCategoryDialogOpen(false);
    } catch (err) {
      console.error('カテゴリの作成に失敗しました:', err);
      setError('カテゴリの作成に失敗しました。もう一度お試しください。');
    } finally {
      setSavingCategory(false);
    }
  };

  // スキル削除の確認ダイアログを開く
  const handleOpenDeleteConfirm = (skill: Skill) => {
    setSkillToDelete(skill);
    setDeleteConfirmOpen(true);
  };

  // スキルを削除
  const handleDeleteSkill = async () => {
    if (!skillToDelete) return;
    
    try {
      await skillAPI.deleteSkill(skillToDelete.id);
      setSkills(skills.filter(s => s.id !== skillToDelete.id));
      setSuccess(`スキル「${skillToDelete.name}」を削除しました`);
      
      // 成功メッセージを表示して3秒後に消す
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      setDeleteConfirmOpen(false);
      setSkillToDelete(null);
    } catch (err) {
      console.error('スキルの削除に失敗しました:', err);
      setError('スキルの削除に失敗しました。もう一度お試しください。');
    }
  };

  // スキルレベルを星評価のテキストで表示
  const getLevelText = (level: number): string => {
    switch (level) {
      case 1: return '初級者 (基本的な理解)';
      case 2: return '中級者 (実務経験あり)';
      case 3: return '上級者 (複雑な問題を解決できる)';
      case 4: return 'エキスパート (高度な知識と経験)';
      case 5: return 'マスター (専門家レベル)';
      default: return '未設定';
    }
  };

  // カテゴリに属するスキルをフィルター
  const getSkillsByCategory = (categoryId: number): Skill[] => {
    return skills.filter(skill => skill.category === categoryId);
  };

  // アイコン選択ダイアログのフィルタリング
  const filteredIcons = AVAILABLE_ICONS.filter(icon => 
    selectedIconCategory === 'all' || 
    icon.category === selectedIconCategory
  );

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await skillAPI.deleteCategory(categoryId);
      // カテゴリリストを更新
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      setCategories(updatedCategories);
      // 削除されたカテゴリに属するスキルを更新
      const updatedSkills = skills.map(skill => {
        if (skill.category === categoryId) {
          return { ...skill, category: null };
        }
        return skill;
      });
      setSkills(updatedSkills);
      // 選択中のカテゴリが削除された場合、選択をクリア
      if (selectedCategory?.id === categoryId) {
        setSelectedCategory(null);
      }
      // 成功メッセージを表示
      setSuccess('カテゴリを削除しました');
    } catch (error) {
      console.error('カテゴリの削除エラー:', error);
      setError(error instanceof Error ? error.message : 'カテゴリの削除に失敗しました');
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
            <StarIcon sx={{ mr: 1.5, fontSize: '1.75rem' }} />
            スキル管理
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            あなたのスキルを管理し、ポートフォリオに表示できます。カテゴリごとに分けて整理しましょう。
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenSkillDialog()}
          sx={{ 
            px: 3, 
            py: 1,
            borderRadius: 2,
            boxShadow: 2,
            fontWeight: 'bold'
          }}
        >
          新規スキル
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
      ) : (
        <Paper 
          elevation={2}
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            mb: 4
          }}
        >
          <Box 
            sx={{ 
              p: 2,
              bgcolor: alpha(theme.palette.primary.light, 0.05),
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CategoryIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="bold">
                カテゴリ
              </Typography>
            </Box>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                setNewCategory({ name: '', order: categories.length + 1 });
                setCategoryDialogOpen(true);
              }}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              カテゴリ追加
            </Button>
          </Box>

          {categories.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                カテゴリが登録されていません。「カテゴリ追加」から新しいカテゴリを作成してください。
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={selectedCategory ? categories.findIndex(cat => cat.id === selectedCategory.id) : 0}
                  onChange={(_, newValue) => setSelectedCategory(categories[newValue] || null)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    px: 2,
                    pt: 1
                  }}
                >
                  {categories.map((category) => (
                    <Tab 
                      key={category.id} 
                      label={category.name}
                      sx={{ 
                        fontWeight: 'medium',
                        minWidth: 100,
                        textTransform: 'none'
                      }}
                    />
                  ))}
                </Tabs>
                {selectedCategory && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end', 
                      alignItems: 'center',
                      px: 2,
                      pb: 1,
                      gap: 1
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingCategory(selectedCategory);
                        setShowCategoryDialog(true);
                      }}
                      sx={{ 
                        color: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (window.confirm('このカテゴリを削除してもよろしいですか？\nこのカテゴリに属するスキルは未分類になります。')) {
                          handleDeleteCategory(selectedCategory.id);
                        }
                      }}
                      sx={{ 
                        color: theme.palette.error.main,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {selectedCategory && (
                <Box sx={{ p: 3 }}>
                  {getSkillsByCategory(selectedCategory.id).length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        このカテゴリにはスキルがまだ登録されていません。
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenSkillDialog()}
                        sx={{ mt: 2 }}
                      >
                        スキルを追加
                      </Button>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {getSkillsByCategory(selectedCategory.id).map((skill) => (
                        <Grid item xs={12} sm={6} md={4} key={skill.id}>
                          <Card 
                            elevation={1} 
                            sx={{ 
                              height: '100%',
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: 4
                              }
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ 
                                  mr: 2, 
                                  width: 40, 
                                  height: 40, 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  bgcolor: 'rgba(0,0,0,0.03)',
                                  borderRadius: '12px'
                                }}>
                                  {skill.icon_id && typeof skill.icon_id === 'string' ? (
                                    <IconDisplay iconId={skill.icon_id} />
                                  ) : (
                                    <Typography variant="subtitle2" color="text.secondary">
                                      {skill.name.substring(0, 1).toUpperCase()}
                                    </Typography>
                                  )}
                                </Box>
                                <Typography variant="h6" component="h3" fontWeight="bold">
                                  {skill.name}
                                </Typography>
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                                <Chip 
                                  label={`Lv.${skill.level}`} 
                                  size="small" 
                                  color={skill.level >= 4 ? "primary" : "default"}
                                />
                                <Chip 
                                  label={`${skill.experience_years}年`} 
                                  size="small" 
                                  color="secondary"
                                />
                                {skill.is_highlighted && (
                                  <Chip 
                                    icon={<StarIcon />} 
                                    label="注目" 
                                    size="small" 
                                    color="warning"
                                  />
                                )}
                              </Box>

                              {skill.description && (
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary" 
                                  sx={{ 
                                    mb: 2,
                                    minHeight: '2.5rem',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                  }}
                                >
                                  {skill.description}
                                </Typography>
                              )}

                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'flex-end', 
                                mt: 'auto', 
                                pt: 2,
                                borderTop: '1px solid rgba(0,0,0,0.08)'
                              }}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleOpenSkillDialog(skill)}
                                  sx={{ 
                                    mr: 1,
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
                                  onClick={() => handleOpenDeleteConfirm(skill)}
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
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}
            </>
          )}
        </Paper>
      )}

      {/* スキル編集ダイアログ */}
      <Dialog 
        open={skillDialogOpen} 
        onClose={handleCloseSkillDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? 'スキルを編集' : '新しいスキルを追加'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="スキル名"
                fullWidth
                value={currentSkill.name || ''}
                onChange={e => setCurrentSkill({...currentSkill, name: e.target.value})}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="category-label">カテゴリ</InputLabel>
                <Select
                  labelId="category-label"
                  value={currentSkill.category || ''}
                  onChange={e => setCurrentSkill({...currentSkill, category: e.target.value as number})}
                  label="カテゴリ"
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="level-label">レベル</InputLabel>
                <Select
                  labelId="level-label"
                  value={currentSkill.level || 3}
                  onChange={e => setCurrentSkill({...currentSkill, level: e.target.value as number})}
                  label="レベル"
                >
                  {[1, 2, 3, 4, 5].map(level => (
                    <MenuItem key={level} value={level}>
                      {level} - {getLevelText(level)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="経験年数"
                type="number"
                fullWidth
                value={currentSkill.experience_years || 0}
                onChange={e => setCurrentSkill({...currentSkill, experience_years: parseFloat(e.target.value)})}
                InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="body1">アイコン</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EmojiSymbolsIcon />}
                  onClick={handleOpenIconDialog}
                >
                  アイコンを選択
                </Button>
              </Box>
              {currentSkill.icon && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  p: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  mb: 2
                }}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}>
                    <IconDisplay iconId={currentSkill.icon} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">
                      {AVAILABLE_ICONS.find(i => i.id === currentSkill.icon)?.label || currentSkill.icon}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      アイコンID: {currentSkill.icon}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="説明"
                fullWidth
                multiline
                rows={3}
                value={currentSkill.description || ''}
                onChange={e => setCurrentSkill({...currentSkill, description: e.target.value})}
                margin="normal"
                placeholder="このスキルについての詳細や得意な分野などを記入してください"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={currentSkill.is_highlighted || false}
                    onChange={e => setCurrentSkill({...currentSkill, is_highlighted: e.target.checked})}
                    color="warning"
                  />
                }
                label="ポートフォリオで強調表示する（特にアピールしたいスキル）"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSkillDialog}>キャンセル</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveSkill}
            disabled={savingSkill}
            startIcon={savingSkill ? <CircularProgress size={16} /> : <SaveIcon />}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* アイコン選択ダイアログ */}
      <Dialog 
        open={iconDialogOpen} 
        onClose={handleCloseIconDialog}
        fullWidth
        maxWidth="md"
        keepMounted={false}
      >
        <DialogTitle>
          アイコンを選択
          <IconButton 
            onClick={handleCloseIconDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="アイコン検索"
              fullWidth
              variant="outlined"
              value={iconSearchQuery}
              onChange={e => setIconSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Tabs
            value={selectedIconCategory}
            onChange={(_, newValue) => setSelectedIconCategory(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab label="すべて" value="all" />
            {ICON_CATEGORIES.map(category => (
              <Tab key={category} label={category} value={category} />
            ))}
          </Tabs>

          <Grid container spacing={1}>
            {filteredIcons
              .filter(icon => 
                iconSearchQuery ? 
                  icon.label.toLowerCase().includes(iconSearchQuery.toLowerCase()) || 
                  icon.id.toLowerCase().includes(iconSearchQuery.toLowerCase()) 
                : true
              )
              .map(icon => (
                <Grid item key={icon.id}>
                  <Card 
                    sx={{ 
                      width: 85, 
                      height: 85, 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                      },
                      ...(selectedIconId === icon.id ? {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                        border: `1px solid ${theme.palette.primary.main}`,
                      } : {})
                    }}
                    onClick={() => handleSelectIcon(icon.id)}
                  >
                    <Box sx={{ p: 1, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <GridIconDisplay iconId={icon.id} />
                    </Box>
                    <Typography variant="caption" sx={{ textAlign: 'center', px: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                      {icon.label}
                    </Typography>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIconDialog}>キャンセル</Button>
          <Button 
            onClick={() => {
              if (selectedIconId) {
                handleSelectIcon(selectedIconId);
              } else {
                console.log('アイコンが選択されていません');
              }
            }}
            color="primary"
            variant="contained"
            disabled={!selectedIconId}
          >
            選択
          </Button>
        </DialogActions>
      </Dialog>

      {/* カテゴリ作成ダイアログ */}
      <Dialog 
        open={categoryDialogOpen} 
        onClose={handleCloseCategoryDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>新しいカテゴリを追加</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="カテゴリ名"
            fullWidth
            value={newCategory.name || ''}
            onChange={e => setNewCategory({...newCategory, name: e.target.value})}
            required
            margin="normal"
          />
          <TextField
            label="表示順序"
            type="number"
            fullWidth
            value={newCategory.order || categories.length + 1}
            onChange={e => setNewCategory({...newCategory, order: parseInt(e.target.value)})}
            InputProps={{ inputProps: { min: 1 } }}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCategoryDialog}>キャンセル</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateCategory}
            disabled={savingCategory}
            startIcon={savingCategory ? <CircularProgress size={16} /> : <SaveIcon />}
          >
            作成
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog 
        open={deleteConfirmOpen} 
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>スキルの削除</DialogTitle>
        <DialogContent>
          <Typography>
            スキル「{skillToDelete?.name}」を削除しますか？この操作は元に戻せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>キャンセル</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDeleteSkill}
            startIcon={<DeleteIcon />}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SkillsEdit; 