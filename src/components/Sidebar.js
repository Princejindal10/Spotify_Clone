import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
} from '@mui/material';
import {
  Home,
  Search,
  TrendingUp,
} from '@mui/icons-material';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Search', icon: <Search />, path: '/search' },
    { text: 'World Charts', icon: <TrendingUp />, path: '/world-charts' },
  ];



  return (
    <Paper
      sx={{
        width: 240,
        height: '100%',
        backgroundColor: '#000000',
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
      elevation={0}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: '#1db954', fontWeight: 'bold' }}>
          Spotify 2.0
        </Typography>
      </Box>

      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: '#282828',
                  '&:hover': {
                    backgroundColor: '#383838',
                  },
                },
                '&:hover': {
                  backgroundColor: '#282828',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#b3b3b3', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.9rem',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>


    </Paper>
  );
};

export default Sidebar; 