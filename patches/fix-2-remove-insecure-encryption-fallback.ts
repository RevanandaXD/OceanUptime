// =============================================================
// FIX #2 — Keamanan: Fallback ENCRYPTION_KEY hardcoded
// File asli : utils/encryption.ts
// =============================================================
//
// MASALAH:
// Baris 7: const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ||
//   "default_insecure_development_key_change_me_immediately_please";
//
// Jika env ENCRYPTION_KEY TIDAK diset, semua provider API key terenkripsi
// dengan kunci publik yang sudah diketahui semua orang => bisa didekripsi.
//
// FIX:
// 1) Hapus fallback. Kalau env tidak ada, THROW — jangan diam-diam lanjut.
// 2) SEBELUM deploy: set ENCRYPTION_KEY di env production.
//    Karena ini mengubah kunci, SEMUA provider_configs yang lama HARUS
//    di-re-encrypt (simpan ulang API key di halaman Settings).
//
// GANTI bagian atas file utils/encryption.ts dengan ini:

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;

// Safety: jangan pernah pakai fallback. Wajib set ENCRYPTION_KEY di env.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
  throw new Error(
    "ENCRYPTION_KEY environment variable is required. " +
      "Set it in your deployment environment to secure provider API keys.",
  );
}

const getKey = (salt: Buffer) => {
  return crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, "sha256");
};

// ... sisanya (interface EncryptedData, encryptText, decryptText)
//     TIDAK BERUBAH — pertahankan seperti semula.

// -------------------------------------------------------------
// CATATAN:
// - generate key:  openssl rand -base64 32
// - Setting env di hosting eksternal (bukan Vercel): pastikan variabel
//   ENCRYPTION_KEY ikut terpasang di environment runtime cron & app.
// -------------------------------------------------------------
