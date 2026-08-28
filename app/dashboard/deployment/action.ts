"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { decryptText } from "@/utils/encryption";

interface VercelProject {
  name?: string;
  targets?: {
    production?: {
      url?: string;
      alias?: string[];
    };
  };
}

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

/**
 * Real redeploy: triggers a fresh deployment on the hosting provider for the
 * given website. Provider API keys are decrypted from provider_configs and the
 * provider's deployment endpoint is called via its real API. Returns the new
 * deployment id and records it in the deployments table.
 */
export async function triggerRedeploy(websiteId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: web } = await supabase
    .from("websites")
    .select("id, name, url, provider")
    .eq("id", websiteId)
    .eq("user_id", user.id)
    .single();
  if (!web) throw new Error("Website not found or unauthorized");

  const provider = web.provider?.toLowerCase();
  if (!provider || provider === "generic http" || provider === "generic http/https") {
    throw new Error("This website has no hosting provider integration to redeploy.");
  }

  const { data: cfg } = await supabase
    .from("provider_configs")
    .select("encrypted_api_key, iv, auth_tag, salt")
    .eq("user_id", user.id)
    .eq("provider_name", provider)
    .single();

  if (!cfg) {
    throw new Error(
      `The ${web.provider} API key is not configured. Add it in Settings to enable redeploy.`,
    );
  }

  let token: string;
  try {
    token = decryptText({
      encryptedText: cfg.encrypted_api_key,
      iv: cfg.iv,
      authTag: cfg.auth_tag,
      salt: cfg.salt,
    });
  } catch {
    throw new Error("Failed to decrypt the provider API key.");
  }

  let deploymentId = "";
  try {
    if (provider === "vercel") {
      const projRes = await fetch("https://api.vercel.com/v9/projects", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!projRes.ok) throw new Error(`Vercel API error (${projRes.status})`);
      const projData: { projects?: VercelProject[] } = await projRes.json();
      const projects = projData?.projects || [];

      const webDomain = web.url.replace(/^https?:\/\/(www\.)?/i, "").split("/")[0].toLowerCase();
      const project = projects.find(
        (p) =>
          p.targets?.production?.url === webDomain ||
          (p.targets?.production?.alias || []).some((a) => a.toLowerCase() === webDomain) ||
          (p.name || "").toLowerCase() === web.name.toLowerCase().replace(/\s+/g, "-"),
      );
      if (!project) throw new Error("Vercel project could not be matched for this website.");

      const deployRes = await fetch(`https://api.vercel.com/v13/deployments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: project.name, target: "production" }),
      });
      if (!deployRes.ok) {
        const body = await deployRes.text();
        throw new Error(`Vercel deploy failed (${deployRes.status}): ${body.slice(0, 200)}`);
      }
      const deployed = await deployRes.json();
      deploymentId = deployed.id || "";
    } else {
      throw new Error(`The ${web.provider} provider is not yet supported for redeploy.`);
    }
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : "Failed to trigger deployment.");
  }

  if (!deploymentId) throw new Error("Provider returned no deployment id.");

  await supabase.from("deployments").insert({
    website_id: web.id,
    provider: web.provider,
    deployment_id: deploymentId,
    status: "BUILDING",
    commit_hash: "--",
  });

  revalidatePath("/dashboard/deployment");
  return { success: true, deploymentId };
}
