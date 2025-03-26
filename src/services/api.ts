import axios from 'axios';
import { 
  UserProfile, PublicProfile, Skill, SkillCategory, 
  Education, WorkExperience, QiitaArticle
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
  withCredentials: false
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
    if (error.response && error.response.data) {
      console.log('詳細エラーデータ:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// 認証関連のデータ型
interface AuthResponse {
  token: string;
  user?: {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

// 認証関連の API 呼び出し
export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/api-token-auth/', { username, password });
    return response.data;
  },
  register: async (userData: { username: string; email: string; password: string }): Promise<AuthResponse> => {
    try {
      console.log('Registering user with data:', {
        ...userData,
        password: '[FILTERED]' // パスワードをログに出力しない
      });
      
      // バリデーション
      if (!userData.username?.trim()) {
        throw new Error('ユーザー名は必須です');
      }
      if (!userData.email?.trim()) {
        throw new Error('メールアドレスは必須です');
      }
      if (!userData.password?.trim()) {
        throw new Error('パスワードは必須です');
      }
      
      const response = await api.post<AuthResponse>('/api/register/', userData);
      console.log('Registration successful, response:', {
        id: response.data.user?.id,
        username: response.data.user?.username,
        email: response.data.user?.email,
        token: '[FILTERED]' // トークンをログに出力しない
      });
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // エラーレスポンスの詳細を確認
      if (error.response?.data) {
        const errorData = error.response.data;
        console.error('Registration error details:', errorData);
        
        if (errorData.error) {
          // エラーオブジェクトの場合、各フィールドのエラーメッセージを結合
          if (typeof errorData.error === 'object') {
            const errorMessages = Object.entries(errorData.error)
              .map(([field, message]) => `${field}: ${message}`)
              .join('\n');
            throw new Error(errorMessages);
          } else {
            throw new Error(errorData.error);
          }
        } else if (errorData.detail) {
          throw new Error(errorData.detail);
        } else if (errorData.message) {
          throw new Error(errorData.message);
        }
      }
      
      // その他のエラー
      throw new Error('会員登録に失敗しました。入力内容を確認してください。');
    }
  },
  logout: async () => {
    return { success: true };
    // ログアウト処理を作成する必要あり
  },
  getMyProfile: async () => {
    try {
      console.log("Fetching profile from authAPI.getMyProfile");
      const response = await api.get<UserProfile>('/api/profiles/me/');
      console.log("Profile data received:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in authAPI.getMyProfile:", error);
      throw error;
    }
  },
};

// プロフィール関連の API 呼び出し
export const profileAPI = {
  getPublicProfile: async (slug: string): Promise<PublicProfile> => {
    try {
      console.log('Calling getPublicProfile with slug:', slug);
      const response = await api.get<PublicProfile>(`/api/profiles/${slug}/`);
      console.log('getPublicProfile response:', response.data);
      
      // 開発モードでQiita記事サンプルデータを追加
      if (process.env.NODE_ENV === 'development') {
        console.log('Adding sample Qiita articles in development mode');
        // ローカル開発中はレスポンスにQiita記事サンプルを追加
        response.data.qiita_articles = [
          {
            id: 'abc123',
            title: 'Reactにおけるパフォーマンス最適化テクニック',
            url: 'https://qiita.com/sample/items/abc123',
            created_at: '2023-10-15T09:00:00+09:00',
            updated_at: '2023-10-16T10:30:00+09:00',
            likes_count: 125,
            stocks_count: 78,
            page_views_count: 5680,
            tags: ['React', 'JavaScript', 'パフォーマンス', 'フロントエンド'],
            is_featured: true
          },
          {
            id: 'def456',
            title: 'TypeScriptの型システムを完全に理解する',
            url: 'https://qiita.com/sample/items/def456',
            created_at: '2023-09-20T14:30:00+09:00',
            updated_at: '2023-09-22T11:15:00+09:00',
            likes_count: 210,
            stocks_count: 145,
            page_views_count: 8350,
            tags: ['TypeScript', '型システム', 'JavaScript']
          },
          {
            id: 'ghi789',
            title: 'Next.jsとMaterial UIでモダンなWebアプリを構築する方法',
            url: 'https://qiita.com/sample/items/ghi789',
            created_at: '2023-08-05T16:45:00+09:00',
            updated_at: '2023-08-07T09:20:00+09:00',
            likes_count: 89,
            stocks_count: 53,
            tags: ['Next.js', 'Material UI', 'React', 'Web開発']
          },
          {
            id: 'jkl012',
            title: 'GraphQLとApollo Clientを使った効率的なAPI設計',
            url: 'https://qiita.com/sample/items/jkl012',
            created_at: '2023-07-12T11:20:00+09:00',
            updated_at: '2023-07-14T13:40:00+09:00',
            likes_count: 67,
            stocks_count: 41,
            tags: ['GraphQL', 'Apollo', 'API設計', 'バックエンド']
          }
        ];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching public profile:', error);
      throw error;
    }
  },
  getMyProfile: async () => {
    try {
      console.log("Fetching profile from profileAPI.getMyProfile");
      const response = await api.get<UserProfile>('/api/profiles/me/');
      console.log("Profile data received:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in profileAPI.getMyProfile:", error);
      throw error;
    }
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
      education, 
      work_experiences,
      ...updatableData 
    } = profileData;
    
    // コンソールに送信データを表示（デバッグ用）
    console.log('Profile update request details:', {
      originalData: profileData,
      processedData: updatableData,
      endpoint: `/api/profiles/${id}/`,
      method: 'PATCH',
      requiredFields: {
        title: updatableData.title,
        display_name: updatableData.display_name
      }
    });
    
    if (!id) {
      throw new Error('Profile ID is missing, cannot update profile');
    }
    
    try {
      // PUTの代わりにPATCHを使用（部分更新）
      const response = await api.patch<UserProfile>(`/api/profiles/${id}/`, updatableData);
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error instanceof Error) {
        if ('response' in error && error.response) {
          const axiosError = error as any;
          console.error('API error response:', {
            status: axiosError.response?.status,
            data: axiosError.response?.data,
            headers: axiosError.response?.headers
          });
        }
      }
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
      console.log('スキル作成リクエスト:', skillData);
      
      // アイコンIDの正規化
      const formattedData = { ...skillData };
      if (formattedData.icon) {
        let iconId = formattedData.icon;
        if (typeof iconId === 'string') {
          // URLからアイコンIDを抽出
          if (iconId.startsWith('http')) {
            iconId = decodeURIComponent(iconId.split('/').pop() || '');
          }
          // Siプレフィックスを削除して小文字に変換
          iconId = iconId.replace(/^Si/, '').toLowerCase();
        }
        formattedData.icon_id = iconId;
        delete formattedData.icon;
      }

      console.log('正規化されたアイコンID:', formattedData.icon_id);
      console.log('スキル作成リクエストの詳細:', {
        url: `${API_BASE_URL}/api/skills/`,
        data: formattedData
      });

      const response = await api.post<Skill>('/api/skills/', formattedData, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('スキル作成成功:', response.data);
      return response.data;
    } catch (error) {
      console.error('スキル作成エラー:', error);
      if (error instanceof Error) {
        if ('response' in error && error.response) {
          const axiosError = error as any;
          const errorMessage = axiosError.response?.data?.detail || 
                             axiosError.response?.data?.message || 
                             axiosError.response?.data?.error || 
                             'スキルの作成に失敗しました。';
          
          if (axiosError.response?.status === 400 && 
              axiosError.response?.data?.detail?.includes('UNIQUE constraint failed')) {
            throw new Error('このスキル名は既に登録されています。別の名前を入力してください。');
          }
          
          throw new Error(errorMessage);
        }
      }
      throw error;
    }
  },

  // スキルを更新する
  updateSkill: async (skill: Partial<Skill>): Promise<Skill> => {
    if (!skill.id) {
      throw new Error('Skill ID is missing, cannot update skill');
    }
    
    try {
      // スキルデータを整形
      const skillDataFormatted = { ...skill };
      
      // アイコンIDを正しく処理
      if (skillDataFormatted.icon !== undefined) {
        if (typeof skillDataFormatted.icon === 'string') {
          // URLやSiプレフィックスを削除してアイコンIDを抽出
          let iconId = skillDataFormatted.icon;
          
          // URLの場合は最後のパスセグメントを取得
          if (iconId.startsWith('http')) {
            // URLをデコードしてから最後のパスセグメントを取得
            iconId = decodeURIComponent(iconId).split('/').pop() || '';
          }
          
          // Siプレフィックスを削除
          if (iconId.startsWith('Si')) {
            iconId = iconId.substring(2).toLowerCase();
          }
          
          console.log('正規化したアイコンID:', iconId);
          skillDataFormatted.icon_id = iconId;
        }
        delete skillDataFormatted.icon;
      }
      
      // リクエストの詳細をログ出力
      console.log(`スキルを更新します ID: ${skillDataFormatted.id}`, skillDataFormatted);
      
      // パスを修正 - 末尾のスラッシュを確認
      const response = await api.patch<Skill>(`/api/skills/${skillDataFormatted.id}/`, skillDataFormatted);
      
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
  },

  // カテゴリを削除する
  deleteCategory: async (categoryId: number): Promise<void> => {
    try {
      await api.delete(`/api/skill-categories/${categoryId}/`);
    } catch (error) {
      console.error('カテゴリの削除エラー:', error);
      if (error instanceof Error) {
        if ('response' in error && error.response) {
          const axiosError = error as any;
          const errorMessage = axiosError.response?.data?.error || 
                             axiosError.response?.data?.detail || 
                             'カテゴリの削除に失敗しました。';
          throw new Error(errorMessage);
        }
      }
      throw error;
    }
  }
};

// 学歴関連の API 呼び出し
export const educationAPI = {
  // 学歴一覧取得
  getEducation: async (): Promise<Education[]> => {
    try {
      const response = await api.get<Education[]>('/api/education/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch education data', error);
      throw error;
    }
  },

  // 学歴作成
  createEducation: async (data: Partial<Education>): Promise<Education> => {
    try {
      const response = await api.post<Education>('/api/education/', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create education', error);
      throw error;
    }
  },

  // 学歴更新
  updateEducation: async (data: Partial<Education>): Promise<Education> => {
    try {
      if (!data.id) {
        throw new Error('Education ID is required for update');
      }
      const response = await api.put<Education>(`/api/education/${data.id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update education', error);
      throw error;
    }
  },

  // 学歴削除
  deleteEducation: async (id: number): Promise<void> => {
    try {
      await api.delete(`/api/education/${id}/`);
    } catch (error) {
      console.error('Failed to delete education', error);
      throw error;
    }
  },

  // 学歴の順序更新
  updateEducationOrder: async (ids: number[]): Promise<void> => {
    try {
      await api.post('/api/education/update_order/', { ids });
    } catch (error) {
      console.error('Failed to update education order', error);
      throw error;
    }
  },
};

// 職務経歴関連のAPI呼び出し
export const workExperienceAPI = {
  // 職務経歴一覧を取得する
  getWorkExperiences: async (): Promise<WorkExperience[]> => {
    try {
      const response = await api.get<WorkExperience[]>('/api/work-experiences/');
      return response.data;
    } catch (error) {
      console.error('職務経歴の取得エラー:', error);
      throw error;
    }
  },

  // 職務経歴を作成する
  createWorkExperience: async (data: Partial<WorkExperience>): Promise<WorkExperience> => {
    try {
      console.log('新しい職務経歴を作成します:', data);
      const response = await api.post<WorkExperience>('/api/work-experiences/', data);
      return response.data;
    } catch (error: any) {
      console.error('職務経歴の作成エラー:', error);
      // エラーレスポンスの詳細を表示
      if (error.response && error.response.data) {
        console.error('エラーレスポンスの詳細:', error.response.data);
      }
      throw error;
    }
  },

  // 職務経歴を更新する
  updateWorkExperience: async (data: Partial<WorkExperience>): Promise<WorkExperience> => {
    if (!data.id) {
      throw new Error('職務経歴IDがありません。更新できません。');
    }
    
    try {
      console.log(`職務経歴を更新します ID: ${data.id}`, data);
      const response = await api.patch<WorkExperience>(`/api/work-experiences/${data.id}/`, data);
      console.log('職務経歴更新成功:', response.data);
      return response.data;
    } catch (error) {
      console.error('職務経歴の更新エラー:', error);
      throw error;
    }
  },

  // 職務経歴を削除する
  deleteWorkExperience: async (id: number): Promise<void> => {
    try {
      await api.delete(`/api/work-experiences/${id}/`);
    } catch (error) {
      console.error('職務経歴の削除エラー:', error);
      throw error;
    }
  },
  
  // 職務経歴の並び順を更新する
  updateOrder: async (orderedIds: number[]): Promise<void> => {
    try {
      await api.post('/api/work-experiences/update-order/', { order: orderedIds });
    } catch (error) {
      console.error('職務経歴の並び順更新エラー:', error);
      throw error;
    }
  }
};

// GitHub連携関連のAPI呼び出し
export const githubAPI = {
  // GitHubリポジトリを取得する
  getRepositories: async (): Promise<any[]> => {
    try {
      const response = await api.get<any[]>('/api/github-repositories/');
      return response.data;
    } catch (error: any) {
      console.error('GitHubリポジトリの取得エラー:', error);
      throw error;
    }
  },
  
  // GitHubリポジトリを同期する
  syncRepositories: async (): Promise<any> => {
    try {
      const response = await api.post<any>('/api/github-repositories/sync/');
      return response.data;
    } catch (error: any) {
      console.error('GitHubリポジトリの同期エラー:', error);
      throw error;
    }
  },
  
  // リポジトリの特集フラグを切り替える
  toggleFeatured: async (repoId: number): Promise<any> => {
    try {
      const response = await api.patch<any>(`/api/github-repositories/${repoId}/toggle_featured/`);
      return response.data;
    } catch (error: any) {
      console.error('リポジトリの特集フラグ切り替えエラー:', error);
      throw error;
    }
  },
  
  // GitHub連携認証URLを取得する
  getOAuthUrl: (userId?: number, clientId?: string): string => {
    // 引数で受け取ったClient IDを使用するか、なければ環境変数から取得
    const githubClientId = clientId || process.env.REACT_APP_GITHUB_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${API_BASE_URL}/api/oauth/github/callback/`);
    const scope = encodeURIComponent('repo user');
    // ユーザーIDをstate引数として使用（ない場合はランダム文字列）
    const state = userId ? userId.toString() : Math.random().toString(36).substring(2, 15);
    
    // ステートをローカルストレージに保存（コールバック時に検証）
    localStorage.setItem('github_oauth_state', state);
    
    return `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  }
};

// Qiita連携関連のAPI呼び出し
export const qiitaAPI = {
  // Qiita記事一覧を取得する
  getArticles: async (): Promise<QiitaArticle[]> => {
    try {
      const response = await api.get<QiitaArticle[]>('/api/qiita-articles/');
      return response.data;
    } catch (error) {
      console.error('Qiita記事の取得エラー:', error);
      throw error;
    }
  },
  
  // Qiita記事を同期する
  syncArticles: async (): Promise<any> => {
    try {
      const response = await api.post<any>('/api/qiita-articles/sync/');
      return response.data;
    } catch (error) {
      console.error('Qiita記事の同期エラー:', error);
      throw error;
    }
  },
  
  // 記事の特集フラグを切り替える
  toggleFeatured: async (articleId: string): Promise<any> => {
    try {
      const response = await api.patch<any>(`/api/qiita-articles/${articleId}/toggle_featured/`);
      return response.data;
    } catch (error) {
      console.error('記事の特集フラグ切り替えエラー:', error);
      throw error;
    }
  },
  
  // アクセストークンを更新する
  updateAccessToken: async (accessToken: string): Promise<any> => {
    try {
      // まず現在のプロファイルを取得
      const profileResponse = await api.get<UserProfile>('/api/profiles/me/');
      const profile = profileResponse.data;
      
      if (!profile.id) {
        throw new Error('プロファイルIDが取得できませんでした');
      }
      
      // プロファイルIDを使って更新
      const response = await api.patch<any>(`/api/profiles/${profile.id}/`, { qiita_access_token: accessToken });
      return response.data;
    } catch (error) {
      console.error('Qiitaアクセストークン更新エラー:', error);
      throw error;
    }
  }
};

export default api; 