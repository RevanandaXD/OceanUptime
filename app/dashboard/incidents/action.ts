"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function resolveIncident(incidentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unathorized");

  const { data: incident, error: fetchError } = await supabase
    .from("incidents")
    .select('id, website_id, started_at')
    .eq('id', incidentId)
    .maybeSingle();
  
  if (fetchError) {
    throw new Error("Failed to fetch incident")
  }

  if (!incident) {
    throw new Error("Incident not found")
  }

  const { data:web } = await supabase
    .from('websites')
    .select('id')
    .eq('id', incident.website_id)
    .eq('user_id', user.id)
    .single()
  
  if (!web) throw new Error("Unathorized");

  const now = new Date();
  const startedAt = new Date(incident.started_at);
  const durationSec = Math.max(0, Math.round((now.getTime() -  startedAt.getTime()) / 1000 ))

  const { error } = await supabase
    .from("incidents")
    .update({
      status: "RESOLVED",
      resolved_at: now.toISOString(),
      duration: durationSec,
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
