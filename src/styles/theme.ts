import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: 'Kanit, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    fontSize: 14,
  },
  shape: { borderRadius: 8 },
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: { primary: '#000000' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#FFfffF' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: '#1f2633', color: '#FFFFFF' },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: '#f5f5f5',
            color: '#000000',
            fontWeight: 600,
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            '&:hover': { filter: 'brightness(0.95)' },
            '&:active': { filter: 'brightness(0.9)' },
          },
        },
      ],
    },
  },
});