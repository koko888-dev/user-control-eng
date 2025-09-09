import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
export default function Page(): React.JSX.Element {
    return (
      <Stack spacing={3}>
        <div>
          <Typography variant="h4">ยินดีต้อนรับ</Typography>
        </div>
        <Grid container spacing={3}>
          <Grid
            size={{
              lg: 4,
              md: 6,
              xs: 12,
            }}
          >

          </Grid>
        </Grid>
      </Stack>
    );
  }
  