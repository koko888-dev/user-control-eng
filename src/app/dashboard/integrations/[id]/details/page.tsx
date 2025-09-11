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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ThemButtonColor } from "@/app/utils/constants";

type FormState = {
  thaiName: string;
  englishName: string;
  shortName: string;
  description: string;
};

export default function SystemDetailPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // form state
  const [form, setForm] = useState<FormState>({
    thaiName: "",
    englishName: "",
    shortName: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  // snack
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: "success" | "error" | "info" }>({
    open: false,
    msg: "",
    sev: "info",
  });

  // delete confirm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchSystemDetail = async () => {
    try {
      // TODO: ดึงข้อมูลจริง
      // mock ตัวอย่าง initial
      setForm({
        thaiName: "ระบบบุคลากร",
        englishName: "Personnel system",
        shortName: "PN",
        description: "สำหรับจัดการข้อมูลบุคลากร",
      });
    } catch (e) {
      console.error(e);
      setSnack({ open: true, msg: "ไม่สามารถโหลดข้อมูลได้", sev: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemDetail();
  }, []);

  const handleChange =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // await fetch('/api/system/:id', { method: 'PUT', body: JSON.stringify(form) })
      setSnack({ open: true, msg: "บันทึกการแก้ไขสำเร็จ", sev: "success" });
    } catch (e) {
      console.error(e);
      setSnack({ open: true, msg: "แก้ไขไม่สำเร็จ", sev: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      // await fetch('/api/system/:id', { method: 'DELETE' })
      setSnack({ open: true, msg: "ลบสำเร็จ", sev: "success" });
      router.push("/dashboard/integrations");
    } catch (e) {
      console.error(e);
      setSnack({ open: true, msg: "ลบไม่สำเร็จ", sev: "error" });
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width={280} height={28} />
        <Skeleton variant="text" width={220} />
        <Skeleton variant="rectangular" height={360} sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Breadcrumbs + Title */}
      <Stack spacing={1} sx={{ mb: 1 }}>
        <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 600 }}>
          รายละเอียดระบบที่เปิดใช้งาน
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
          <Typography color="text.primary">xxx</Typography>
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

            <Grid size = {{xs: 12,md :12}}>
              <TextField
                label="รายละเอียด"
                fullWidth
                multiline
                minRows={4}
                value={form.description}
                onChange={handleChange("description")}
              />
            </Grid>

            <Grid size = {{xs: 12}}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: ThemButtonColor?.Reject ?? "#1976d2",
                    "&:hover": { opacity: 0.9, bgcolor: ThemButtonColor?.Reject ?? "#1976d2" },
                  }}
                >
                  แก้ไข
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setConfirmOpen(true)}
                  sx={{
                    bgcolor: ThemButtonColor?.Delete ?? "#d32f2f",
                    "&:hover": { opacity: 0.9, bgcolor: ThemButtonColor?.Delete ?? "#d32f2f" },
                  }}
                >
                  ลบ
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Delete confirm */}
      <Dialog open={confirmOpen} onClose={() => (!deleting ? setConfirmOpen(false) : null)}>
        <DialogTitle>ยืนยันการลบ</DialogTitle>
        <DialogContent>
          <DialogContentText>คุณต้องการลบระบบนี้หรือไม่?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>
            ยกเลิก
          </Button>
          <Button onClick={handleDelete} variant="contained" disabled={deleting}>
            {deleting ? "กำลังลบ..." : "ลบ"}
          </Button>
        </DialogActions>
      </Dialog>

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
