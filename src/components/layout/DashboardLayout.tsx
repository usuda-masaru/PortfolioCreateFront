import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Code as CodeIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Logout as LogoutIcon,
  Article as ArticleIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useAuth } from '../../contexts/AuthContext';
import { profileAPI } from '../../services/api';

const drawerWidth = 240;

interface NavigationItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // プロフィール情報をロードする
  useEffect(() => {
    const fetchProfile = async () => {
      try { 
        const profileData = await profileAPI.getMyProfile();
        console.log("Loaded profile:", profileData);
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      console.log("Current user:", user);
      fetchProfile();
    }
  }, [user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  const menuItems: NavigationItem[] = [
    {
      text: 'ポートフォリオ管理',
      path: '/dashboard',
      icon: <DashboardIcon />,
    },
    {
      text: '基本情報',
      path: '/dashboard/profile',
      icon: <PersonIcon />,
    },
    {
      text: 'スキル',
      path: '/dashboard/skills',
      icon: <CodeIcon />,
    },
    {
      text: '学歴',
      path: '/dashboard/education',
      icon: <SchoolIcon />,
    },
    {
      text: '職務経歴',
      path: '/dashboard/work-experience',
      icon: <WorkIcon />,
    },
    {
      text: '担当工程',
      path: '/dashboard/process',
      icon: <AssignmentIcon />,
    },
    {
      text: 'GitHub連携',
      path: '/dashboard/github',
      icon: <GitHubIcon />,
    },
    {
      text: 'Qiita連携',
      path: '/dashboard/qiita',
      icon: <ArticleIcon />,
    },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        py: 3,
        bgcolor: 'primary.main',
        color: 'primary.contrastText'
      }}>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            letterSpacing: 1
          }}
        >
          Portfolio
        </Typography>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            opacity: 0.8,
            letterSpacing: 3,
            textTransform: 'uppercase'
          }}
        >
          Builder
        </Typography>
      </Box>
      
      <Divider />
      
      <Box sx={{ px: 2, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            alt={user?.username} 
            src="" 
            sx={{ 
              width: 40, 
              height: 40,
              bgcolor: 'primary.main',
              mr: 2
            }}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              {user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              エンジニア
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <List sx={{ flex: 1, px: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  p: 1.5,
                  position: 'relative',
                  transition: 'all 0.2s',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.12)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    }
                  },
                  '&::before': isActive ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 4,
                    height: '70%',
                    bgcolor: 'primary.main',
                    borderRadius: '0 4px 4px 0'
                  } : {},
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40, 
                  color: isActive ? 'primary.main' : 'text.secondary',
                  transition: 'color 0.2s'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? 'medium' : 'regular',
                    fontSize: '0.9rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<PersonIcon />}
          component="a" 
          href={`/portfolio/${profile?.portfolio_slug}`}
          target="_blank"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            py: 1.2,
            justifyContent: 'flex-start',
          }}
        >
          公開プロフィール表示
        </Button>
        
        <Button
          variant="text"
          fullWidth
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ 
            mt: 2,
            borderRadius: 2,
            textTransform: 'none',
            py: 1.2,
            justifyContent: 'flex-start',
          }}
        >
          ログアウト
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'ダッシュボード'}
          </Typography>
          
          {profile?.portfolio_slug && (
            <Button
              variant="contained"
              disableElevation
              component="a"
              href={`/portfolio/${profile.portfolio_slug}`}
              target="_blank"
              sx={{ 
                mr: 2,
                display: { xs: 'none', sm: 'flex' },
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 'medium',
              }}
              startIcon={<PersonIcon />}
            >
              ポートフォリオを表示
            </Button>
          )}
          
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{
              ml: 1,
              bgcolor: 'action.selected',
              '&:hover': {
                bgcolor: 'action.hover',
              }
            }}
          >
            <Avatar 
              alt={user?.username} 
              src="" 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: 'primary.main'
              }} 
            />
          </IconButton>
          
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            keepMounted
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 180,
                borderRadius: 2,
                '& .MuiMenuItem-root': {
                  py: 1.5
                }
              }
            }}
          >
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              navigate('/dashboard/profile');
            }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              プロフィール
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <Typography color="error">ログアウト</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="dashboard menu"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 4, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#F8FAFC', // より明るい背景色
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;