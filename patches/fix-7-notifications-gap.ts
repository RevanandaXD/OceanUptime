// =============================================================
// FIX #7 — Gap fitur: Notifikasi DIJANJIKAN tapi TIDAK ADA implementasi
// =============================================================
//
// MASALAH (temuan audit):
// Landing page (app/page.tsx) & FAQ mengklaim:
//   - "native browser web push notifications" (utk offline/recovery)
// AGENTS.md Primary Goals #7: Email, Discord, Telegram.
// TAPI TIDAK ada satu pun file service worker, endpoint webhook, node
// mailer, ataupun kode notifikasi — hanya teks marketing.
//
// Ini risiko kredibilitas & melanggar konsistensi fitur vs realita.
//
// PILIHAN (resolve sendiri sesuai kebutuhan):
// ---------------------------------------------------------------------
// OPSI A — JANGAN klaim sebelum ada: hilangkan kalimat web-push dari
//          landing page/FAQ, atau tandai sebagai "roadmap".
//   File: app/page.tsx  (~baris 442 & 510)
//
// OPSI B — Implementasikan notifikasi minimal (browser Web Push) :
//   1) Buat file publik/sw.js (service worker) + manifest.
//   2) Buat endpooint POST /api/notifications/subscribe utk simpan
//      PushSubscription user ke Supabase (tabel push_subscriptions).
//   3) Di /api/cron, setelah status DOWN/RESOLVED terdeteksi, kirim
//      Web Push via web-push (npm i web-push) pakai VAPID key.
//   4) Tambah tombol "Enable Alerts" (dgn Notification.requestPermission)
//      di dashboard (mis. di layout/sidebar).
//
// OPSI C — Mulai dari yang termudah: notifikasi EMAIL/Telegram webhook.
//   Simpan webhook URL di tabel `provider_configs` (atau tabel `notifications`),
//   dan dari /api/cron kirim fetch() ke endpoint webhook saat status
//   berubah. Contoh payload Telegram:
//   https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=<ID>&text=...
//
// ---------------------------------------------------------------------
// KERANGKA minimal untuk memicu notifikasi dari cron
// (tambahkan pada app/api/cron/route.ts, di bagian incidents DOWN/RESOLVED):

// import { notify } from "@/utils/notify";

// // saat deteksi insiden BARU (blok `if (!activeIncidents) { ... }`)
// await notify({
//   type: "website_down",
//   websiteName: web.name,
//   websiteUrl: web.url,
//   reason: failureReason || `Check failed (HTTP Code: ${statusCode})`,
// });

// // saat insiden RESOLVED (blok loop `for (const inc of activeIncidents)`)
// await notify({
//   type: "website_recovered",
//   websiteName: web.name,
//   websiteUrl: web.url,
// });

// -------------------------------------------------------------
// utils/notify.ts (contoh kerangka — lengkapi sesuai kanal pilihanmu)
// -------------------------------------------------------------
// export async function notify(event: {
//   type: "website_down" | "website_recovered" | "ssl_expiring";
//   websiteName: string;
//   websiteUrl: string;
//   reason?: string;
// }) {
//   const { createClient } = await import("@supabase/supabase-js");
//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY!,
//   );
//
//   // celah trigger ganda: hanya kirim jika state berubah (sebelumnya UP -> skrg DOWN)
//   // (di cron, deteksi transisi agar tidak spam setiap 5 menit saat downtime panjang)
//
//   // 1) Email (opsional) via SMTP/Resend
//   // 2) Discord webhook
//   // 3) Telegram bot
//   // 4) Web Push subscriptions
//   // ... implementasi sesuai pilihan
// }
// -------------------------------------------------------------
