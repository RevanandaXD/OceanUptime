// =============================================================
// FIX #3 — Bug: updateSSLInfo selalu INSERT (bisa duplikat)
// File asli : app/dashboard/ssl/action.ts
// =============================================================
//
// MASALAH:
// Kode lama SELALU insert baris baru di ssl_certificates, jadi jika dipanggil
// berkali-kali utk website yang sama akan tercipta banyak duplikat.
// Cron di /api/cron sudah melakukan upsert (update kalau ada). Jadikan
// function manual ini konsisten: UPDATE kalau sudah ada, INSERT kalau belum.
//
// GANTI seluruh isi app/dashboard/ssl/action.ts dengan ini:

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSSLInfo(
  websiteId: string,
  issuer: string,
  daysRemaining: number,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Pastikan user pemilik website ini
  const { data: web } = await supabase
    .from("websites")
    .select("id")
    .eq("id", websiteId)
    .eq("user_id", user.id)
    .single();
  if (!web) throw new Error("Unauthorized");

  const expiresAt = new Date(
    Date.now() + daysRemaining * 24 * 60 * 60 * 1000,
  ).toISOString();

  // Cek apakah sudah ada sertifikat utk website ini
  const { data: existing } = await supabase
    .from("ssl_certificates")
    .select("id")
    .eq("website_id", websiteId)
    .maybeSingle();

  let error;
  if (existing) {
    ({ error } = await supabase
      .from("ssl_certificates")
      .update({ issuer, days_remaining: daysRemaining, expires_at: expiresAt })
      .eq("id", existing.id));
  } else {
    ({ error } = await supabase.from("ssl_certificates").insert({
      website_id: websiteId,
      issuer,
      days_remaining: daysRemaining,
      expires_at: expiresAt,
    }));
  }

  if (error) {
    console.error("Failed to update SSL info:", error);
    throw new Error("Failed to update SSL info");
  }

  revalidatePath("/dashboard/ssl");
  return { success: true };
}
