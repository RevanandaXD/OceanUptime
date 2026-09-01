// =============================================================
// FIX #5 — Performa: getDashboardData memuat semua checks tanpa batas
// dan melakukan count-exact setiap 20 detik.
// File asli : app/dashboard/action.ts
// =============================================================
//
// MASALAH (sesuai AGENTS.md: "Minimize database queries. Use pagination."):
// 1) `checks` query memuat SEMUA baris website_checks utk semua website.
//    Seharusnya dibatasi, karena UI cuma butuh ~10 poin history per website.
// 2) `totalChecks` menggunakan count:"exact" via query terpisah => mahal,
//    dan di-refresh dari client setiap 20 detik.
//
// FIX A (paling sederhana & langsung) — batasi jumlah checks:
// Pada query checks tambahkan .limit(). Karena list berurutan desc,
// ambil mis. 20 per website cukup dgn satu query terakhir des-cascading.

// GANTI blok query checks (baris ~141-146) dengan ini:

const { data: checks } = await supabase
  .from("website_checks")
  .select("id, website_id, status, response_time, checked_at")
  .in("website_id", websiteIds)
  .order("checked_at", { ascending: false })
  .limit(200); // <-- batas hard, cukup utk 10 history x 20 website

// -------------------------------------------------------------
// FIX B (lebih baik, opsional) — lazy-load totalChecks / hilangkan
// hitungan exact dari polling 20 detik:
//
// 1) Hapus query `SELECT("*", { count: "exact", head: true })` dari fungsi ini.
// 2) Pindahkan perhitungan totalChecks ke halaman Analytics SAJA, dan
//    refresh-nya jangan tiap 20 detik — mis. pakai pagination atau
//    endpoint sendiri /api/checks yang men-support offset & limit.
// 3) Atau pakai count:"estimated" (lebih murah di Supabase) sebagai ganti
//    "exact" bila angka akurat tidak terlalu penting utk card "Total Checks".

// Contoh count estimasi:
const { count: estimated } = await supabase
  .from("website_checks")
  .select("website_id", { count: "estimated", head: true })
  .in("website_id", websiteIds);
// totalChecks = estimated || 0;
// -------------------------------------------------------------
// FIX C (disarankan) — kurangi frekuensi polling client:
//    File: context/DashboardContext.tsx  (interval 20000 ms)
//    Naikkan INTERVAL_MS menjadi 30000–60000, dan on throttle manual
//    refresh. Karena cron yang jadi sumber kebenaran, client cuma perlu
//    refresh moderat.
// -------------------------------------------------------------
