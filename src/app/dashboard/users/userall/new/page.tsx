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
// ถ้าต้องการใช้ validateEmailInput เดิม ให้ปรับให้ return boolean/string แล้วเรียกใน validate()
// import { validateEmailInput } from "@/app/utils";

type FormState = {
  nontriAccount: string;
  name: string;
  surname: string;
  kuMail: string;
};

export default function NewUserPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // form state
  const [form, setForm] = useState<FormState>({
    nontriAccount: "",
    name: "",
    surname: "",
    kuMail: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  // snackbar
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: "success" | "error" | "info" }>({
    open: false,
    msg: "",
    sev: "info",
  });

  const fetchNewUser = async () => {
    try {
      // เตรียมหน้าเพิ่มผู้ใช้ (ไม่มีโหลดข้อมูล)
    } catch (e) {
      console.error(e);
      setSnack({ open: true, msg: "ไม่สามารถโหลดหน้าฟอร์มได้", sev: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewUser();
  }, []);

  const handleChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((s) => ({ ...s, [key]: e.target.value }));
      setErrors((s) => ({ ...s, [key]: "" }));
    };

  // ตรวจอีเมลง่าย ๆ; ถ้าจะใช้ validateEmailInput เดิม ให้ปรับ logic ให้คืนข้อความผิดพลาด/true แล้วเรียกแทนได้
  const isEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validate = () => {
    const err: Partial<FormState> = {};
    if (!form.nontriAccount?.trim()) err.nontriAccount = "กรุณาใส่ข้อมูล บัญชีนนทรี!";
    if (!form.name?.trim()) err.name = "กรุณาใส่ข้อมูล ชื่อ!";
    if (!form.surname?.trim()) err.surname = "กรุณาใส่ข้อมูล นามสกุล!";
    if (!form.kuMail?.trim()) err.kuMail = "กรุณาใส่ข้อมูล KU E-mail!";
    else if (!isEmail(form.kuMail)) err.kuMail = "รูปแบบอีเมลไม่ถูกต้อง";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // await fetch('/api/user', { method: 'POST', body: JSON.stringify(form) })
      setSnack({ open: true, msg: "เพิ่มผู้ใช้งานสำเร็จ", sev: "success" });
      // router.push('/private/user');
    } catch (e) {
      console.error(e);
      setSnack({ open: true, msg: "ไม่สามารถเพิ่มผู้ใช้งานได้", sev: "error" });
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
          ผู้ใช้งานระบบ
        </Typography>

        <Breadcrumbs>
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => {
              setLoading(true);
              router.push("/dashboard/users/userall/");
            }}
          >
            ผู้ใช้งานระบบ
          </Link>
          <Typography color="text.primary">เพิ่ม</Typography>
        </Breadcrumbs>
      </Stack>

      {/* Form */}
      <Paper sx={{ p: 2 }}>
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="บัญชีนนทรี"
                fullWidth
                value={form.nontriAccount}
                onChange={handleChange("nontriAccount")}
                error={!!errors.nontriAccount}
                helperText={errors.nontriAccount}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} />

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="ชื่อ"
                fullWidth
                value={form.name}
                onChange={handleChange("name")}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="นามสกุล"
                fullWidth
                value={form.surname}
                onChange={handleChange("surname")}
                error={!!errors.surname}
                helperText={errors.surname}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="KU E-mail"
                fullWidth
                value={form.kuMail}
                onChange={handleChange("kuMail")}
                error={!!errors.kuMail}
                helperText={errors.kuMail}
              />
            </Grid>

            <Grid size={{ xs: 12}} display="flex" justifyContent="flex-end">
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
