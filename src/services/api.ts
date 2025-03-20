import axios from 'axios';
import { 
  UserProfile, PublicProfile, Skill, SkillCategory, 
  Project, Education, WorkExperience 
} from '../types/interfaces';

// バックエンドAPIのエンドポイント
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// axiosインスタンスの設定
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// リクエスト時のインターセプター（デバッグ用）
api.interceptors.request.use(
  config => {
    // ローカルストレージからトークンを取得
    const token = localStorage.getItem('token');
    
    // トークンがある場合はAuthorizationヘッダーに追加
    if (token && config.headers) {
      config.headers.Authorization = `Token ${token}`;
    }
    
    console.log(`API リクエスト: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data);
    return config;
  },
  error => {
    console.error('API リクエストエラー:', error);
    return Promise.reject(error);
  }
);

// レスポンスのインターセプター（デバッグ用）
api.interceptors.response.use(
  response => {
    console.log(`API レスポンス: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  error => {
    console.error('API レスポンスエラー:', error.response || error);
    return Promise.reject(error);
  }
);

// 認証関連のデータ型
interface AuthResponse {
  token: string;
  user?: any;
}

// 認証関連の API 呼び出し
export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/api-token-auth/', { username, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/api/register/', userData);
    return response.data;
  },
  getMyProfile: async () => {
    const response = await api.get<UserProfile>('/api/profiles/me/');
    return response.data;
  },
};

// プロフィール関連の API 呼び出し
export const profileAPI = {
  getPublicProfile: async (slug: string) => {
    const response = await api.get<PublicProfile>(`/api/profile/${slug}/`);
    return response.data;
  },
  getMyProfile: async () => {
    const response = await api.get<UserProfile>('/api/profiles/me/');
    return response.data;
  },
  updateProfile: async (profileData: Partial<UserProfile>) => {
    // IDを取り除いた新しいオブジェクトを作成
    const { 
      id, 
      user_details, 
      created_at, 
      updated_at, 
      profile_image, // 画像フィールドを明示的に除外
      skills, // ネストされたリレーション系のフィールドを除外
      projects,
      education, 
      work_experiences,
      ...updatableData 
    } = profileData;
    
    // コンソールに送信データを表示（デバッグ用）
    console.log('Sending profile update data:', updatableData);
    
    if (!id) {
      throw new Error('Profile ID is missing, cannot update profile');
    }
    
    try {
      const response = await api.put<UserProfile>(`/api/profiles/${id}/`, updatableData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error; // エラーを呼び出し元に伝播させる
    }
  },
  uploadProfileImage: async (id: number, imageFile: File) => {
    if (!id) {
      throw new Error('Profile ID is missing, cannot upload image');
    }
    
    const formData = new FormData();
    formData.append('profile_image', imageFile);
    
    try {
      const response = await api.patch<UserProfile>(
        `/api/profiles/${id}/`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  },
  uploadResume: async (id: number, file: File) => {
    if (!id) {
      throw new Error('Profile ID is missing, cannot upload resume');
    }
    
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
      const response = await api.patch<UserProfile>(
        `/api/profiles/${id}/`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  },
};

// スキル関連の API 呼び出し
export const skillAPI = {
  // スキルを取得する
  getSkills: async (): Promise<Skill[]> => {
    try {
      const response = await api.get<Skill[]>('/api/skills/');
      return response.data;
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  },

  // スキルを作成する
  createSkill: async (skillData: Partial<Skill>): Promise<Skill> => {
    try {
      console.log('新しいスキルを作成します:', skillData);
      const response = await api.post<Skill>('/api/skills/', skillData);
      return response.data;
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  },

  // スキルを更新する
  updateSkill: async (skill: Partial<Skill>): Promise<Skill> => {
    if (!skill.id) {
      throw new Error('Skill ID is missing, cannot update skill');
    }
    
    try {
      // リクエストの詳細をログ出力
      console.log(`スキルを更新します ID: ${skill.id}`, skill);
      
      // パスを修正 - 末尾のスラッシュを確認
      const response = await api.patch<Skill>(`/api/skills/${skill.id}/`, skill);
      
      console.log('スキル更新成功:', response.data);
      return response.data;
    } catch (error) {
      console.error('スキル更新エラー:', error);
      throw error;
    }
  },

  // スキルを削除する
  deleteSkill: async (skillId: number): Promise<void> => {
    try {
      await api.delete(`/api/skills/${skillId}/`);
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  },

  // スキルアイコンをアップロードする
  uploadSkillIcon: async (id: number, iconFile: File): Promise<Skill> => {
    try {
      const formData = new FormData();
      formData.append('icon', iconFile);
      
      const response = await api.patch<Skill>(
        `/api/skills/${id}/`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error uploading skill icon:', error);
      throw error;
    }
  },
  
  // カテゴリを取得する
  getCategories: async (): Promise<SkillCategory[]> => {
    try {
      const response = await api.get<SkillCategory[]>('/api/skill-categories/');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  // カテゴリを作成する
  createCategory: async (categoryData: Partial<SkillCategory>): Promise<SkillCategory> => {
    try {
      const response = await api.post<SkillCategory>('/api/skill-categories/', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }
};

// プロジェクト関連の API 呼び出し
export const projectAPI = {
  getProjects: async () => {
    const response = await api.get<Project[]>('/api/projects/');
    return response.data;
  },
  createProject: async (projectData: Partial<Project>) => {
    const response = await api.post<Project>('/api/projects/', projectData);
    return response.data;
  },
  updateProject: async (projectData: Partial<Project>) => {
    const response = await api.patch<Project>(`/api/projects/${projectData.id}/`, projectData);
    return response.data;
  },
  deleteProject: async (id: number) => {
    await api.delete(`/api/projects/${id}/`);
  },
  uploadProjectThumbnail: async (id: number, thumbnailFile: File) => {
    const formData = new FormData();
    formData.append('thumbnail', thumbnailFile);
    
    const response = await api.patch<Project>(
      `/api/projects/${id}/`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};

// 学歴関連の API 呼び出し
export const educationAPI = {
  getEducation: async () => {
    const response = await api.get<Education[]>('/api/education/');
    return response.data;
  },
  createEducation: async (educationData: Partial<Education>) => {
    const response = await api.post<Education>('/api/education/', educationData);
    return response.data;
  },
  updateEducation: async (educationData: Partial<Education>) => {
    const response = await api.patch<Education>(`/api/education/${educationData.id}/`, educationData);
    return response.data;
  },
  deleteEducation: async (id: number) => {
    await api.delete(`/api/education/${id}/`);
  },
};

// 職歴関連の API 呼び出し
export const workExperienceAPI = {
  getWorkExperiences: async () => {
    const response = await api.get<WorkExperience[]>('/api/work-experiences/');
    return response.data;
  },
  createWorkExperience: async (workExpData: Partial<WorkExperience>) => {
    const response = await api.post<WorkExperience>('/api/work-experiences/', workExpData);
    return response.data;
  },
  updateWorkExperience: async (workExpData: Partial<WorkExperience>) => {
    const response = await api.patch<WorkExperience>(`/api/work-experiences/${workExpData.id}/`, workExpData);
    return response.data;
  },
  deleteWorkExperience: async (id: number) => {
    await api.delete(`/api/work-experiences/${id}/`);
  },
};

export default api; 