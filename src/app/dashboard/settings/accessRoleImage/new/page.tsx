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
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";

type FormState = {
  sequence: string;         // เก็บเป็น string เพื่อจัดการ TextField ได้สะดวก
  thaiName: string;
  englishName: string;
};
type FileState = {
  file: File | null;
  previewUrl?: string;
};

export default function NewAccessRoleImagePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // form
  const [form, setForm] = useState<FormState>({
    sequence: "",
    thaiName: "",
    englishName: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  // upload
  const [upload, setUpload] = useState<FileState>({ file: null });
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: "success" | "error" | "info" }>({
    open: false,
    msg: "",
    sev: "info",
  });

  const fetchNewAccessRoleImage = async () => {
    try {
      // mock: เตรียมหน้าใหม่เฉยๆ
    } catch (e) {
      console.error("error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewAccessRoleImage();
  }, []);

  const handleChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
    setErrors((s) => ({ ...s, [key]: "" }));
  };

  // แทน beforeUpload ของ Antd
  const handlePickFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setUpload({ file: null });
      return;
    }
    const isAccepted = ["image/png", "image/jpeg"].includes(f.type);
    if (!isAccepted) {
      setSnack({ open: true, msg: "รองรับเฉพาะ PNG หรือ JPEG เท่านั้น", sev: "error" });
      e.currentTarget.value = "";
      return;
    }
    const isLt10M = f.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      setSnack({ open: true, msg: "ขนาดรูปต้องน้อยกว่า 10MB!", sev: "error" });
      e.currentTarget.value = "";
      return;
    }
    const url = URL.createObjectURL(f);
    setUpload({ file: f, previewUrl: url });
  };

  const validate = (): boolean => {
    const newErr: Partial<FormState> = {};
    if (!form.sequence || Number(form.sequence) < 1) newErr.sequence = "กรุณาใส่ลำดับ (ตัวเลข ≥ 1)";
    if (!form.thaiName?.trim()) newErr.thaiName = "กรุณาใส่ชื่อภาษาไทย";
    if (!form.englishName?.trim()) newErr.englishName = "กรุณาใส่ชื่อภาษาอังกฤษ";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // สร้าง payload
      const payload = new FormData();
      payload.append("sequence", String(Number(form.sequence)));
      payload.append("thaiName", form.thaiName.trim());
      payload.append("englishName", form.englishName.trim());
      if (upload.file) payload.append("image", upload.file);

      // await fetch('/api/access-role-image', { method: 'POST', body: payload });

      setSnack({ open: true, msg: "บันทึกสำเร็จ", sev: "success" });
      // router.push('/private/setting/accessRoleImage');
    } catch (err) {
      console.error(err);
      setSnack({ open: true, msg: "เกิดข้อผิดพลาดในการบันทึก", sev: "error" });
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width={240} height={32} />
        <Skeleton variant="rectangular" height={160} sx={{ mt: 2 }} />
        <Skeleton variant="rectangular" height={320} sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 1 }}>
        <Link
          component="button"
          onClick={() => {
            setLoading(true);
            router.push("/dashboard/settings");
          }}
          underline="hover"
          color="inherit"
        >
          การตั้งค่า
        </Link>
     {/*  <Link
          component="button"
          onClick={() => {
            setLoading(true);
            router.push("/dashboard/settings/accessRoleImage/new");
          }}
          underline="hover"
          color="inherit"
        >
          ภาพไอคอนเข้าถึงระบบ
        </Link> */}
        <Typography color="text.primary">เพิ่ม</Typography>
      </Breadcrumbs>

      <Typography variant="h6" sx={{ mb: 2, fontSize: 18, fontWeight: 600 }}>
        ภาพไอคอนใหม่สำหรับเข้าถึงระบบ
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* ลำดับ */}
            <Grid size = {{xs: 12,md :6}}>
              <TextField
                label="ลำดับ"
                type="number"
                inputProps={{ min: 1 }}
                value={form.sequence}
                onChange={handleChange("sequence")}
                error={!!errors.sequence}
                helperText={errors.sequence}
                fullWidth
              />
            </Grid>

            {/* ชื่อภาษาไทย */}
            <Grid size = {{xs: 12,md :6}} />

            <Grid size = {{xs: 12,md :6}}>
              <TextField
                label="ชื่อภาษาไทย"
                value={form.thaiName}
                onChange={handleChange("thaiName")}
                error={!!errors.thaiName}
                helperText={errors.thaiName}
                fullWidth
              />
            </Grid>

            {/* ชื่อภาษาอังกฤษ */}
            <Grid size = {{xs: 12,md :6}}>
              <TextField
                label="ชื่อภาษาอังกฤษ"
                value={form.englishName}
                onChange={handleChange("englishName")}
                error={!!errors.englishName}
                helperText={errors.englishName}
                fullWidth
              />
            </Grid>

            {/* อัปโหลดภาพ */}
            <Grid size = {{xs: 12,md :6}}>
              <Stack spacing={1}>
                <Typography variant="subtitle2">ภาพไอคอนเข้าถึงระบบ</Typography>
                <Button
                  variant="outlined"
                  startIcon={<Icons.Upload size={16} />}
                  component="label"
                >
                  Upload (PNG/JPEG, &lt;10MB)
                  <input
                    type="file"
                    hidden
                    accept="image/png, image/jpeg"
                    onChange={handlePickFile}
                  />
                </Button>
                {upload.file && (
                  <Typography variant="body2" color="text.secondary">
                    ไฟล์: {upload.file.name} ({(upload.file.size / 1024).toFixed(0)} KB)
                  </Typography>
                )}
                {upload.previewUrl && (
                  <Box
                    component="img"
                    src={upload.previewUrl}
                    alt="preview"
                    sx={{
                      mt: 1,
                      maxWidth: 260,
                      maxHeight: 160,
                      objectFit: "contain",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 1,
                      bgcolor: "background.paper",
                    }}
                  />
                )}
              </Stack>
            </Grid>

            {/* ปุ่มส่ง */}
            <Grid size = {{xs: 12}} display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained">
                เพิ่ม
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

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
