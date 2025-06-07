import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  People,
  Comment,
  Favorite,
  Assessment,
  Login,
  Dashboard,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Members', icon: <People />, path: '/members' },
    { text: 'Experiences', icon: <Comment />, path: '/experiences' },
    { text: 'Donations', icon: <Favorite />, path: '/donations' },
    { text: 'Analysis', icon: <Assessment />, path: '/analysis' },
    ...(isAuthenticated
      ? [{ text: 'Admin Dashboard', icon: <Dashboard />, path: '/admin/dashboard' }]
      : [{ text: 'Admin Login', icon: <Login />, path: '/admin/login' }]),
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            LEDO SPORTS ACADEMY
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
        >
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 