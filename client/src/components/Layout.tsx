import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  Avatar,
  Divider,
  Tooltip,
  Badge,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Checkbox,
  ListSubheader,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  TableChart as TableChartIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { logout } from '../features/authSlice';
import { UserRole } from '../types';
import SettingsSection from './SettingsSection';

const drawerWidth = 260;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const [exportEmail, setExportEmail] = React.useState('');
  const [exportSuccess, setExportSuccess] = React.useState(false);
  const [exportError, setExportError] = React.useState('');
  const [selectedUserIds, setSelectedUserIds] = React.useState<number[]>([]);
  const [customEmailBody, setCustomEmailBody] = React.useState('');
  const { user } = useSelector((state: RootState) => state.auth);
  const employees = useSelector((state: RootState) => state.employees.employees);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Employees', icon: <PeopleIcon />, path: '/employees', roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { text: 'Profit & Loss', icon: <MonetizationOnIcon />, path: '/profit-loss' },
    { text: 'P&L Table View', icon: <TableChartIcon />, path: '/profit-loss-table' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  ].filter(item => !item.roles || (user && item.roles.includes(user.role)));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUserToggle = (id: number) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleExport = async () => {
    if (!exportEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(exportEmail)) {
      setExportError('Please enter a valid email address.');
      return;
    }
    if (selectedUserIds.length === 0) {
      setExportError('Please select at least one user to export.');
      return;
    }
    try {
      const response = await fetch('/api/export/user-logins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: exportEmail,
          userIds: selectedUserIds,
          body: customEmailBody,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to export user logins.');
      }
      setExportDialogOpen(false);
      setExportSuccess(true);
      setExportError('');
      setSelectedUserIds([]);
      setCustomEmailBody('');
    } catch (err: any) {
      setExportError(err.message || 'Failed to export user logins.');
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Toolbar />
      <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 1 }}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: theme.palette.primary.main, fontSize: 32 }}>
          {user?.firstName?.[0] || '?'}
        </Avatar>
        <Typography variant="h6" sx={{ mt: 1 }}>{user?.firstName} {user?.lastName}</Typography>
        <Chip label={user?.role} color="secondary" size="small" />
      </Box>
      <Divider sx={{ mb: 1 }} />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => handleNavigation(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={() => setExportDialogOpen(true)}>
          <ListItemIcon><EmailIcon /></ListItemIcon>
          <ListItemText primary="Export User Logins" />
        </ListItem>
        <SettingsSection />
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button fullWidth variant="outlined" color="error" onClick={handleLogout} startIcon={<LogoutIcon />}>Logout</Button>
      </Box>
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export User Logins</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Destination Email Address"
            type="email"
            fullWidth
            value={exportEmail}
            onChange={e => setExportEmail(e.target.value)}
            error={!!exportError}
            helperText={exportError}
          />
          <List
            subheader={<ListSubheader>Select Users to Export</ListSubheader>}
            sx={{ maxHeight: 200, overflow: 'auto', mt: 2, mb: 2 }}
          >
            {employees.map(emp => (
              <ListItem key={emp.id} dense button onClick={() => handleUserToggle(emp.id)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedUserIds.includes(emp.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={`${emp.firstName} ${emp.lastName} (${emp.email})`} />
              </ListItem>
            ))}
          </List>
          <TextField
            label="Custom Email Body"
            multiline
            minRows={4}
            fullWidth
            value={customEmailBody}
            onChange={e => setCustomEmailBody(e.target.value)}
            placeholder="Enter your custom message here..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleExport} variant="contained">Export</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={exportSuccess} autoHideDuration={4000} onClose={() => setExportSuccess(false)}>
        <Alert onClose={() => setExportSuccess(false)} severity="success" sx={{ width: '100%' }}>
          User logins exported and sent to {exportEmail}!
        </Alert>
      </Snackbar>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'primary.main', boxShadow: 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 700 }}>
            Amensys Portal
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
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
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
