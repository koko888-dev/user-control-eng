import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: 'Kanit, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    fontSize: 14,
  },
  shape: { borderRadius: 8 },
  palette: {
    mode: 'light',
    primary: { main: '#335c67' }, // ปุ่ม primary (เดิมคือ Submit)
    background: {
      default: '#000000', // พื้นหลังนอกสุด (body)
      paper:   '#FFFFFF', // ใช้กับ Main / Card / Paper
    },
    text: { primary: '#000000' },
  },
  components: {
    // ให้ body เป็น #F2F2F2 เสมอ
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#F2F2F2', color: '#000000' },
      },
    },
    // Header ให้ขาว + เส้นคั่นบาง (ถ้าใช้ AppBar)
    MuiAppBar: {
      defaultProps: { color: 'default', position: 'fixed' },
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#000000',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        },
      },
    },
    // หัวตารางเทาอ่อนเหมือนเดิม
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
    // ปุ่ม primary
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } },
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
