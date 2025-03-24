export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface SkillCategory {
  id: number;
  name: string;
  order: number;
  skills?: Skill[];
}

export interface Skill {
  id: number;
  name: string;
  category: number;
  category_name?: string;
  level: number;
  experience_years: number;
  icon?: string;
  description?: string;
  order: number;
  is_highlighted?: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  project_url?: string;
  github_url?: string;
  technologies: Skill[];
  start_date?: string;
  end_date?: string;
  is_featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  is_visible: boolean;
  order: number;
}

export interface WorkExperience {
  id: number;
  company?: string;          // 会社名/クライアント名（任意）
  position: string;         // 役職/ポジション
  project_name?: string;    // 案件/プロジェクト名
  start_date: string;       // 開始日
  end_date?: string | null; // 終了日（現在の案件の場合はnull）
  current: boolean;         // 現在の案件かどうか
  team_size?: number;       // チーム人数
  
  // 詳細内容
  details?: {
    project_detail?: string;       // 案件詳細
    process_work_detail?: string;  // 工程毎の作業詳細
  };
  
  // 使用技術詳細
  skills_used_details?: Skill[]; // 使用したスキル（任意）
  os_used?: string[];        // 使用したOS
  languages_used?: string[]; // 使用した言語
  db_used?: string[];        // 使用したDB
  frameworks_used?: string[]; // 使用したフレームワーク
  
  // 担当工程 (設計、開発、テスト、運用など)
  process_roles?: string[];
  
  // 担当工程の詳細情報
  process_details?: {
    requirements?: boolean;      // 要件定義
    basic_design?: boolean;      // 基本設計
    detailed_design?: boolean;   // 詳細設計
    implementation?: boolean;    // 実装
    testing?: boolean;           // テスト
    deployment?: boolean;        // デプロイ
    operation?: boolean;         // 運用・保守
    management?: boolean;        // マネジメント
  };
}

export interface ProcessExperience {
  id: number;
  process_type: string;
  process_type_display: string;
  experience_count: number;
  description: string;
}

export interface UserProfile {
  id: number;
  user_details: User;
  profile_image?: string;
  display_name: string;
  title: string;
  bio?: string;
  specialty?: string;
  location?: string;
  email_public?: string;
  github_username?: string;
  qiita_username?: string;
  twitter_username?: string;
  linkedin_url?: string;
  website_url?: string;
  resume?: string;
  portfolio_slug: string;
  github_access_token?: string;
  github_client_id?: string;
  github_client_secret?: string;
  qiita_access_token?: string;
  created_at: string;
  updated_at: string;
  skills: Skill[];
  projects: Project[];
  education: Education[];
  work_experiences: WorkExperience[];
  process_experiences?: ProcessExperience[];
}

export interface QiitaArticle {
  id: string;
  title: string;
  url: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  stocks_count: number;
  tags: string[];
  is_featured?: boolean;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  featured: boolean;
  topics: string[];
  is_fork: boolean;
  is_private: boolean;
}

export interface PublicProfile {
  display_name: string;
  profile_image?: string;
  title: string;
  bio?: string;
  specialty?: string;
  location?: string;
  email_public?: string;
  github_username?: string;
  qiita_username?: string;
  twitter_username?: string;
  linkedin_url?: string;
  website_url?: string;
  resume?: string;
  skills: SkillCategory[];
  projects: Project[];
  education: Education[];
  work_experiences: WorkExperience[];
  qiita_articles?: QiitaArticle[];
  process_experiences?: ProcessExperience[];
  github_repositories?: GitHubRepository[];
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
} 