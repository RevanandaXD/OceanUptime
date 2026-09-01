"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { performCheck } from "@/utils/monitoring";

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
    free: 5,
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
 * Run a real monitoring check on the user's active websites right now.
 * Performs an actual HTTP request and records the true result (status,
 * response time, status code) into website_checks. This is a manual "check
 * now" trigger — it does not fabricate data. It reuses the same status logic
 * as the scheduled cron so results are consistent.
 */
export async function triggerManualCheck() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const { data: websites } = await supabase
    .from("websites")
    .select("id, url, name, expected_keyword")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!websites || websites.length === 0) return { success: true };

  const results = await Promise.all(
    websites.map(async (web) => {
      const outcome = await performCheck(web.url, {
        expectedKeyword: web.expected_keyword,
      });

      await supabase.from("website_checks").insert({
        website_id: web.id,
        status: outcome.status,
        response_time: outcome.responseTime,
        status_code: outcome.statusCode,
      });

      return { name: web.name, status: outcome.status, responseTime: `${outcome.responseTime}ms` };
    }),
  );

  revalidatePath("/dashboard");
  return { success: true, results };
}
