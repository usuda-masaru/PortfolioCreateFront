import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/interfaces';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

// 認証コンテキストの初期状態
const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
};

// コンテキスト作成
export interface AuthContextType {
  currentUser: User | null;
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  error: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearErrors: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// コンテキストプロバイダーの作成
interface AuthProviderProps {
  children: ReactNode;
}

interface RegisterResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const navigate = useNavigate();

  // 初期化時にローカルストレージからトークンを取得
  useEffect(() => {
    const loadStoredAuth = async () => {
      // ローカルストレージからトークンを取得
      const token = localStorage.getItem('token');
      
      if (token) {
        setState(prev => ({
          ...prev,
          loading: true
        }));
        
        try {
          // トークンがある場合はユーザープロフィールを取得
          const profile = await authAPI.getMyProfile();
          
          setState({
            isAuthenticated: true,
            token,
            user: profile.user_details,
            loading: false,
            error: null,
          });
        } catch (error) {
          // エラーの場合はログアウト状態に
          console.error('Failed to validate token:', error);
          localStorage.removeItem('token');
          setState(initialState);
        }
      }
    };
    
    loadStoredAuth();
  }, []);

  // ログイン関数
  const login = async (username: string, password: string) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));
    
    try {
      const data = await authAPI.login(username, password);
      // トークンをローカルストレージに保存
      localStorage.setItem('token', data.token);
      
      // ユーザープロフィールを取得
      const profile = await authAPI.getMyProfile();
      
      setState({
        isAuthenticated: true,
        token: data.token,
        user: profile.user_details,
        loading: false,
        error: null,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.non_field_errors?.[0] || 'ログインに失敗しました。'
      }));
    }
  };

  // ログアウト関数
  const logout = async (): Promise<void> => {
    try {
      // バックエンドのログアウトAPIを呼び出す
      await authAPI.logout();
      
      // localStorage からトークンを削除
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // 状態をリセット
      setState({
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: null,
      });
      
      // ログインページへリダイレクト
      navigate('/login');
    } catch (error) {
      console.error('ログアウト中にエラーが発生しました:', error);
      // エラーが発生しても強制的にログアウト処理を続行
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setState(initialState);
      navigate('/login');
    }
  };

  // エラーをクリアする関数
  const clearErrors = () => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  };

  const register = async (username: string, email: string, password: string) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));
    try {
      // API呼び出しを実装
      console.log('ユーザー登録APIを呼び出し:', { username, email });
      const userData = { username, email, password };
      const response = await authAPI.register(userData) as RegisterResponse;
      console.log('登録レスポンス:', response);
      
      // まずトークンを保存
      localStorage.setItem('token', response.token);
      
      // トークンを設定してからプロフィールを取得
      const profile = await authAPI.getMyProfile();
      
      setState(prev => ({
        ...prev,
        loading: false,
        isAuthenticated: true,
        token: response.token,
        user: profile.user_details
      }));
      
      // 登録成功後にダッシュボードへ遷移
      navigate('/dashboard');
      
      return;
    } catch (error: any) {
      console.error('登録エラー:', error);
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '会員登録に失敗しました。入力内容を確認してください。'
      }));
      
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    setState(prev => ({
      ...prev,
      loading: true
    }));
    try {
      // API呼び出しをここに実装
      // 例: const response = await api.post('/auth/reset-password', { email });
      
      // 開発中は成功したと仮定
      console.log('パスワードリセットリクエスト:', { email });
      setState(prev => ({
        ...prev,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false
      }));
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser: state.user,
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    token: state.token,
    error: state.error,
    loading: state.loading,
    login,
    logout,
    register,
    resetPassword,
    clearErrors
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// カスタムフック
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 