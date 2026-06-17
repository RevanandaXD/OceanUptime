import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProviderConfigForm from "./ProviderConfigForm";
import ThemeConfigForm from "./ThemeConfigForm";

export const metadata = {
  title: "Settings | OceanUptime",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: configs } = await supabase
    .from("provider_configs")
    .select("provider_name")
    .eq("user_id", user.id);

  const configuredProviders = configs?.map((c) => c.provider_name) || [];

  const providers = [
    { id: "vercel", label: "Vercel Integration" },
    { id: "netlify", label: "Netlify Integration" },
    { id: "cloudflare", label: "Cloudflare Pages" },
    { id: "github", label: "GitHub API" },
  ];

  return (
    <div className="space-y-6 animate-fade-in container">
      <div>
        <h1 className="text-2xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
          Settings & Configurations
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
          Securely connect your hosting providers and customize your visual interface dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2 items-start">
        {/* Integrations Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-450 dark:text-zinc-500">
              Integrations
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {providers.map((p) => (
              <ProviderConfigForm
                key={p.id}
                providerName={p.id}
                providerLabel={p.label}
                isConfigured={configuredProviders.includes(p.id)}
              />
            ))}
          </div>
        </div>

        {/* Appearance Column */}
        <div className="space-y-4 w-full">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-450 dark:text-zinc-500">
              Appearance
            </h2>
          </div>
          <ThemeConfigForm />
        </div>
      </div>
    </div>
  );
}