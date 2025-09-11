"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";
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
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { convertDateTimeFormate, convertDateTimeToNumber } from "@/app/utils";

// ---------- Types ----------
type System = {
  id: number;
  thaiName: string;
  englishName: string;
  shortName: string;
  description: string;
  visibility: "show" | "hide";
  updatedAt: string; // ISO
  createdAt: string; // ISO
};

type SystemList = {
  data: System[];
  page: number;
  totalPage: number;
  limit: number;
  totalCount: number;
};

type Order = "asc" | "desc";
type OrderBy = keyof Pick<System, "id" | "thaiName" | "englishName" | "shortName" | "updatedAt">;

// ---------- Component ----------
export default function SystemIndexPage() {
  const { push } = useRouter();

  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [systems, setSystems] = useState<SystemList>({
    data: [],
    page: 0,
    totalPage: 1,
    limit: 0,
    totalCount: 0,
  });

  const [currentSearch, setCurrentSearch] = useState({
    thaiName: "",
    shortName: "",
  });

  // sorting
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<OrderBy>("id");

  // confirm dialog for switch
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<null | {
    id: number;
    nextVisibility: "show" | "hide";
  }>(null);

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = useMemo(() => {
    const data = [...systems.data];

    const getValue = (row: System, key: OrderBy) => {
      if (key === "updatedAt") return convertDateTimeToNumber(row.updatedAt);
      if (typeof row[key] === "string") return (row[key] as string).toLowerCase();
      return row[key] as number;
    };

    data.sort((a, b) => {
      const av = getValue(a, orderBy);
      const bv = getValue(b, orderBy);
      if (av < bv) return order === "asc" ? -1 : 1;
      if (av > bv) return order === "asc" ? 1 : -1;
      return 0;
    });

    // filter by search (client-side เหมือนเดิม)
    return data.filter((r) => {
      const matchThai = currentSearch.thaiName
        ? r.thaiName.toLowerCase().includes(currentSearch.thaiName.toLowerCase())
        : true;
      const matchShort = currentSearch.shortName
        ? r.shortName.toLowerCase().includes(currentSearch.shortName.toLowerCase())
        : true;
      return matchThai && matchShort;
    });
  }, [systems.data, order, orderBy, currentSearch]);

  // page size fixed = 10 (ให้เหมือนของเดิม)
  const pageSize = 10;
  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage]);

  const fetchSystem = async () => {
    try {
      const data: SystemList = {
        data: [
          {
            id: 1,
            thaiName: "ระบบบุคลากร",
            englishName: "Personnel system",
            shortName: "PN",
            description: "xxxx",
            visibility: "show",
            updatedAt: "2025-07-03T10:15:23Z",
            createdAt: "2025-07-03T10:15:23Z",
          },
          {
            id: 2,
            thaiName: "ระบบลา",
            englishName: "Leave system",
            shortName: "L",
            description: "xxxx",
            visibility: "hide",
            updatedAt: "2025-07-03T10:17:45Z",
            createdAt: "2025-07-03T10:15:23Z",
          },
          {
            id: 3,
            thaiName: "ระบบใช้รถ",
            englishName: "Vehicle use system",
            shortName: "VC",
            description: "xxxx",
            visibility: "hide",
            updatedAt: "2025-07-03T10:18:12Z",
            createdAt: "2025-07-03T10:15:23Z",
          },
        ],
        page: 1,
        totalPage: 1,
        limit: 10,
        totalCount: 3,
      };
      setSystems(data);
      setLoading(false);
      setTableLoading(false);
    } catch (error) {
      console.log("error: ", error);
      setLoading(false);
      setTableLoading(false);
    }
  };

  const onSearch = () => {
    setCurrentSearch((prev) => ({
      ...prev,
      // ค่ามาจาก TextField ด้านล่าง (ใช้ uncontrolled refs ก็ได้ แต่เราอ่านจาก DOM ผ่าน id ชัดๆ)
      thaiName: (document.getElementById("thaiName") as HTMLInputElement)?.value || "",
      shortName: (document.getElementById("shortName") as HTMLInputElement)?.value || "",
    }));
    setCurrentPage(1);
  };

  useEffect(() => {
    setTableLoading(true);
    fetchSystem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // mock: แค่เปลี่ยนหน้า/ค้นหา ให้หมุนโหลดนิดหน่อยให้ฟีลเดิม
    setTableLoading(true);
    const t = setTimeout(() => setTableLoading(false), 200);
    return () => clearTimeout(t);
  }, [currentPage, currentSearch, order, orderBy]);

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box p={2}>
        <Stack spacing={2}>
          <Grid container>
            <Grid size = {{xs: 12,md :6}}>
              <Typography sx={{ mt: 0, mb: 0, fontSize: 22 }}>ระบบที่เปิดใช้งาน</Typography>
            </Grid>
          </Grid>

          <Box>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Grid size = {{xs: 12,md :6}} >
                <Grid container spacing={1} alignItems="center">
                  <Grid>
                    <TextField id="thaiName" placeholder="ชื่อภาษาไทย" size="small" />
                  </Grid>
                  <Grid>
                    <TextField id="shortName" placeholder="ชื่อย่อ" size="small" />
                  </Grid>
                  <Grid>
                    <Button variant="contained" onClick={onSearch}>
                      ค้นหา
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid size = {{xs: 12,md :6}} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={() => {
                    setLoading(true);
                    //push("/dashboard/integrations/add_system");
                    push("/dashboard/integrations/new");
                  }}
                >
                  เพิ่ม
                </Button>
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {/* Id (hidden เดิม) — จะซ่อนไว้ */}
                    {/* <TableCell align="center">Id</TableCell> */}
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
                    <TableCell sx = {{ pl : 1}}>
                      <TableSortLabel
                        active={orderBy === "shortName"}
                        direction={orderBy === "shortName" ? order : "asc"}
                        onClick={() => handleRequestSort("shortName")}
                      >
                        ชื่อย่อ
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">การมองเห็น</TableCell>
                    <TableCell align="center" sx={{ pl: 4 }}>
                      <TableSortLabel
                        active={orderBy === "updatedAt"}
                        direction={orderBy === "updatedAt" ? order : "asc"}
                        onClick={() => handleRequestSort("updatedAt")}
                      >
                        แก้ไขล่าสุด
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center" width="10%"></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tableLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress size={20} />
                      </TableCell>
                    </TableRow>
                  ) : pagedRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        ไม่พบข้อมูล
                      </TableCell>
                    </TableRow>
                  ) : (
                    pagedRows.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>{record.thaiName}</TableCell>
                        <TableCell>{record.englishName}</TableCell>
                        <TableCell>{record.shortName}</TableCell>
                        <TableCell align="center">
                          <Switch
                            checked={record.visibility === "show"}
                            onChange={() => {
                              setConfirmTarget({
                                id: record.id,
                                nextVisibility: record.visibility === "show" ? "hide" : "show",
                              });
                              setConfirmOpen(true);
                            }}
                            inputProps={{ "aria-label": "visibility switch" }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {convertDateTimeFormate(record.updatedAt)}
                        </TableCell>
                        <TableCell align="center">
                          <Grid container spacing={1} justifyContent="center">
                            <Grid>
                              <Tooltip title="รายละเอียด">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setLoading(true);
                                    push(`/dashboard/integrations/${record.id}/details`);
                                  }}
                                >
                                  <Icons.BookOpenText size={16} />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            <Grid>
                              <Tooltip title="จัดการสิทธิ์ระบบ">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setLoading(true);
                                    push(`/dashboard/integrations/${record.id}/roles`);
                                  }}
                                >
                                  <Icons.ShieldPlus size={16} />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={2} display="flex" justifyContent="flex-end">
              <Pagination
                page={currentPage}
                count={Math.ceil(sortedRows.length / pageSize)}
                onChange={(_, p) => setCurrentPage(p)}
                showFirstButton
                showLastButton
              />
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Confirm Dialog (แทน Popconfirm เดิม) */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>
          {confirmTarget?.nextVisibility === "show" ? "แสดง" : "ซ่อน"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmTarget?.nextVisibility === "show"
              ? "คุณต้องการแสดงระบบ?"
              : "คุณต้องการซ่อนระบบ?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>ไม่</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (confirmTarget) {
                // mock update (ไม่มี API เรียก เหมือนของเดิม)
                setSystems((prev) => ({
                  ...prev,
                  data: prev.data.map((s) =>
                    s.id === confirmTarget.id ? { ...s, visibility: confirmTarget.nextVisibility } : s
                  ),
                }));
              }
              setConfirmOpen(false);
            }}
          >
            ใช่
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
