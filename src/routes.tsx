import React from 'react';
import { RouteObject } from 'react-router-dom';
// import { AuthRequired } from './components/auth/AuthRequired';
import ProfileEdit from './pages/dashboard/ProfileEdit';
import SkillsEdit from './pages/dashboard/SkillsEdit';
import WorkExperienceEdit from './pages/dashboard/WorkExperienceEdit';
import ProcessEdit from './pages/dashboard/ProcessEdit';
import EducationEdit from './pages/dashboard/EducationEdit';
import QiitaEdit from './pages/dashboard/QiitaEdit';
import Dashboard from './pages/dashboard/Dashboard';
// import SkillEdit from './pages/dashboard/SkillEdit';
import Login from './pages/auth/Login';
// import Profile from './pages/profile/Profile';

// ダッシュボード内のルート
const routes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      {
        path: 'profile',
        element: <ProfileEdit />,
      },
      {
        path: 'skills',
        element: <SkillsEdit />,
      },
      {
        path: 'work-experience',
        element: <WorkExperienceEdit />,
      },
      {
        path: 'process',
        element: <ProcessEdit />,
      },
      {
        path: 'education',
        element: <EducationEdit />,
      },
      {
        path: 'qiita',
        element: <QiitaEdit />,
      },
    ],
  },
  {
    path: '/dashboard/skills',
    element: <SkillsEdit />,
  },
  {
    path: '/dashboard/work-experience',
    element: <WorkExperienceEdit />,
  },
  {
    path: '/dashboard/process',
    element: <ProcessEdit />,
  },
  {
    path: '/dashboard/education',
    element: <EducationEdit />,
  },
  {
    path: '/dashboard/qiita',
    element: <QiitaEdit />,
  },
  // ... existing code ...
]; 