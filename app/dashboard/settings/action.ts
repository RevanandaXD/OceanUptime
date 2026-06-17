"use server";

import { createClient } from "@/utils/supabase/server";
import { encryptText } from "@/utils/encryption";
import { revalidatePath } from "next/cache";

export async function saveProviderKey(providerName: string, apiKey: string) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  // Encrypt the API key securely before saving
  const encrypted = encryptText(apiKey);

  const { error } = await supabase.from("provider_configs").upsert(
    {
      user_id: user.id,
      provider_name: providerName,
      encrypted_api_key: encrypted.encryptedText,
      iv: encrypted.iv,
      auth_tag: encrypted.authTag,
      salt: encrypted.salt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id, provider_name" }
  );

  if (error) {
    console.error("Error saving provider key:", error);
    throw new Error("Failed to save configuration.");
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function deleteProviderKey(providerName: string) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("provider_configs")
    .delete()
    .eq("user_id", user.id)
    .eq("provider_name", providerName);

  if (error) {
    console.error("Error deleting provider key:", error);
    throw new Error("Failed to disconnect provider.");
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}
