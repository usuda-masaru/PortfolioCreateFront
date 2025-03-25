import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';

// コンポーネント
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import ProfileEdit from './pages/dashboard/ProfileEdit';
import SkillsEdit from './pages/dashboard/SkillsEdit';
import ProcessEdit from './pages/dashboard/ProcessEdit';
import WorkExperienceEdit from './pages/dashboard/WorkExperienceEdit';
import EducationEdit from './pages/dashboard/EducationEdit';
import GitHubManagement from './pages/dashboard/github/GitHubManagement';
import QiitaEdit from './pages/dashboard/QiitaEdit';
import Portfolio from './pages/public/Portfolio';

// カスタムテーマ
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

// 認証ルート
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* 認証ルート */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* ダッシュボードルート */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<ProfileEdit />} />
              <Route path="skills" element={<SkillsEdit />} />
              <Route path="process" element={<ProcessEdit />} />
              <Route path="work-experience" element={<WorkExperienceEdit />} />
              <Route path="education" element={<EducationEdit />} />
              <Route path="github" element={<GitHubManagement />} />
              <Route path="qiita" element={<QiitaEdit />} />
              {/* 他のダッシュボードルートはここに追加 */}
            </Route>
            
            {/* 公開ポートフォリオルート */}
            <Route path="/portfolio/:portfolio_slug" element={<Portfolio />} />
            
            {/* リダイレクト */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
