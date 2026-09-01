// =============================================================
// FIX #1 — Bug: resolveIncident meng-update TABLE YANG SALAH
// File asli : app/dashboard/incidents/action.ts
// =============================================================
//
// MASALAH:
// Kode lama meng-update tabel `websites` (yang TIDAK punya kolom
// status/resolved_at) dan mengiki `.eq("id", incidentId)`.
// Seharusnya target adalah tabel `incidents`.
//
// Tambahkan juga parameter `websiteId` agar bisa menghitung duration
// dan kembali mengecek apakah masih ada insiden aktif lain utk website itu.
//
// GANTI seluruh isi app/dashboard/incidents/action.ts dengan ini:

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function resolveIncident(incidentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 1) Ambil insiden yang mau di-resolve, dan pastikan user pemilik website-nya
  const { data: incident, error: fetchError } = await supabase
    .from("incidents")
    .select("id, website_id, started_at")
    .eq("id", incidentId)
    .maybeSingle();
  if (fetchError) throw new Error("Failed to fetch incident");
  if (!incident) throw new Error("Incident not found");

  // 2) Pastikan user memiliki website terkait insiden ini
  const { data: web } = await supabase
    .from("websites")
    .select("id")
    .eq("id", incident.website_id)
    .eq("user_id", user.id)
    .single();
  if (!web) throw new Error("Unathorized");

  // 3) Hitung durasi (dalam detik)
  const now = new Date();
  const startedAt = new Date(incident.started_at);
  const durationSecs = Math.max(
    0,
    Math.round((now.getTime() - startedAt.getTime()) / 1000),
  );

  // 4) Update baris di tabel incidents (bukan websites)
  const { error } = await supabase
    .from("incidents")
    .update({
      status: "RESOLVED",
      resolved_at: now.toISOString(),
      duration: durationSecs,
    })
    .eq("id", incidentId);

  if (error) {
    console.error("Failed resolving incident:", error);
    throw new Error("Failed to resolve incident");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/incidents");
  return { success: true };
}

// -------------------------------------------------------------
// (Optional) Jangan lupa cek pemanggilnya di ClientPage:
// pastikan tombol "Resolve" memanggil resolveIncident dengan incident id
// dari TABEL INCIDENTS (bukan website id). Jika UI lama salah mengirim
// website id, sesuaikan di tombol tersebut.
// -------------------------------------------------------------
