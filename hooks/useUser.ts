"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type User = {
  username: string;
  email: string;
  tier: "free" | "pro" | "admin" | "waiting";
};

export const useUser = () => {
  const supabase = createClient();
  const [user, setUser] = useState<User>({
    username: "...",
    email: "...",
    tier: "waiting",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      setUser({
        username: data.user.user_metadata?.name || "user",
        email: data.user.email || "user@oceanruntime.com",
        tier: profile?.role || "free",
      });
    };

    fetchUser();
  }, [supabase]);

  return { user };
};
