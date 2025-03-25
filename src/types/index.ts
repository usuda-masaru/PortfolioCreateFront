import { User, Skill, Education, WorkExperience } from './interfaces';

export interface UserProfile {
  id: number;
  user: number;
  display_name: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  profile_image: string | null;
  resume: string | null;
  portfolio_slug: string;
  github_username: string | null;
  twitter_username: string | null;
  linkedin_url: string | null;
  github_access_token: string | null;
  github_client_id: string | null;
  github_client_secret: string | null;
  created_at: string;
  updated_at: string;
  user_details?: User;
  skills?: Skill[];
  education?: Education[];
  work_experiences?: WorkExperience[];
} 