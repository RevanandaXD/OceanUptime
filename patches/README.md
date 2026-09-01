# Patch / Referensi Perbaikan — OceanUptime

Folder ini berisi **kode referensi & catatan** untuk memperbaiki bug/kelemahan
hasil audit. Anda akan **resolve & implementasi sendiri** — folder ini hanya
panduan dan tidak di-import oleh aplikasi.

## Daftar Isi

| # | Isu | File referensi | Prioritas |
|---|-----|----------------|-----------|
| 1 | Bug: `resolveIncident` update tabel SALAH (`websites` bukan `incidents`) | `fix-1-resolve-incident-bug.tsx` | 🔴 Tinggi |
| 2 | Keamanan: fallback `ENCRYPTION_KEY` hardcoded | `fix-2-remove-insecure-encryption-fallback.ts` | 🔴 Tinggi |
| 3 | Bug: `updateSSLInfo` selalu INSERT → duplikat | `fix-3-ssl-upsert-not-insert.ts` | 🟠 Sedang |
| 4 | Duplikasi & inkonsistensi logika monitoring (cron vs manual) | `fix-4-shared-monitoring-module.ts` | 🟠 Sedang |
| 5 | Performa: query tanpa pagination + count exact tiap 20s | `fix-5-pagination-query-optimization.ts` | 🟠 Sedang |
| 6 | Inkonsistensi dokumentasi (AGENTS.md vs stack asli) + README | `fix-6-docs-stack-consistency.md` | 🟢 Rendah |
| 7 | Fitur notifikasi dijanjikan tapi belum ada | `fix-7-notifications-gap.ts` | 🟢 Rendah |
| 8 | Housekeeping repo (lint gagal, next.config, `any`) | `fix-8-repo-housekeeping.ts` | 🟢 Rendah |

## Catatan penting

- **Fix #2 mengubah kunci enkripsi** → setelah diterapkan, semua `provider_configs`
  yang lama harus di-save ulang dari halaman Settings.
- **Fix #4** memperkenalkan modul baru `utils/monitoring.ts`; setelah dibuat,
  update `app/api/cron/route.ts` **dan** `app/dashboard/monitors/action.ts`
  agar keduanya memanggil `performCheck()`.
- Sebelum commit, jalankan `pnpm lint` dan `pnpm build` untuk memastikan
  tidak ada error.
