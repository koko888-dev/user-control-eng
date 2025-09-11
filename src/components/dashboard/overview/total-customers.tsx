// components/dashboard/overview/total-customers.tsx
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import type { SxProps, Theme } from '@mui/material/styles';
import { UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

export interface TotalCustomersProps {
  diff?: number;
  trend: 'up' | 'down';
  sx?: SxProps<Theme>;
  value: string;
  onLoginClick?: () => void;
}

// helper รวม sx และตัด undefined ออก
const mergeSx = (...styles: Array<SxProps<Theme> | undefined>): SxProps<Theme> =>
  styles.flat().filter(Boolean) as SxProps<Theme>;

export function TotalCustomers({
  diff,
  trend, // ยังรับไว้เพื่อความเข้ากันได้ แม้ไม่ได้ใช้ใน UI นี้
  sx,
  value,
  onLoginClick,
}: TotalCustomersProps): React.JSX.Element {
  return (
    <Card sx={mergeSx({ position: 'relative', minHeight: 180 }, sx)}>
      <CardContent >
        <Stack spacing={2}>
          <Stack
            direction="row"
            sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
            spacing={3}
          >
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                บุคลากร
              </Typography>
              <Typography variant="h5" >
                {value}
              </Typography>
            </Stack>

            <Avatar
              sx={{
                backgroundColor: 'var(--mui-palette-success-main)',
                height: 56,
                width: 56,
                
              }}
            >
              <UsersIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>

      {diff ? (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={onLoginClick}
          sx={{
            position: 'absolute',
            left: 16,
            bottom: 16,
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          เข้าสู่ระบบ
        </Button>
      ) : null}
    </Card>
  );
}
