import { createTheme } from '@mui/material/styles';

export const getBaseTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#ff9800', // orange
      contrastText: '#fff',
    },
    secondary: {
      main: '#212121', // dark gray/black
      contrastText: '#fff',
    },
    background: {
      default: mode === 'dark' ? '#181818' : '#f4f6f8',
      paper: mode === 'dark' ? '#232323' : '#fff',
    },
    text: {
      primary: mode === 'dark' ? '#fff' : '#181818',
      secondary: '#ff9800',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: mode === 'dark' ? '#232323' : '#fff',
          color: mode === 'dark' ? '#fff' : '#181818',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: mode === 'dark' ? '#181818' : '#fff',
          color: '#ff9800',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'dark' ? '#232323' : '#fff',
          color: mode === 'dark' ? '#fff' : '#181818',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#ff9800',
            color: '#fff',
          },
        },
      },
    },
  },
});

// Default export for legacy usage (dark mode)
const theme = getBaseTheme('dark');
export default theme;
