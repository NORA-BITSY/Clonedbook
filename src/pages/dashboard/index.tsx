import React from 'react';
import { 
  Grid, Box, Typography, Card, CardContent, CardHeader, 
  Avatar, IconButton, LinearProgress, Chip, List, ListItem,
  ListItemText, ListItemAvatar, Button, Paper
} from '@mui/material';
import {
  DirectionsBoat, Warning, TrendingUp, Cloud, Water,
  Schedule, Store, Groups, Event, Anchor, Build
} from '@mui/icons-material';
import { BOATABLE_CONFIG } from '../../config/boatable.config';
import BoatableNav from '../../components/organisms/NavBar/BoatableNav';

// Mock data for the dashboard
const mockFleetData = [
  { id: 1, name: 'Sea Explorer', type: 'Sailboat', status: 'Active', location: 'Marina Bay', health: 85 },
  { id: 2, name: 'Wave Rider', type: 'Powerboat', status: 'Maintenance', location: 'Dry Dock A', health: 72 },
  { id: 3, name: 'Ocean Dream', type: 'Yacht', status: 'Active', location: 'Harbor Point', health: 94 }
];

const mockMaintenanceTasks = [
  { id: 1, vessel: 'Sea Explorer', task: 'Engine Oil Change', due: '2024-01-15', priority: 'high' },
  { id: 2, vessel: 'Wave Rider', task: 'Hull Cleaning', due: '2024-01-20', priority: 'medium' },
  { id: 3, vessel: 'Ocean Dream', task: 'Safety Equipment Check', due: '2024-01-25', priority: 'low' }
];

const mockMarketplaceListings = [
  { id: 1, title: '2019 Catalina 425', price: '$285,000', location: 'San Diego, CA' },
  { id: 2, title: 'Marine GPS Chartplotter', price: '$1,200', location: 'Seattle, WA' },
  { id: 3, title: 'Life Jackets (Set of 6)', price: '$150', location: 'Miami, FL' }
];

function DashboardCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: BOATABLE_CONFIG.brand.colors.primary }}>{icon}</Avatar>}
        title={title}
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        {children}
      </CardContent>
    </Card>
  );
}

function FleetOverview() {
  return (
    <DashboardCard title="Fleet Overview" icon={<DirectionsBoat />}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {mockFleetData.length} vessels in your fleet
        </Typography>
      </Box>
      
      {mockFleetData.map((vessel) => (
        <Box key={vessel.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">{vessel.name}</Typography>
            <Chip 
              label={vessel.status} 
              color={vessel.status === 'Active' ? 'success' : 'warning'}
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {vessel.type} • {vessel.location}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>Health:</Typography>
            <LinearProgress 
              variant="determinate" 
              value={vessel.health} 
              sx={{ flexGrow: 1, mr: 1 }}
              color={vessel.health > 80 ? 'success' : vessel.health > 60 ? 'warning' : 'error'}
            />
            <Typography variant="body2">{vessel.health}%</Typography>
          </Box>
        </Box>
      ))}
    </DashboardCard>
  );
}

function WeatherCard() {
  return (
    <DashboardCard title="Weather Conditions" icon={<Cloud />}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h3" sx={{ color: BOATABLE_CONFIG.brand.colors.primary }}>
          72°F
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Partly Cloudy
        </Typography>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">Wind</Typography>
          <Typography variant="body1">12 kts NE</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">Visibility</Typography>
          <Typography variant="body1">10+ nm</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">Waves</Typography>
          <Typography variant="body1">2-3 ft</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">Pressure</Typography>
          <Typography variant="body1">30.12 in</Typography>
        </Grid>
      </Grid>
    </DashboardCard>
  );
}

function TideCard() {
  return (
    <DashboardCard title="Tide Information" icon={<Water />}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ color: BOATABLE_CONFIG.brand.colors.secondary }}>
          3.2 ft
        </Typography>
        <Typography variant="body1" color="text.secondary">
          High Tide Rising
        </Typography>
      </Box>
      
      <Box>
        <Typography variant="body2" color="text.secondary">Next Low: 6:45 PM (0.8 ft)</Typography>
        <Typography variant="body2" color="text.secondary">Next High: 12:30 AM (3.8 ft)</Typography>
      </Box>
    </DashboardCard>
  );
}

function MaintenanceAlerts() {
  return (
    <DashboardCard title="Maintenance Alerts" icon={<Build />}>
      <List dense>
        {mockMaintenanceTasks.map((task) => (
          <ListItem key={task.id}>
            <ListItemAvatar>
              <Avatar sx={{ 
                bgcolor: task.priority === 'high' ? 'error.main' : 
                        task.priority === 'medium' ? 'warning.main' : 'info.main',
                width: 32, 
                height: 32 
              }}>
                <Warning fontSize="small" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={task.task}
              secondary={`${task.vessel} • Due ${task.due}`}
            />
          </ListItem>
        ))}
      </List>
      
      <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
        View All Maintenance
      </Button>
    </DashboardCard>
  );
}

function MarketplaceHighlights() {
  return (
    <DashboardCard title="Marketplace Highlights" icon={<Store />}>
      <Grid container spacing={2}>
        {mockMarketplaceListings.map((listing) => (
          <Grid item xs={12} md={4} key={listing.id}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" noWrap>{listing.title}</Typography>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                {listing.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {listing.location}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
        Browse Marketplace
      </Button>
    </DashboardCard>
  );
}

export default function Dashboard() {
  return (
    <Box sx={{ 
      bgcolor: BOATABLE_CONFIG.brand.colors.background, 
      minHeight: '100vh',
      pt: 12 // Account for fixed navbar
    }}>
      <BoatableNav />
      
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: BOATABLE_CONFIG.brand.colors.primary }}>
            <Anchor sx={{ mr: 1, verticalAlign: 'middle' }} />
            Welcome aboard, Captain Smith
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your maritime command center - monitor your fleet, track weather, and stay connected with the boating community.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Fleet Overview */}
          <Grid item xs={12} lg={8}>
            <FleetOverview />
          </Grid>
          
          {/* Weather & Conditions */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <WeatherCard />
              </Grid>
              <Grid item xs={12}>
                <TideCard />
              </Grid>
            </Grid>
          </Grid>

          {/* Maintenance Alerts */}
          <Grid item xs={12} md={6}>
            <MaintenanceAlerts />
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} md={6}>
            <DashboardCard title="Quick Stats" icon={<TrendingUp />}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">23</Typography>
                    <Typography variant="body2">Days on Water</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">1,247</Typography>
                    <Typography variant="body2">Nautical Miles</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">5.2</Typography>
                    <Typography variant="body2">Avg Speed (kts)</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">$2,340</Typography>
                    <Typography variant="body2">Fuel Saved</Typography>
                  </Box>
                </Grid>
              </Grid>
            </DashboardCard>
          </Grid>

          {/* Marketplace Highlights */}
          <Grid item xs={12}>
            <MarketplaceHighlights />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}