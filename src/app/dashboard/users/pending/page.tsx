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
  Pagination,
  CircularProgress,
} from "@mui/material";
import * as Icons from "lucide-react";
import { convertDateTimeFormate, convertDateTimeToNumber } from "@/app/utils";

// ---- Types ----
type UserItem = {
  id: number;
  uid: string;
  nontriAccount: string;
  name: string;
  surname: string;
  kuMail: string;
  updatedAt: string;
  createdAt: string;
};

type UserList = {
  data: UserItem[];
  page: number;
  totalPage: number;
  limit: number;
  totalCount: number;
};

// ---- Sorting helpers ----
type Order = "asc" | "desc";
type OrderBy = keyof Pick<
  UserItem,
  "id" | "nontriAccount" | "name" | "surname" | "kuMail" | "updatedAt"
>;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  // custom for date-time string
  if (orderBy === "updatedAt") {
    const av = convertDateTimeToNumber((a as any)[orderBy]);
    const bv = convertDateTimeToNumber((b as any)[orderBy]);
    if (bv < av) return -1;
    if (bv > av) return 1;
    return 0;
  }
  const av = (a as any)[orderBy];
  const bv = (b as any)[orderBy];

  if (typeof av === "number" && typeof bv === "number") {
    if (bv < av) return -1;
    if (bv > av) return 1;
    return 0;
  }
  // string length sort was the original behavior for some columns;
  // this version sorts lexicographically (usually preferable).
  // If you want length-based sort, swap to av.length / bv.length.
  const aStr = String(av);
  const bStr = String(bv);
  if (bStr < aStr) return -1;
  if (bStr > aStr) return 1;
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilized = array.map((el, index) => [el, index] as const);
  stabilized.sort((a, b) => {
    const cmp = comparator(a[0], b[0]);
    if (cmp !== 0) return cmp;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

export default function PendingApprovalUserIndexPage() {
  // ---- UI states ----
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  // sorting
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<OrderBy>("id");

  // data
  const [users, setUsers] = useState<UserList>({
    data: [],
    page: 1,
    totalPage: 1,
    limit: rowsPerPage,
    totalCount: 0,
  });

  // search
  const [filters, setFilters] = useState({
    nontriAccount: "",
    name: "",
    surname: "",
  });
  const [committedFilters, setCommittedFilters] = useState(filters);

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const fetchpendingApprovalUsers = async () => {
    try {
      // mock data (เหมือนต้นฉบับ)
      const data: UserList = {
        data: [
          {
            id: 1,
            uid: "xxx",
            nontriAccount: "nattapong01",
            name: "ณัฐพงศ์",
            surname: "ศรีสุข",
            kuMail: "nattapong01@example.com",
            updatedAt: "2025-07-03T10:15:23Z",
            createdAt: "2025-07-03T10:15:23Z",
          },
          {
            id: 2,
            uid: "xxx",
            nontriAccount: "arisa_kt",
            name: "อริสา",
            surname: "เกตุแก้ว",
            kuMail: "arisa.kt@example.com",
            updatedAt: "2025-07-03T10:17:45Z",
            createdAt: "2025-07-03T10:15:23Z",
          },
          {
            id: 3,
            uid: "xxx",
            nontriAccount: "beam_rk",
            name: "พีรภัทร",
            surname: "รักดี",
            kuMail: "beam.rk@example.com",
            updatedAt: "2025-07-03T10:18:12Z",
            createdAt: "2025-07-03T10:15:23Z",
          },
          {
            id: 4,
            uid: "xxx",
            nontriAccount: "fonny_89",
            name: "น้ำฝน",
            surname: "ธรรมรักษ์",
            kuMail: "fonny89@example.com",
            updatedAt: "2025-07-03T10:20:08Z",
            createdAt: "2025-07-03T10:15:23Z",
          },
          {
            id: 5,
            uid: "xxx",
            nontriAccount: "meechai_dev",
            name: "มีชัย",
            surname: "สารวัตร",
            kuMail: "meechai.dev@example.com",
            updatedAt: "2025-07-03T10:21:50Z",
            createdAt: "2025-07-03T10:15:23Z",
          },
          {
            id: 6,
            uid: "xxx",
            nontriAccount: "piyada_sky",
            name: "ปิยะดา",
            surname: "เมฆขลา",
            kuMail: "piyada.sky@example.com",
            updatedAt: "2025-07-03T10:22:33Z",
            createdAt: "2025-07-03T10:15:23Z",
          },
          {
            id: 7,
            uid: "xxx",
            nontriAccount: "tonkla_ch",
            name: "ต้นกล้า",
            surname: "ชัยวัฒน์",
            kuMail: "tonkla.ch@example.com",
            updatedAt: "2025-07-03T10:24:01Z",
            createdAt: "2025-07-03T10:15:23Z",
          },
          {
            id: 8,
            uid: "xxx",
            nontriAccount: "noon_lovely",
            name: "นุ่น",
            surname: "รัตนโกสินทร์",
            kuMail: "noon.lovely@example.com",
            updatedAt: "2025-07-03T10:25:14Z",
            createdAt: "2025-07-03T10:15:23Z",
          },
          {
            id: 9,
            uid: "xxx",
            nontriAccount: "krit_sr",
            name: "กฤต",
            surname: "ศิริเวช",
            kuMail: "krit.sr@example.com",
            updatedAt: "2025-07-03T10:27:09Z",
            createdAt: "2025-07-03T10:15:23Z",
          },
          {
            id: 10,
            uid: "xxx",
            nontriAccount: "junezaza",
            name: "จูน",
            surname: "อินทรโชติ",
            kuMail: "junezaza@example.com",
            updatedAt: "2025-07-03T10:28:56Z",
            createdAt: "2025-07-03T10:15:23Z",
          },
        ],
        page: 1,
        totalPage: 1,
        limit: rowsPerPage,
        totalCount: 10,
      };

      setUsers(data);
    } catch (error) {
      console.error("error: ", error);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  // simulate fetching when page or filters change
  useEffect(() => {
    setTableLoading(true);
    fetchpendingApprovalUsers();
  }, [currentPage, committedFilters]);

  // filtering client-side (เหมือน onSearch แล้วค่อย fetch)
  const filtered = useMemo(() => {
    const na = committedFilters.nontriAccount.trim().toLowerCase();
    const nm = committedFilters.name.trim().toLowerCase();
    const sn = committedFilters.surname.trim().toLowerCase();

    return users.data.filter((u) => {
      const okNA = !na || u.nontriAccount.toLowerCase().includes(na);
      const okN = !nm || u.name.toLowerCase().includes(nm);
      const okS = !sn || u.surname.toLowerCase().includes(sn);
      return okNA && okN && okS;
    });
  }, [users.data, committedFilters]);

  const sorted = useMemo(
    () => stableSort(filtered, getComparator(order, orderBy)),
    [filtered, order, orderBy]
  );

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, currentPage]);

  const handleSearch = () => {
    setCommittedFilters(filters);
    setCurrentPage(1);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2} width="100%">
        <Grid container alignItems="center">
          <Grid size={{ xs: 12,md :6}}>
            <Typography
              variant="h6"
              sx={{ mt: 0, mb: 0, fontSize: 18, fontWeight: 600 }}
            >
              ผู้ใช้งานรอพิจารณา
            </Typography>
          </Grid>
        </Grid>

        {/* Search Bar */}
        <Grid container spacing={1} alignItems="center">
          <Grid size={{ xs: 12,md :6}}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                label="บัญชีนนทรี"
                size="small"
                fullWidth
                value={filters.nontriAccount}
                onChange={(e) =>
                  setFilters((s) => ({ ...s, nontriAccount: e.target.value }))
                }
              />
              <TextField
                label="ชื่อ"
                size="small"
                fullWidth
                value={filters.name}
                onChange={(e) =>
                  setFilters((s) => ({ ...s, name: e.target.value }))
                }
              />
              <TextField
                label="นามสกุล"
                size="small"
                fullWidth
                value={filters.surname}
                onChange={(e) =>
                  setFilters((s) => ({ ...s, surname: e.target.value }))
                }
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ whiteSpace: "nowrap" }}
              >
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
                <TableCell align="center" sortDirection={orderBy === "id" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "id"}
                    direction={orderBy === "id" ? order : "asc"}
                    onClick={() => handleRequestSort("id")}
                  >
                    ไอดีผู้ใช้งาน
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "nontriAccount"}
                    direction={orderBy === "nontriAccount" ? order : "asc"}
                    onClick={() => handleRequestSort("nontriAccount")}
                  >
                    บัญชีนนทรี
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleRequestSort("name")}
                  >
                    ชื่อ
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "surname"}
                    direction={orderBy === "surname" ? order : "asc"}
                    onClick={() => handleRequestSort("surname")}
                  >
                    นามสกุล
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "kuMail"}
                    direction={orderBy === "kuMail" ? order : "asc"}
                    onClick={() => handleRequestSort("kuMail")}
                  >
                    ku mail
                  </TableSortLabel>
                </TableCell>

                <TableCell align="center" sortDirection={orderBy === "updatedAt" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "updatedAt"}
                    direction={orderBy === "updatedAt" ? order : "asc"}
                    onClick={() => handleRequestSort("updatedAt")}
                  >
                    ยื่นขอเมื่อ
                  </TableSortLabel>
                </TableCell>

                <TableCell align="center" sx={{ width: { xs: 120, md: "10%" } }}>
                  {/* empty title column for actions */}
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell align="center">{row.id}</TableCell>
                  <TableCell>{row.nontriAccount}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.surname}</TableCell>
                  <TableCell>{row.kuMail}</TableCell>
                  <TableCell align="center">
                    {convertDateTimeFormate(row.updatedAt)}
                  </TableCell>
                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Tooltip title="ยอมรับ">
                        <IconButton size="small" color="success">
                          <Icons.Check size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="ปฏิเสธ">
                        <IconButton size="small" color="error">
                          <Icons.X size={18} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {paginated.length === 0 && !tableLoading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Grid container>
          <Grid size={{ xs: 12}} display="flex" justifyContent="flex-end">
            <Pagination
              page={currentPage}
              onChange={(_, p) => setCurrentPage(p)}
              count={Math.max(1, Math.ceil(filtered.length / rowsPerPage))}
              showFirstButton
              showLastButton
            />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}





