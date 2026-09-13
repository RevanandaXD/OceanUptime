"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DEMO_COOKIE_NAME } from "@/utils/demo";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      error: "Email dan password wajib di isi.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error?.message,
    };
  }

  redirect("/dashboard/overview");
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return {error: error.message}
  }

  return {
    success: "Pendaftaran berhasil! Silakan cek email Anda untuk konfirmasi."
  }
}

export async function logout() {
  const supabase = await createClient();
  const cookieStore = await cookies();

  await supabase.auth.signOut();

  cookieStore.set(DEMO_COOKIE_NAME, "", { path: "/", maxAge: 0 });

  redirect("/auth")
}
