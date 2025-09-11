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
  IconButton,
  Autocomplete,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";
import { ThemButtonColor } from "@/app/utils/constants";

type AccessRow = { systemId: number | null; roleId: number | null };
type FormState = {
  nontriAccount: string;
  name: string;
  surname: string;
  kuMail: string;
  systems: AccessRow[];
};

const SYSTEM_OPTIONS = [
  { value: 1, label: "ระบบ A" },
  { value: 2, label: "ระบบ B" },
];
const ROLE_OPTIONS = [
  { value: 1, label: "ผู้ดูแลระบบ" },
  { value: 2, label: "ผู้ใช้ทั่วไป" },
];

export default function UserDetailPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>({
    nontriAccount: "",
    name: "",
    surname: "",
    kuMail: "",
    systems: [{ systemId: null, roleId: null }],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [rowErrors, setRowErrors] = useState<Record<number, { systemId?: string; roleId?: string }>>({});

  // snackbar
  const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: "success" | "error" | "info" }>(
    { open: false, msg: "", sev: "info" }
  );

  // delete confirm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchUserDetail = async () => {
    try {
      // TODO: โหลดข้อมูลจริง
      // mock
      setForm({
        nontriAccount: "nattapong01",
        name: "ณัฐพงศ์",
        surname: "ศรีสุข",
        kuMail: "nattapong01@example.com",
        systems: [
          { systemId: 1, roleId: 1 },
          { systemId: 2, roleId: 2 },
        ],
      });
    } catch (e) {
      console.error(e);
      setSnack({ open: true, msg: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้", sev: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);

  const handleChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((s) => ({ ...s, [key]: e.target.value }));
      setErrors((s) => ({ ...s, [key]: "" }));
    };

  const handleSystemChange = (idx: number, field: "systemId" | "roleId", value: number | null) => {
    setForm((s) => {
      const next = [...s.systems];
      next[idx] = { ...next[idx], [field]: value };
      return { ...s, systems: next };
    });
    setRowErrors((re) => ({ ...re, [idx]: { ...re[idx], [field]: "" as any } }));
  };

  const addAccessRow = () => {
    setForm((s) => ({ ...s, systems: [...s.systems, { systemId: null, roleId: null }] }));
  };
  const removeAccessRow = (idx: number) => {
    setForm((s) => ({ ...s, systems: s.systems.filter((_, i) => i !== idx) }));
    setRowErrors((re) => {
      const copy = { ...re };
      delete copy[idx];
      return copy;
    });
  };

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validate = () => {
    const err: Partial<Record<keyof FormState, string>> = {};
    const rowErrs: Record<number, { systemId?: string; roleId?: string }> = {};

    if (!form.nontriAccount?.trim()) err.nontriAccount = "กรุณาใส่ข้อมูล บัญชีนนทรี!";
    if (!form.name?.trim()) err.name = "กรุณาใส่ข้อมูล ชื่อ!";
    if (!form.surname?.trim()) err.surname = "กรุณาใส่ข้อมูล นามสกุล!";
    if (!form.kuMail?.trim()) err.kuMail = "กรุณาใส่ข้อมูล KU E-mail!";
    else if (!isEmail(form.kuMail)) err.kuMail = "รูปแบบอีเมลไม่ถูกต้อง";

    form.systems.forEach((r, i) => {
      const re: { systemId?: string; roleId?: string } = {};
      if (!r.systemId) re.systemId = "กรุณาเลือกข้อมูล ชื่อระบบ!";
      if (!r.roleId) re.roleId = "กรุณาเลือกข้อมูล สิทธิ์เข้าถึง!";
      if (re.systemId || re.roleId) rowErrs[i] = re;
    });

    setErrors(err);
    setRowErrors(rowErrs);
    return Object.keys(err).length === 0 && Object.keys(rowErrs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // await fetch('/api/user/:id', { method: 'PUT', body: JSON.stringify(form) })
      setSnack({ open: true, msg: "บันทึกการแก้ไขสำเร็จ", sev: "success" });
    } catch (e) {
      console.error(e);
      setSnack({ open: true, msg: "แก้ไขไม่สำเร็จ", sev: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      // await fetch('/api/user/:id', { method: 'DELETE' })
      setSnack({ open: true, msg: "ลบผู้ใช้งานสำเร็จ", sev: "success" });
      router.push("/dashboard/users/userall/");
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
        <Skeleton variant="text" width={260} height={28} />
        <Skeleton variant="text" width={220} />
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
          <Typography color="text.primary">รายละเอียด</Typography>
        </Breadcrumbs>
      </Stack>

      {/* Form */}
      <Paper sx={{ p: 2 }}>
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* nontriAccount */}
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

            <Grid size={{ xs: 12, md: 6 }}/>

            {/* name / surname */}
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

            {/* kuMail */}
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

            {/* Systems access list */}
            <Grid size={{ xs: 12}}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                รายการระบบที่สามารถเข้าถึงได้
              </Typography>

              <Stack spacing={2}>
                {form.systems.map((row, idx) => {
                  const systemValue = SYSTEM_OPTIONS.find((o) => o.value === row.systemId) ?? null;
                  const roleValue = ROLE_OPTIONS.find((o) => o.value === row.roleId) ?? null;

                  return (
                    <Paper key={idx} variant="outlined" sx={{ p: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 5}}>
                          <Autocomplete
                            options={SYSTEM_OPTIONS}
                            value={systemValue}
                            onChange={(_, val) => handleSystemChange(idx, "systemId", val?.value ?? null)}
                            getOptionLabel={(o) => o.label}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="ชื่อระบบ"
                                error={!!rowErrors[idx]?.systemId}
                                helperText={rowErrors[idx]?.systemId}
                              />
                            )}
                            fullWidth
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }}>
                          <Autocomplete
                            options={ROLE_OPTIONS}
                            value={roleValue}
                            onChange={(_, val) => handleSystemChange(idx, "roleId", val?.value ?? null)}
                            getOptionLabel={(o) => o.label}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="สิทธิ์เข้าถึง"
                                error={!!rowErrors[idx]?.roleId}
                                helperText={rowErrors[idx]?.roleId}
                              />
                            )}
                            fullWidth
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 2 }} display="flex" justifyContent="flex-end">
                          <IconButton aria-label="remove-row" onClick={() => removeAccessRow(idx)}>
                            <Icons.CircleMinus size={20} />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  );
                })}

                <Button
                  variant="outlined"
                  onClick={addAccessRow}
                  startIcon={<Icons.CirclePlus size={18} />}
                  sx={{
                    alignSelf: { xs: "stretch", md: "flex-start" },
                    borderStyle: "dashed",
                  }}
                >
                  เพิ่มเข้าถึงระบบ
                </Button>
              </Stack>
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12}}>
              <Divider sx={{ my: 1 }} />
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
          <DialogContentText>คุณต้องการลบผู้ใช้งานนี้หรือไม่?</DialogContentText>
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
