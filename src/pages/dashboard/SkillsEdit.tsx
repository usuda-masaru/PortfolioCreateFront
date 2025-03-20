import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  CircularProgress, Alert, Divider, IconButton, MenuItem,
  Select, FormControl, InputLabel, Card, CardContent, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormHelperText, Chip, Tooltip, Avatar, SelectChangeEvent,
  InputAdornment, Tab, Tabs, Modal, TextField as MuiTextField,
  Checkbox, FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import EmojiSymbolsIcon from '@mui/icons-material/EmojiSymbols';
import StarIcon from '@mui/icons-material/Star';
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
import { skillAPI } from '../../services/api';
import { API_BASE_URL } from '../../services/api';
import { Skill, SkillCategory } from '../../types/interfaces';
import api from '../../services/api'; // 既にimportされている場合は無視

// インターフェース定義を拡張して、画像URLを含めるようにします
interface IconDefinition {
  id: string;
  label: string;
  component?: IconType;
  category: string;
  imageUrl?: string; // 画像URLを追加
}

// アイコンカテゴリ
const ICON_CATEGORIES = [
  'フロントエンド', 'バックエンド', 'プログラミング言語', 'データベース', 
  'ツール', 'ホスティング', 'デザイン', 'OS/プラットフォーム', 'モバイル', 'AWS'
];

// 利用可能なアイコンの定義
const AVAILABLE_ICONS: IconDefinition[] = [
  // フロントエンド
  { id: 'SiReact', label: 'React', component: SiReact, category: 'フロントエンド' },
  { id: 'SiAngular', label: 'Angular', component: SiAngular, category: 'フロントエンド' },
  { id: 'SiVuedotjs', label: 'Vue.js', component: SiVuedotjs, category: 'フロントエンド' },
  { id: 'SiSvelte', label: 'Svelte', component: SiSvelte, category: 'フロントエンド' },
  { id: 'SiNextdotjs', label: 'Next.js', component: SiNextdotjs, category: 'フロントエンド' },
  { id: 'SiHtml5', label: 'HTML5', component: SiHtml5, category: 'フロントエンド' },
  { id: 'SiCss3', label: 'CSS3', component: SiCss3, category: 'フロントエンド' },
  { id: 'SiTailwindcss', label: 'Tailwind CSS', component: SiTailwindcss, category: 'フロントエンド' },
  { id: 'SiBootstrap', label: 'Bootstrap', component: SiBootstrap, category: 'フロントエンド' },
  { id: 'SiMui', label: 'Material UI', component: SiMui, category: 'フロントエンド' },
  { id: 'SiChakraui', label: 'Chakra UI', component: SiChakraui, category: 'フロントエンド' },
  
  // バックエンド
  { id: 'SiNodedotjs', label: 'Node.js', component: SiNodedotjs, category: 'バックエンド' },
  { id: 'SiExpress', label: 'Express', component: SiExpress, category: 'バックエンド' },
  { id: 'SiNestjs', label: 'NestJS', component: SiNestjs, category: 'バックエンド' },
  { id: 'SiDjango', label: 'Django', component: SiDjango, category: 'バックエンド' },
  { id: 'SiFlask', label: 'Flask', component: SiFlask, category: 'バックエンド' },
  { id: 'SiRubyonrails', label: 'Ruby on Rails', component: SiRubyonrails, category: 'バックエンド' },
  
  // プログラミング言語
  { id: 'SiJavascript', label: 'JavaScript', component: SiJavascript, category: 'プログラミング言語' },
  { id: 'SiTypescript', label: 'TypeScript', component: SiTypescript, category: 'プログラミング言語' },
  { id: 'SiPython', label: 'Python', component: SiPython, category: 'プログラミング言語' },
  { id: 'SiJavaIcon', label: 'Java', component: SiJavaIcon, category: 'プログラミング言語' },
  { id: 'SiPhp', label: 'PHP', component: SiPhp, category: 'プログラミング言語' },
  { id: 'SiRuby', label: 'Ruby', component: SiRuby, category: 'プログラミング言語' },
  { id: 'SiGo', label: 'Go', component: SiGo, category: 'プログラミング言語' },
  { id: 'SiRust', label: 'Rust', component: SiRust, category: 'プログラミング言語' },
  { id: 'SiCplusplus', label: 'C++', component: SiCplusplus, category: 'プログラミング言語' },
  { id: 'SiC', label: 'C', component: SiC, category: 'プログラミング言語' },
  
  // データベース
  { id: 'SiPostgresql', label: 'PostgreSQL', component: SiPostgresql, category: 'データベース' },
  { id: 'SiMysql', label: 'MySQL', component: SiMysql, category: 'データベース' },
  { id: 'SiMongodb', label: 'MongoDB', component: SiMongodb, category: 'データベース' },
  { id: 'SiRedis', label: 'Redis', component: SiRedis, category: 'データベース' },
  { id: 'SiFirebase', label: 'Firebase', component: SiFirebase, category: 'データベース' },
  { id: 'SiSqlite', label: 'SQLite', component: SiSqlite, category: 'データベース' },
  
  // ツール
  { id: 'SiGit', label: 'Git', component: SiGit, category: 'ツール' },
  { id: 'SiGithub', label: 'GitHub', component: SiGithub, category: 'ツール' },
  { id: 'SiGitlab', label: 'GitLab', component: SiGitlab, category: 'ツール' },
  { id: 'SiBitbucket', label: 'Bitbucket', component: SiBitbucket, category: 'ツール' },
  { id: 'SiJira', label: 'Jira', component: SiJira, category: 'ツール' },
  { id: 'SiTrello', label: 'Trello', component: SiTrello, category: 'ツール' },
  { id: 'SiNotion', label: 'Notion', component: SiNotion, category: 'ツール' },
  { id: 'SiConfluence', label: 'Confluence', component: SiConfluence, category: 'ツール' },
  
  // ホスティング
  { id: 'SiDocker', label: 'Docker', component: SiDocker, category: 'ホスティング' },
  { id: 'SiKubernetes', label: 'Kubernetes', component: SiKubernetes, category: 'ホスティング' },
  { id: 'SiGooglecloud', label: 'Google Cloud', component: SiGooglecloud, category: 'ホスティング' },
  { id: 'FaMicrosoft', label: 'Microsoft', component: FaMicrosoft, category: 'ホスティング' },
  { id: 'FaServer', label: 'サーバー', component: FaServer, category: 'ホスティング' },
  { id: 'FaDatabase', label: 'データベース', component: FaDatabase, category: 'ホスティング' },
  { id: 'FaCloud', label: 'クラウド', component: FaCloud, category: 'ホスティング' },
  { id: 'SiVercel', label: 'Vercel', component: SiVercel, category: 'ホスティング' },
  { id: 'SiNetlify', label: 'Netlify', component: SiNetlify, category: 'ホスティング' },
  
  // AWS
  { id: 'SiAmazon', label: 'AWS', component: SiAmazon, category: 'AWS' },
  { id: 'FaAws', label: 'AWS', component: FaAws, category: 'AWS' },
  { id: 'FaAmazon', label: 'Amazon', component: FaAmazon, category: 'AWS' },
  { id: 'aws_s3', label: 'Amazon S3', imageUrl: '/aws-icons/s3.svg', category: 'AWS' },
  { id: 'aws_ec2', label: 'Amazon EC2', imageUrl: '/aws-icons/ec2.svg', category: 'AWS' },
  { id: 'aws_rds', label: 'Amazon RDS', imageUrl: '/aws-icons/rds.svg', category: 'AWS' },
  { id: 'aws_lambda', label: 'AWS Lambda', imageUrl: '/aws-icons/lambda.svg', category: 'AWS' },
  { id: 'aws_dynamodb', label: 'Amazon DynamoDB', imageUrl: '/aws-icons/dynamodb.svg', category: 'AWS' },
  { id: 'aws_cloudformation', label: 'AWS CloudFormation', imageUrl: '/aws-icons/cloudformation.svg', category: 'AWS' },
  { id: 'aws_ecs', label: 'Amazon ECS', imageUrl: '/aws-icons/ecs.svg', category: 'AWS' },
  { id: 'aws_eks', label: 'Amazon EKS', imageUrl: '/aws-icons/eks.svg', category: 'AWS' },
  { id: 'aws_cloudwatch', label: 'Amazon CloudWatch', imageUrl: '/aws-icons/cloudwatch.svg', category: 'AWS' },
  { id: 'aws_route53', label: 'Amazon Route 53', imageUrl: '/aws-icons/route53.svg', category: 'AWS' },
  { id: 'aws_vpc', label: 'Amazon VPC', imageUrl: '/aws-icons/vpc.svg', category: 'AWS' },
  { id: 'aws_iam', label: 'AWS IAM', imageUrl: '/aws-icons/iam.svg', category: 'AWS' },
  
  // デザイン
  { id: 'SiFigma', label: 'Figma', component: SiFigma, category: 'デザイン' },
  { id: 'SiAdobexd', label: 'Adobe XD', component: SiAdobexd, category: 'デザイン' },
  { id: 'SiSketch', label: 'Sketch', component: SiSketch, category: 'デザイン' },
  
  // OS/プラットフォーム
  { id: 'SiLinux', label: 'Linux', component: SiLinux, category: 'OS/プラットフォーム' },
  { id: 'SiUbuntu', label: 'Ubuntu', component: SiUbuntu, category: 'OS/プラットフォーム' },
  { id: 'SiDebian', label: 'Debian', component: SiDebian, category: 'OS/プラットフォーム' },
  { id: 'SiCentos', label: 'CentOS', component: SiCentos, category: 'OS/プラットフォーム' },
  { id: 'SiRedhat', label: 'Red Hat', component: SiRedhat, category: 'OS/プラットフォーム' },
  { id: 'FaWindows', label: 'Windows', component: FaWindows, category: 'OS/プラットフォーム' },
  { id: 'SiApple', label: 'macOS', component: SiApple, category: 'OS/プラットフォーム' },
  
  // モバイル
  { id: 'SiAndroid', label: 'Android', component: SiAndroid, category: 'モバイル' },
  { id: 'SiIos', label: 'iOS', component: SiIos, category: 'モバイル' },
  { id: 'SiReactNativeIcon', label: 'React Native', component: SiReactNativeIcon, category: 'モバイル' },
  { id: 'SiFlutter', label: 'Flutter', component: SiFlutter, category: 'モバイル' },
];

// IconDisplayコンポーネントを更新して画像URLをサポート
const IconDisplay: React.FC<{ iconId: string; size?: number }> = ({ iconId, size = 24 }) => {
  // URLからアイコンIDを抽出する関数
  const extractIconIdFromUrl = (url: string): string => {
    // URLの場合は最後の部分を抽出
    if (url.includes('/media/')) {
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      console.log(`[IconDisplay] URLからアイコンIDを抽出: ${url} → ${lastPart}`);
      return lastPart;
    }
    return url;
  };

  // 実際に使用するアイコンID
  const effectiveIconId = iconId.includes('/media/') ? extractIconIdFromUrl(iconId) : iconId;
  
  // 通常のアイコン定義を検索
  const iconDef = AVAILABLE_ICONS.find(i => i.id === effectiveIconId);
  
  // コンポーネントがマウントされたときにコンソールにログを出力
  useEffect(() => {
    if (iconId.includes('/media/')) {
      console.log(`[IconDisplay] URL形式のアイコン: ${iconId} → 抽出ID: ${effectiveIconId}, 定義あり=${!!iconDef}`);
    }
    
    if (iconDef) {
      console.log(`[IconDisplay] アイコン表示: id=${iconId}, 定義あり=true`, {
        id: iconDef.id,
        label: iconDef.label,
        hasComponent: !!iconDef.component,
        imageUrl: iconDef.imageUrl || 'なし'
      });
    } else {
      console.log(`[IconDisplay] アイコン表示: id=${iconId}, 定義あり=false`, 'アイコン定義なし');
    }
  }, [iconId, iconDef, effectiveIconId]);

  // URLの場合でも、アイコンIDが抽出できていればコンポーネントを使う
  if (iconDef) {
    if (iconDef.imageUrl) {
      console.log(`[IconDisplay] 画像URLを使用: ${iconDef.imageUrl}`);
      
      // 画像のプレビューを実際に試す
      return (
        <div style={{ position: 'relative', width: size, height: size }}>
          <img 
            src={iconDef.imageUrl} 
            alt={iconDef.label} 
            width={size} 
            height={size} 
            style={{ objectFit: 'contain' }}
            onError={(e) => {
              console.error(`[IconDisplay] 画像の読み込みに失敗: ${iconDef.imageUrl}`, e);
              e.currentTarget.style.display = 'none';
            }}
          />
          <div style={{
            display: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            fontSize: size * 0.5,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {iconDef.label.substring(0, 2)}
          </div>
        </div>
      );
    }
    
    if (iconDef.component) {
      console.log(`[IconDisplay] コンポーネントを使用: ${iconDef.id}`);
      try {
        return React.createElement(
          iconDef.component as React.ComponentType<{ size?: number }>,
          { size }
        );
      } catch (error) {
        console.error(`[IconDisplay] コンポーネントの描画エラー: ${iconDef.id}`, error);
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
            {iconDef.id.substring(0, 2)}
          </div>
        );
      }
    }
    
    console.warn(`[IconDisplay] 警告: アイコン「${iconDef.label}」は画像URLもコンポーネントも持っていません`);
    return (
      <div style={{ 
        width: size, 
        height: size, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#ffffdd',
        borderRadius: '4px',
        fontSize: size * 0.4,
        color: '#666600'
      }}>
        {iconDef.label.substring(0, 2)}
      </div>
    );
  }

  // URLの場合は直接画像として表示
  if (iconId.startsWith('http://') || iconId.startsWith('https://') || iconId.includes('/media/')) {
    console.log(`[IconDisplay] URL形式のアイコンを直接表示: ${iconId}`);
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <img 
          src={iconId} 
          alt="スキルアイコン" 
          width={size} 
          height={size} 
          style={{ objectFit: 'contain' }}
          onError={(e) => {
            console.error(`[IconDisplay] 画像の読み込みに失敗: ${iconId}`, e);
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.parentElement?.querySelector('.icon-fallback');
            if (fallback) {
              (fallback as HTMLElement).style.display = 'flex';
            }
          }}
        />
        <div 
          className="icon-fallback"
          style={{
            display: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            fontSize: size * 0.5,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {effectiveIconId.substring(0, 2)}
        </div>
      </div>
    );
  }
  
  // iconDefがなく、URLでもない場合のフォールバック（常に何かを返す必要がある）
  console.warn(`[IconDisplay] 警告: アイコンID「${iconId}」に対応する定義が見つかりません`);
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
      {iconId.substring(0, 2)}
    </div>
  );
};

// GridIconDisplayコンポーネントも同様に更新
const GridIconDisplay: React.FC<{ iconId: string }> = ({ iconId }) => {
  // URLからアイコンIDを抽出する関数
  const extractIconIdFromUrl = (url: string): string => {
    // URLの場合は最後の部分を抽出
    if (url.includes('/media/')) {
      const parts = url.split('/');
      return parts[parts.length - 1];
    }
    return url;
  };

  // 実際に使用するアイコンID
  const effectiveIconId = iconId.includes('/media/') ? extractIconIdFromUrl(iconId) : iconId;
  
  // アイコン定義を検索
  const iconDef = AVAILABLE_ICONS.find(i => i.id === effectiveIconId);
  
  if (iconDef) {
    if (iconDef.imageUrl) {
      return (
        <div style={{ position: 'relative', width: 32, height: 32 }}>
          <img 
            src={iconDef.imageUrl} 
            alt={iconDef.label} 
            width={32} 
            height={32} 
            style={{ objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
            }}
          />
          <div style={{
            display: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 32,
            height: 32,
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            fontSize: 16,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {iconDef.label.substring(0, 2)}
          </div>
        </div>
      );
    }
    
    if (iconDef.component) {
      try {
        return React.createElement(
          iconDef.component as React.ComponentType<{ size?: number }>,
          { size: 32 }
        );
      } catch (error) {
        return (
          <div style={{ 
            width: 32, 
            height: 32, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#ffeeee',
            borderRadius: '4px',
            fontSize: 16,
            color: 'red'
          }}>
            {iconDef.id.substring(0, 2)}
          </div>
        );
      }
    }
    
    return (
      <div style={{ 
        width: 32, 
        height: 32, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#ffffdd',
        borderRadius: '4px',
        fontSize: 14,
        color: '#666600'
      }}>
        {iconDef.label.substring(0, 2)}
      </div>
    );
  }

  // URLの場合は直接画像として表示
  if (iconId.startsWith('http://') || iconId.startsWith('https://') || iconId.includes('/media/')) {
    return (
      <div style={{ position: 'relative', width: 32, height: 32 }}>
        <img 
          src={iconId} 
          alt="スキルアイコン" 
          width={32} 
          height={32} 
          style={{ objectFit: 'contain' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.parentElement?.querySelector('.grid-icon-fallback');
            if (fallback) {
              (fallback as HTMLElement).style.display = 'flex';
            }
          }}
        />
        <div 
          className="grid-icon-fallback"
          style={{
            display: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 32,
            height: 32,
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            fontSize: 16,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {effectiveIconId.substring(0, 2)}
        </div>
      </div>
    );
  }
  
  // iconDefがなく、URLでもない場合のフォールバック
  return (
    <div style={{ 
      width: 32, 
      height: 32, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      fontSize: 16
    }}>
      {iconId.substring(0, 2)}
    </div>
  );
};

const SkillsEdit: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  
  // アイコン選択関連
  const [iconSelectOpen, setIconSelectOpen] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [iconSearchTerm, setIconSearchTerm] = useState('');
  const [iconTabValue, setIconTabValue] = useState(0);
  
  // カテゴリ作成関連
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<{name: string, order: number}>({name: '', order: 0});
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);
  
  // スキルデータがロードされた後、アイコン情報をログに出力する
  useEffect(() => {
    if (skills.length > 0) {
      console.log('--- スキルアイコン情報のデバッグ出力 ---');
      skills.forEach(skill => {
        if (skill.icon) {
          const iconDef = AVAILABLE_ICONS.find(i => i.id === skill.icon);
          console.log(`スキル「${skill.name}」のアイコン:`, {
            id: skill.icon,
            定義あり: !!iconDef,
            label: iconDef?.label,
            component: !!iconDef?.component,
            imageUrl: iconDef?.imageUrl
          });
        }
      });
    }
  }, [skills]);

  // アイコンダイアログを開く
  const handleOpenIconSelect = () => {
    setIconSelectOpen(true);
    setIconSearchTerm('');
    setIconTabValue(0);
    // 現在のアイコンを選択状態にする
    setSelectedIconId(editingSkill?.icon || null);
  };

  // アイコンダイアログを閉じる
  const handleCloseIconSelect = () => {
    setIconSelectOpen(false);
  };

  // アイコンを選択する
  const handleSelectIcon = (iconId: string) => {
    // 編集中のスキルデータを直接更新して、UIに即座に反映
    if (editingSkill) {
      const selectedIcon = AVAILABLE_ICONS.find(i => i.id === iconId);
      
      // 新しいスキルオブジェクトを作成して、現在の編集中スキルを更新
      const updatedSkill = {
        ...editingSkill,
        icon: iconId
      };
      
      // スキル名も自動更新（既存の名前があっても更新）
      if (selectedIcon) {
        updatedSkill.name = selectedIcon.label;
      }
      
      // ステートを更新
      setEditingSkill(updatedSkill);
      setSelectedIconId(iconId);
      
      // 重要: 検証エラーをクリアする（アイコン選択時にエラーが出ないように）
      setValidationErrors({
        ...validationErrors,
        name: '',
        icon: ''
      });
    }
    
    // ダイアログを閉じる
    handleCloseIconSelect();
  };

  // アイコンタブを切り替える
  const handleIconTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setIconTabValue(newValue);
  };

  // アイコン検索の結果
  const getFilteredIcons = () => {
    const searchTerm = iconSearchTerm.toLowerCase();
    
    let filteredIcons = AVAILABLE_ICONS;
    
    // タブでフィルター
    if (iconTabValue > 0) {
      const category = ICON_CATEGORIES[iconTabValue - 1];
      filteredIcons = filteredIcons.filter(icon => icon.category === category);
    }
    
    // 検索語でフィルター
    if (searchTerm) {
      filteredIcons = filteredIcons.filter(icon => 
        icon.label.toLowerCase().includes(searchTerm) || 
        icon.id.toLowerCase().includes(searchTerm)
      );
    }
    
    return filteredIcons;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriesData, skillsData] = await Promise.all([
        skillAPI.getCategories(),
        skillAPI.getSkills()
      ]);
      
      if (!categoriesData || categoriesData.length === 0) {
        setError('カテゴリが存在しません。デフォルトカテゴリを表示します。');
        
        // デフォルトカテゴリ（仮表示用）
        const defaultCategories = [
          { id: -1, name: 'フロントエンド', order: 1 },
          { id: -2, name: 'バックエンド', order: 2 },
          { id: -3, name: 'インフラ', order: 3 },
          { id: -4, name: 'その他', order: 4 }
        ];
        
        setCategories(defaultCategories);
      } else {
        setCategories(categoriesData);
      }
      
      setSkills(skillsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('データの取得に失敗しました');
      
      // エラー時もデフォルトカテゴリを表示
      const defaultCategories = [
        { id: -1, name: 'フロントエンド', order: 1 },
        { id: -2, name: 'バックエンド', order: 2 },
        { id: -3, name: 'インフラ', order: 3 },
        { id: -4, name: 'その他', order: 4 }
      ];
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  // カテゴリダイアログを開く
  const handleOpenCategoryDialog = () => {
    setNewCategory({
      name: '',
      order: categories.length + 1
    });
    setCategoryError('');
    setCategoryDialogOpen(true);
  };

  // カテゴリダイアログを閉じる
  const handleCloseCategoryDialog = () => {
    setCategoryDialogOpen(false);
  };

  // カテゴリを作成する
  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      setCategoryError('カテゴリ名は必須です');
      return;
    }

    setSavingCategory(true);
    try {
      const createdCategory = await skillAPI.createCategory(newCategory);
      setCategories([...categories, createdCategory]);
      setSuccess(`カテゴリ「${createdCategory.name}」を作成しました`);
      handleCloseCategoryDialog();
    } catch (error) {
      console.error('Error creating category:', error);
      setCategoryError('カテゴリの作成に失敗しました');
    } finally {
      setSavingCategory(false);
    }
  };

  const validateSkill = (skill: Partial<Skill>): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!skill.name?.trim()) {
      errors.name = 'スキル名は必須です';
    }
    
    if (!skill.category) {
      errors.category = 'カテゴリーは必須です';
    }
    
    // アイコンも必須項目にする
    if (!skill.icon) {
      errors.icon = 'アイコンを選択してください';
    }
    
    if (skill.level === undefined || skill.level < 1 || skill.level > 5) {
      errors.level = 'レベルは1〜5の範囲で指定してください';
    }
    
    if (skill.experience_years === undefined || skill.experience_years < 0) {
      errors.experience_years = '経験年数は0以上の数値で指定してください';
    }
    
    return errors;
  };

  const handleOpenDialog = (skill?: Skill) => {
    if (skill) {
      setEditingSkill({...skill});
    } else {
      setEditingSkill({
        name: '',
        category: categories[0]?.id,
        level: 3,
        experience_years: 1,
        description: '',
        order: skills.length + 1
      });
    }
    setValidationErrors({});
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSkill(null);
  };

  const handleDialogChange = (field: keyof Skill, value: any) => {
    if (!editingSkill) return;
    
    setEditingSkill({
      ...editingSkill,
      [field]: value
    });
    
    // 該当フィールドのバリデーションエラーをクリア
    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: ''
      });
    }
  };

  // アイコンをクリックしたときの処理
  const handleIconClick = () => {
    // 常にアイコン選択ダイアログを開く
    handleOpenIconSelect();
  };

  const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingSkill?.id || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploadingIcon(true);
    
    try {
      const updatedSkill = await skillAPI.uploadSkillIcon(editingSkill.id, file);
      setEditingSkill({
        ...editingSkill,
        icon: updatedSkill.icon
      });
      setSuccess('アイコンをアップロードしました');
    } catch (error) {
      console.error('Error uploading icon:', error);
      setError('アイコンのアップロードに失敗しました');
    } finally {
      setUploadingIcon(false);
    }
  };

  const handleSaveSkill = async () => {
    if (!editingSkill) return;
    
    // スキルデータのディープコピーを作成して送信用データを準備
    const skillToSave = {...editingSkill};
    const iconId = skillToSave.icon; // アイコンIDを保存
    
    // 必須フィールドの確認
    const errors = validateSkill(skillToSave);
    if (Object.keys(errors).length > 0) {
      console.error('バリデーションエラー:', errors);
      setValidationErrors(errors);
      return;
    }
    
    // 送信前にデータを整形
    // iconフィールドを送信データから除外（APIエラーの原因）
    const { icon, ...skillDataWithoutIcon } = skillToSave;
    
    const formattedSkill: Partial<Skill> = {
      ...skillDataWithoutIcon,
      // 空文字列は空文字列のまま送信（バックエンドの期待する形式）
      name: skillToSave.name?.trim() || '',
      description: skillToSave.description?.trim() || '',
      // categoryとlevelは数値であることを確認
      category: typeof skillToSave.category === 'number' ? skillToSave.category : parseInt(String(skillToSave.category), 10),
      level: typeof skillToSave.level === 'number' ? skillToSave.level : parseInt(String(skillToSave.level), 10),
      experience_years: typeof skillToSave.experience_years === 'number' ? skillToSave.experience_years : parseFloat(String(skillToSave.experience_years))
    };
    
    console.log('送信するスキルデータ:', formattedSkill);
    console.log('アイコンID（別途処理）:', iconId);
    
    setSaving(true);
    try {
      let savedSkill: Skill;
      if (formattedSkill.id) {
        // 既存スキルの更新
        savedSkill = await skillAPI.updateSkill(formattedSkill);
        console.log('スキルを更新しました:', savedSkill);
        
        // アイコンIDを別途更新
        if (iconId && savedSkill.id) {
          try {
            const updatedSkill = await updateIconField(savedSkill.id, iconId);
            if (updatedSkill) {
              savedSkill = updatedSkill;
            }
          } catch (iconError) {
            console.error('アイコン更新エラー:', iconError);
          }
        }
        
        // 既存のスキルリストを更新
        setSkills(skills.map(s => s.id === savedSkill.id ? savedSkill : s));
      } else {
        // 新規スキルの作成
        savedSkill = await skillAPI.createSkill(formattedSkill);
        console.log('新しいスキルを作成しました:', savedSkill);
        
        // アイコンIDを別途更新
        if (iconId && savedSkill.id) {
          try {
            const updatedSkill = await updateIconField(savedSkill.id, iconId);
            if (updatedSkill) {
              savedSkill = updatedSkill;
            }
          } catch (iconError) {
            console.error('アイコン更新エラー:', iconError);
          }
        }
        
        // 新しいスキルをリストに追加
        setSkills([...skills, savedSkill]);
      }
      setSuccess(`スキル「${savedSkill.name}」を保存しました`);
      handleCloseDialog();
      
      // スキル保存後にすぐにデータを再取得して最新の状態を表示
      fetchData();
    } catch (error: any) {
      console.error('Error saving skill:', error);
      // エラーレスポンスの詳細を表示
      const errorDetail = error.response?.data 
        ? JSON.stringify(error.response.data) 
        : error.message || 'スキルの保存に失敗しました';
      
      console.error('詳細エラー:', errorDetail);
      setError(`スキルの保存に失敗しました: ${errorDetail}`);
    } finally {
      setSaving(false);
    }
  };
  
  // アイコンフィールドを別途更新する関数
  const updateIconField = async (skillId: number, iconId: string): Promise<Skill | null> => {
    try {
      console.log(`スキル ${skillId} のアイコンを ${iconId} に更新します`);
      
      // APIエンドポイントのURLを修正 - '/api/'プレフィックスを追加
      const response = await fetch(`${API_BASE_URL}/api/skills/${skillId}/set_icon/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ icon_id: iconId })
      });
      
      if (!response.ok) {
        throw new Error(`アイコン更新エラー: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('アイコン更新成功:', data);
      return data as Skill;
    } catch (error) {
      console.error('アイコン更新に失敗しました:', error);
      return null;
    }
  };

  const openDeleteConfirm = (skill: Skill) => {
    setSkillToDelete(skill);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteSkill = async () => {
    if (!skillToDelete) return;
    
    try {
      await skillAPI.deleteSkill(skillToDelete.id);
      // スキルリストから削除
      setSkills(skills.filter(s => s.id !== skillToDelete.id));
      setSuccess(`スキル「${skillToDelete.name}」を削除しました`);
      setDeleteConfirmOpen(false);
      setSkillToDelete(null);
    } catch (error) {
      console.error('Error deleting skill:', error);
      // エラー内容の詳細を表示
      const errorMessage = error instanceof Error 
        ? `スキルの削除に失敗しました: ${error.message}` 
        : 'スキルの削除に失敗しました';
      setError(errorMessage);
      // ダイアログは閉じない - 再試行できるようにする
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>スキル管理</Typography>
      <Divider sx={{ mb: 4 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<CategoryIcon />}
          onClick={handleOpenCategoryDialog}
        >
          カテゴリを追加
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          新しいスキルを追加
        </Button>
      </Box>

      {categories.length === 0 ? (
        <Alert severity="warning" sx={{ my: 4 }}>
          カテゴリが存在しません。「カテゴリを追加」ボタンをクリックして新しいカテゴリを作成してください。
        </Alert>
      ) : (
        categories.map(category => (
          <Card key={category.id} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{category.name}</Typography>
              <Divider sx={{ mb: 2 }} />
              
              {skills.filter(skill => skill.category === category.id).length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', my: 2 }}>
                  このカテゴリーにはスキルがありません
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {skills
                    .filter(skill => skill.category === category.id)
                    .map((skill) => (
                      <Grid item xs={12} sm={6} md={4} key={skill.id}>
                        <Card 
                          variant="outlined" 
                          sx={{ 
                            height: '100%',
                            position: 'relative',
                            borderColor: skill.is_highlighted ? 'warning.main' : 'inherit',
                            boxShadow: skill.is_highlighted ? '0 0 8px rgba(255,152,0,0.4)' : 'inherit',
                          }}
                        >
                          {skill.is_highlighted && (
                            <Box 
                              sx={{ 
                                position: 'absolute', 
                                top: -10, 
                                right: -10, 
                                backgroundColor: 'warning.main',
                                color: 'warning.contrastText',
                                borderRadius: '50%',
                                width: 28,
                                height: 28,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 1,
                                zIndex: 1
                              }}
                            >
                              <StarIcon fontSize="small" />
                            </Box>
                          )}
                          <CardContent sx={{ pt: 2, pb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              {skill.icon ? (
                                <>
                                  <Box sx={{ mr: 1, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconDisplay iconId={skill.icon} size={32} />
                                  </Box>
                                </>
                              ) : (
                                <Box 
                                  sx={{ 
                                    width: 32, 
                                    height: 32, 
                                    mr: 1, 
                                    bgcolor: 'grey.200', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                  }}
                                >
                                  <Typography variant="caption" color="text.secondary">
                                    {skill.name.substring(0, 1).toUpperCase()}
                                  </Typography>
                                </Box>
                              )}
                              <Typography
                                variant="subtitle1"
                                component="div"
                                sx={{
                                  fontWeight: skill.is_highlighted ? 'bold' : 'normal',
                                  color: skill.is_highlighted ? 'warning.dark' : 'inherit'
                                }}
                              >
                                {skill.name}
                                {skill.is_highlighted && (
                                  <Tooltip title="ポートフォリオで強調表示されます">
                                    <StarIcon 
                                      fontSize="small" 
                                      color="warning" 
                                      sx={{ ml: 0.5, verticalAlign: 'middle', fontSize: '0.9rem' }} 
                                    />
                                  </Tooltip>
                                )}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ mb: 1 }}>
                              <Chip 
                                size="small" 
                                label={`レベル: ${skill.level}`} 
                                color={skill.level >= 4 ? "primary" : "default"}
                                sx={{ mr: 1, mb: 1 }} 
                              />
                              <Chip 
                                size="small" 
                                label={`${skill.experience_years}年`} 
                                color="secondary"
                                sx={{ mb: 1 }} 
                              />
                            </Box>
                            
                            {skill.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {skill.description}
                              </Typography>
                            )}
                            
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                              <Tooltip title="編集">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleOpenDialog(skill)}
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="削除">
                                <IconButton 
                                  size="small" 
                                  color="error" 
                                  onClick={() => openDeleteConfirm(skill)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        ))
      )}

      {/* スキル編集ダイアログ */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSkill?.id ? 'スキルを編集' : '新しいスキルを追加'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="スキル名"
                fullWidth
                value={editingSkill?.name || ''}
                onChange={(e) => handleDialogChange('name', e.target.value)}
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                required
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" error={!!validationErrors.category}>
                <InputLabel id="category-label">カテゴリー</InputLabel>
                <Select
                  labelId="category-label"
                  value={editingSkill?.category || ''}
                  onChange={(e: SelectChangeEvent<number>) => handleDialogChange('category', e.target.value)}
                  label="カテゴリー"
                  required
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.category && (
                  <FormHelperText>{validationErrors.category}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" error={!!validationErrors.level}>
                <InputLabel id="level-label">レベル</InputLabel>
                <Select
                  labelId="level-label"
                  value={editingSkill?.level || ''}
                  onChange={(e: SelectChangeEvent<number>) => handleDialogChange('level', e.target.value)}
                  label="レベル"
                  required
                >
                  {[1, 2, 3, 4, 5].map(level => (
                    <MenuItem key={level} value={level}>
                      {level} - {getLevelText(level)}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.level && (
                  <FormHelperText>{validationErrors.level}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="経験年数"
                type="number"
                fullWidth
                value={editingSkill?.experience_years || 0}
                onChange={(e) => handleDialogChange('experience_years', parseFloat(e.target.value))}
                InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                error={!!validationErrors.experience_years}
                helperText={validationErrors.experience_years}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ mr: 2 }}>アイコン</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EmojiSymbolsIcon />}
                    onClick={handleOpenIconSelect}
                    color={validationErrors.icon ? "error" : "primary"}
                  >
                    アイコンを選択
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleIconChange}
                  />
                </Box>
                {validationErrors.icon && (
                  <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                    {validationErrors.icon}
                  </Typography>
                )}
                {editingSkill?.icon ? (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '1px solid #eee',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'scale(1.1)',
                      },
                    }}
                    onClick={handleOpenIconSelect}
                    >
                      <IconDisplay iconId={editingSkill.icon} />
                    </Box>
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      {AVAILABLE_ICONS.find(i => i.id === editingSkill.icon)?.label || editingSkill.icon}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="caption" color={validationErrors.icon ? "error" : "text.secondary"} sx={{ mt: 1, display: 'block' }}>
                    アイコンが設定されていません。「アイコンを選択」ボタンをクリックして選んでください。
                  </Typography>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="説明"
                fullWidth
                multiline
                rows={3}
                value={editingSkill?.description || ''}
                onChange={(e) => handleDialogChange('description', e.target.value)}
                margin="normal"
                placeholder="このスキルについての詳細や得意な分野などを記入してください"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={editingSkill?.is_highlighted || false}
                    onChange={(e) => handleDialogChange('is_highlighted', e.target.checked)}
                    color="warning"
                    icon={<StarIcon />}
                    checkedIcon={<StarIcon />}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight="medium">ポートフォリオで強調表示する</Typography>
                    <Tooltip title="チェックすると、ポートフォリオ画面でこのスキルが目立つように表示されます。特にアピールしたいスキルに設定してください。">
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>(アピールポイントとして表示)</Typography>
                    </Tooltip>
                  </Box>
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveSkill}
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} /> : '保存'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* アイコン選択ダイアログ */}
      <Dialog
        open={iconSelectOpen}
        onClose={handleCloseIconSelect}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>アイコンを選択</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="アイコンを検索..."
              value={iconSearchTerm}
              onChange={(e) => setIconSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={iconTabValue} 
              onChange={handleIconTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="すべて" />
              {ICON_CATEGORIES.map((category, index) => (
                <Tab key={category} label={category} />
              ))}
            </Tabs>
          </Box>
          
          <Box sx={{ mt: 2, maxHeight: '400px', overflow: 'auto' }}>
            <Grid container spacing={1}>
              {getFilteredIcons().map((icon) => (
                <Grid item xs={4} sm={3} md={2} key={icon.id}>
                  <Box
                    sx={{
                      p: 1.5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      border: '1px solid',
                      borderColor: selectedIconId === icon.id ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: selectedIconId === icon.id ? 'primary.light' : 'background.paper',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover',
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={() => handleSelectIcon(icon.id)}
                  >
                    <GridIconDisplay iconId={icon.id} />
                    <Typography 
                      variant="caption" 
                      align="center" 
                      sx={{ 
                        mt: 1, 
                        fontSize: '0.7rem', 
                        color: selectedIconId === icon.id ? 'primary.main' : 'text.primary',
                        fontWeight: selectedIconId === icon.id ? 'bold' : 'normal'
                      }}
                    >
                      {icon.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
              
              {getFilteredIcons().length === 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                    該当するアイコンが見つかりませんでした
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIconSelect}>キャンセル</Button>
        </DialogActions>
      </Dialog>

      {/* カテゴリ作成ダイアログ */}
      <Dialog open={categoryDialogOpen} onClose={handleCloseCategoryDialog} maxWidth="xs" fullWidth>
        <DialogTitle>新しいカテゴリを追加</DialogTitle>
        <DialogContent dividers>
          {categoryError && (
            <Alert severity="error" sx={{ mb: 2 }}>{categoryError}</Alert>
          )}
          <TextField
            label="カテゴリ名"
            fullWidth
            value={newCategory.name}
            onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
            required
            margin="normal"
          />
          <TextField
            label="表示順序"
            type="number"
            fullWidth
            value={newCategory.order}
            onChange={(e) => setNewCategory({...newCategory, order: parseInt(e.target.value)})}
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
          >
            {savingCategory ? <CircularProgress size={24} /> : '作成'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>スキルの削除</DialogTitle>
        <DialogContent>
          <Typography>
            スキル「{skillToDelete?.name}」を削除しますか？この操作は元に戻せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>キャンセル</Button>
          <Button variant="contained" color="error" onClick={handleDeleteSkill}>削除</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SkillsEdit; 