"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Tooltip,
  IconButton,
  TableSortLabel,
  CircularProgress,
} from "@mui/material";
import * as Icons from "lucide-react";
import { useRouter } from "next/navigation";

// ---- Types ----
type SettingList = {
  id: number;
  order: number;
  thaiName: string;
  englishName: string;
  description: string;
  direct: string; // route segment
};

// ---- Sorting helpers ----
type Order = "asc" | "desc";
type OrderBy = keyof Pick<SettingList, "order" | "thaiName" | "englishName" | "description">;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const av = (a as any)[orderBy];
  const bv = (b as any)[orderBy];

  if (typeof av === "number" && typeof bv === "number") {
    if (bv < av) return -1;
    if (bv > av) return 1;
    return 0;
  }
  const aStr = String(av ?? "");
  const bStr = String(bv ?? "");
  if (bStr < aStr) return -1;
  if (bStr > aStr) return 1;
  return 0;
}
function getComparator<Key extends keyof any>(order: Order, orderBy: Key) {
  return order === "desc"
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilized = array.map((el, index) => [el, index] as const);
  stabilized.sort((a, b) => {
    const cmp = comparator(a[0], b[0]);
    if (cmp !== 0) return cmp;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

export default function SettingIndexPage() {
  const router = useRouter();

  const [tableLoading, setTableLoading] = useState(true);
  const [settingList, setSettingList] = useState<SettingList[]>([]);
  const [filters, setFilters] = useState({ thaiName: "", englishName: "" });
  const [committedFilters, setCommittedFilters] = useState(filters);

  // sorting
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<OrderBy>("order");
  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const fetchSetting = async () => {
    try {
      const data: SettingList[] = [

        {
          id: 1,
          order: 1,
          thaiName: "ภาพไอคอนเข้าถึงระบบ",
          englishName: "System access icon image",
          description: "ภาพไอคอนสิทธ์การเข้าถึงระบบอื่นๆ",
          direct: "accessRoleImage",
        },
      ];
      setSettingList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    setTableLoading(true);
    fetchSetting();
  }, []);

  // filter + sort (client-side)
  const filtered = useMemo(() => {
    const tn = committedFilters.thaiName.trim().toLowerCase();
    const en = committedFilters.englishName.trim().toLowerCase();
    return settingList.filter((s) => {
      const okTN = !tn || s.thaiName.toLowerCase().includes(tn);
      const okEN = !en || s.englishName.toLowerCase().includes(en);
      return okTN && okEN;
    });
  }, [settingList, committedFilters]);

  const sorted = useMemo(
    () => stableSort(filtered, getComparator(order, orderBy)),
    [filtered, order, orderBy]
  );

  const handleSearch = () => setCommittedFilters(filters);

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2} width="100%">
        <Grid container>
          <Grid size = {{xs: 12,md :6}}>
            <Typography variant="h6" sx={{ m: 0, fontSize: 18, fontWeight: 600 }}>
              การตั้งค่า
            </Typography>
          </Grid>
        </Grid>

        {/* Search */}
        <Grid container spacing={1}>
          <Grid size = {{xs: 12,md :8}}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                label="ชื่อภาษาไทย"
                size="small"
                fullWidth
                value={filters.thaiName}
                onChange={(e) => setFilters((s) => ({ ...s, thaiName: e.target.value }))}
              />
              <TextField
                label="ชื่อภาษาอังกฤษ"
                size="small"
                fullWidth
                value={filters.englishName}
                onChange={(e) => setFilters((s) => ({ ...s, englishName: e.target.value }))}
              />
              <Button variant="contained" onClick={handleSearch} sx={{ whiteSpace: "nowrap" }}>
                ค้นหา
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Table */}
        <TableContainer component={Paper} sx={{ position: "relative" }}>
          {tableLoading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(255,255,255,0.6)",
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sortDirection={orderBy === "order" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "order"}
                    direction={orderBy === "order" ? order : "asc"}
                    onClick={() => handleRequestSort("order")}
                  >
                    ลำดับ
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "thaiName"}
                    direction={orderBy === "thaiName" ? order : "asc"}
                    onClick={() => handleRequestSort("thaiName")}
                  >
                    ชื่อภาษาไทย
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "englishName"}
                    direction={orderBy === "englishName" ? order : "asc"}
                    onClick={() => handleRequestSort("englishName")}
                  >
                    ชื่อภาษาอังกฤษ
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "description"}
                    direction={orderBy === "description" ? order : "asc"}
                    onClick={() => handleRequestSort("description")}
                  >
                    รายละเอียด
                  </TableSortLabel>
                </TableCell>

                <TableCell align="center" sx={{ width: { xs: 120, md: "12%" } }} />
              </TableRow>
            </TableHead>

            <TableBody>
              {sorted.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell align="center">{row.order}</TableCell>
                  <TableCell>{row.thaiName}</TableCell>
                  <TableCell>{row.englishName}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="จัดการ">
                      <IconButton
                        size="small"
                        onClick={() => {
                          router.push(`/dashboard/settings/accessRoleImage/`);
                        }}
                      >
                        <Icons.TableOfContents size={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {sorted.length === 0 && !tableLoading && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
}

