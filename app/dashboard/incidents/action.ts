"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function resolveIncident(incidentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unathorized");

  const { error } = await supabase
    .from("websites")
    .update({
      status: "RESOLVE",
      resolved_at: new Date().toISOString(),
    })
    .eq("id", incidentId);

  if (error) {
    console.error("Failed revolving incident:", error);
    throw new Error("Failed to resolve incident");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/incidents");
  return { success: true };
}
