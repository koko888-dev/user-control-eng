"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  TextField,
  Button,
  Breadcrumbs,
  Link,
  Card,
  CardMedia,
  CardContent,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";

// ---- Types ----
type IconImageItem = {
  id: number;
  sequence: number;
  thaiName: string;
  englishName: string;
  pathName: string;
  createdAt: string;
  updatedAt: string;
};
type IconImageList = {
  data: IconImageItem[];
  page: number;
  totalPage: number;
  limit: number;
  totalCount: number;
};

export default function AccessRoleImageIndexPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  const [iconImage, setIconImage] = useState<IconImageList>({
    data: [],
    page: 0,
    totalPage: 1,
    limit: 0,
    totalCount: 0,
  });

  // search
  const [filters, setFilters] = useState({ thaiName: "", englishName: "" });
  const [committedFilters, setCommittedFilters] = useState(filters);

  const fetchRole = async () => {
    try {
      const data: IconImageList = {
        data: [
          {
            id: 1,
            sequence: 1,
            thaiName: "ผู้ดูแลระบบ",
            englishName: "Admin",
            pathName: "avatar-1.png",
            createdAt: "",
            updatedAt: "",
          },
          {
            id: 2,
            sequence: 2,
            thaiName: "ผู้อนุมัติ",
            englishName: "Approver",
            pathName: "avatar-1.png",
            createdAt: "",
            updatedAt: "",
          },
          {
            id: 3,
            sequence: 3,
            thaiName: "ผู้ใช้งานในระบบ",
            englishName: "User",
            pathName: "avatar-1.png",
            createdAt: "",
            updatedAt: "",
          },
        ],
        page: 1,
        totalPage: 1,
        limit: 10,
        totalCount: 10,
      };
      setIconImage(data);
    } catch (e) {
      console.error("error: ", e);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    setTableLoading(true);
    fetchRole();
  }, [currentPage, committedFilters]);

  // filter + paginate (client-side)
  const filtered = useMemo(() => {
    const tn = committedFilters.thaiName.trim().toLowerCase();
    const en = committedFilters.englishName.trim().toLowerCase();
    return iconImage.data.filter((it) => {
      const okTN = !tn || it.thaiName.toLowerCase().includes(tn);
      const okEN = !en || it.englishName.toLowerCase().includes(en);
      return okTN && okEN;
    });
  }, [iconImage.data, committedFilters]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage]);

  const handleSearch = () => {
    setCommittedFilters(filters);
    setCurrentPage(1);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Stack spacing={1} sx={{ mb: 1 }}>
        <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 600, m: 0 }}>
          ภาพไอคอนเข้าถึงระบบ
        </Typography>

        <Breadcrumbs>
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => {
              setLoading(true);
              router.push("/dashboard/setting");
            }}
          >
            การตั้งค่า
          </Link>
          <Typography color="text.primary">รายการ</Typography>
        </Breadcrumbs>
      </Stack>

      {/* Search + Add */}
      <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
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

        <Grid size = {{xs: 12,md :4}} display="flex" justifyContent={{ xs: "flex-start", md: "flex-end" }}>
          <Button
            variant="contained"
            onClick={() => {
              setLoading(true);
              router.push("/dashboard/settings/accessRoleImage/new/");
            }}
          >
            เพิ่ม
          </Button>
        </Grid>
      </Grid>

      {/* Cards */}
      <Box sx={{ position: "relative" }}>
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
              borderRadius: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {paginated.map((item) => (
            <Grid key={item.id}>
              <Card
                sx={{
                  width: 200,
                  bgcolor: "background.paper",
                  color: "text.primary",
                  fontWeight: 700,
                }}
                raised
              >
                <CardMedia
                  component="img"
                  image={`/assets/${item.pathName}`}
                  alt={item.thaiName}
                  draggable={false}
                  sx={{
                    height: 140,
                    width: "100%",
                    objectFit: "cover",  // ✅ เต็มและครอบสวย
                  }}
                />
                <CardContent sx={{ py: 1.5 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 0, lineHeight: 1.2 }}
                    noWrap
                    title={item.thaiName}
                  >
                    {item.thaiName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap title={item.englishName}>
                    {item.englishName}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {!tableLoading && paginated.length === 0 && (
            <Grid size = {{xs: 12}}>
              <Typography align="center" sx={{ py: 6 }}>
                ไม่พบข้อมูล
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Pagination */}
      <Grid container>
        <Grid size = {{xs: 12}} display="flex" justifyContent="flex-end">
          <Pagination
            page={currentPage}
            onChange={(_, p) => setCurrentPage(p)}
            count={Math.max(1, Math.ceil(filtered.length / rowsPerPage))}
            showFirstButton
            showLastButton
          />
        </Grid>
      </Grid>
    </Box>
  );
}
