"use client";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

export default function BlankTablePage() {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        ตัวอย่าง Table จัดตำแหน่งข้อความ
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">ชิดซ้าย</TableCell>
              <TableCell align="center">กึ่งกลาง</TableCell>
              <TableCell align="right">ชิดขวา</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="left">ข้อความ A</TableCell>
              <TableCell align="center">ข้อความ B</TableCell>
              <TableCell align="right">ข้อความ C</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">ข้อความ D</TableCell>
              <TableCell align="center">ข้อความ E</TableCell>
              <TableCell align="right">ข้อความ F</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
