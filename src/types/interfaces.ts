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
  end_date?: string;
  description?: string;
}

export interface WorkExperience {
  id: number;
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  skills_used_details: Skill[];
  process_roles?: string[];
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
  created_at: string;
  updated_at: string;
  skills: Skill[];
  projects: Project[];
  education: Education[];
  work_experiences: WorkExperience[];
  process_experiences?: ProcessExperience[];
}

export interface QiitaArticle {
  id: number;
  title: string;
  url: string;
  likes_count: number;
  published_at: string;
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
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
} 