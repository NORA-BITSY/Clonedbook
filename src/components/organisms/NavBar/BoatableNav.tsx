import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Badge, Menu, MenuItem,
  Avatar, Box, Button, Typography, Divider, Tooltip
} from '@mui/material';
import {
  Anchor, DirectionsBoat, Store, Groups, Build, Map,
  Cloud, Water, People, LocationOn, Notifications,
  Emergency, Dashboard, TrendingUp, AccountCircle,
  Settings, ExitToApp
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { BOATABLE_CONFIG } from '../../../config/boatable.config';

// Mock hooks for now - these would be real in production
const useAuth = () => ({
  user: { name: 'Captain Smith', avatar: '/avatar.jpg' },
  vessels: [],
  logout: () => {}
});

const useAlerts = () => ({
  dashboard: 0,
  maintenance: 2,
  marketplace: 0,
  groups: 1,
  total: 3
});

// Mock components for now - these would be real components
const WeatherWidget = () => (
  <Tooltip title="Current Weather">
    <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: '0.875rem' }}>
      <Cloud sx={{ mr: 0.5, fontSize: 16 }} />
      72°F
    </Box>
  </Tooltip>
);

const TideWidget = () => (
  <Tooltip title="Current Tide">
    <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: '0.875rem' }}>
      <Water sx={{ mr: 0.5, fontSize: 16 }} />
      High 3.2ft
    </Box>
  </Tooltip>
);

const LocationTracker = () => (
  <Tooltip title="Your Location">
    <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: '0.875rem' }}>
      <LocationOn sx={{ mr: 0.5, fontSize: 16 }} />
      Marina Bay
    </Box>
  </Tooltip>
);

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Avatar src={user.avatar} sx={{ width: 32, height: 32 }}>
          <AccountCircle />
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MenuItem onClick={handleClose}>
          <Settings sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleClose(); logout(); }}>
          <ExitToApp sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default function BoatableNav() {
  const router = useRouter();
  const { user, vessels } = useAuth();
  const { alerts } = useAlerts();
  
  const primaryNav = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      badge: alerts.dashboard
    },
    {
      id: 'fleet',
      label: 'My Fleet',
      icon: <DirectionsBoat />,
      path: '/fleet',
      badge: alerts.maintenance
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: <Store />,
      path: '/marketplace',
      badge: alerts.marketplace
    },
    {
      id: 'groups',
      label: 'Groups',
      icon: <Groups />,
      path: '/groups',
      badge: alerts.groups
    },
    {
      id: 'maps',
      label: 'Maps & Routes',
      icon: <Map />,
      path: '/maps'
    },
    {
      id: 'crew',
      label: 'Crew Finder',
      icon: <People />,
      path: '/crew'
    }
  ];

  const toolsNav = [
    {
      id: 'diagnostics',
      label: 'Diagnostics',
      icon: <Build />,
      path: '/tools/diagnostics'
    },
    {
      id: 'pricing',
      label: 'Vessel Pricing',
      icon: <TrendingUp />,
      path: '/tools/pricing'
    },
    {
      id: 'weather',
      label: 'Weather',
      icon: <Cloud />,
      path: '/weather'
    },
    {
      id: 'tides',
      label: 'Tides',
      icon: <Water />,
      path: '/tides'
    }
  ];

  return (
    <AppBar position="fixed" sx={{ bgcolor: BOATABLE_CONFIG.brand.colors.primary }}>
      <Toolbar>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <Anchor sx={{ color: BOATABLE_CONFIG.brand.colors.accent, fontSize: 32, mr: 1 }} />
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            {BOATABLE_CONFIG.brand.name}
          </Typography>
          <Typography variant="caption" sx={{ color: BOATABLE_CONFIG.brand.colors.accent, ml: 1 }}>
            {BOATABLE_CONFIG.brand.tagline}
          </Typography>
        </Box>

        {/* Primary Navigation */}
        <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
          {primaryNav.map(item => (
            <Button
              key={item.id}
              color="inherit"
              startIcon={item.icon}
              onClick={() => router.push(item.path)}
              sx={{
                color: router.pathname.startsWith(item.path) ? BOATABLE_CONFIG.brand.colors.accent : 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  color: BOATABLE_CONFIG.brand.colors.accent
                }
              }}
            >
              <Badge badgeContent={item.badge} color="error">
                {item.label}
              </Badge>
            </Button>
          ))}
        </Box>

        {/* Live Widgets */}
        <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
          <WeatherWidget />
          <TideWidget />
          <LocationTracker />
        </Box>

        {/* Emergency SOS */}
        <Tooltip title="Emergency SOS - Hold for 3 seconds">
          <IconButton
            color="error"
            sx={{
              bgcolor: BOATABLE_CONFIG.brand.colors.danger,
              color: 'white',
              mr: 1,
              '&:hover': { bgcolor: '#d63447' },
              animation: 'pulse 2s infinite'
            }}
          >
            <Emergency />
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <IconButton color="inherit">
          <Badge badgeContent={alerts.total} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        {/* User Menu */}
        <UserMenu />
      </Toolbar>

      {/* Secondary Navigation Bar */}
      <Toolbar variant="dense" sx={{ bgcolor: BOATABLE_CONFIG.brand.colors.secondary, minHeight: 40 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {toolsNav.map(item => (
            <Button
              key={item.id}
              size="small"
              color="inherit"
              startIcon={item.icon}
              onClick={() => router.push(item.path)}
              sx={{ 
                fontSize: '0.875rem',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: BOATABLE_CONFIG.brand.colors.accent
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
        
        {/* Add Emergency Channel Info */}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', color: 'white', fontSize: '0.75rem' }}>
          <Typography variant="caption" sx={{ mr: 1 }}>
            VHF Ch {BOATABLE_CONFIG.emergency.coastGuardChannel}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}