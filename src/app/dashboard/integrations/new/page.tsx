"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  TextField,
  Button,
  Paper,
  Breadcrumbs,
  Link,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";

type FormState = {
  thaiName: string;
  englishName: string;
  shortName: string;
  description: string;
};

export default function NewSystemPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>({
    thaiName: "",
    englishName: "",
    shortName: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: "success" | "error" | "info" }>({
    open: false,
    msg: "",
    sev: "info",
  });

  const fetchNewSystem = async () => {
    try {
      // หน้านี้ไม่มีโหลดข้อมูลพิเศษ
    } catch (e) {
      console.error(e);
      setSnack({ open: true, msg: "ไม่สามารถเปิดหน้าฟอร์มได้", sev: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewSystem();
  }, []);

  const handleChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((s) => ({ ...s, [key]: e.target.value }));
      setErrors((s) => ({ ...s, [key]: "" }));
    };

  const validate = () => {
    const err: Partial<FormState> = {};
    if (!form.thaiName?.trim()) err.thaiName = "กรุณาใส่ข้อมูล ชื่อภาษาไทย!";
    if (!form.englishName?.trim()) err.englishName = "กรุณาใส่ข้อมูล ชื่อภาษาอังกฤษ!";
    if (!form.shortName?.trim()) err.shortName = "กรุณาใส่ข้อมูล ชื่อย่อ!";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // await fetch('/api/system', { method: 'POST', body: JSON.stringify(form) })
      setSnack({ open: true, msg: "เพิ่มระบบสำเร็จ", sev: "success" });
      // router.push('/private/system');
    } catch (e) {
      console.error(e);
      setSnack({ open: true, msg: "เพิ่มระบบไม่สำเร็จ", sev: "error" });
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width={240} height={28} />
        <Skeleton variant="text" width={200} />
        <Skeleton variant="rectangular" height={360} sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Stack spacing={1} sx={{ mb: 1 }}>
        <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 600 }}>
          ระบบที่เปิดใช้งาน
        </Typography>

        <Breadcrumbs>
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => {
              setLoading(true);
              router.push("/dashboard/integrations");
            }}
          >
            ระบบที่เปิดใช้งาน
          </Link>
          <Typography color="text.primary">เพิ่ม</Typography>
        </Breadcrumbs>
      </Stack>

      {/* Form */}
      <Paper sx={{ p: 2 }}>
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size = {{xs: 12,md :6}}>
              <TextField
                label="ชื่อภาษาไทย"
                fullWidth
                value={form.thaiName}
                onChange={handleChange("thaiName")}
                error={!!errors.thaiName}
                helperText={errors.thaiName}
              />
            </Grid>

            <Grid size = {{xs: 12,md :6}} />

            <Grid size = {{xs: 12,md :6}}>
              <TextField
                label="ชื่อภาษาอังกฤษ"
                fullWidth
                value={form.englishName}
                onChange={handleChange("englishName")}
                error={!!errors.englishName}
                helperText={errors.englishName}
              />
            </Grid>

            <Grid size = {{xs: 12,md :6}}>
              <TextField
                label="ชื่อย่อ"
                fullWidth
                value={form.shortName}
                onChange={handleChange("shortName")}
                error={!!errors.shortName}
                helperText={errors.shortName}
              />
            </Grid>

            <Grid size = {{xs: 12}}>
              <TextField
                label="รายละเอียด"
                fullWidth
                multiline
                minRows={4}
                value={form.description}
                onChange={handleChange("description")}
              />
            </Grid>

            <Grid size = {{xs: 12}} display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained">
                เพิ่ม
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.sev}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
