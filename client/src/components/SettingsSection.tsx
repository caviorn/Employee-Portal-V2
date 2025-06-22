import React from 'react';
import { ListSubheader, ListItem, ListItemIcon, ListItemText, Switch } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useThemeMode } from '../ThemeContext';

const SettingsSection: React.FC = () => {
  const { mode, toggleMode } = useThemeMode();

  return (
    <>
      <ListSubheader>Settings</ListSubheader>
      <ListItem>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Dark Mode" />
        <Switch
          edge="end"
          checked={mode === 'dark'}
          onChange={toggleMode}
          icon={<Brightness4Icon />}
          checkedIcon={<Brightness4Icon />}
          inputProps={{ 'aria-label': 'toggle dark mode' }}
        />
      </ListItem>
    </>
  );
};

export default SettingsSection;
