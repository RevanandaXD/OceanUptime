"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addMonitor(data: {
  name: string;
  url: string;
  provider: string;
  expectedKeyword?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError);
  }
  const role = profile?.role || "free";

  const { count, error: countError } = await supabase
    .from("websites")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) {
    console.error("Error counting monitors:", countError);
    throw new Error("Failed to verify monitor quota.");
  }

  // Limits per role
  const LIMITS: Record<string, number> = {
    free: 7,
    pro: 24,
    admin: 9999,
  };

  const userLimit = LIMITS[role] || LIMITS.free;

  if (count !== null && count >= userLimit) {
    throw new Error(
      `Limit reached. You have used ${count}/${userLimit} monitors. Upgrade to PRO to add more websites.`
    );
  }

  const { error } = await supabase.from("websites").insert({
    user_id: user.id,
    name: data.name,
    url: data.url,
    provider: data.provider || "Generic HTTP/HTTPS",
    expected_keyword: data.expectedKeyword || null,
    is_active: true,
  });

  if (error) throw new Error("Failed to add websites");

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteMonitor(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("websites")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error("Failed to delete monitor");

  revalidatePath("/dashboard");
  return { success: true };
}

export async function toogleMonitorStatus(id: string, isActive: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unathorized");

  const { error } = await supabase
    .from("websites")
    .update({ is_active: isActive })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error("Failed to toggle monitor");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Fitur Simulasi: Mengirim PING palsu ke semua website yang aktif.
 * Berguna untuk mengetes grafik sebelum ada Cron Job sungguhan.
 */
export async function triggerSimulatedCheck() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const { data: websites } = await supabase
    .from("websites")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!websites || websites.length === 0) return { success: true };

  const checksToInsert = websites.map((web) => {
    const isUp = Math.random() > 0.05; // 95% UP
    return {
      website_id: web.id,
      status: isUp ? "UP" : "DOWN",
      response_time: isUp ? Math.floor(Math.random() * 300) + 50 : 0,
      status_code: isUp ? 200 : 502,
    };
  });

  const { error } = await supabase
    .from("website_checks")
    .insert(checksToInsert);

  if (error) {
    console.error("Simulation error:", error);
    return { success: false };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
