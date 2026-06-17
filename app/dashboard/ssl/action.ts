"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSSLInfo(websiteId: string, issuer: string, daysRemaining: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: web } = await supabase.from("websites").select("id").eq("id", websiteId).eq("user_id", user.id).single();
  if (!web) throw new Error("Unauthorized");

  const { error } = await supabase.from("ssl_certificates").insert({
    website_id: websiteId,
    issuer: issuer,
    days_remaining: daysRemaining,
    expires_at: new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000).toISOString()
  });

  if (error) throw new Error("Failed to update SSL info");

  revalidatePath("/dashboard/ssl");
  return { success: true };
}
