"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addDeploymentRecord(websiteId: string, provider: string, commitHash: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: web } = await supabase.from("websites").select("id").eq("id", websiteId).eq("user_id", user.id).single();
  if (!web) throw new Error("Website not found or unauthorized");

  const { error } = await supabase.from("deployments").insert({
    website_id: websiteId,
    provider: provider,
    deployment_id: "dpl_" + Math.random().toString(36).substr(2, 8),
    status: "READY",
    commit_hash: commitHash,
  });

  if (error) throw new Error("Failed to record deployment");

  revalidatePath("/dashboard/deployment");
  return { success: true };
}
