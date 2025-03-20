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
interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearErrors: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// コンテキストプロバイダーの作成
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
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
  const logout = () => {
    // ローカルストレージからトークンを削除
    localStorage.removeItem('token');
    // 状態を初期化
    setState(initialState);
    navigate('/login');
  };

  // エラーをクリアする関数
  const clearErrors = () => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearErrors,
      }}
    >
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