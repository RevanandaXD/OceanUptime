// =============================================================
// FIX #8 — Environment/konfigurasi tingkat repo
// =============================================================
//
// Berikut kelemahan penunjang yang bisa Anda tangani sendiri:
//
// ---------------------------------------------------------------------
// 1) pnpm lint GAGAL — "Cannot find module 'debug'"
//    Penyebab: node_modules tidak konsisten (transitif `debug` hilang).
//    Resolusi (pilih salah satu):
//      pnpm install          # rebuild lockfile cons
//      pnpm install debug    # pasang ketergantungan lint yg kurang
//      rm -rf node_modules .pnpm-store && pnpm install   # fresh clean
//
// 2) next.config.ts kosong — tidak ada security headers / redirects.
//    Tambahan yang disarankan (bebas dipilih):
//    - X-Frame-Options, X-Content-Type-Options, Referrer-Policy
//    - Redirect /dashboard -> /dashboard/overview (jika perlu)
//    Contoh header keamanan utk next.config.ts:
//
//    const securityHeaders = [
//      { key: "X-Frame-Options", value: "DENY" },
//      { key: "X-Content-Type-Options", value: "nosniff" },
//      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
//      { key: "Permissions-Policy", value: "camera=(), microphone=()" },
//    ];
//    // lalu masukkan key: headers di nextConfig (utk semua route)
//
// 3) Vercel Cron limitation (hanya relevan kalau suatu saat pakai Vercel).
//    Anda pakai cron eksternal -> sudah oke. Pastikan cron eksternal
//    memanggil:  GET https://<domain>/api/cron?secret=CRON_SECRET
//    dengan interval yang Anda inginkan (5 menit, dst). CRON_SECRET
//    harus SAMA dengan env di runtime app + cron.
//
// 4) Frekuensi & keamanan endpoint cron:
//    - Endpoint /api/cron TIDAK membatasi rate. Karena dilindungi secret,
//      sudah cukup, tapi pertimbangkan juga verifikasi header/User-Agent
//      tambahan bila dikhawatirkan brute-force.
//    - Jangan pernah menaruh secret di URL logging/analytics.
//
// 5) `any` usage luas (melanggar "Avoid any" di AGENTS.md):
//    - context/DashboardContext.tsx, app/dashboard/action.ts, dll.
//    Ganti `any` dengan tipe konkret (Monitor, Incident, ProviderConfig, dsb).
//    Ini pekerjaan bertahap — mulai dari fetchWithCache dan apiCache.
// ---------------------------------------------------------------------
